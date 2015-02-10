/**
 * Reporters core
 * ==============
 */
var Reporters = {
    html: require('./html-reporter'),
    flat: require('./flat-reporter')
};

/**
 * Initialize the reporter
 * @param {String} name
 * @param {String} mode
 * @returns {Reporter}
 */
exports.mk = function (name, mode) {
    return new Reporters[name](mode);
};
