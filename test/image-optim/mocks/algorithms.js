var Q = require('q'),
    qfs = require('q-io/fs'),
    File = require('../../../lib/file');

/**
 * @param {File} file
 * @param {String} suffix
 * @param {Number} shift
 * @returns {Promise * File}
 */
function mockCompress(file, suffix, shift) {
    var compressedFile = {
        name: file.name + suffix,
        size: file.size - shift
    };

    return qfs.write(compressedFile.name, new Buffer(compressedFile.size))
        .then(function () {
            return new File(compressedFile.name, compressedFile.size);
        });
}

/**
 * Mock algorithms
 * ===============
 */
module.exports = {
    /**
     * @param {File} file
     * @returns {Promise * File}
     */
    algorithm1: function (file) {
        return mockCompress(file, '.algorithm1.ext', 1);
    },

    ///
    algorithm2: function (file) {
        return mockCompress(file, '.algorithm2.ext', -1);
    },

    /**
     * returns {Promise * Error}
     */
    algorithm3: function () {
        return Q.reject();
    }
};
