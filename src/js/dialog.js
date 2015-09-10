/**
 * # Kub.Dialog
 *
 * 对话框
 */
!(function(factory){
    var root =this,Kub = root.Kub = root.Kub ? root.Kub : {};

    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root,root.jQuery||root.Zepto,root._);
    }else if (typeof define === "function") {
        define(function() {
            return Kub.Dialog = factory(root,root.jQuery||root.Zepto,root._);
        });
    } else {
        Kub.Dialog = factory(root,root.jQuery||root.Zepto,root._);
    }
}(function(root,$,_){

    /**
     * ## Dialog Constructor
     *
     * Dialog 类
     *
     * 使用：
     * ```js
     *   //可定制多个按钮
     *   var dialog = new Kub.Dialog({
     *       message:"这是个弹窗",
     *       title:"弹窗",
     *       buttons:[{
     *           text:"确定",
     *           handler:function(){
     *           }
     *       },{
     *          text:"取消",
     *           handler:function(e,dialog){
     *               //返回 event 与 dialog对象
     *               dialog.close();
     *           }
     *       }]
     *   });
     * ```
     */
    var Dialog = function(options){
        this.options = $.extend({}, Dialog.prototype.defaults, options||{});

        //由于按钮排列采用CSS解决，所以目前限制最大可包含5个按钮
        this.options.buttons && this.options.buttons.length > 5 && (this.options.buttons.length = 5);
        this._init();
    },
    $body = $("body"),
    $html = $body.parent();

    var ZOOMINCLASS = "kub-animated kub-zoomIn",
        OVERFLOWCLASS =  "kub-ofh",
        DIALOGID = "J_dialog" , 
        DIALOGCLOSEID = "J_dialogClose",
        DIALOGBUTTONCLASS = "J_dialogButton",
        //弹窗模板
        TEMPLATE = '<div class="kub-dialog-modal <%= data.className%> <%if( data.modal ){%> kub-modal <%}%>"> <div class="kub-dialog-wrapper"><div class="kub-dialog-container"> <div class="kub-dialog" id="J_dialog"> <%if(data.showHeader){%> <div class="kub-dialog-header clearfix"> <strong><%= data.title%></strong> <%if(data.closable){%><button class="kub-dialog-button kub-dialog-close" id="J_dialogClose">×</button><%}%> </div> <%}%> <div class="kub-dialog-body"> <%= data.message%> </div> <%if(data.buttons && data.buttons.length){%> <div class="kub-dialog-footer kub-column<%= data.buttons.length%>"> <% for (var i=0,j=data.buttons.length;i<j;i++){%><button class="kub-dialog-button J_dialogButton <%= data.buttons[i].className || ""%>" data-index="<%= i%>"><%= data.buttons[i].text%></button><%}%> </div> <%}%> </div></div></div> </div>'

    ;(function(){
        this.constructor = Dialog;

        /**
         * ## defaults
         *
         * 默认配置项。
         *
         * 配置项说明：
         * 
         * * `modal`: 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
         * 
         * * `title`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
         *
         * * `showHeader`: 是否显示头部。
         * 
         * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
         * 
         * * `message`: 弹窗内容
         *
         * * `className`: 弹窗类名
         * 
         * * `scrollable`: 是否禁用页面滚动条
         * 
         * * `animated`: 是否开启动画效果
         *
         * * `buttons`: 弹窗按钮
         * 
         * ```js
         * [{   
         *     //按钮名称
         *     text:"确定",
         *     handler:function(){
         *         //按钮单击触发事件
         *     }
         * }]
         * ```
         */
        this.defaults = {
            modal:true,
            title:"",
            showHeader:true,
            closable:true,
            message:"",
            className:"",
            scrollable:true,
            animated:true,
            buttons:null
        };

        this.i18n = {
            zh:{
                ok:"确定",
                cancel:"取消"
            },
            en:{
                ok:"Ok",
                cancel:"Cancel"
            }
        };

        //添加本地化，主要用在 `alert`,`confirm`,`prompt`
        this.addLocale = function(name, locale) {
            name && locale && (this.i18n[name] = locale);
            return this;
        };

        this.inherit = function(c,p){
            var F = function(){};
            F.prototype = p.prototype;
            c.prototype = new F();
            c.prototype.constructor = c;
            c.uber = p.prototype;
        };

        this._render = function(data){
            if(this.completed){
                return this;
            }
            var compiled = _.template(TEMPLATE),html = compiled({data:data});
            this.$element = $(html).appendTo($body);
            this.completed = true;
            return this;
        };

        this._init = function(){
            var self = this,options = self.options;

            //解决 iphone 下，fixed定位问题
            setTimeout(function(){
                var $window = $(window);
                $window.scrollTop($window.scrollTop());
            },5);

            //渲染数据
            self._render(options);
            this.$dialog = this.$element.find("#"+DIALOGID);
            
            self.show();
            
            self.setPosition();
        
            //监听事件
            self.$element.find("#"+DIALOGCLOSEID).on("click",function(){
                self.close();
            });

            //注册按钮事件
            self.$element.on("click","."+DIALOGBUTTONCLASS,function(e){
                var index = parseInt($(this).attr("data-index"));
                options.buttons[index] && options.buttons[index].handler && options.buttons[index].handler.call(this,e,self);
            });
        };


        //采用table-cell居中方式
        this.setPosition = function(){
            /*this.$dialog.css({
                marginTop:-(this.$dialog.height()/2 || 100),
                top:"50%"
            });*/
            return this;
        };

        var i = 0,scrollTop;
        this.disableScrollbar = function(){
            if(!this.options.scrollable){
                i == 0 && (scrollTop = $body.scrollTop());
                $body.addClass(OVERFLOWCLASS) && $html.addClass(OVERFLOWCLASS);
            }
            return this;
        };

        this.enableScrollbar = function(){
            if(!this.options.scrollable){
                i<1 && $body.removeClass(OVERFLOWCLASS) && $html.removeClass(OVERFLOWCLASS) && (i=0);
                i == 0 && $body.scrollTop(scrollTop);
            }
            return this;
        };

        /**
         * ## show
         *
         * 显示弹窗
         * @return {instance} 返回当前实例
         */
        this.show = function(){
            this.disableScrollbar();

            !this.options.scrollable  && i++;
            this.$element.show();

            this.options.animated && this.$dialog.addClass(ZOOMINCLASS);
            return this;
        };

        /**
         * ## hide
         *
         * 隐藏弹窗
         * @return {instance} 返回当前实例
         */
        this.hide = function(){
            !this.options.scrollable && i--;
            this.enableScrollbar();

            this.$element.hide();
            this.options.animated && this.$dialog.removeClass(ZOOMINCLASS);

            return this;
        };

        /**
         * ## close
         *
         * 关闭弹窗
         * @return {instance} 返回当前实例
         */
        this.close = function(){
            var self =this;
            if(this.options.closeHandler && this.options.closeHandler.call(this) === false){
                return this;
            }

            this.hide();
            self.$element.remove();
            
            return this;
        };

    }).call(Dialog.prototype);
    return Dialog;
}));