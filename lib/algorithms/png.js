/**
 * PNG Algorithms
 * ==============
 */
var path = require('path'),
    format = require('util').format,
    qfs = require('q-io/fs'),
    _ = require('lodash'),
    qexec = require('../qexec'),
    pwd = path.join(path.dirname(module.filename), '..', '..', 'compressors');

/**
 * Executes the given compression command and returns the instace of the compressed file
 * @param {String} command
 * @param {File} outputFile
 * @returns {Promise * File}
 */
function _compress(command, outputFile) {
    return qexec(command)
        .then(function () {
            return outputFile.loadSize();
        })
        .fail(function (err) {
            // Before using of 'advpng' a raw file has to be copied
            // This algorithm can not compress a file and write a result to another file
            return qfs.exists(outputFile.name)
                .then(function (exists) {
                    if (exists) {
                        outputFile.remove();
                    }

                    throw err;
                });
        });
}

/**
 * Compresses the give file and returns its instance
 * @param {File} pngFile
 * @param {File} outputFile
 * @returns {Promise * File}
 */
module.exports = [
    /// pngcrush
    function (pngFile, outputFile) {
        // jscs: disable
        var command = format('%s/pngcrush/pngcrush -nofilecheck -bail -blacken -reduce -rem alla -force %s "%s" "%s" 2>&1',
                pwd,
                pngFile.isSmall() ? '-brute' : '',
                pngFile.name,
                outputFile.name
            );

        return _compress(command, outputFile);
    },

    /// zopflipng
    function (pngFile, outputFile) {
        var timelimit = 10 + pngFile.size / 1024,
            iterations = 15,
            splitting = 1;

        timelimit = _.min(timelimit, 60);

        pngFile.isLarge() && (iterations /= 2);

        if (pngFile.isSmall()) {
            iterations *= 2;
            splitting = 3;
        }

        // jscs: disable
        var  command = format('%s/zopflipng/zopflipng --lossy_transparent -y --always_zopflify --splitting=%s --iterations=%s --timelimit=%s "%s" "%s"',
                pwd,
                splitting,
                iterations,
                timelimit,
                pngFile.name,
                outputFile.name
            );

        return _compress(command, outputFile);
    },

    /// optipng
    function (pngFile, outputFile) {
        var command = format('%s/optipng/bin/optipng -force -o6 "%s" -out "%s"', pwd, pngFile.name, outputFile.name);

        return _compress(command, outputFile);
    },

    /// pngout
    function (pngFile, outputFile) {
        var pngout = require('pngout-bin').path,
            command = format('%s "%s" "%s" -s%s -k0 -v -r -force -nil',
                pngout,
                pngFile.name,
                outputFile.name,
                pngFile.isLarge() ? 1 : 0
            );

        return _compress(command, outputFile);
    },

    /// advpng
    function (pngFile, outputFile) {
        var command = format('%s/advpng/bin/advpng -z -4 -f "%s"', pwd, outputFile.name);

        // Before using of 'advpng' a raw file has to be copied
        // This algorithm can not compress a file and write a result to another file
        return qfs.copy(pngFile.name, outputFile.name)
            .then(function () {
                return _compress(command, outputFile);
            });
    }
];
