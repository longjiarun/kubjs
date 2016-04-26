/**
 * # Kub.Dialog
 *
 * 对话框
 */

/**
 * ## Dialog Constructor
 *
 * Dialog 类
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

var core = require('./core'),
    $ = require('./lite'),
    template = require('./tpl/dialog')

function Dialog(options) {
    var opts = this.options = core.extend({}, _prototype.defaults, options || {})
    init(this)
}

var ZOOMIN_CLASS = 'kub-animated kub-zoomin',
    DIALOG_SELECTOR = '.J_dialog',
    DIALOG_BUTTON_SELECTOR = '.J_dialogButton',
    EVENT_NAME = 'click'

var $body = $(document.body)

var _window = window;
    _prototype = Dialog.prototype

var render = function(dialog,data) {
    var html = template(data)
    dialog.$element = $(html).appendTo($body)
    return this
}

var fixed = function(){
    //解决 iphone 下，fixed定位问题
    core.os.ios && setTimeout(function() {
        _window.scrollTo(_window.scrollX, _window.scrollY)
    }, 5)
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

    fixed()

    //渲染数据
    render(dialog, dialog.options)

    dialog.$dialog = dialog.$element.find(DIALOG_SELECTOR)

    dialog.setPosition && dialog.setPosition()

    dialog.show()

    bindEvents(dialog)
}

/**
 * ## defaults
 *
 * 默认配置项。
 *
 * 配置项说明：
 *
 * * `modal`: 是否显示遮罩层；
 *
 * * `title`: 对话框名称；
 *
 * * `showHeader`: 是否显示头部；
 *
 * * `message`: 弹窗内容，可设置成`html`；
 *
 * * `className`: 弹窗类名；
 *
 * * `animated`: 是否开启动画效果；
 *
 * * `buttons`: 弹窗按钮；
 *
 * ```js
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
 * ## show
 *
 * 显示弹窗
 * @return {instance} 返回当前实例
 */
_prototype.show = function() {

    this.$element.show()
    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS)

    return this
}

/**
 * ## hide
 *
 * 隐藏弹窗
 * @return {instance} 返回当前实例
 */
_prototype.hide = function() {

    this.$element.hide()
    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS)

    return this
}

/**
 * ## close
 *
 * 关闭弹窗
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
