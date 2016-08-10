/**
 * # Dialog
 *
 * 对话框.
 */

/**
 * @require [core](./core.js.html)
 * @require [Lite](./lite.js.html)
 */
var core = require('./core'),
    $ = require('./lite'),
    template = require('./tpl/dialog')

/**
 * ## Dialog Constructor
 *
 * Dialog 构造函数。
 *
 * 使用：
 * ```js
 *   //可定制多个按钮
 *   var dialog = new Kub.Dialog({
 *       message:'这是个弹窗',
 *       title:'弹窗',
 *       buttons:[{
 *           text:'确定',
 *           handler:function(e,dialog){
 *
 *           }
 *       },{
 *          text:'取消',
 *          handler:function(e,dialog){
 *               //返回 event 与 dialog对象
 *               dialog.close()
 *          }
 *       }]
 *   })
 * ```
 */
function Dialog(options) {
    this.options = core.extend({}, _prototype.defaults, options || {})
    init(this)
}

var ZOOMIN_CLASS = 'kub-animated kub-zoomin',
    DIALOG_SELECTOR = '.J_dialog',
    DIALOG_BUTTON_SELECTOR = '.J_dialogButton',
    EVENT_NAME = 'click'

var $body

var _prototype = Dialog.prototype

var render = function(dialog,data) {
    var html = template(data)

    dialog.$element = $(html).appendTo($body)
    return this
}

var bindEvents = function(dialog){
    var options = dialog.options

    //注册按钮事件
    dialog.$element.find(DIALOG_BUTTON_SELECTOR).on(EVENT_NAME, function(e) {
        var index = parseInt($(this).attr('data-index')),
            button = options.buttons[index]

        button.handler && button.handler.call(this, e, dialog)
    })
}

var init = function(dialog) {

    !$body && ($body = $(document.body))

    //渲染数据
    render(dialog, dialog.options)

    dialog.$dialog = dialog.$element.find(DIALOG_SELECTOR)

    dialog.setPosition && dialog.setPosition()

    dialog.show()

    bindEvents(dialog)
}

/**
 * ## Dialog.prototype.defaults
 *
 * 默认配置项。
 *
 * 配置项说明：
 *
 * * `modal` : `Boolean` 是否显示遮罩层。
 *
 * * `title` : `String` 对话框名称。
 *
 * * `showHeader` : `Boolean` 是否显示头部。
 *
 * * `message` : `String` 弹窗内容。
 *
 * * `className` : `String` 弹窗类名。
 *
 * * `animated` : `Boolean` 是否开启动画效果。
 *
 * * `buttons`: `Array` 弹窗按钮。
 *
 * ```js
 * //例如：
 * [{
 *     text:'按钮名称',//按钮名称
 *     className:'button-name',//按钮class类名
 *     handler:function(){
 *         //按钮单击触发事件
 *     }
 * }]
 * ```
 */
_prototype.defaults = {
    modal: true,
    title: '',
    showHeader: true,
    message: '',
    className: '',
    animated: true,
    buttons: null
}

/**
 * ## Dialog.prototype.show
 *
 * 显示弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.show = function() {

    this.$element.show()
    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS)

    return this
}

/**
 * ## Dialog.prototype.hide
 *
 * 隐藏弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.hide = function() {

    this.$element.hide()
    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS)

    return this
}

/**
 * ## Dialog.prototype.close
 *
 * 关闭弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.close = function() {
    var opts = this.options

    if (opts.closeHandler && opts.closeHandler.call(this) === false) {
        return this
    }

    this.hide()
    this.$element.remove()

    return this
}

module.exports = Dialog
