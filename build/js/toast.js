/**
 * # Kub.Toast
 * 
 * 提示框
 * @extend [Dialog](dialog.js.html)
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Toast = factory(root, root.jQuery || root.Zepto, Kub.Dialog);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root,require("./lib/zepto"),require("./dialog"));
    } else {
        Kub.Toast = factory(root, root.jQuery || root.Zepto, Kub.Dialog);
    }
}(this,function(root,$,Dialog){

    /**
     * ## Toast Constructor
     *
     * 初始化`Toast`类，`Toast`并不提供实例方法，实例方法均继承于`Dialog`。
     *
     * 使用方法：
     * ```js
     * var toast = new Kub.Toast({
     *     message:"操作成功。"
     * });
     * ```
     */
    var Toast = function(options){
        var self = this;
        this.options = $.extend({},Toast.prototype.defaults, options||{},{
            showHeader:false,
            buttons:null,
            modal:false,
            scrollable:true
        });

        Dialog.call(this,this.options);

        //自动关闭
        setTimeout(function(){
            self.close();
        },this.options.delay);
    };

    //继承于 `Dialog`
    Dialog.prototype.inherit(Toast,Dialog);

    ;(function(){
        this.constructor = Toast;

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
        this.defaults = {
            message:"",
            className:"kub-toast",
            top:50,
            delay:2000
        };

        this.setPosition = function(){
            this.$element.css({
                top:this.options.top
            });
            return this;
        };

     }).call(Toast.prototype);

    return Toast;
}));