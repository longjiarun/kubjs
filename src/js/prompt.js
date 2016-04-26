/**
 * # Kub.Prompt
 *
 * 输入框
 * @extend [Dialog](dialog.js.html)
 */

/**
 * ## Prompt Constructor
 *
 * 初始化`Prompt`类，`Prompt`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var prompt = new Kub.Prompt({
 *     confirm:function(event,dialog){
 *         //输入框输入的值
 *         console.log(dialog.value)
 *     }
 * })
 * ```
 */

var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog'),
    template = require('./tpl/prompt')

function Prompt(options) {
    var self = this,
        opts = this.options = core.extend({}, _prototype.defaults, options || {})

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

var INPUT_SELECTOR = '.J_input'

var _prototype = Prompt.prototype = Object.create(Dialog.prototype)

_prototype.constructor = Prompt

/**
 * ## defaults
 *
 * `Prompt`默认配置项。
 *
 * 配置项说明：
 *
 * * `confirm`: 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
 *
 * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
 *
 * * `showHeader`: 是否显示头部。
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `modal`: 是否显示遮罩层。
 *
 * * `inputType`: 输入框类型。
 *
 * * `placeholder`: 输入框 placeholder 属性。
 *
 * * `defaultValue`: 输入框默认值。
 */
_prototype.defaults = {
    confirmText: '确定',
    confirm: null,
    cancelText: '取消',
    cancel: null,
    showHeader: false,
    className: 'kub-prompt',
    modal: true,
    inputType: 'text',
    placeholder: '',
    defaultValue: ''
}

module.exports = Prompt
