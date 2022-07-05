var fs = require('fs'),
    fse = require('fs-extra'),
    sass = require('sass'),
    handlebars = require('handlebars'),
    http = require('http'),
    WebSocket = require('ws'),
    autoprefixer = require('autoprefixer'),
    postcss = require('postcss'),
    markdown = new (require('showdown')).Converter(),
    args = process.argv.slice(2),
    debugMode = args.includes('--debug'),
    blogEntries;

// Data

// Useful functions

function debug (string) { if (debugMode) { console.info(string); } };

function doForFilesInDir (dir, extension, action, recursive) {
    // does something for each file of a particular extension in a directory
    var path = `${__dirname}/${dir}`;
    var filenames = fs.readdirSync(path);
    filenames.forEach((fileName) => {
        var fullPath = path + '/' + fileName;
        if (fs.statSync(fullPath).isFile()) {
            var matches = extension ?
                new RegExp(`^([^.]+).${extension}$`).exec(fileName) :
                [fileName];
            if (!matches) { return; }
            var fileContents = fs.readFileSync(fullPath, 'utf8');
            action.call(
                this,
                fileName.replace(/\..*$/,'','g'), // strip file extension
                fileContents,
                fullPath
            );
        } else if (recursive && fs.statSync(fullPath).isDirectory()) {
            // recurse into directory
            doForFilesInDir(dir + '/' + fileName, extension, action, recursive);
        } else if (extension == '/' && fs.statSync(fullPath).isDirectory()) {
            // iterate over directories
            action.call(this, fileName, fullPath);
        }
    });
};

// Handlebars processing

function registerPartials (dir) {
    // registers handlebars partials in a particular templates/partials subdir
    doForFilesInDir(
        `src/templates/partials/${dir || ''}`,
        'hbs',
        (fileName, fileContents) => {
            // if there's a dir, register the partial as dir.name
            // i.e. svg.icon-plus.svg
            handlebars.registerPartial(
                (dir ? dir + '.' : '') + fileName,
                fileContents
            );
            debug(`registered partial: ${fileName}`);
        }
    );
};

function compileTemplates () {
    // compiles all templates
    doForFilesInDir(
        'src/templates',
        'hbs',
        (fileName, fileContents) => {
            var dataPath = `${__dirname}/data/static/${fileName}.json`;
            var data = fs.existsSync(dataPath) ?
                    JSON.parse(fs.readFileSync(dataPath), 'utf8') :
                    {};
            compileTemplate(fileName, data, 'dist');
        }
    );
};

function compileTemplate (templateName, descriptor, destDir, fileName) {
    var template =
            fs.readFileSync(
                `${__dirname}/src/templates/${templateName}.hbs`,
                'utf8'
            );

    // yes, special cases are ugly
    if (templateName == 'archive') {
        descriptor['blog-entries'] = blogEntries;
    }

    if (debugMode) { descriptor.livereload = true; }

    fs.writeFileSync(
        `${destDir}/${fileName || templateName}.html`,
        handlebars.compile(template)(descriptor)
    );
    debug(`compiled template: ${templateName}`);
};

function compileBlog () {
    var firstPageSize = 6,
        pageSize = 12,
        pageCount =
            Math.ceil((blogEntries.length - firstPageSize) / pageSize) + 1,
        descriptor = {},
        featuredSlug =
            JSON.parse(
                fs.readFileSync(
                    `${__dirname}/data/blog/meta.json`,
                    'utf8'
                )
            ).featured;

    descriptor.featured =
        blogEntries.find(each => each.slug == featuredSlug);

    // featured article shouldn't show up in the paginated list
    blogEntries.splice(blogEntries.indexOf(descriptor.featured), 1);
    
    // store only the entries for the first page
    descriptor['blog-entries'] = blogEntries.slice(0, firstPageSize);
    descriptor['page-count'] = pageCount;
    descriptor.page = 1;
    compileTemplate('blog', descriptor, 'dist/blog', 'index');
        
    // compile all pages

    for (var page = 2; page <= pageCount + 1; page ++) {
        descriptor['blog-entries'] = 
            blogEntries.slice(
                firstPageSize + (page - 2) * pageSize,
                firstPageSize + (page - 1) * pageSize
            );
        descriptor.page = page;
        compileTemplate(
            'blog-paginated',
            descriptor,
            'dist/blog',
            page.toString()
        );
    }
};

