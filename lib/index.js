var imageOptim = require('./image-optim'),
    modes = require('./modes'),
    algorithms = require('./algorithms'),
    exit = require('./exit-code');

/**
 * API
 * ===
 */
module.exports = {
    /**
     * @typedef {Object} OptimResult
     * @property {String} name
     * @property {Number} savedBytes
     * @property {Number} exitCode
     */

    /**
     * Optimizes the given files
     * Returns the information about the optimized files
     * @param {Array} files
     * @returns {Promise * OptimResult[]}
     */
    optim: function (files) {
        return imageOptim(files, modes.optim, algorithms);
    },

    /**
     * @typedef {Object} LintResult
     * @property {String} name
     * @property {Boolean} isOptimized
     * @property {Number} exitCode
     */

    /**
     * Returns the list of files which can be optimized further
     * Returns the information about the checked files
     * @param {Array} files
     * @param {Object} [options] -> lib/defaults.js
     * @param {Number} [options.tolerance] default: 0
     * @returns {Promise * LintResult[]}
     */
    lint: function (files, options) {
        return imageOptim(files, modes.lint, algorithms, options);
    },

    SUCCESS: exit.SUCCESS,
    CANT_COMPRESS: exit.CANT_COMPRESS,
    DOESNT_EXIST: exit.DOESNT_EXIST
};
