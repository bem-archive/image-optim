var Q = require('q'),
    qfs = require('q-io/fs'),
    File = require('./file');

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
            return rawFile  ;
        });
}

/**
 * Checks whether the given raw file is smaller than the given compressed file
 * Removes the compressed file
 * @param {File} rawFile
 * @param {File} compressedFile
 * @param {Object} [options] -> lib/defaults.js
 * @param {Number} [options.tolerance] default: 0
 * @returns {Promise * Boolean}
 */
function _isSmallerAfterCompression(rawFile, compressedFile, options) {
    return compressedFile.remove()
        .then(function () {
            return rawFile.size - compressedFile.size > options.tolerance;
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
 * Modes
 * =====
 */
module.exports = {
    /**
     * Optimizes the given file and returns the information about the compression
     * @examples
     * 1. { name: 'file.ext', savedBytes: 12345 }
     * 2. { name: 'file.ext', savedBytes: 'Can not compress' }
     * 3. { name: 'file.ext', savedBytes: 'Does not exist' }
     * @param {File} rawFile
     * @param {Array} algorithms
     * @returns {Promise * Object}
     */
    optim: function (rawFile, algorithms) {
        /**
         * Helping reduce function
         * @param {Promise * File} prev
         * @param {Promise * File} next
         * returns {Promise * File}
         */
        function _reduceCompressFunc(prev, next) {
            return prev.then(function (minFile) {
                return next(rawFile)
                    .then(function (compressed) {
                        isCompressionError = false;

                        return _minFile(minFile, compressed);
                    })
                    // One of the algorithms failed
                    .fail(function () {
                        return minFile;
                    });
            });
        }

        // We need to detect whether all algorithms have failed or not
        // `isCompressionError` will be `false` if at least one of the algorithms do not fail
        var isCompressionError = true;

        return rawFile.loadSize()
            .then(function () {
                return algorithms.reduce(_reduceCompressFunc, new Q(rawFile));
            })
            .then(function (minFile) {
                return {
                    name: rawFile.name,
                    savedBytes: isCompressionError ? 'Can not be compressed' : _getSavedBytes(rawFile, minFile)
                };
            })
            // File does not exist
            .fail(function () {
                return {
                    name: rawFile.name,
                    savedBytes: 'Does not exist'
                };
            });
    },

    /**
     * Checks whether the given file can be optimized further and return the information about the check
     * @examples
     * 1. { name: 'file.ext', isOptimized: true }
     * 2. { name: 'file.ext', isOptimized: false }
     * 3. { name: 'file.ext', isOptimized: 'Can not be compressed' }
     * 4. { name: 'file.ext', isOptimized: 'Does not exist' }
     * @param {File} rawFile
     * @param {Array} algorithms
     * @param {Object} [options] -> lib/defaults.js
     * @param {Number} [options.tolerance] default: 0
     * @returns {Promise * Object}
     */
    lint: function (rawFile, algorithms, options) {
        /**
         * Helping reduce function
         * @param {Promise * Boolean} prev
         * @param {Promise * File} next
         * returns {Promise * Boolean}
         */
        function _reduceLintFunc(prev, next) {
            return prev.then(function (isSmaller) {
                return isSmaller || next(rawFile)
                    .then(function (compressed) {
                        isCompressionError = false;

                        return _isSmallerAfterCompression(rawFile, compressed, options);
                    })
                    // One of the algorithms failed
                    .fail(function () {
                        return isSmaller;
                    });
            });
        }

        // We need to detect whether all algorithms have failed or not
        // `isCompressionError` will be `false` if at least one of the algorithms do not fail
        var isCompressionError = true;

        return rawFile.loadSize()
            .then(function () {
                return algorithms.reduce(_reduceLintFunc, new Q(false));
            })
            .then(function (isSmaller) {
                return {
                    name: rawFile.name,
                    isOptimized: isCompressionError ? 'Can not be compressed' : !isSmaller
                };
            })
            // File does not exist
            .fail(function () {
                return {
                    name: rawFile.name,
                    isOptimized: 'Does not exist'
                };
            });
    }
};
