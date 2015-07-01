!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.Dialog = factory(root,root.jQuery||root.Zepto,root._);
        });
    }else {
        root.Dialog = factory(root,root.jQuery||root.Zepto,root._);
    }
}(this,function(root,$,_){
    var Dialog = function(options){
        this.options = $.extend({}, Dialog.prototype.defaults, options||{});

        //最大可包含5个按钮
        this.options.buttons && this.options.buttons.length > 5 && (this.options.buttons.length = 5);
        this._init();
    },$body = $("body"),$html = $body.parent();

    var ZOOMINCLASS = "kub-animated kub-zoomIn",
        OVERFLOWCLASS =  "kub-ofh",
        DIALOGID = "J_dialog" , 
        DIALOGCLOSEID = "J_dialogClose",
        DIALOGBUTTONCLASS = "J_dialogButton",
        TEMPLATE = '<div class="dialog-modal <%= data.className%> <%if( data.modal ){%> modal <%}%>"> <div class="dialog-wrapper"><div class="dialog-container"> <div class="dialog" id="J_dialog"> <%if(data.showHeader){%> <div class="dialog-header clearfix"> <strong><%= data.title%></strong> <%if(data.closable){%><button class="dialog-button dialog-close" id="J_dialogClose">×</button><%}%> </div> <%}%> <div class="dialog-body"> <%= data.message%> </div> <%if(data.buttons && data.buttons.length){%> <div class="dialog-footer column<%= data.buttons.length%>"> <% for (var i=0,j=data.buttons.length;i<j;i++){%><button class="dialog-button J_dialogButton" data-index="<%= i%>"><%= data.buttons[i].text%></button><%}%> </div> <%}%> </div></div></div> </div>'

    ;(function(){
        this.constructor = Dialog;

        this.defaults = {
            modal:true,
            title:"",
            showHeader:true,
            message:"",
            closable:true,
            scrollable:false
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

        this.render = function(data){
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

            //渲染数据
            self.render(options);
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


        /*采用table-cell居中方式*/
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

                console.log(scrollTop)
                $body.addClass(OVERFLOWCLASS) && $html.addClass(OVERFLOWCLASS) && i++;
            }
            return this;
        };

        this.enableScrollbar = function(){
            if(!this.options.scrollable){
                i--;
                i<1 && $body.removeClass(OVERFLOWCLASS) && $html.removeClass(OVERFLOWCLASS) && (i=0);
                i == 0 && $body.scrollTop(scrollTop);
            }
            return this;
        };


        this.show = function(){
            this.disableScrollbar();
            this.$element.show();

            this.$dialog.addClass(ZOOMINCLASS);

            return this;
        };

        this.hide = function(){
            this.enableScrollbar();

            this.$element.hide();
            this.$dialog.removeClass(ZOOMINCLASS);

            return this;
        };

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