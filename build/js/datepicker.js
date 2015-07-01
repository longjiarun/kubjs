!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.DatePicker = factory(root,root.jQuery||root.Zepto,root._,root.Hammer,root.Dialog,root.dateHelper);
        });
    }else {
        root.DatePicker = factory(root,root.jQuery||root.Zepto,root._,root.Hammer,root.Dialog,root.dateHelper);
    }
}(this,function(root,$,_,Hammer,Dialog){
    "use strict";
    var DatePicker = function(element,options){
        var self =this;
        this.$element = $(element);
        this.options = $.extend({},DatePicker.prototype.defaults,options || {});


        this.$element.on("click",function(e){
            self.$element[0].blur();
            !self.completed ? self._init() : self.dialog.show();
            return false;
        });
    };

    var HEIGHTUNIT = 38,DURATION=0.3,VALUETAG = "li",VALUECONTAINERTAG = "ul",TEMPLATE = $("#J_template").html();
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
                        self.date = self.getDate();
                        self.formatDate = self.date.format(options.format);

                        options.confirm ? options.confirm.call(this,e,self) : function(){
                            self.$element.val(self.formatDate);
                            dialog.hide();
                        }();
                    }
                },{
                    text:Dialog.prototype.i18n[options.locale].cancel,
                    handler:function(e,dialog){
                        options.cancel ? options.cancel.call(this,e,self) : dialog.hide();
                    }
                }]
            });
            self.completed = true;
            return self;
        };

        this.getRows = function(y,height,maxRows){
            maxRows = maxRows-3;
            y = y > 0 ? 0 : y;
            var rows = Math.round(Math.abs(y) / height);
            return rows > maxRows ? maxRows : rows;
        };

        this.setTranslate = function($this,y,duration){
            $this.css({
                top:y,
                //"-webkit-transform":"translate(0,"+y+")",
                //"transform":"translate(0,"+y+")",
                "-webkit-transition-duration":duration+"s",
                "transition-duration":duration+"s"
            });
            return this;
        };

        this._init = function(){
            var self = this,options = self.options;


            self.render();

            self.ui = {
                year:self.dialog.$element.find(".year"),
                month:self.dialog.$element.find(".month"),
                day:self.dialog.$element.find(".day"),
                hour:self.dialog.$element.find(".hour"),
                minute:self.dialog.$element.find(".minute"),
                second:self.dialog.$element.find(".second")
            };

            self._initUi();

            self.ui.columns = self.dialog.$element.find(".date-column");

            self.setDate(options.date);

            self.ui.columns.each(function(){
                self._scroll($(this));
            });
        };

        this._initUi = function(){
            var self = this,options = self.options;
            options.format.indexOf("y") === -1 && self.ui.year.remove();
            options.format.indexOf("M") === -1 && self.ui.month.remove();
            options.format.indexOf("d") === -1 && self.ui.day.remove();
            options.format.indexOf("H") === -1 && self.ui.hour.remove();
            options.format.indexOf("m") === -1 && self.ui.minute.remove();
            options.format.indexOf("s") === -1 && self.ui.second.remove();
            return self;
        };

        this._scroll = function(handler){
            var self = this,options = self.options;

            //初始化hammer事件
            var hammer = new Hammer(handler[0]),
                $valueContainer = handler.find(VALUECONTAINERTAG),rows,timer,
                y = handler[0].y,height, shouldSetDays = handler.hasClass("month") || handler.hasClass("year");
            

            

            return false;

            //监听拖动开始事件
            hammer.get("pan").set({
                threshold: 0
            });
            hammer.on("panstart",function(event){
                rows = 0;
                y = handler[0].y;
            }).on("panmove",function(event){
                self.setTranslate($valueContainer, y + event.deltaY  +"px",0);


                event.srcEvent.preventDefault();
                event.srcEvent.stopImmediatePropagation && event.srcEvent.stopImmediatePropagation();
                event.returnValue = false;
            }).on("panend",function(event){
                rows = -self.getRows(y + event.deltaY, HEIGHTUNIT , $valueContainer.find(".show").length);
        
                self.setTranslate($valueContainer, rows * HEIGHTUNIT +"px",DURATION);

                self._storeData(handler,rows);

                shouldSetDays && self._setDays();


                event.srcEvent.preventDefault();
                event.srcEvent.stopImmediatePropagation && event.srcEvent.stopImmediatePropagation();
                event.returnValue = false;
            });




            return this;
        };

        this._setDays = function(){
            var self = this,days = self.getDays(self.getValue("year"),self.getValue("month")),day = self.getValue("day"),
                $lis = self.ui.day.find(VALUETAG);

            $lis.addClass("show").slice(days+1,$lis.length-1).removeClass("show");
            days < day && self._setTranslateByValue("day",days);
        };

        this._storeData = function($this,rows){
            $this[0].y = rows * HEIGHTUNIT;
            $this[0].rows = Math.abs(rows);
            return this;
        };

        this._setTranslateByValue = function(name,value){
            var $this = this.ui[name], rows, $valueContainer = $this.find(VALUECONTAINERTAG);     

            rows = -($valueContainer.find(VALUETAG+'[data-value="'+value+'"]').index()-1);

            this.setTranslate($valueContainer, rows * HEIGHTUNIT +"px",0);

            this._storeData($this,rows);
            return this;
        };

        this.setDate = function(date){
            var self = this,options = self.options;
            ["year","month","day","hour","minute","second"].forEach(function(type){
                switch(type){
                    case "year":
                        self._setTranslateByValue(type,date.getFullYear());
                        break;
                    case "month":
                        self._setTranslateByValue(type,date.getMonth());
                        break;
                    case "day":
                        self._setTranslateByValue(type,date.getDate());
                        break;
                    case "hour":
                        self._setTranslateByValue(type,date.getHours());
                        break;
                    case "minute":
                        self._setTranslateByValue(type,date.getMinutes());
                        break;
                    case "second":
                        self._setTranslateByValue(type,date.getSeconds());
                        break;
                }
            });
            return self;
        };

        this.getValue = function(name){
            var $this = this.ui[name];
            return $this.length ? parseInt( $this.find(VALUETAG).eq( $this[0].rows + 1 ).attr("data-value") ) :0;
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
                values[name] = self.getValue(name);
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