!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.DatePicker = factory(root,root.jQuery||root.Zepto,root._,root.Hammer,Kub.Dialog,Kub.dateHelper);
        });
    }else {
        Kub.DatePicker = factory(root,root.jQuery||root.Zepto,root._,root.Hammer,Kub.Dialog,Kub.dateHelper);
    }
}(this,function(root,$,_,Hammer,Dialog){
    "use strict";
    var DatePicker = function(element,options){
        var self =this;
        this.$element = $(element);
        this.options = $.extend({},DatePicker.prototype.defaults,options || {});

        self._init().hide();

        this.$element.on("click",function(e){
            //使输入框失去焦点
            self.$element[0].blur();
            self.dialog.show();
            return false;
        });
    };

    var HEIGHTUNIT = 40,
        DURATION = 0.5,
        SHOWCLASS = "kub-datepicker-show",
        VALUECOLUMNCLASS = ".kub-datepicker-column",
        VALUETAG = "li",
        VALUECONTAINERTAG = "ul",
        TEMPLATE = '<div class="kub-datepicker"> <div class="kub-datepicker-column year" data-type="year"> <ul> <li class="kub-datepicker-show"></li> <%for(var i=data.yearRange[0];i<= data.yearRange[1];i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= i%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column month"  data-type="month"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 1;i<=12;i++){%> <li class="kub-datepicker-show" data-value="<%= i-1%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column day"  data-type="day"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 1;i<=31;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column hour"  data-type="hour"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=23;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column minute"  data-type="minute"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=59;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column second"  data-type="second"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=59;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-overlay"></div> </div> ';

    ;(function(){
        this.constructor = DatePicker;

        this.defaults = {
            locale:"zh",
            title:"选择时间",
            format:"yyyy-MM-dd",
            closable:false,
            className:"kub-datepicker-dialog",
            date:new Date(),
            confirm:null,
            cancel:null,
            yearRange:[1970,2100]
        };

        this._render = function(){
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
                animated:false,
                buttons:[{
                    text:Dialog.prototype.i18n[options.locale].cancel,
                    handler:function(e,dialog){
                        options.cancel ? options.cancel.call(this,e,self) : dialog.hide();
                    }
                },{
                    text:Dialog.prototype.i18n[options.locale].ok,
                    handler:function(e,dialog){
                        self.date = self.getDate();
                        self.formatDate = self.date.format(options.format);

                        options.confirm ? options.confirm.call(this,e,self) : function(){
                            self.$element.val(self.formatDate);
                            dialog.hide();
                        }();
                    }
                }]
            });
            self.completed = true;
            return self;
        };

        this._init = function(){
            var self = this,options = self.options;
            
            //创建对话框
            self._render();

            self.ui = {
                year:self.dialog.$element.find(".year"),
                month:self.dialog.$element.find(".month"),
                day:self.dialog.$element.find(".day"),
                hour:self.dialog.$element.find(".hour"),
                minute:self.dialog.$element.find(".minute"),
                second:self.dialog.$element.find(".second")
            };

            options.format.indexOf("y") === -1 && (self.ui.year.empty().remove());
            options.format.indexOf("M") === -1 && (self.ui.month.empty().remove());
            options.format.indexOf("d") === -1 && (self.ui.day.empty().remove());
            options.format.indexOf("H") === -1 && (self.ui.hour.empty().remove());
            options.format.indexOf("m") === -1 && (self.ui.minute.empty().remove());
            options.format.indexOf("s") === -1 && (self.ui.second.empty().remove());

            //设置本地化
            self.dialog.$element.addClass("kub-datepicker-"+options.locale);

            //监听每个元素的滚动事件            
            self.ui.columns = self.dialog.$element.find(VALUECOLUMNCLASS).each(function(){
                var $handler = $(this), hammer = new Hammer($handler[0]);
                //监听拖动开始事件
                hammer.get("pan").set({
                    threshold: 0
                });
                hammer.on("panstart",function(event){
                    self.ui.currentScrollHandler = $handler;
                    event.preventDefault();
                });
            });

            HEIGHTUNIT = self.ui.columns.find(VALUETAG).eq(0).height();

            //设置默认时间
            self.setDate(options.date);

            //注册全局拖动事件，注册在每一列，会导致拖动不流畅
            self._registerGlobalScroll();

            return self;
        };

        this._cacheData = function($this,index){
            $this[0].y = index * HEIGHTUNIT;
            $this[0].index = Math.abs(index);
            return this;
        };

        this._registerGlobalScroll = function(){
            var self = this,
                options = self.options,
                hammer = new Hammer(self.dialog.$element[0]),
                $handler, index, y, shouldSetDays;
            
            //监听拖动开始事件
            hammer.get("pan").set({
                threshold: 0
            });
            hammer.on("panstart",function(event){
                if(self.ui.currentScrollHandler !== $handler){
                    $handler = self.ui.currentScrollHandler;
                    //决定是否设置天数，由于年份与月份决定每月的天数
                    shouldSetDays = $handler.hasClass("month") || $handler.hasClass("year");
                    index = 0;
                    y = $handler[0].y;                    
                }
                event.preventDefault();
            }).on("panmove",function(event){
                $handler && self.setTranslate($handler, 0, y + event.deltaY  +"px",0);
                event.preventDefault();
            }).on("panend",function(event){
                if($handler){
                    index = -self._getIndex(y + event.deltaY, HEIGHTUNIT, $handler.find("."+SHOWCLASS).length);
            
                    self._cacheData($handler,index);

                    self.setTranslate($handler, 0, $handler[0].y +"px", DURATION);

                    shouldSetDays && self._setDays(self.getValue("year"), self.getValue("month"));
                }
                //结束以后将当前滚动元素至空
                self.ui.currentScrollHandler = $handler = null ;
                event.preventDefault();
            });
            return self;
        };

        this._getIndex = function(y,height,max){
            //去掉空白的两行
            max = max-3;
            y = y > 0 ? 0 : y;
            var index = Math.round(Math.abs(y) / height);
            return index > max ? max : index;
        };

        this.setTranslate = function($this,x,y,duration){
            ($this[0].$container ? $this[0].$container : ( $this[0].$container = $this.find(VALUECONTAINERTAG))).css({
                "-webkit-transform": "translate(0,"+y+")",
                transform: "translate(0,"+y+")"
            });
            return this;
        };

        this._setDays = function(year,month){
            var self = this,
                days = self.getDays(year,month),
                day = self.getValue("day"),
                $valueTags = self.ui.day.find(VALUETAG);

            //移除不在本月的日期
            $valueTags.addClass(SHOWCLASS).slice(days+1, $valueTags.length-1).removeClass(SHOWCLASS);
            days < day && self.setValue("day",days);
            return self;
        };

        this.getDays = function(year,month){
            return (new Date(year, month + 1, 0)).getDate();
        };

        this.setDate = function(date){
            var self = this;
            ["year","month","day","hour","minute","second"].forEach(function(type){
                switch(type){
                    case "year":
                        self.setValue(type,date.getFullYear());
                        break;
                    case "month":
                        self.setValue(type,date.getMonth());
                        break;
                    case "day":
                        self.setValue(type,date.getDate());
                        break;
                    case "hour":
                        self.setValue(type,date.getHours());
                        break;
                    case "minute":
                        self.setValue(type,date.getMinutes());
                        break;
                    case "second":
                        self.setValue(type,date.getSeconds());
                        break;
                }
            });
            return self;
        };

        this.getDate = function(){
            var self = this,
                options = self.options,
                values = {
                    year:self.getValue("year"),
                    month:self.getValue("month"),
                    day:self.getValue("day"),
                    hour:self.getValue("hour"),
                    minute:self.getValue("minute"),
                    second:self.getValue("second")
                };

            return new Date(values.year,values.month,values.day,values.hour,values.minute,values.second);
        };

        this.setValue = function(name,value){
            var $this = this.ui[name], index;

            index = -($this.find(VALUETAG+'[data-value="'+value+'"]').index()-1);
            this._cacheData($this,index);
            this.setTranslate($this, 0,$this[0].y +"px",0);

            return this;
        };

        this.getValue = function(name){
            var $this = this.ui[name], $valueTags = $this.find(VALUETAG);

            return $valueTags.length ? parseInt( $valueTags.eq( $this[0].index + 1 ).attr("data-value") ) : 0;
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