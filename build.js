var fs = require('fs'),
    fse = require('fs-extra'),
    sass = require('node-sass'),
    handlebars = require('handlebars'),
    http = require('http'),
    WebSocket = require('ws'),
    autoprefixer = require('autoprefixer'),
    postcss = require('postcss'),
    markdown = new (require('showdown')).Converter(),
    args = process.argv.slice(2),
    debugMode = args.includes('--debug');

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
            if (debugMode) { data.livereload = true; }
            fs.writeFileSync(
                `dist/${fileName}.html`,
                handlebars.compile(fileContents)(data)
            );
            debug(`compiled template: ${fileName}`);
        }
    );
};

// Handlebars additions

handlebars.registerHelper('markdown', (context, options) => {
    var mdPath = `${__dirname}/data/markdown/${context}.md`,
        md = options ? options.fn(this) : context.fn(this),
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

    // compile all templates
    compileTemplates();
};

function makeFakeReleaseFiles () {
    fse.ensureFileSync(`${__dirname}/dist/downloads/latest/VERSION.txt`);
    fse.ensureFileSync(`${__dirname}/dist/downloads/latest/CHANGELOG.txt`);
    fs.writeFileSync(
        `${__dirname}/dist/downloads/latest/VERSION.txt`,
        '0.0.0-test\n04/06/2021'
    );
    fs.writeFileSync(
        `${__dirname}/dist/downloads/latest/CHANGELOG.txt`,
        'nothing new under the sun'
    );
};

function copyAssets () {
    fse.copySync(
        `${__dirname}/src/assets`,
        `${__dirname}/dist/assets`,
        { overwrite: true },
        (err) => { if (err) { console.error(err); } }
    );
    doForFilesInDir(
        'data/runtime',
        'json',
        (fileName, fileContents, fullPath) => {
            fs.copyFileSync(fullPath, `${__dirname}/dist/${fileName}.json`);
        }
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
            outputStyle: (debugMode ? 'nested' : 'compressed')
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
}