// Blog

function compileArticles () {
    blogEntries = [];
    doForFilesInDir(
        'data/blog',
        '/',
        (dirName, fullPath) => {
            var json = JSON.parse(
                    fs.readFileSync(
                        `${fullPath}/meta.json`,
                        'utf8'
                    )
                );
            json.markdown = fs.readFileSync(
                `${fullPath}/index.md`,
                'utf8'
            );

            json.slug = dirName;

            // check whether dirName starts with a number, in which case it
            // represents the publication date
            if (parseInt(dirName) + 0 == parseInt(dirName)) {
                json['publication-date'] = dirName.substring(0,10)
            }

            fse.ensureDirSync(`${__dirname}/dist/blog/${dirName}`);
            fse.copySync(`${fullPath}`, `${__dirname}/dist/blog/${dirName}`);

            compileTemplate('article', json, `dist/blog/${dirName}`, 'index');
            debug(`compiled article: ${json.title}`);

            if (!json.draft) {
                blogEntries.push(json);
            }
        }
    );
    blogEntries = blogEntries.reverse();
};

// Handlebars additions

handlebars.registerHelper('markdown', (context, options) => {
    var mdPath = `${__dirname}/data/markdown/${context}.md`,
        md = context.data ?
            (context.data.root.markdown || context.fn(this)) : '',
        html;
    if (fs.existsSync(mdPath)) {
        md = fs.readFileSync(mdPath, 'utf8');
    }
    try {
        html = markdown.makeHtml(md);
    } catch (err) {
        html = `<p>PARSING MARKDOWN FAILED:</p><pre>${md}</pre><br>`;
    }
    return html;
});

handlebars.registerHelper('date-string', function (context) {
    var date = new Date(context),
        day = date.getDate();

    // Thanks to https://stackoverflow.com/a/39466341
    function nth(n) { return['st','nd','rd'][((n+90)%100-10)%10-1] || 'th'; };

    return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ][date.getMonth()] + ' ' +
            day + nth(day) + ', ' +
            date.getFullYear();
});

// Thanks to https://stackoverflow.com/a/11924998
handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i <= to; i += incr)
        accum += block.fn(i);
    return accum;
});

handlebars.registerHelper('inc', function (num, increment, context) {
    return num + increment;
});

// Build script functions

function build () {
    // builds the whole thing

    // remove and remake dist directory
    fse.removeSync(`${__dirname}/dist`);
    fse.ensureDirSync(`${__dirname}/dist`);

    // register all handlebars partials
    registerPartials('svg');
    registerPartials('layouts');
    registerPartials();

    // concat all JS
    concatJS();

    // compile sass stylesheets, autoprefixing the resulting CSS
    compileSass();

    // copy assets and JSON files
    copyAssets();

    if (debugMode) { makeFakeReleaseFiles(); }

    // build blog articles
    compileArticles();

    // compile all templates
    compileTemplates();

    // build paginated blog
    compileBlog();
};

function makeFakeReleaseFiles () {
    fse.ensureFileSync(`${__dirname}/dist/downloads/latest/VERSION.txt`);
    fse.ensureFileSync(`${__dirname}/dist/downloads/latest/CHANGELOG.txt`);
    fse.ensureFileSync(`${__dirname}/dist/downloads/pilot/VERSION.txt`);
    fse.ensureFileSync(`${__dirname}/dist/downloads/pilot/CHANGELOG.txt`);
    fs.writeFileSync(
        `${__dirname}/dist/downloads/latest/VERSION.txt`,
        '0.0.0-test\n04/06/2021'
    );
    fs.writeFileSync(
        `${__dirname}/dist/downloads/latest/CHANGELOG.txt`,
        'nothing new under the sun'
    );
    fs.writeFileSync(
        `${__dirname}/dist/downloads/pilot/VERSION.txt`,
        '0.0.1-pilot\n25/11/2021'
    );
    fs.writeFileSync(
        `${__dirname}/dist/downloads/pilot/CHANGELOG.txt`,
        'lots of flashy new things'
    );
};

