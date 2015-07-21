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


        this.activeIndex = 0;
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
                x = self.activeIndex * w;
            }else{
                h = ui.slides.eq(0).height();
                y = self.activeIndex * h;
            }
            event.preventDefault();

        }).on("panmove",function(event){

            if(x != void 0){
                //横向
                self.setTranslate(x + event.deltaX + "px", 0,0);
            }else{
                //垂直
                self.setTranslate(0,y + event.deltaY + "px",0);
            }

            event.preventDefault();
        }).on("panend",function(event){
            var distance = event.distance;
            console.log(distance)
            if(distance > options.threshold){

            }


            event.preventDefault();
        });

        options.nextButton && ui.nextButton.on("click",function(){
            self.slideNext();
        });

        options.prevButton && ui.prevButton.on("click",function(){
            self.slidePrev();
        });
    };

    ;(function(){
        this.constructor = Swiper;

        this.defaults = {
            direction:"horizontal",     //vertical
            threshold:50,
            loop: false,
            speed : 300,
            autoplay: false,
            delay:3000,
            initialSlide:0,
            slideSelector:"",
            slideActiveClass:"",
            paginationSelector:"",
            paginationActiveClass:"",
            nextButton:"",
            prevButton:""
        };

        this.getActualIndex = function(index){
            var _i = index % this.length;
            return _i > 0 ? _i : _i + this.length;
        };

        this.setTranslate = function(x,y){
            this.$element.css({
                "-webkit-transform": "translate("+x+","+y+")",
                transform: "translate("+x+","+y+")"
            });
            return this;
        };

        this.slideTo = function(index,speed){
            var self = this,options = self.options;

            self.activeIndex = index = self.getActualIndex(index);
            //横向
            if(options.direction === "horizontal"){
                self.setTranslate(100/self.length * index + "%",0,speed);
            }else{
                //垂直
                self.setTranslate(0,index * 100 + "%",speed);
            }

            self.ui.slides.removeClass(options.slideActiveClass).eq(index).addClass(options.slideActiveClass);
            self.ui.paginations.removeClass(options.paginationActiveClass).eq(index).addClass(options.paginationActiveClass);
            return self;
        };

        this.slideNext = function(){
            return this.slideTo(this.getActualIndex(this.activeIndex++));
        };

        this.slidePrev = function(){
            return this.slideTo(this.getActualIndex(this.activeIndex--));
        };

    }).call(Swiper.prototype);

    return Swiper;
}));