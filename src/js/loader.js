/**
 * # Kub.Loader
 *
 * 加载等待框
 * @extend [Dialog](dialog.js.html)
 */

/**
 * ## Loader Constructor
 *
 * 初始化`Loader`类，`Loader`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var loader = new Kub.Loader();
 * //隐藏loader
 * loader.hide();
 * ```
 */
var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog'),
    template = require('./tpl/loader');

var Loader = function(options) {
        var self = this,
            opts = this.options = core.extend({}, Loader.prototype.defaults, options || {});

        opts.message = template({
            data: this.options
        });

        Dialog.call(this, opts);
    },
    proto = Loader.prototype;

//继承于 `Dialog`
core.inherit(Loader, Dialog);

proto.constructor = Loader;

/**
 * ## defaults
 *
 * `Loader`默认配置项。
 *
 * 配置项说明：
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `message`: 加载文字提示
 *
 * * `modal`: 是否显示遮罩层。
 */
proto.defaults = {
    scrollable: true,
    className: 'kub-loader',
    modal: true,
    message: '加载中...',

    showHeader: false,
    buttons: null
}

module.exports = Loader;
