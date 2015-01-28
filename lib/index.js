var imageOptim = require('./image-optim'),
    modes = require('./modes'),
    algorithms = require('./algorithms');

/**
 * API
 * ===
 */
module.exports = {
    /**
     * Optimizes the given files
     * Returns the information about the optimized files
     * @example
     * [
     *   { name: file1.ext, savedBytes: 12345 },
     *   { name: 'file2.ext', savedBytes: 'Can not compress' },
     *   { name: 'file3.ext', savedBytes: 'Does not exist' }
     * ]
     * @param {Array} files
     * @returns {Promise * Array}
     */
    optim: function (files) {
        return imageOptim(files, modes.optim, algorithms);
    },

    /**
     * Returns the list of files which can be optimized further
     * Returns the information about the checked files
     * @example
     * [
     *   { name: 'file1.ext', isOptimized: true },
     *   { name: 'file.ext', isOptimized: false },
     *   { name: 'file.ext', isOptimized: 'Can not be compressed' },
     *   { name: 'file.ext', isOptimized: 'Does not exist' },
     * ]
     * @param {Array} files
     * @param {Object} [options] -> lib/defaults.js
     * @param {Number} [options.tolerance] default: 0
     * @returns {Promise * Array}
     */
    lint: function (files, options) {
        return imageOptim(files, modes.lint, algorithms, options);
    }
};
