/**
 * # Kub.Alert
 * alert弹窗，用于提示说明。
 *
 * @extend [Dialog](dialog.js.html)
 */
var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog');

/**
 * ## Alert Constructor
 *
 * 初始化`Alert`类，`Alert`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var alert = new Kub.Alert();
 * ```
 */

var Alert = function(options) {
        var opts = this.options = core.extend({}, Alert.prototype.defaults, options || {});

        opts.buttons = [{
            text: opts.confirmText,
            handler: this.options.confirm || function(e, dialog) {
                dialog.close();
            }
        }];

        Dialog.call(this, opts);
    },
    proto = Alert.prototype;

//继承于 `Dialog`
core.inherit(Alert, Dialog);

proto.constructor = Alert;

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
 * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `locale`: 本地化。与`Dialog`保持一致。
 *
 * * `modal`: 是否显示遮罩层。
 */

proto.defaults = {
    confirmText:'确定',
    confirm: null,
    showHeader: false,
    closable: false,
    className: 'kub-alert',
    locale: 'zh',
    modal: true
};

module.exports = Alert;
