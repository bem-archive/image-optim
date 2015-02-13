/**
 * HTML reporter of the results
 * ============================
 */
var path = require('path'),
    format = require('util').format,
    inherit = require('inherit'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    qfs = require('q-io/fs'),
    exit = require('../../exit-code'),
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
 * @param {Object} item
 * @returns {String}
 */
function _getGroup(item) {
    return _.findKey(exit, function (value) {
        return value === item.exitCode;
    });
}

/**
 * @param {Boolean} isOptimMode
 * @param {Object} info
 * @returns {Object}
 */
function _getStatus(isOptimMode, info) {
    if (isOptimMode) {
        return {
            saved: _.reduce(info.SUCCESS, function (result, item) {
                return result + item.savedBytes;
            }, 0)
        };
    }

    var optimizedCount = _.filter(info.SUCCESS, function (item) {
        return item.isOptimized;
    }).length;

    return {
        optimized: optimizedCount,
        notOptimized: info.SUCCESS ? info.SUCCESS.length - optimizedCount : 0
    };
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
            _handleError = _this._handleError,
            info = _.groupBy(result, _getGroup);

        /**
         * Optim Report helper
         */
        Handlebars.registerHelper('optimReport', function (exitCode, savedBytes) {
            if (exitCode !== exit.SUCCESS) return _handleError(exitCode, _boldFont);

            return 'saved ' + _boldFont(savedBytes, 'green') + ' bytes';
        });

        /**
         * Lint Report helper
         */
        Handlebars.registerHelper('lintReport', function (exitCode, isOptimized) {
            if (exitCode !== exit.SUCCESS) return _handleError(exitCode, _boldFont);

            return isOptimized
                ? _boldFont('optimized', 'green')
                : _boldFont('not optimized', 'red');
        });

        return qfs.read(path.join(__dirname, 'suite.hbs'))
            .then(function (source) {
                var template = Handlebars.compile(source),
                    data = {
                        isOptimMode: _this.mode === 'optim',
                        files: result,
                        DOESNT_EXIST: info.DOESNT_EXIST ? info.DOESNT_EXIST.length : 0,
                        CANT_COMPRESS: info.CANT_COMPRESS ? info.CANT_COMPRESS.length : 0
                    };

                data.status = _getStatus(data.isOptimMode, info);

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
