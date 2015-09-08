/**
 * # Kub.Loader
 * 
 * 加载等待框
 * @extend [Dialog](dialog.js.html)
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Loader = factory(root, root._, root.jQuery||root.Zepto, Kub.Dialog);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root,require("./lib/underscore"),require("./lib/zepto"),require("./dialog"));
    }else {
        Kub.Loader = factory(root, root._, root.jQuery||root.Zepto, Kub.Dialog);
    }
}(this,function(root, _, $, Dialog){

    /**
     * ## Loader Constructor
     *
     * 初始化`Loader`类，`Loader`并不提供实例方法，实例方法均继承于`Dialog`。
     *
     * 使用方法：
     * ```js
     * var loader = new Kub.Loader();
     * //隐藏loader
     * loader.hide();
     * ```
     */
    var Loader = function(options){
        var self = this;
        this.options = $.extend({},Loader.prototype.defaults, options||{},{
            showHeader:false,
            closable:false,
            buttons:null
        });
        
        this.options.message = _.template(TEMPLATE)({data:this.options});

        Dialog.call(this,this.options);
    };

    //加载等待框模板
    var TEMPLATE = '<div class="kub-spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div> <div class="kub-loader-message"><%= data.message%></div>'

    //继承于 `Dialog`
    Dialog.prototype.inherit(Loader,Dialog);

    ;(function(){
        this.constructor = Loader;

        /**
         * ## defaults
         *
         * `Loader`默认配置项。
         *
         * 配置项说明：
         * 
         * * `className`: 弹窗类名，不建议修改，会影响样式。
         * 
         * * `message`: 加载文字提示
         * 
         * * `modal`: 是否显示遮罩层。
         */
        this.defaults = {
            scrollable:true,
            className:"kub-loader",
            modal:true,
            message:"加载中..."
        };

     }).call(Loader.prototype);

    return Loader;
}));