/**
 * Flat reporter of the results
 * ============================
 */
var inherit = require('inherit'),
    Q = require('q'),
    SUCCESS = require('../exit-code').SUCCESS,
    Reporter = require('./reporter');

require('colors');

/**
 * @param {String} text
 * @param {String} color
 * @returns {String}
 */
function _boldFont(text, color) {
    return text.bold[color];
}

/**
 * @name FlatReporter
 * @class
 */
module.exports = inherit(Reporter, {
    /**
     * Returns the flat report
     * @param {Object} result
     * @returns {Promise * String}
     * @private
     */
    _format: function (result) {
        var _this = this;
        return Q.resolve(result.map(function (item) {
            var out = item.name.bold + ' - ';

            if (item.exitCode !== SUCCESS) {
                return out + _this._handleError(item.exitCode, _boldFont);
            }

            if (_this.mode === 'optim') {
                return out + 'saved ' + _boldFont(item.savedBytes.toString(), 'green') + ' bytes';
            }

            return out + (item.isOptimized
                ? _boldFont('optimized', 'green')
                : _boldFont('not optimized', 'red'));
        }).join('\n'));
    },

    /**
     * Writes the flat report into the console
     * @param {Object} result
     * @private
     */
    _handle: function (result) {
        return console.log(result);
    }
});
