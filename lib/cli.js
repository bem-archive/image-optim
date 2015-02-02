var format = require('util').format,
    imageOptim = require('./index'),
    defaults = require('./defaults');

/**
 * CLI
 * ===
 */
module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Node.js wrapper for some images compression algorithms')
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
    .opt()
        .name('tolerance')
        .title(format('Tolerance (default: %s)', defaults().tolerance))
        .long('tolerance').short('t')
        .end()
    .arg()
        .name('files')
        .title('Paths to files')
        .arr()
        .req()
        .end()
    .act(function (opts, args) {
        var files = args.files,
            lintMode = opts.lint,
            options = {};

        lintMode && (options.tolerance = opts.tolerance);

        return (lintMode ? imageOptim.lint(files, options) : imageOptim.optim(files))
            .then(function (res) {
                console.log(res);
            });
    })
    .run(process.argv.slice(2));
