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

        this.activeIndex = this.options.initialSlide || 0;

        this.slideTo(this.activeIndex,0);
        init.call(this);
    };

    function init(){
        var self = this,options = self.options,ui = self.ui;

        var hammer = new Hammer(self.$element[0]),x,y;
        //监听拖动开始事件
        hammer.get("pan").set({
            threshold: 0
        });
        hammer.on("panstart",function(event){
            var w, h;
            if(options.direction === "horizontal"){
                w = ui.slides.eq(0).width();
                x = -self.activeIndex * w;
            }else{
                h = ui.slides.eq(0).height();
                y = -self.activeIndex * h;
            }
            event.preventDefault();
        }).on("panmove",function(event){
            
            if(options.touchMove){
                if(x != void 0){
                    //横向
                    self.setTranslate(x + event.deltaX + "px", 0,0);
                }else{
                    //垂直
                    self.setTranslate(0,y + event.deltaY + "px",0);
                }
            }

            event.preventDefault();
        }).on("panend",function(event){
            var distance;
            x != void 0 ? (distance = Math.abs(event.deltaX)) : (distance = Math.abs(event.deltaY));
            
            if(distance > options.threshold){
                if(x != void 0){
                    //横向
                    event.deltaX < 0 ? self.slideNext(options.speed) : self.slidePrev(options.speed);
                }else{
                    event.deltaY < 0 ? self.slideNext(options.speed) : self.slidePrev(options.speed);
                }
            }else{
                self.slideTo(self.activeIndex,options.speed)
            }
            event.preventDefault();
        });


        options.nextButton && ui.nextButton.on("click",function(){
            self.slideNext(options.speed);
        });
        options.prevButton && ui.prevButton.on("click",function(){
            self.slidePrev(options.speed);
        });

        self.$element.css(options.style.swiper);

        if(options.direction === "horizontal"){
            self.$element.css({
                width:self.length * 100 +"%",
                display:"table",
                content:" "
            });
            ui.slides.css({
                float:"left",
                width:100/self.length +"%"
            });
        }else{
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
            speed : 300,
            touchMove:false,
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
                },
                slide:{

                }
            }
        };

        this.getActualIndex = function(index){
            return index < 0 ? 0 : index >= this.length ? this.length-1 : index;
        };

        this.setTranslate = function(x,y,speed){
            speed = speed || 0;
            this.$element.css({
                "-webkit-transform": "translate3d("+x+","+y+",0)",
                "transform": "translate3d("+x+","+y+",0)",
                "-webkit-transition-duration":speed +"ms",
                "transition-duration":speed +"ms"
            });
            return this;
        };

        this.slideTo = function(index,speed){
            var self = this,options = self.options;

            self.activeIndex = index = self.getActualIndex(index);

            //横向
            if(options.direction === "horizontal"){
                self.setTranslate(-100/self.length * index + "%",0,speed);
            }else{
                //垂直
                //self.setTranslate(0,-index * 100 + "%",speed);
                self.setTranslate(0,-100/self.length * index + "%",speed);
            }

            self.ui.slides.removeClass(options.slideActiveClass).eq(index).addClass(options.slideActiveClass);
            self.ui.paginations.removeClass(options.paginationActiveClass).eq(index).addClass(options.paginationActiveClass);
            return self;
        };

        this.slideNext = function(speed){
            return this.slideTo(++this.activeIndex,speed);
        };

        this.slidePrev = function(speed){
            return this.slideTo(--this.activeIndex,speed);
        };

    }).call(Swiper.prototype);

    return Swiper;
}));