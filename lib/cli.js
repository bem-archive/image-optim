var imageOptim = require('./index');

/**
 * CLI
 * ===
 */
module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Image Optim')
    .opt()
        .name('version')
        .title('Shows the version number')
        /*jshint -W024 */
        .short('v').long('version')
        .flag()
        .only()
        .act(function () {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('lint')
        .title('Lint mode')
        .long('lint').short('l')
        .flag()
        .end()
    .arg()
        .name('files')
        .title('Path to PNG files')
        .arr()
        .req()
        .end()
    .act(function (opts, args) {
        var files = args.files;

        return (opts.lint ? imageOptim.lint(files) : imageOptim.optim(files))
            .then(function (res) {
                console.log(res);
            });
    })
    .run(process.argv.slice(2));
