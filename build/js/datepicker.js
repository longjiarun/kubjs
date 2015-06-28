!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return factory(root,root.jQuery||root.Zepto,root._,root.Hammer,root.Dialog,root.dateHelper);
        });
    }else {
        root.DatePicker = factory(root,root.jQuery||root.Zepto,root._,root.Hammer,root.Dialog,root.dateHelper);
    }
}(this,function(root,$,_,Hammer,Dialog){
    "use strict";
    var DatePicker = function(element,options){
        this.$element = $(element);
        this.options = $.extend({},DatePicker.prototype.defaults,options || {});

        console.log(options)
        this._init();
    };

    var HEIGHTUNIT = 38,VALUETAG = "li",VALUECONTAINERTAG = "ul",TEMPLATE = $("#J_template").html();
    ;(function(){
        this.constructor = DatePicker;
        this.defaults = {
            locale:"zh",
            title:"选择时间",
            format:"yyyy-MM-dd,HH:mm:ss",
            closable:false,
            className:"datepicker-dialog",
            date:new Date(),
            confirm:null,
            cancel:null,
            yearRange:[1970,2100]
        };

        this.render = function(){
            if(this.completed) return;
            var self = this,options = self.options,
                html = _.template(TEMPLATE)({
                    data:options
                });
            self.dialog = new Dialog({
                title:options.title,
                locale:options.locale,
                message:html,
                closable:options.closable,
                className:options.className,
                buttons:[{
                    text:Dialog.prototype.i18n[options.locale].ok,
                    handler:function(e,dialog){
                        self.date = self.getDate().format(options.format);
                        options.confirm && options.confirm.call(this,e,self);
                    }
                },{
                    text:Dialog.prototype.i18n[options.locale].cancel,
                    handler:function(e,dialog){
                        options.cancel ? options.cancel.call(this,e,self) : dialog.close();
                    }
                }]
            });
            self.completed = true;
            return self;
        };

        this.scroll = function(handler){
            var self = this,options = self.options;

            //初始化hammer事件
            var hammer = new Hammer(handler[0]),
                $ul = handler.find("ul"),rows,
                y = handler[0].y,height;
        
            //监听拖动开始事件
            hammer.get("pan").set({
                threshold: 0
            });
            hammer.on("panstart",function(event){
                rows = 0;
            }).on("panmove",function(event){
                self.setTranslate($ul, y + event.deltaY  +"px",0.5);
                event.srcEvent.preventDefault();
                event.srcEvent.stopImmediatePropagation && event.srcEvent.stopImmediatePropagation();
            }).on("panend",function(event){

                height = $ul.find("li").eq(0).height();
                rows = -self.getRows(y + event.deltaY, height,$ul.find("li").length);
                self.setTranslate($ul, rows * height +"px",0.5);

                handler[0].y = y = rows * height;
                handler[0].rows = Math.abs(rows);
            })
            .on("pancancel",function(event){
                console.log("cancel")
            });
        };

        this.getRows = function(y,height,maxRows){
            maxRows = maxRows-3;
            y = y > 0 ? 0 : y;
            var rows = Math.round(Math.abs(y) / height);
            return rows > maxRows ? maxRows : rows;
        };

        this.setTranslate = function($this,y,duration){
            $this.css({
                "-webkit-transform":"translate(0,"+y+")",
                "transform":"translate(0,"+y+")",
                "-webkit-transition-duration":duration+"s",
                "transition-duration":duration+"s"
            });
            return this;
        };

        this._init = function(){
            var self = this,options = self.options;

            self.render();

            self.ui = {};

            self.ui.columns = self.dialog.$element.find(".date-column");

            self.setDate(options.date)
            self.ui.columns.each(function(){
                self.scroll($(this));
            });
        };

        this._setColumnY = function($this,value){
            var rows, $ul = $this.find(VALUECONTAINERTAG);     

            rows = -($ul.find(VALUETAG+'[data-value="'+value+'"]').index()-1);

            this.setTranslate($ul, rows * HEIGHTUNIT +"px",0);

            $this[0].y = rows * HEIGHTUNIT;
            $this[0].rows = Math.abs(rows);
        };

        this.setDate = function(date){
            var self = this,options = self.options;

            self.ui.columns.each(function(){
                var $this = $(this),type = $this.attr("data-type");
                switch(type){
                    case "year":
                        self._setColumnY($this,date.getFullYear());
                        break;
                    case "month":
                        self._setColumnY($this,date.getMonth());
                        break;
                    case "day":
                        self._setColumnY($this,date.getDate());
                        break;
                    case "hour":
                        self._setColumnY($this,date.getHours());
                        break;
                    case "minute":
                        self._setColumnY($this,date.getMinutes());
                        break;
                    case "second":
                        self._setColumnY($this,date.getSeconds());
                        break;
                }
            });
            return self;
        };

        this.getDate = function(){
            var self = this,options = self.options,$this,
                values = {
                    year:0,
                    month:0,
                    day:0,
                    hour:0,
                    minute:0,
                    second:0
                };
            for(var name in values){
                $this = self.dialog.$element.find("."+name);
                values[name] = parseInt( $this.find(VALUETAG).eq( $this[0].rows + 1 ).attr("data-value") );
            }
            return new Date(values.year,values.month,values.day,values.hour,values.minute,values.second);
        };

        this.getDays = function(year,month){
            return (new Date(year, month + 1, 0)).getDate();
        };

        this.close = function(){
            this.dialog.close();
            return this;
        };

        this.show = function(){
            this.dialog.show();
            return this;
        };

        this.hide = function(){
            this.dialog.hide();
            return this;
        };

    }).call(DatePicker.prototype);
    
    return DatePicker;
}));