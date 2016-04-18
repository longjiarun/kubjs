/**
 * # Kub.Toast
 *
 * 提示框
 * @extend [Dialog](dialog.js.html)
 */

/**
 * ## Toast Constructor
 *
 * 初始化`Toast`类，`Toast`并不提供实例方法，实例方法均继承于`Dialog`。
 *
 * 使用方法：
 * ```js
 * var toast = new Kub.Toast({
 *     message:'操作成功。'
 * });
 * ```
 */

var core = require('./core'),
    Dialog = require('./dialog');

var Toast = function(options){
    var self = this,
        opts = this.options = core.extend({},Toast.prototype.defaults, options||{});

    Dialog.call(this, opts);

    //自动关闭
    setTimeout(function(){
        self.close();
    }, opts.delay);
};

var proto = Toast.prototype = Object.create(Dialog.prototype);

proto.constructor = Toast;

/**
 * ## defaults
 *
 * `Toast`默认配置项。
 *
 * 配置项说明：
 *
 * * `message`: 显示文字
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `top`: 距离顶部高度
 *
 * * `delay`: 延迟时间
 */
proto.defaults = {
    message:'',
    className:'kub-toast',
    top:50,
    delay:2000,

    showHeader:false,
    buttons:null,
    modal:false
};

proto.setPosition = function(){
    var top = this.options.top;

    this.$element.css({
        top:core.isNumber(top) ? top + 'px' : top
    });
    return this;
};

module.exports = Toast;
