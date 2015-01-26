var _ = require('lodash');

/**
 * Sets options
 * @param {Object} [options]
 * @param {Number} [options.tolerance]
 * returns {Object}
 */
 module.exports = function (options) {
    return _.defaults(options || {}, {
        tolerance: 0 // bytes
    });
};
