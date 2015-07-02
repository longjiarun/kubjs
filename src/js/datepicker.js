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

    var HEIGHTUNIT = 38,DURATION=0.5,VALUETAG = "li",VALUECONTAINERTAG = "ul",TEMPLATE = '<div class="datepicker"> <div class="date-column year" data-type="year"> <ul> <li class="show"></li> <%for(var i=data.yearRange[0];i<= data.yearRange[1];i++){%> <li class="show" data-value="<%= i%>"><%= i%></li> <%}%> <li class="show"></li> </ul> </div> <div class="date-column month"  data-type="month"> <ul> <li class="show"></li> <%for(var i= 1;i<=12;i++){%> <li class="show" data-value="<%= i-1%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="show"></li> </ul> </div> <div class="date-column day"  data-type="day"> <ul> <li class="show"></li> <%for(var i= 1;i<=31;i++){%> <li class="show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="show"></li> </ul> </div> <div class="date-column hour"  data-type="hour"> <ul> <li class="show"></li> <%for(var i= 0;i<=59;i++){%> <li class="show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="show"></li> </ul> </div> <div class="date-column minute"  data-type="minute"> <ul> <li class="show"></li> <%for(var i= 0;i<=59;i++){%> <li class="show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="show"></li> </ul> </div> <div class="date-column second"  data-type="second"> <ul> <li class="show"></li> <%for(var i= 0;i<=59;i++){%> <li class="show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="show"></li> </ul> </div> <div class="overlay"></div> </div>';

    ;(function(){
        this.constructor = DatePicker;

        this.defaults = {
            locale:"zh",
            title:"选择时间",
            format:"yyyy-MM-dd",
            closable:false,
            className:"datepicker-dialog",
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

            self._render();
            self.ui = {
                year:self.dialog.$element.find(".year"),
                month:self.dialog.$element.find(".month"),
                day:self.dialog.$element.find(".day"),
                hour:self.dialog.$element.find(".hour"),
                minute:self.dialog.$element.find(".minute"),
                second:self.dialog.$element.find(".second")
            };
            self.renderByFormat(options.format);

            self.ui.columns = self.dialog.$element.find(".date-column");

            self.setDate(options.date);

            //监听每个元素的滚动事件            
            self.ui.columns.each(function(){
                var $handler = $(this),hammer = new Hammer($handler[0]);

                //监听拖动开始事件
                hammer.get("pan").set({
                    threshold: 0
                });
                hammer.on("panstart",function(event){
                    self.$currentScrollHandler = $handler;
                    event.preventDefault();
                });
            });

            self._registerDocumentScroll();
        };

        this.renderByFormat = function(format){
            var self = this,options = self.options;
            format.indexOf("y") === -1 && self.ui.year.remove();
            format.indexOf("M") === -1 && self.ui.month.remove();
            format.indexOf("d") === -1 && self.ui.day.remove();
            format.indexOf("H") === -1 && self.ui.hour.remove();
            format.indexOf("m") === -1 && self.ui.minute.remove();
            format.indexOf("s") === -1 && self.ui.second.remove();
            return self;
        };

        this._storeData = function($this,index){
            $this[0].y = index * HEIGHTUNIT;
            $this[0].index = Math.abs(index);
            return this;
        };

        this._registerDocumentScroll = function(){
            var self = this,options = self.options,
                hammer = new Hammer(self.dialog.$element[0]), $handler, $valueContainer, index, y, shouldSetDays;
            
            //监听拖动开始事件
            hammer.get("pan").set({
                threshold: 0
            });

            hammer.on("panstart",function(event){
                if(self.$currentScrollHandler !== $handler){

                    $handler = self.$currentScrollHandler;

                    $valueContainer = $handler.find(VALUECONTAINERTAG);

                    shouldSetDays = $handler.hasClass("month") || $handler.hasClass("year");

                    index = 0;

                    y = $handler[0].y;                    
                }
                event.preventDefault();
            }).on("panmove",function(event){

                $handler && self.setTranslate($valueContainer, y + event.deltaY  +"px",0);

                event.preventDefault();
            }).on("panend",function(event){
                if($handler){
                    index = -self.getIndex(y + event.deltaY, HEIGHTUNIT , $handler.find(".show").length);
        
                    self.setTranslate($valueContainer, index * HEIGHTUNIT +"px",DURATION);

                    self._storeData($handler,index);

                    shouldSetDays && self.setDays(self.getValue("year"),self.getValue("month"));
                }
                
                self.$currentScrollHandler = $handler = null ;
                event.preventDefault();
            });
            return self;
        };

        this.getIndex = function(y,height,maxRows){
            maxRows = maxRows-3;
            y = y > 0 ? 0 : y;
            var index = Math.round(Math.abs(y) / height);
            return index > maxRows ? maxRows : index;
        };

        this.setTranslate = function($this,y,duration){
            $this.css({
                "-webkit-transform": "translate(0,"+y+")",
                transform: "translate(0,"+y+")"
            });
            return this;
        };

        this.setDays = function(year,month){
            var self = this,
                days = self.getDays(year,month),
                day = self.getValue("day"),
                $lis = self.ui.day.find(VALUETAG);

            $lis.addClass("show").slice(days+1,$lis.length-1).removeClass("show");
            days < day && self.setValue("day",days);

            return self;
        };

        this.getDays = function(year,month){
            return (new Date(year, month + 1, 0)).getDate();
        };

        this.setDate = function(date){
            var self = this,options = self.options;
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
            var self = this,options = self.options,$this,
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
            var $this = this.ui[name], index, $valueContainer = $this.find(VALUECONTAINERTAG);     

            index = -($this.find(VALUETAG+'[data-value="'+value+'"]').index()-1);

            this.setTranslate($valueContainer, index * HEIGHTUNIT +"px",0);

            this._storeData($this,index);
            return this;
        };

        this.getValue = function(name){
            var $this = this.ui[name];
            return $this.length ? parseInt( $this.find(VALUETAG).eq( $this[0].index + 1 ).attr("data-value") ) :0;
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