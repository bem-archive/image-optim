var inherit = require('inherit'),
    exit = require('../exit-code');

/**
 * @name Reporter
 * @class
 */
module.exports = inherit({
    /**
     * Constructor
     * @param {String} mode
     */
    __constructor: function (mode) {
        this.mode = mode;
    },

    /**
     * Writes the report
     * @param {String} result
     * @returns {Promise * undefined}
     * @public
     */
    write: function (result) {
        return this._format(result)
            .then(this._handle.bind(this));
    },

    /**
     * Error handler
     * @param {Number} exitCode
     * @param {Function} formater
     * @returns {String}
     * @private
     */
    _handleError: function (exitCode, formater) {
        var errMsg = exitCode === exit.CANT_COMPRESS
            ? 'compression failed'
            : 'does not exist';

        return formater(errMsg, 'red');
    },

    ///
    _format: function () {
        throw 'Not implemented';
    },

    ///
    _handle: function () {
        throw 'Not implemented';
    }
});
