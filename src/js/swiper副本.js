!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Swiper = factory(root, root.jQuery || root.Zepto);
        });
    }else {
        Kub.Swiper = factory(root, root.jQuery || root.Zepto);
    }
}(this,function(root,$){
    'use strict';
    var Swiper = function(element,options){
        this.options = $.extend({},Swiper.prototype.defaults, options||{});
        this.$element = $(element);

        this.ui ={
            slides:$(options.slideSelector),
            paginations:$(options.paginationSelector),
            nextButton:$(options.nextButton),
            prevButton:$(options.prevButton)
        };
        this.length = this.ui.slides.length;

        init.call(this);
        this.slideTo(this.options.initialSlide || 0,0);
    };

    function init(){
        var self = this,options = self.options,ui = self.ui;

        var hammer = new Hammer(self.$element[0]),x,y,w,h;
        //监听拖动开始事件
        hammer.get("pan").set({
            threshold: 0
        });
        hammer.on("panstart",function(event){   
            var pos = self._getPosition();
            x = pos.x;
            y = pos.y;
            w = pos.w;
            h = pos.h;

            //解决 followFinger 为false时，移动端滑动时无效果问题
            !options.followFinger && self.setTranslateByIndex(self.activeIndex,options.speed);
            
            event.preventDefault();
        }).on("panmove",function(event){
            //是否跟随手指滑动
            if(options.followFinger){
                if(x != void 0){
                    //横向
                    var resistance = 1 - event.distance/w/2, deltaX = event.deltaX;

                    if(self.activeIndex == 0){
                        resistance = deltaX > 0 ? resistance : 1;
                    }else if( self.activeIndex == self.length-1 ){
                        resistance = deltaX < 0 ? resistance : 1;
                    }else{
                        resistance=1;
                    }

                    self.setTranslate(x +  deltaX * resistance + "px", 0,0);
                }else{
                    //垂直
                    var resistance = 1 - event.distance/h/2, deltaY = event.deltaY; 

                    if(self.activeIndex == 0){
                        resistance = deltaY > 0 ? resistance : 1;
                    }else if( self.activeIndex == self.length-1 ){
                        resistance = deltaY < 0 ? resistance : 1 ;
                    }else{
                        resistance=1;
                    }

                    self.setTranslate(0,y + deltaY * resistance + "px",0);
                }
            }
            event.preventDefault();
        }).on("panend",function(event){
            var distance,duration,velocity;

            //计算出持续时间
            velocity = x != void 0 ? event.velocityX : event.velocityY;
            x != void 0 ? (distance = Math.abs(event.deltaX)) : (distance = Math.abs(event.deltaY));
            duration = self.getDuration(distance,velocity);

            //如果大于限定距离，则允许切换
            if(distance > options.threshold && Math.abs(velocity) > 0.2){
                if(x != void 0){
                    //横向
                    event.deltaX < 0 ? self.slideNext(duration) : self.slidePrev(duration);
                }else{
                    event.deltaY < 0 ? self.slideNext(duration) : self.slidePrev(duration);
                }
            }else{
                self.slideTo(self.activeIndex,options.speed);
            }
            event.preventDefault();
        });

        //监听左右切换按钮
        options.nextButton && ui.nextButton.on("click",function(){
            !self.isScrolling && self.slideNext(options.speed);
        });
        options.prevButton && ui.prevButton.on("click",function(){
            !self.isScrolling && self.slidePrev(options.speed);
        });

        //set style
        self.$element.css(options.style.swiper);
        if(options.direction === "horizontal"){
            //横向
            self.$element.css({
                width:self.length * 100 +"%",
                display:"table"
            });
            ui.slides.css({
                "float":"left",
                width:100/self.length +"%"
            });
        }else{
            //竖向
            self.$element.css({
                height:self.length * 100 +"%"
            });
            ui.slides.css({
                height:100/self.length +"%"
            });
        }
    };

    ;(function(){
        this.constructor = Swiper;

        this.defaults = {
            direction:"horizontal",     //vertical
            threshold:50,
            speed : 500,
            initialSlide:0,
            slideSelector:"",
            slideActiveClass:"",
            paginationSelector:"",
            paginationActiveClass:"",
            nextButton:"",
            prevButton:"",
            style:{
                swiper:{
                    "-webkit-transition-property": "-webkit-transform",
                    "transition-property":"transform",
                    "overflow":"hidden"
                }
            }
        };

        this.getActualIndex = function(index){
            return index < 0 ? 0 : index >= this.length ? this.length-1 : index;
        };

        this.setTranslate = function(x,y,speed){
            var self = this,options = self.options,cssProps = {};
            speed = speed || 0;
            cssProps = {
                "-webkit-transform": "translate("+x+","+y+")",
                "transform": "translate("+x+","+y+")",
                "-webkit-transition-duration":speed +"ms",
                "transition-duration":speed +"ms"
            };
            self.$element.css(cssProps);
            return this;
        };

        this._getPosition = function(){
            var self = this,options = self.options,ui = self.ui,
                w, h, x, y;

            if(options.direction === "horizontal"){
                w = ui.slides.eq(0).width();
                x = -self.activeIndex * w;
            }else{
                h = ui.slides.eq(0).height();
                y = -self.activeIndex * h;
            }
            return {
                x:x,
                y:y,
                w:w,
                h:h
            };
        };

        this.setTranslateByIndex = function(index,speed){
            var self = this,options = self.options;

            //由于移动端浏览器transition动画不支持百分比，所以采用像素值
            //在动画完成以后将其重置未百分比，确保页面不出问题
            if(options.direction === "horizontal"){
                //横向
                var w = self.ui.slides.eq(0).width();
                self.setTranslate( -index * w + "px",0,speed);
            }else{
                //垂直
                var h = self.ui.slides.eq(0).height();
                self.setTranslate(0,-index * h  + "px",speed);
            }
            return self;
        };

        this.getDuration = function(distance,velocity){
            var duration = Math.abs(distance / velocity);
            return duration > this.options.speed ? this.options.speed : duration < 200 ? 200 :  duration;
        };

        this.slideTo = function(index,speed){
            var self = this,options = self.options;

            //如果speed为空，则默认值
            speed = speed == void 0 ? options.speed : speed;

            !self.isScrolling && self.setTranslateByIndex(self.activeIndex,options.speed);

            //记录滚动状态
            self.isScrolling = true;

            //设置百分比
            function setTranslate(index,direction){
                if(direction === "horizontal"){
                    //横向
                    self.setTranslate(-100/self.length * index + "%",0,0);
                }else{
                    //垂直
                    self.setTranslate(0,-100/self.length * index + "%",0);
                }
                self.isScrolling = false;
            }

            //取出真实的索引值
            index = self.getActualIndex(index);

            //通过索引值设置偏移
            self.setTranslateByIndex(index,speed);

            //添加选中的class
            self.ui.slides.removeClass(options.slideActiveClass).eq(index).addClass(options.slideActiveClass);
            self.ui.paginations.removeClass(options.paginationActiveClass).eq(index).addClass(options.paginationActiveClass);

            //触发slide事件
            //由于transitionend事件在中间过程不会触发，所以采用下面方法解决
            if(speed == 0){
                self.activeIndex != index && options.slide && options.slide.call(self,index);
                setTranslate(index,options.direction);
            }else{
                (function(activeIndex){
                    setTimeout(function(){
                        activeIndex != index && options.slide && options.slide.call(self,index);
                        setTranslate(index,options.direction);
                    },speed);
                })(self.activeIndex);
            }

            //保存当前索引值
            self.activeIndex = index;
            return self;
        };

        this.slideNext = function(speed){
            return this.slideTo(this.activeIndex+1,speed);
        };

        this.slidePrev = function(speed){
            return this.slideTo(this.activeIndex-1,speed);
        };

    }).call(Swiper.prototype);
    return Swiper;
}));