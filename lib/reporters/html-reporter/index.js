/**
 * HTML reporter of the results
 * ============================
 */
var path = require('path'),
    format = require('util').format,
    inherit = require('inherit'),
    Handlebars = require('handlebars'),
    qfs = require('q-io/fs'),
    SUCCESS = require('../../exit-code').SUCCESS,
    Reporter = require('../reporter');

/**
 * @param {String} text
 * @param {String} color
 * @returns {String}
 */
function _boldFont(text, color) {
    return format('<font color="%s"><b>%s</b></font>', color, text);
}

/**
 * @name HtmlReporter
 * @class
 */
module.exports = inherit(Reporter, {
    /**
     * Returns the HTML report
     * @param {Object} result
     * @returns {Promise * String}
     * @private
     */
    _format: function (result) {
        var _this = this,
            _handleError = _this._handleError;

        /**
         * Optim Report helper
         */
        Handlebars.registerHelper('optimReport', function (exitCode, savedBytes) {
            if (exitCode !== SUCCESS) return _handleError(exitCode, _boldFont);

            return 'saved ' + _boldFont(savedBytes, 'green') + ' bytes';
        });

        /**
         * Lint Report helper
         */
        Handlebars.registerHelper('lintReport', function (exitCode, isOptimized) {
            if (exitCode !== SUCCESS) return _handleError(exitCode, _boldFont);

            return isOptimized
                ? _boldFont('optimized', 'green')
                : _boldFont('not optimized', 'red');
        });

        return qfs.read(path.join(__dirname, 'suite.hbs'))
            .then(function (source) {
                var template = Handlebars.compile(source),
                    data = { isOptimMode: _this.mode === 'optim', files: result };

                return template(data);
            });
    },

    /**
     * Writes the HTML report into the file 'imageoptim-report.html'
     * @param {Object} result
     * @private
     */
    _handle: function (result) {
        return qfs.write(path.join(process.cwd(), 'imageoptim-report.html'), result);
    }
});
