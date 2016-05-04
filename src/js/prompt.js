/**
 * # Prompt
 *
 * prompt 输入框。
 */

/**
 * @require [core](./core.js.html)
 * @extend [Dialog](./dialog.js.html)
 */
var core = require('./core'),
    Dialog = require('./dialog'),
    template = require('./tpl/prompt')

var INPUT_SELECTOR = '.J_input'

/**
 * ## Prompt Constructor
 *
 * 继承于`Dialog`，可使用`Dialog`类中的方法。
 *
 * 使用方法：
 * ```js
 * var prompt = new Kub.Prompt({
 *     confirm:function(event,dialog,value){
 *         //输入框输入的值 value
 *     }
 * })
 * ```
 */
function Prompt(options) {
    var opts = this.options = core.extend({}, _prototype.defaults, options || {})

    opts.buttons = [{
        text: opts.cancelText,
        handler: opts.cancel || function(e, dialog) {
            dialog.close()
        }
    }, {
        text: opts.confirmText,
        handler: function(e, dialog) {
            var value = dialog.$element.find(INPUT_SELECTOR)[0].value
            opts.confirm && opts.confirm.call(this, e, dialog, value)
        }
    }]

    opts.message = template(opts)

    Dialog.call(this, opts)
}

var _prototype = Prompt.prototype = Object.create(Dialog.prototype)

_prototype.constructor = Prompt

/**
 * ## Prompt.prototype.defaults
 *
 * `Prompt`默认配置项。
 *
 * 配置项说明：
 *
 * * `confirmText` : `String` 确认按钮名称。
 *
 * * `confirm` : `Function` 单击确认按钮时触发的事件。用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
 *
 * * `cancelText` : `String` 取消按钮名称。
 *
 * * `cancel` : `Function` 单击取消按钮时触发的事件。
 *
 *    > 如果未传递，单击时会默认关闭弹窗。
 *    >
 *    > 如果传递，需调用 `dialog.close()`关闭弹窗。
 *
 * * `showHeader` : `Boolean` 是否显示头部。
 *
 * * `className` : `String` 弹窗类名，修改时需加上`kub-prompt`默认类名。
 *
 * * `modal` : `Boolean` 是否显示遮罩层。
 *
 * * `message` : `String` 提示内容。
 *
 * * `inputType` : `String` 输入框类型。
 *
 * * `placeholder` : `String` 输入框 `placeholder` 属性。
 *
 * * `defaultValue` : `String` 输入框默认值。
 */
_prototype.defaults = {
    confirmText: '确定',
    confirm: null,
    cancelText: '取消',
    cancel: null,
    showHeader: false,
    className: 'kub-prompt',
    modal: true,
    message:'',
    inputType: 'text',
    placeholder: '',
    defaultValue: ''
}

module.exports = Prompt
