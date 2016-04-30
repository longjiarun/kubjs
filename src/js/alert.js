/**
 * # Alert
 *
 * alert弹窗。
 */

/**
 * @require [core](./core.js.html)
 * @extend [Dialog](./dialog.js.html)
 */
var core = require('./core'),
    Dialog = require('./dialog')

/**
 * ## Alert Constructor
 *
 * 继承于`Dialog`，可使用`Dialog`类中的方法。
 *
 * 使用方法：
 * ```js
 * var alert = new Kub.Alert()
 * ```
 */
function Alert(options) {
    var opts = this.options = core.extend({}, _prototype.defaults, options || {})

    opts.buttons = [{
        text: opts.confirmText,
        handler: this.options.confirm || function(e, dialog) {
            dialog.close()
        }
    }]

    Dialog.call(this, opts)
}

var _prototype = Alert.prototype = Object.create(Dialog.prototype)

_prototype.constructor = Alert

/**
 * ## Alert.defaults
 *
 * `Alert` 默认配置项。
 *
 * 配置项说明：
 *
 * * `confirmText` : `String` 确认按钮名称。
 *
 * * `confirm` : `Function` 单击确认按钮时触发的事件。
 *
 *    > 如果未传递，单击时会默认关闭弹窗。
 *    >
 *    > 如果传递，需调用 `dialog.close()`关闭弹窗。
 *
 * * `showHeader` : `Boolean` 是否显示头部。
 *
 * * `className` : `String` 弹窗类名，修改时需加上`kub-alert`默认类名。
 *
 * * `modal` : `Boolean` 是否显示遮罩层。
 */

_prototype.defaults = {
    confirmText: '确定',
    confirm: null,
    showHeader: false,
    className: 'kub-alert',
    modal: true
}

module.exports = Alert
