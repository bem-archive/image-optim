var imageOptim = require('./image-optim'),
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
     * @param {String[]} files
     * @param {Object}   [opts]
     * @param {String[]} [opts.reporters]
     * @returns {Promise * OptimResult[]}
     */
    optim: function (files, opts) {
        return imageOptim(files, 'optim', algorithms, opts);
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
     * @param {String[]} files
     * @param {Object}   [opts]
     * @param {Number}   [opts.tolerance]
     * @param {String[]} [opts.reporters]
     * @returns {Promise * LintResult[]}
     */
    lint: function (files, opts) {
        return imageOptim(files, 'lint', algorithms, opts);
    },

    SUCCESS: exit.SUCCESS,
    CANT_COMPRESS: exit.CANT_COMPRESS,
    DOESNT_EXIST: exit.DOESNT_EXIST
};
