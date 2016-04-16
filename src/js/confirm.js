/**
 * # Kub.Confirm
 * confirm弹窗。
 *
 * @extend [Dialog](dialog.js.html)
 */

/**
 * ## Confirm Constructor
 *
 * 初始化`Confirm`类，`Confirm`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var confirm = new Kub.Confirm({
 *     confirm:function(e,dialog){
 *         console.log("确认按钮");
 *         dialog.close();
 *     }
 * });
 * ```
 */
var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog');

var Confirm = function(options) {

        var opts = this.options = core.extend({}, Confirm.prototype.defaults, options || {});

        this.options.buttons = [{
            text: opts.cancelText,
            handler: opts.cancel || function(e, dialog) {
                dialog.close();
            }
        }, {
            text: opts.confirmText,
            handler: opts.confirm
        }];

        Dialog.call(this, opts);
    },
    proto = Alert.prototype;

//继承于 `Dialog`
core.inherit(Confirm, Dialog);

proto.constructor = Confirm;

/**
 * ## defaults
 *
 * `Confirm`默认配置项。
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
 * * `locale`: 本地化。与`Dialog`保持一致。
 *
 * * `modal`: 是否显示遮罩层。
 */
proto.defaults = {
    confirmText: '确定',
    confirm: null,
    cancelText: '取消',
    cancel: null,
    showHeader: false,
    className: "kub-confirm",
    modal: true
}

module.exports = Confirm;
