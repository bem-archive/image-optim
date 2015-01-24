/**
 * File
 * ====
 */
var inherit = require('inherit'),
    qfs = require('q-io/fs');

/**
 * @name File
 * @class
 */
module.exports = inherit({
    /**
     * Constructor
     */
    __constructor: function (name, size) {
        this.name = name || '';
        this.size = size || 0;
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
    }
});
