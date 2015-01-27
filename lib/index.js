var imageOptim = require('./image-optim'),
    modes = require('./modes');

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
        return imageOptim(files, modes.optim);
    },

    /**
     * Returns the list of files which can be optimized further
     * @param {Array} files
     * @param {Object} [options] -> lib/defaults.js
     * @param {Number} [options.tolerance] default: 0
     * @returns {Promise * Array}
     */
    lint: function (files, options) {
        return imageOptim(files, modes.lint, options);
    }
};
