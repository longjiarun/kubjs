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
    };

    ;(function(){
        this.constructor = Swiper;

        this.defaults = {
            threshold:50,
            loop: false,
            speed : 300,
            autoplay: false,
            slideSelector:"",
            slideActiveClass:"",
            paginationSelector:"",
            paginationActiveClass:""
        };

        this.slideTo = function(){
            
        };

        this.slideNext = function(){

        };

        this.slidePrev = function(){

        };

        this.destory = function(){

        };



    }).call(Swiper.prototype);

    return Swiper;
}));