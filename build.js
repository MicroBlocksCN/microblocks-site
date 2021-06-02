var fs = require('fs'),
    handlebars = require('handlebars'),
    httpServer = require('http-server'),
    debugMode = true;

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

function compileAll () {
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

function build () {
    // builds the whole thing

    // register all handlebars partials
    registerPartials('svg');
    registerPartials('layouts');
    registerPartials();

    // compile all templates
    compileAll();
};

function watchDir (dir, action) {
    doForFilesInDir(
        dir,
        'hbs',
        (fileName, fileContents, fullPath) => {
            debug(`watching file: ${fullPath}`);
            fs.watchFile(fullPath, { interval: 1000 }, (c, p) => {
                debug(`file ${fileName} in ${fullPath} changed. Rebuilding`);
                fs.writeFileSync(
                    `dist/${fileName}.html`,
                    handlebars.compile(fs.readFileSync(fullPath, 'utf8'))({})
                );
            })
        }
    );
};

build();
watchDir('src/templates');
httpServer.createServer().listen(3000);
