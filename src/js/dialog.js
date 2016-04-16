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
 *               dialog.close();
 *          }
 *       }]
 *   });
 * ```
 */

var core = require('./core'),
    $ = require('./lite'),
    template = require('./tpl/dialog');

var Dialog = function(options) {
        var opts = this.options = core.extend({}, Dialog.prototype.defaults, options || {});

        //由于按钮排列采用CSS解决，所以目前限制最大可包含5个按钮
        //opts.buttons && opts.buttons.length > 5 && (opts.buttons.length = 5);
        init.call(this);
    },
    $body = $('body'),
    proto = Dialog.prototype;

var ZOOMIN_CLASS = 'kub-animated kub-zoomIn',
    DIALOG_SELECTOR = '#J_dialog',
    DIALOG_BUTTON_SELECTOR = '.J_dialogButton';

proto.constructor = Dialog;

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
 * * `scrollable`: 是否禁用页面滚动条；
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
proto.defaults = {
    modal: true,
    title: '',
    showHeader: true,
    message: '',
    className: '',
    scrollable: true,
    animated: true,
    buttons: null
};

var render = function(data) {

    var html = template({
        data: data
    });
    this.$element = $(html).appendTo($body);
    return this;
};

var init = function() {
    var self = this,
        options = self.options;

    //解决 iphone 下，fixed定位问题
    setTimeout(function() {
        var $window = $(window);
        $window.scrollTop($window.scrollTop());
    }, 5);

    //渲染数据
    render.call(self, options);

    this.$dialog = this.$element.find(DIALOG_SELECTOR);

    self.setPosition();

    self.show();

    //注册按钮事件
    self.$element.on('click', DIALOG_BUTTON_SELECTOR, function(e) {
        var index = parseInt($(this).attr('data-index')),
            button = options.buttons[index];

        button.handler && button.handler.call(this, e, self);
    });
};

proto.setPosition = function() {}

/**
 * ## show
 *
 * 显示弹窗
 * @return {instance} 返回当前实例
 */
proto.show = function() {

    this.$element.show();
    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS);

    return this;
};

/**
 * ## hide
 *
 * 隐藏弹窗
 * @return {instance} 返回当前实例
 */
proto.hide = function() {

    this.$element.hide();
    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS);

    return this;
};

/**
 * ## close
 *
 * 关闭弹窗
 * @return {instance} 返回当前实例
 */
proto.close = function() {
    var self = this,
        opts = this.options;

    if (opts.closeHandler && opts.closeHandler.call(this) === false) {
        return this;
    }

    this.hide();
    self.$element.remove();

    return this;
};

module.exports = Dialog;
