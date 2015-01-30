var Q = require('q'),
    qfs = require('q-io/fs'),
    _ = require('lodash'),
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
 * @param {Array} algorithms
 * @param {Object} [options] -> lib/defaults.js
 * @param {Number} [options.tolerance] default: 0
 * @param {String} [options._dirName]
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

    return qfs.makeDirectory(options._dirName)
        .then(function () {
            return _splice(_.uniq(files), 50).reduce(_reduceImageOptimFunc, new Q([]));
        })
        .then(function (res) {
            return qfs.removeTree(options._dirName)
                .thenResolve(res);
        });
};
