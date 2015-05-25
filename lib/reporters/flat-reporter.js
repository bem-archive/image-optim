/**
 * Flat reporter of the results
 * ============================
 */
var inherit = require('inherit'),
    chalk = require('chalk'),
    Q = require('q'),
    SUCCESS = require('../exit-code').SUCCESS,
    Reporter = require('./reporter');

/**
 * @param {String} text
 * @param {String} color
 * @returns {String}
 */
function _boldFont(text, color) {
    return chalk.bold[color](text);
}

/**
 * @param {OptimResult|LintResult} item
 * @returns {String}
 */
function _formatReport(item) {
    var out = item.name.bold + ' - ';

    if (item.exitCode !== SUCCESS) {
        return out + this._handleError(item.exitCode, _boldFont);
    }

    if (this.mode === 'optim') {
        return out + 'saved ' + _boldFont(item.savedBytes.toString(), 'green') + ' bytes';
    }

    return out + (item.isOptimized
        ? _boldFont('optimized', 'green')
        : _boldFont('not optimized', 'red'));
}

/**
 * @param {OptimResult|LintResult} a
 * @param {OptimResult|LintResult} b
 * @returns {Number}
 */
function _sortFunc(a, b) {
    if ((a.exitCode !== SUCCESS && b.exitCode === SUCCESS) || (!a.isOptimized && b.isOptimized)) {
        return 1;
    }

    return -1;
}

/**
 * @name FlatReporter
 * @class
 */
module.exports = inherit(Reporter, {
    /**
     * @typedef {Object} OptimResult
     * @property {String} name
     * @property {Number} savedBytes
     * @property {Number} exitCode
     */

    /**
     * @typedef {Object} LintResult
     * @property {String} name
     * @property {Boolean} isOptimized
     * @property {Number} exitCode
     */

    /**
     * Returns the flat report
     * @param {OptimResult[]|LintResult[]} result
     * @returns {Promise * String}
     * @private
     */
    _format: function (result) {
        return Q.resolve(
            result
                .sort(_sortFunc)
                .map(_formatReport.bind(this))
                .join('\n')
        );
    },

    /**
     * Writes the flat report into the console
     * @param {String} result
     * @private
     */
    _handle: function (result) {
        return console.log(result);
    }
});
