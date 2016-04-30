/**
 * # Loader
 *
 * 加载等待框。
 *
 */

/**
 * @require [core](./core.js.html)
 * @extend [Dialog](./dialog.js.html)
 */
var core = require('./core'),
    Dialog = require('./dialog')

/**
 * ## Loader Constructor
 *
 * 继承于`Dialog`，可使用`Dialog`类中的方法。
 *
 * 使用方法：
 *
 * ```js
 * var loader = new Kub.Loader()
 *
 * //隐藏loader
 * loader.hide()
 *
 * var loader = new Kub.Loader({
 *     message: '定制提示内容'
 * })
 *
 * ```
 */
function Loader(options) {
    var opts = this.options = core.extend({}, _prototype.defaults, options || {}, {
        showHeader: false,
        buttons: null
    })

    Dialog.call(this, opts)
}

var _prototype = Loader.prototype = Object.create(Dialog.prototype)

_prototype.constructor = Loader

/**
 * ## Loader.prototype.defaults
 *
 * `Loader` 默认配置项。
 *
 * 配置项说明：
 *
 * * `className`: `String` 弹窗类名，修改时需加上`kub-loader`默认类名。
 *
 * * `message` : `String` 提示内容。
 *
 * * `modal` : `Boolean` 是否显示遮罩层。
 */
_prototype.defaults = {
    className: 'kub-loader',
    modal: true,
    message: '加载中…'
}

module.exports = Loader
