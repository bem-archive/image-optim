var Q = require('q');

/**
 * Mock error-algorithms
 * ===============
 */
module.exports = {
    /**
     * @returns {Promise * Error}
     */
    algorithm1: function () {
        return Q.reject();
    },

    ///
    algorithm2: function () {
        return Q.reject();
    }
};
