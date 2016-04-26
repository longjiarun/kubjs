/**
 * # Kub.Alert
 * alert弹窗，用于提示说明。
 *
 * @extend [Dialog](dialog.js.html)
 */

/**
 * ## Alert Constructor
 *
 * 初始化`Alert`类，`Alert`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var alert = new Kub.Alert()
 * ```
 */

var core = require('./core'),
    Dialog = require('./dialog')

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
 * ## defaults
 *
 * `Alert`默认配置项。
 *
 * 配置项说明：
 *
 * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
 *
 * * `showHeader`: 是否显示头部。
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `modal`: 是否显示遮罩层。
 */

_prototype.defaults = {
    confirmText: '确定',
    confirm: null,
    showHeader: false,
    className: 'kub-alert',
    modal: true
}

module.exports = Alert
