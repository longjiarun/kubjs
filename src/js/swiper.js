/**
 * # Kub.Swiper
 * 
 * 图片切换组件 
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Swiper = factory(root, root.jQuery || root.Zepto, root.Hammer);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root,require("./lib/zepto"),require("./lib/hammer"));
    } else {
        Kub.Swiper = factory(root, root.jQuery || root.Zepto, root.Hammer);
    }
}(this,function(root,$,Hammer){
    'use strict';

    /**
     * ## Swiper Constructor
     *
     * `Swiper`类。
     *
     * 使用方法：
     * ```js
     *  new Kub.Swiper($swiperWrap.find(".swiper"),{
     *      auto:true,
     *      slideSelector:$swiperWrap.find(".slide"),
     *      slideActiveClass:"active",
     *      paginationSelector:$swiperWrap.find(".pagination li"),
     *      paginationActiveClass:"pagination-active",
     *      nextButton:$swiperWrap.find(".next-button"),
     *      prevButton:$swiperWrap.find(".prev-button"),
     *      slide:function(index){
     *          //console.log("slide:"+index,this)
     *      }
     * });
     * ```
     */
    
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

        var hammer = new Hammer(self.$element[0]),x,y,w,h,
            horizontal = options.direction === "horizontal";

        //监听拖动开始事件
        hammer.get("pan").set({
            threshold: 0
        });
        hammer.on("panstart",function(event){  

            var pos = getPosition.call(self);
            x = pos.x;
            y = pos.y;
            w = pos.w;
            h = pos.h;
            
            self.timer && clearInterval(self.timer);

            !horizontal && event.srcEvent.preventDefault();
        }).on("panmove",function(event){
            var resistance, deltaX = event.deltaX, deltaY = event.deltaY;
            //是否跟随手指滑动
            if(options.followFinger){
                if(horizontal){
                    //横向
                    //计算出第一个或者最后一个节点
                    resistance = 1 - event.distance/w/2;
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
                    resistance = 1 - event.distance/h/2;

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

            var _deltaX = Math.abs(deltaX)
            if(horizontal &&  _deltaX >= options.threshold && _deltaX > Math.abs(deltaY)){
                event.srcEvent.preventDefault();
            }

            if(!horizontal){
                event.srcEvent.preventDefault();
            }
        }).on("panend",function(event){
            
            var distance,duration,velocity;

            //计算出持续时间
            velocity = horizontal ? event.velocityX : event.velocityY;
            horizontal ? (distance = Math.abs(event.deltaX)) : (distance = Math.abs(event.deltaY));
            duration = self.getDuration(distance,velocity);

            //如果大于限定距离，则允许切换
            if(distance > options.threshold && Math.abs(velocity) > 0.2){
                if(horizontal){
                    //横向
                    event.deltaX < 0 ? self.slideNext(duration) : self.slidePrev(duration);
                }else{
                    event.deltaY < 0 ? self.slideNext(duration) : self.slidePrev(duration);
                }
            }else{
                self.slideTo(self.activeIndex,options.speed);
            }

            auto.call(self);

            event.srcEvent.preventDefault();
        })

        //监听左右切换按钮
        options.nextButton && ui.nextButton.on("click",function(){
            !self.isScrolling && self.slideNext(options.speed);
        });
        options.prevButton && ui.prevButton.on("click",function(){
            !self.isScrolling && self.slidePrev(options.speed);
        });

        setDefaultStyle.call(self);

        auto.call(self);

        handleOrientationChange.call(self,function(){
            self.slideTo(self.activeIndex,options.speed/2);
        });
    };

    function setDefaultStyle(){
        var self = this,options = self.options,ui = self.ui;

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
    }

    function auto(){
        var self = this, options = self.options;
        if(!options.auto){
            return;
        }
        self.timer = setInterval(function(){
            self.slideNext(options.speed,true);
        },options.delay + options.speed);
    }

    function getPosition(){
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
    }

    function handleOrientationChange(callback){
        var self=this, options = self.options,timer;
        function handler() {
            timer && clearTimeout(timer);
            timer = setTimeout(function(){
                callback && callback();
            },300);
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
        return self;
    }

    ;(function(){
        this.constructor = Swiper;

        /**
         * ## defaults
         *
         * `Swiper`默认配置项。
         *
         * 配置项说明：
         * 
         * * `direction`: 切换方向。horizontal：横向， vertical：纵向
         * 
         * * `threshold`: 最小触发距离。手指移动距离必须超过`threshold`才能切换。
         *
         * * `auto`: 是否可自动切换。true:可以，false：不可以
         * 
         * * `delay`: 延迟时间。
         *
         * * `speed`: 切换速度。
         *
         * * `followFinger`: 是否跟随手指移动
         * 
         * * `initialSlide`: 初始化滚动位置
         * 
         * * `slideSelector`: 滚动块元素选择器
         * 
         * * `slideActiveClass`: 滚动块元素选中的类名
         * 
         * * `paginationSelector`: 缩略图或者icon选择器
         *
         * * `paginationActiveClass`: 选中的类名
         *
         * * `nextButton`: 下一个选择器
         *
         * * `prevButton`: 上一个选择器
         *
         * * `slide`: 切换回调函数
         */
        
        this.defaults = {
            //vertical
            direction:"horizontal",
            threshold:50,
            auto:false,
            delay:2500,
            speed : 500,
            followFinger:true,
            initialSlide:0,
            slideSelector:"",
            slideActiveClass:"",
            paginationSelector:"",
            paginationActiveClass:"",
            nextButton:"",
            prevButton:"",
            slide:null,
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

        this._getActualIndex = function(index){
            return (index % this.length + this.length) % this.length;
        };

        /**
         * ## setTranslate
         *
         * 设置偏移量
         * 
         * @param {String} x     x偏移。注意值应该包含单位。例如 100px,或者10%。
         * @param {String} y     y偏移。注意值应该包含单位。例如 100px,或者10%。
         * @param {Number} speed 滚动速度
         */
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
        
        this.setTranslateByIndex = function(index,speed){
            var self = this,options = self.options;

            //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
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

        //触发slide事件
        function triggerSlideHandler(index,speed){
            var self = this, options = self.options;

            //由于 transitionend 事件在中间过程中不会触发，所以采用下面方法解决
            if(speed <= 0){
                self.activeIndex != index && options.slide && options.slide.call(self,index);
                self.isScrolling = false;
            }else{
                (function(activeIndex){
                    setTimeout(function(){
                        activeIndex != index && options.slide && options.slide.call(self,index);
                        self.isScrolling = false;
                    },speed);
                })(self.activeIndex);
            }
        }

        /**
         * ## slideTo
         *
         * 滚动到指定索引值位置
         * 
         * @param  {index} index 滚动索引值
         * @param  {speed} speed 滚动速度，默认使用参数配置的speed
         * @return {instance}    当前实例
         */
        this.slideTo = function(index,speed,flag){
            var self = this,options = self.options;

            //如果speed为空，则取默认值
            speed = speed == void 0 ? options.speed : speed;

            //记录滚动状态
            self.isScrolling = true;

            //取出实际的索引值
            index = flag ? self._getActualIndex(index) : self.getActualIndex(index);

            //通过索引值设置偏移
            self.setTranslateByIndex(index,speed);

            //触发回调函数
            triggerSlideHandler.call(this,index,speed);

            //设置选中状态Class
            self._setActiveClass(index);

            //保存当前索引值
            self.activeIndex = index;
            return self;
        };

        this._setActiveClass = function(index){
            var self = this,options = self.options;

            //添加选中的class
            self.ui.slides.removeClass(options.slideActiveClass).eq(index).addClass(options.slideActiveClass);
            self.ui.paginations.removeClass(options.paginationActiveClass).eq(index).addClass(options.paginationActiveClass);

            return self;
        };

        /**
         * ## slideNext
         *
         * 切换到下一个
         * 
         * @param  {speed} speed 滚动速度，默认使用参数配置的speed
         * @return {instance}    当前实例
         */
        this.slideNext = function(speed,flag){
            return this.slideTo(this.activeIndex+1,speed,flag);
        };

        /**
         * ## slidePrev
         *
         * 切换到上一个

         * @param  {speed} speed 滚动速度，默认使用参数配置的speed
         * @return {instance}    当前实例
         */
        this.slidePrev = function(speed,flag){
            return this.slideTo(this.activeIndex-1,speed,flag);
        };

    }).call(Swiper.prototype);
    return Swiper;
}));