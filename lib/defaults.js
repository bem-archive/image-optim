var path = require('path'),
    _ = require('lodash'),
    uid = require('uid');

/**
 * Sets options
 * @param {Object} [options]
 * @param {Number} [options.tolerance]
 * @param {String} [options._dirName]
 * returns {Object}
 */
 module.exports = function (options) {
    options = options || {};
    options._dirName = path.join(process.cwd(), '.image-optim#' + uid(6));

    return _.defaults(options, {
        tolerance: 0 // bytes
    });
};
