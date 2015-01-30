/**
 * PNG Algorithms
 * ==============
 */
var path = require('path'),
    format = require('util').format,
    qfs = require('q-io/fs'),
    _ = require('lodash'),
    qexec = require('./qexec'),
    File = require('./file'),
    pwd = path.join(path.dirname(module.filename), '..', 'compressors');

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
            // Before using 'advpng' a raw file have to be copied
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
 * Initializes the compressed file
 * @param {File} file
 * @param {String} suffix
 * @param {Object} options
 * @returns {File}
 */
function _initCompressedFile(file, suffix, options) {
    return new File(path.join(options._dirName, path.basename(file.name) + suffix));
}

/**
 * Compresses the give file and returns its instance
 * @param {File} pngFile
 * @param {Object} [options] -> lib/defaults.js
 * @param {Number} [options.tolerance] default: 0
 * @param {String} [options._dirName]
 * @returns {Promise * File}
 */
module.exports = [
    /// pngcrush
    function (pngFile, options) {
        var pngcrushFile = _initCompressedFile(pngFile, '.pngcrush.png', options),
            command = format('%s/pngcrush/pngcrush -nofilecheck -bail -blacken -reduce -rem alla -force %s %s %s 2>&1',
                pwd,
                pngFile.isSmall() ? '-brute' : '',
                pngFile.name,
                pngcrushFile.name
            );

        return _compress(command, pngcrushFile);
    },

    /// optipng
    function (pngFile, options) {
        var optipngFile = _initCompressedFile(pngFile, '.optipng.png', options),
            command = format('%s/optipng/bin/optipng -force -o6 %s -out %s', pwd, pngFile.name, optipngFile.name);

        return _compress(command, optipngFile);
    },

    /// zopflipng
    function (pngFile, options) {
        var timelimit = 10 + pngFile.size / 1024,
            iterations = 15,
            splitting = 1;

        timelimit = _.min(timelimit, 60);

        pngFile.isLarge() && (iterations /= 2);

        if (pngFile.isSmall()) {
            iterations *= 2;
            splitting = 3;
        }

        var zopflipngFile = _initCompressedFile(pngFile, '.zopflipng.png', options),
            chunks = [
                'tEXt', 'zTXt', 'iTXt', 'gAMA', 'sRGB',
                'iCCP', 'bKGD', 'pHYs', 'sBIT', 'tIME',
                'oFFs', 'acTL', 'fcTL', 'fdAT', 'prVW',
                'mkBF', 'mkTS', 'mkBS', 'mkBT'
            ].join(','),
            // jscs: disable
            command = format('%s/zopflipng/zopflipng --lossy_transparent -y --always_zopflify --keepchunks=%s --splitting=%s --iterations=%s --timelimit=%s %s %s',
                pwd,
                chunks,
                splitting,
                iterations,
                timelimit,
                pngFile.name,
                zopflipngFile.name
            );

        return _compress(command, zopflipngFile);
    },

    /// pngout
    function (pngFile, options) {
        var pngoutFile = _initCompressedFile(pngFile, '.pngout.png', options),
            command = format('%s/pngout/pngout %s %s -s%s -k0 -v -r -force -nil',
                pwd,
                pngFile.name,
                pngoutFile.name,
                pngFile.isLarge() ? 1 : 0
            );

        return _compress(command, pngoutFile);
    },

    /// advpng
    function (pngFile, options) {
        var advpngFile = _initCompressedFile(pngFile, '.advpng.png', options),
            command = format('%s/advpng/bin/advpng -z -4 -f %s', pwd, advpngFile.name);

        // Before using 'advpng' a raw file have to be copied
        // This algorithm can not compress a file and write a result to another file
        return qfs.copy(pngFile.name, advpngFile.name)
            .then(function () {
                return _compress(command, advpngFile);
            });
    }
];
