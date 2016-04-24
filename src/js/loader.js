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
 * var loader = new Kub.Loader()
 * //隐藏loader
 * loader.hide()
 * ```
 */
var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog')

function Loader(options) {
    var self = this,
        opts = this.options = core.extend({}, _prototype.defaults, options || {})

    Dialog.call(this, opts)
}

var _prototype = Loader.prototype = Object.create(Dialog.prototype)

_prototype.constructor = Loader

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
_prototype.defaults = {
    scrollable: true,
    className: 'kub-loader',
    modal: true,
    message: '加载中…',
    showHeader: false,
    buttons: null
}

module.exports = Loader
