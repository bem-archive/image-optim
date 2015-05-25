var path = require('path'),
    Q = require('q'),
    qfs = require('q-io/fs'),
    md5 = require('MD5'),
    File = require('./file'),
    exit = require('./exit-code');

/**
 * Overwrites the raw file by the compressed one if it is smaller otherwise removes it
 * @param {File} rawFile
 * @param {File} compressedFile
 * @returns {Promise * File}
 */
function _minFile(rawFile, compressedFile) {
    if (compressedFile.size < rawFile.size) {
        return qfs.move(compressedFile.name, rawFile.name)
            .then(function () {
                return new File(rawFile.name, compressedFile.size);
            });
    }

    return compressedFile.remove()
        .then(function () {
            return rawFile;
        });
}

/**
 * Checks whether the given raw file is smaller than the given compressed file
 * Removes the compressed file
 * @param {File} rawFile
 * @param {File} compressedFile
 * @param {Object}   [opts] -> lib/defaults.js
 * @param {Number}   [opts.tolerance=0]
 * @param {String[]} [opts.reporters=[]]
 * @param {String}   [opts._tmpDir=md5]
 * @returns {Promise * Boolean}
 */
function _isSmallerAfterCompression(rawFile, compressedFile, opts) {
    return compressedFile.remove()
        .then(function () {
            var tolerance = opts.tolerance < 1
                ? opts.tolerance * rawFile.size
                : opts.tolerance;

            return rawFile.size > compressedFile.size + tolerance;
        });
}

/**
 * Returns saved bytes between the raw and compressed files
 * @param {File} rawFile
 * @param {File} compressedFile
 * @returns {Number}
 */
function _getSavedBytes(rawFile, compressedFile) {
    var savedBytes = rawFile.size - compressedFile.size;

    if (savedBytes > 0) return savedBytes;

    return 0;
}

/**
 * @param {Object} err
 * @param {File} rawFile
 * @returns {Object}
 */
function _handleError(err, rawFile) {
    if (err && err.code === 'ENOENT') {
        return { name: rawFile.name, exitCode: exit.DOESNT_EXIST };
    }

    return { name: rawFile.name, exitCode: exit.CANT_COMPRESS };
}

/**
 * Initializes a compressed file
 * @param {String} filename
 * @param {String} tmpDir
 * @returns {File}
 */
function _initCompressedFile(filename, tmpDir) {
    return new File(path.join(tmpDir, path.basename(filename) + md5(filename) + path.extname(filename)));
}

/**
 * Processes the file in the specifies mode
 * @param {File} rawFile
 * @param {Function[]} algorithms
 * @param {reduceCallback} reduceFunc
 * @param {Promise * File|Boolean} initVal
 * @returns {Promise * File|Boolean}
 */
function _imageOptim(rawFile, algorithms, reduceFunc, initVal) {
    return Q.all([rawFile.loadSize(), rawFile.loadType()])
        .then(function () {
            return algorithms[rawFile.type].reduce(reduceFunc, initVal);
        })
        .fail(function (err) {
            throw err;
        });
}

/**
 * Modes
 * =====
 */
module.exports = {
    /**
     * This callback is provided as a first argument for reduce function
     * @callback reduceCallback
     * @param {Promise * File|Boolean} prev
     * @param {Promise * File|Boolean} next
     */

    /**
     * Optimizes the given file and returns the information about the compression
     * @examples
     * 1. { name: 'file.ext', savedBytes: 12345, exitCode: 0 }
     * 2. { name: 'file.ext', exitCode: 1 }
     * 3. { name: 'file.ext', exitCode: 2 }
     * @param {File} rawFile
     * @param {Function[]} algorithms
     * @param {Object}   [opts] -> lib/defaults.js
     * @param {Number}   [opts.tolerance=0]
     * @param {String[]} [opts.reporters=[]]
     * @param {String}   [opts._tmpDir=md5]
     * @returns {Promise * Object}
     */
    optim: function (rawFile, algorithms, opts) {
        return _imageOptim(rawFile, algorithms, function (prev, next) {
            return prev.then(function (res) {
                return next(rawFile, _initCompressedFile(rawFile.name, opts._tmpDir))
                    .then(function (compressed) {
                        return _minFile(res, compressed);
                    });
                });
            }, new Q(rawFile))
            .then(function (minFile) {
                return {
                    name: rawFile.name,
                    savedBytes: _getSavedBytes(rawFile, minFile),
                    exitCode: exit.SUCCESS
                };
            })
            .fail(function (err) {
                return _handleError(err, rawFile);
            });
    },

    /**
     * Checks whether the given file can be optimized further and return the information about the check
     * @examples
     * 1. { name: 'file.ext', isOptimized: true, exitCode: 0 }
     * 2. { name: 'file.ext', isOptimized: false, exitCode: 0 }
     * 3. { name: 'file.ext', exitCode: 1 }
     * 4. { name: 'file.ext', exitCode: 2 }
     * @param {File} rawFile
     * @param {Function[]} algorithms
     * @param {Object}   [opts] -> lib/defaults.js
     * @param {Number}   [opts.tolerance=0]
     * @param {String[]} [opts.reporters=[]]
     * @param {String}   [opts._tmpDir=md5]
     * @returns {Promise * Object}
     */
    lint: function (rawFile, algorithms, opts) {
        return _imageOptim(rawFile, algorithms, function (prev, next) {
            return prev.then(function (res) {
                return res || next(rawFile, _initCompressedFile(rawFile.name, opts._tmpDir))
                    .then(function (compressed) {
                        return _isSmallerAfterCompression(rawFile, compressed, opts);
                    });
                });
            }, new Q(false))
            .then(function (isSmaller) {
                return {
                    name: rawFile.name,
                    isOptimized: !isSmaller,
                    exitCode: 0
                };
            })
            .fail(function (err) {
                return _handleError(err, rawFile);
            });
    }
};
