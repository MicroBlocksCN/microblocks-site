var fs = require('fs');
var hbs = require('hbs');
var debugMode = true;

function debug (string) { if (debugMode) { console.info(string); } };

function doForFilesInDir (dir, extension, action) {
    // does something for each file of a particular extension in a directory
    var path = __dirname + dir;
    var filenames = fs.readdirSync(path);
    filenames.forEach((filename) => {
        var matches =
            new RegExp('^([^.]+).' + extension + '$').exec(filename);
        if (!matches) { return; }
        var fileName = matches[1];
        var fileContents = fs.readFileSync(path + '/' + filename, 'utf8');
        action.call(this, fileName, fileContents);
    });
};

function registerPartials (dir) {
    // registers handlebars partials in a particular templates/partials subdir
    doForFilesInDir(
        '/src/templates/partials/' + (dir || ''),
        'hbs',
        function (fileName, fileContents) {
            // if there's a dir, register the partial as dir.name
            // i.e. svg.icon-plus.svg
            hbs.registerPartial(
                (dir ? dir + '.' : '') + fileName,
                fileContents
            );
            debug('registered partial: ' + fileName);
        }
    );
};

function compileAll () {
    // compiles all templates
    doForFilesInDir(
        '/src/templates/',
        'hbs',
        function (fileName, fileContents) {
            fs.writeFileSync(
                'dist/' + fileName + '.html',
                hbs.compile(fileContents)({})
            );
            debug('compiled template: ' + fileName);
        }
    )
};

function build () {
    // builds the whole thing

    // register all handlebars partials
    registerPartials('svg');
    registerPartials();

    // compile all templates
    compileAll();
};

build();
