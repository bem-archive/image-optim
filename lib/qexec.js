var Q = require('q'),
    child_process = require('child_process'), // jscs: disable
    format = require('util').format;

/**
 * Simple exec wrapper
 * Printf-like parameters will be joined to command
 * Will be resolved with command's output or rejected with error
 * @returns {Promise * String}
 */
module.exports = function () {
    var cmd = format.apply(null, arguments),
        def = Q.defer();

    child_process.exec(cmd, function (error, stdout, stderr) {
        error || stderr
            ? def.reject(error || stderr)
            : def.resolve(stdout.trim());
    });

    return def.promise;
};
