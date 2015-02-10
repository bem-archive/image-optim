var Q = require('q'),
    qfs = require('q-io/fs'),
    _ = require('lodash'),
    modes = require('./modes'),
    File = require('./file'),
    defaults = require('./defaults'),
    reporters = require('./reporters');

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
 * @param {Object}  [options] -> lib/defaults.js
 * @param {Number}  [options.tolerance=0]
 * @param {Boolean} [options.reporters=[]]
 * @param {String}  [options._tmpDir=md5]
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
