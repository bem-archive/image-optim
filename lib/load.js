var _ = require('lodash'),
    algorithms = require('./algorithms');

/**
 * Loads the specifies in file 'algorithms.js' compression algorithms
 * @returns {Array of functions}
 */
module.exports = function () {
    var compressors = [];

    _(algorithms).keys().forEach(function (algorithm) {
        compressors.push(algorithms[algorithm]);
    });

    return compressors;
};
