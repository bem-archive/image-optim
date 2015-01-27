var Q = require('q'),
    _ = require('lodash'),
    load = require('./load'),
    File = require('./file'),
    defaults = require('./defaults');

/**
 * Divides the given array of files into groups of the given length
 * @param {Array} files
 * @param {Number} length
 * @returns {Array}
 */
function _splice(files, length) {
    var spliced = [];

    while (files.length) {
        spliced.push(files.splice(0, length));
    }

    return spliced;
}

/**
 * Processes the given files in the specified mode
 * @param {Array} files
 * @param {Function} mode
 * @param {Object} algorithms
 * @param {Object} [options] -> lib/defaults.js
 * @param {Number} [options.tolerance] default: 0
 * @returns {Promise * Array}
 */
module.exports = function (files, mode, algorithms, options) {
    /**
     * Helping reduce function
     * @param {Promise * Array} prev
     * @param {Promise * Array} next
     * @returns {Promis * Array}
     */
    function _reduceImageOptimFunc(prev, next) {
        return prev.then(function (res) {
            return Q.all(next.map(function (filename) {
                return mode(new File(filename), algorithms, options);
            }))
            .then(function (stepRes) {
                return res.concat(stepRes);
            });
        });
    }

    options = defaults(options);
    algorithms = load(algorithms);

    return _splice(files, 50)
        .reduce(_reduceImageOptimFunc, new Q([]))
        .then(_.compact);
};
