var format = require('util').format,
    qfs = require('q-io/fs'),
    _ = require('lodash'),
    qexec = require('./qexec'),
    File = require('./file');

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
        });
}

/**
 * Algorithms
 * ==========
 */
module.exports = {
    /**
     * Compresses the give file and returns its instance
     * @param {File} pngFile
     * @returns {Promise * File}
     */
    pngout: function (pngFile) {
        var pngoutFile = new File(pngFile.name + '.pngout.png'),
            command = format('pngout %s %s -s%s -k0 -v -r -force -nil',
                pngFile.name,
                pngoutFile.name,
                pngFile.isLarge() ? 1 : 0
            );

        return _compress(command, pngoutFile);
    },

    ///
    pngcrush: function (pngFile) {
        var pngcrushFile = new File(pngFile.name + '.pngcrush.png'),
            command = format('pngcrush -nofilecheck -bail -blacken -reduce -rem alla -force %s %s %s 2>&1',
                pngFile.isSmall() ? '-brute' : '',
                pngFile.name,
                pngcrushFile.name
            );

        return _compress(command, pngcrushFile);
    },

    ///
    advpng: function (pngFile) {
        var advpngFile = new File(pngFile.name + '.advpng.png'),
            command = format('advpng -z -4 -f %s', advpngFile.name);

        return qfs.copy(pngFile.name, advpngFile.name)
            .then(function () {
                return _compress(command, advpngFile);
            });
    },

    ///
    optipng: function (pngFile) {
        var optipngFile = new File(pngFile.name + '.optipng.png'),
            command = format('optipng -force -o6 %s -out %s', pngFile.name, optipngFile.name);

        return _compress(command, optipngFile);
    },

    ///
    zopflipng: function (pngFile) {
        var timelimit = 10 + pngFile.size / 1024,
            iterations = 15,
            splitting = 1;

        timelimit = _.min(timelimit, 60);

        pngFile.isLarge() && (iterations /= 2);

        if (pngFile.isSmall()) {
            iterations *= 2;
            splitting = 3;
        }

        var zopflipngFile = new File(pngFile.name + '.zopflipng.png'),
            chunks = [
                'tEXt', 'zTXt', 'iTXt', 'gAMA', 'sRGB',
                'iCCP', 'bKGD', 'pHYs', 'sBIT', 'tIME',
                'oFFs', 'acTL', 'fcTL', 'fdAT', 'prVW',
                'mkBF', 'mkTS', 'mkBS', 'mkBT'
            ].join(','),
            // jscs: disable
            command = format('zopflipng --lossy_transparent -y --always_zopflify --keepchunks=%s --splitting=%s --iterations=%s --timelimit=%s %s %s',
                chunks,
                splitting,
                iterations,
                timelimit,
                pngFile.name,
                zopflipngFile.name
            );

        return _compress(command, zopflipngFile);
    }
};
