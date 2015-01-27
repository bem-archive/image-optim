var _ = require('lodash');

/**
 * Loads the specifies in file 'algorithms.js' compression algorithms
 * @param {Object} algorithms
 * @returns {Array of functions}
 */
module.exports = function (algorithms) {
    var compressors = [];

    _(algorithms).keys().forEach(function (algorithm) {
        compressors.push(algorithms[algorithm]);
    });

    return compressors;
};