function copyAssets () {
    fse.copySync(
        `${__dirname}/src/assets`,
        `${__dirname}/dist/assets`,
        { overwrite: true },
        (err) => { if (err) { console.error(err); } }
    );
};

function concatJS () {
    var fullJS = '';
    doForFilesInDir(
        'src/scripts',
        'js',
        (fileName, fileContents) => {
            fullJS += fileContents;
        }
    );
    fs.writeFileSync(`${__dirname}/dist/main.js`, fullJS);
};

function compileSass () {
    // Compile SASS files and autoprefix the resulting CSS
    sass.render(
        {
            file: `${__dirname}/src/styles/main.scss`,
            outputStyle: (debugMode ? 'expanded' : 'compressed')
        },
        (err, result) => {
            if (err) {
                console.error(err);
            } else {
                postcss([ autoprefixer ])
                    .process(result.css, { from: undefined })
                    .then(prefixed => {
                        prefixed.warnings().forEach(warn => {
                            console.warn(warn.toString())
                        });
                        fs.writeFileSync(
                            `${__dirname}/dist/main.css`,
                            prefixed.css
                        );
                    });
            }
        }
    );
};

function serve () {
    // Dead simple (and naive) HTTP static server

    function respondWithFile (res, fileName, params) {
        // So we need to do anything at all with params? I don't think so
        fs.readFile(
            pathTo(fileName),
            (err,data) => {
                res.setHeader('Content-Type', mimeTypeFor(fileName));
                if (err) {
                    res.writeHead(404);
                    err.fileName = fileName;
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
    };

    function mimeTypeFor (fileName) {
        var extension = fileName.replace(/.*\./,''),
            mimeType = {
                svg: 'image/svg+xml',
                png: 'image/png',
                jpg: 'image/jpg',
                jpeg: 'image/jpg',
                html: 'text/html',
                htm: 'text/html',
                css: 'text/css',
                ttf: 'font/ttf',
                otf: 'font/otf',
                woff: 'font/woff',
                pdf: 'application/pdf',
                zip: 'application/zip',
            }[extension];
        if (!mimeType) { mimeType = 'text/html'; }
        return mimeType;
    };

    function pathTo (fileName) {
        return `${__dirname}/dist/${fileName.replace(/\?.*/,'')}`;
    };

    function getParams (url) {
        url.replace(/.*\?/,'').split('&').map(
            paramString => {
                var pairArray = paramString.split('='),
                    assoc = {};
                assoc[pairArray[0]] = pairArray[1];
                return assoc;
            }
        );
    };

    http.createServer(function (req, res) {
        var fileName = req.url;
        if (req.url === '/') {
            fileName = 'index.html';
        }
        if (!fs.existsSync(pathTo(fileName))) {
            fileName = fileName + '.html';
        } else if (fs.lstatSync(pathTo(fileName)).isDirectory()) {
            if (!req.url.endsWith('/')) {
                // this is a directory, redirect to the same path but with a
                // trailing slash
                res.writeHead(301, { Location: req.url + '/'} );
                res.end();
                return;
            }
            fileName = fileName + '/index.html';
        }
        respondWithFile(res, fileName, getParams(req.url));
    }).listen(3000);
};

function watchDirs (dirs, action) {
    dirs.forEach(
        (dir) => {
            doForFilesInDir(
                dir,
                null, // all extensions
                (fileName, fileContents, fullPath) => {
                    debug(`watching file: ${fullPath}`);
                    fs.watchFile(fullPath, { interval: 1000 }, (c, p) => {
                        debug(`File ${fullPath} changed. Rebuilding site.`);
                        build();
                        action.call(this);
                    });
                },
                true // recursive
            );
        }
    );
};

function watch () {
    var wss = new WebSocket.Server({ port: 8080 }),
        clients = [];

    watchDirs(
        [
            'src/templates', 'src/styles', 'src/scripts',
            'data'
        ],
        () => {
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
        }
    );

    wss.on('connection', client => {
        clients.push(client);
        client.send('LiveReload connected to server');
    });
};

// Build, watch, and serve

build();

if (debugMode) {
    watch();
    serve();
    console.log("\nHTTP Server: '127.0.0.1:3000/'");
}

