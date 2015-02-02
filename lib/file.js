/**
 * File
 * ====
 */
var inherit = require('inherit'),
    Q = require('q'),
    qfs = require('q-io/fs'),
    readChunk = require('read-chunk'),
    imageType = require('image-type');

/**
 * @name File
 * @class
 */
module.exports = inherit({
    /**
     * Constructor
     * @param {String} name
     * @param {Number} size
     * @param {String} type
     */
    __constructor: function (name, size, type) {
        this.name = name || '';
        this.size = size || 0;
        this.type = type || null;
    },

    /**
     * @retuns {Promise * this}
     * @public
     */
    loadSize: function () {
        var _this = this;

        return qfs.stat(_this.name)
            .then(function (stat) {
                _this.size = stat.size;

                return _this;
            });
    },

    /**
     * @returns {Promise * this}
     * @public
     */
    loadType: function () {
        var _this = this;

        return Q.nfcall(readChunk, _this.name, 0, 12)
            .then(function (buffer) {
                _this.type = _this._getType(buffer);

                return _this;
            });
    },

    /**
     * returns {Promise}
     * @public
     */
    remove: function () {
        return qfs.remove(this.name);
    },

    /**
     * @returns {Number}
     * @public
     */
    isLarge: function () {
        return this.size > 250 * 1024;
    },

    /**
     * @returns {Number}
     * @public
     */
    isSmall: function () {
        return this.size < 2048;
    },

    /**
     * @param {Buffer} buffer
     * @returns {String|null}
     * @private
     */
    _getType: function (buffer) {
        var type = imageType(buffer);

        return type ? type.ext : null;
    }
});
