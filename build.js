var fs = require('fs'),
    fse = require('fs-extra'),
    sass = require('node-sass'),
    handlebars = require('handlebars'),
    httpServer = require('http-server'),
    autoprefixer = require('autoprefixer'),
    postcss = require('postcss'),
    debugMode = true;

// Useful functions

function debug (string) { if (debugMode) { console.info(string); } };

function doForFilesInDir (dir, extension, action) {
    // does something for each file of a particular extension in a directory
    var path = `${__dirname}/${dir}`;
    var filenames = fs.readdirSync(path);
    filenames.forEach((filename) => {
        var matches =
            new RegExp(`^([^.]+).${extension}$`).exec(filename);
        if (!matches) { return; }
        var fileName = matches[1];
        var fullPath = path + '/' + filename;
        var fileContents = fs.readFileSync(fullPath, 'utf8');
        action.call(this, fileName, fileContents, fullPath);
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
            fs.writeFileSync(
                `dist/${fileName}.html`,
                handlebars.compile(fileContents)({})
            );
            debug(`compiled template: ${fileName}`);
        }
    );
};

// Handlebars additions

handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
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

    // compile all templates
    compileTemplates();
};

function copyAssets () {
    fse.copySync(
        `${__dirname}/src/assets`,
        `${__dirname}/dist/assets`,
        { overwrite: true},
        (err) => { if (err) { console.error(err); } }
    );
    doForFilesInDir(
        'src',
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
    httpServer.createServer(
        { root: __dirname + '/dist', cache: -1 }
    ).listen(3000);
}


function watchDirs (dirs, action) {
    dirs.forEach(
        (dir) => {
            doForFilesInDir(
                dir,
                'hbs',
                (fileName, fileContents, fullPath) => {
                    debug(`watching file: ${fullPath}`);
                    fs.watchFile(fullPath, { interval: 1000 }, (c, p) => {
                        debug(`File ${fullPath} changed. Rebuilding site.`);
                        build();
                    });
                }
            );
        }
    );
};

function watch () {
    watchDirs([
        'src/templates', 'src/templates/partials', 'src/templates/partials/layouts',
        'src/templates/partials/svg', 'src/styles', 'src/styles/base',
        'src/styles/components', 'src/styles/elements', 'src/styles/generic',
        'src/styles/layout', 'src/styles/settings', 'src/styles/templates',
        'src/styles/tools', 'src/styles/utilities', 'src/styles/vendors',
        'src/scripts']);
};

// Build, watch, and serve

build();
watch();
serve();

