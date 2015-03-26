var Q = require('q'),
    qfs = require('q-io/fs'),
    _ = require('lodash'),
    modes = require('./modes'),
    File = require('./file'),
    defaults = require('./defaults'),
    reporters = require('./reporters');

/**
 * Divides the given array of files into groups of the given length
 * @param {String[]} files
 * @param {Number} length
 * @returns {Object[]}
 */
function _splice(files, length) {
    var spliced = [];

    while (files.length) {
        spliced.push(files.splice(0, length));
    }

    return spliced;
}

/**
 * @typedef {Object} OptimResult
 * @property {String} name
 * @property {Number} savedBytes
 * @property {Number} exitCode
 */

 /**
 * @typedef {Object} LintResult
 * @property {String} name
 * @property {Boolean} isOptimized
 * @property {Number} exitCode
 */

/**
 * Processes the given files in the specified mode
 * @param {String[]} files
 * @param {Function} mode
 * @param {Function[]} algorithms
 * @param {Object}  [options] -> lib/defaults.js
 * @param {Number}  [options.tolerance=0]
 * @param {Boolean} [options.reporters=[]]
 * @param {String}  [options._tmpDir=md5]
 * @returns {Promise * OptimResult[]|LintResult[]}
 */
module.exports = function (files, mode, algorithms, options) {
    /**
     * Helping reduce function
     * @param {Promise * OptimResult[]|LintResult[]} prev
     * @param {Promise * OptimResult[]|LintResult[]} next
     * @returns {Promise * OptimResult[]|LintResult[]}
     */
    function _reduceImageOptimFunc(prev, next) {
        return prev.then(function (res) {
            return Q.all(next.map(function (filename) {
                return modes[mode](new File(filename), algorithms, options);
            }))
            .then(function (stepRes) {
                return res.concat(stepRes);
            });
        });
    }

    options = defaults(options);

    return qfs.makeDirectory(options._tmpDir)
        .then(function () {
            return _splice(_.uniq(files), 50).reduce(_reduceImageOptimFunc, new Q([]));
        })
        .then(function (res) {
            return qfs.removeTree(options._tmpDir)
                .then(function () {
                    return Q.all(options.reporters.map(function (item) {
                        return reporters.mk(item, mode).write(res);
                    }));
                })
                .thenResolve(res);
        });
};
