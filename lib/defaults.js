var format = require('util').format,
    path = require('path'),
    chalk = require('chalk'),
    _ = require('lodash'),
    md5 = require('MD5');

/**
 * Sets opts
 * @param {Object}   [opts]
 * @param {Number}   [opts.tolerance]
 * @param {String[]} [opts.reporters]
 * returns {Object}
 */
 module.exports = function (opts) {
    opts = opts || {};
    opts._tmpDir = path.join(process.cwd(), '.image-optim#' + md5(new Date()));

    if (opts.tolerance && opts.tolerance < 0) {
        throw format('%s tolerance can not be negative', chalk.bold.red('ERROR:'));
    }

    return _.defaults(opts, {
        tolerance: 0,
        reporters: []
    });
};
