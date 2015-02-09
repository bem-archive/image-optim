var path = require('path'),
    _ = require('lodash'),
    md5 = require('MD5');

/**
 * Sets options
 * @param {Object} [options]
 * @param {Number} [options.tolerance]
 * @param {String} [options._tmpDir]
 * returns {Object}
 */
 module.exports = function (options) {
    options = options || {};
    options._tmpDir = path.join(process.cwd(), '.image-optim#' + md5(new Date()));

    return _.defaults(options, {
        tolerance: 0 // percents
    });
};
