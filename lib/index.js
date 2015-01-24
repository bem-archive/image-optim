var Q = require('q'),
    _ = require('lodash'),
    File = require('./file'),
    optim = require('./optim');

/**
 * Processes the give files in the specified mode
 * @param {Array} files
 * @param {Function} mode
 * @returns {Promise * Array}
 */
function _imageOptim(files, mode) {
    return Q.all(files.map(function (filename) {
        return mode(new File(filename));
    }))
    .then(_.compact);
}

/**
 * API
 * ===
 */
module.exports = {
    /**
     * Optimizes the given files
     * Returns the information about optimized files
     * @example
     * [{ name: file.ext, savedBytes: 1 }]
     * @param {Array} files
     * @returns {Promise * Array}
     */
    optim: function (files) {
        return _imageOptim(files, optim.optimize);
    },

    /**
     * Returns the list of files which can be optimized further
     * @param {Array} files
     * @returns {Promise * Array}
     */
    lint: function (files) {
        return _imageOptim(files, optim.lint);
    }
};
