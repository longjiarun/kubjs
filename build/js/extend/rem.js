!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Rem = factory(root);
        });
    } else {
        Kub.Rem = factory(root);
    }
}(this,function(root){
    var html = document.getElementsByTagName("html")[0],os={},ua = navigator.userAgent;
        os.mobile = "ontouchstart" in window || /(phone|mobile|tablet|touch|Kindle)/i.test(ua);
        os.tablet = os.mobile && /(tablet|touch|ipad)/i.test(ua);
    function Rem(){

        this.width = 640;
        this.fontSize = 32;
        this.delay = 50;

        os.mobile && this.handleOrientationChange();
    }

    ;(function(){
        this.constructor = Rem;

        /**
         * 获取 html 的 font-size
         * @param  {Number} w viewport width
         * @return {Number}   font-size
         */
        this.getFontSize = function(w){
            return w ? w * this.fontSize/ this.width : this.fontSize;
        };

        /**
         * 设置 html 的font-size
         * @param {Number} fontSize font-size
         */
        this.setFontSize = function(fontSize){
            html.style.fontSize = fontSize +"px";
            return this;
        }
        
        /**
         * 通过viewport 设置font-size
         * @param {Number} width viewport width
         */
        this.setFontSizeByWidth = function(width){
            return this.setFontSize(this.getFontSize(width));
        };

        /**
         * 根据给出的像素值，获取rem
         * 用于在js中换算单位
         * @param  {Number} value 像素值
         * @return {Number}       rem
         */
        this.getRem = function(value){
            return value ? value/this.fontSize : 0;
        };

        /**
         * get the viewport width
         * @return {Number} width
         */
        this.getViewportWidth = function(){
            var self=this,
                iw = window.innerWidth,
                ow = window.outerWidth,
                sw = window.screen.width,
                saw = window.screen.availWidth,
                w;
            w = Math.min(iw,ow,sw,saw);

            //平板下viewport width 大于页面宽，不进行适配
            os.tablet && (w = w > this.width ? this.width : w);
            return w;
        };

        /**
         * get the window orientation 
         * @return {Number}  1 : 横屏 0 : 竖屏 无该属性 ： undefined
         */
        this.getOrientation = function(){
            var s;
            s = (window.orientation == 90 || window.orientation == -90 ) ? 1 : window.orientation ? 0 : s;
            return s;
        };

        /**
         * handler window orientationchange
         */
        this.handleOrientationChange = function(){
            var self=this,options = self.options,width,orientation = -1,timer;
            function handler() {
                var s = self.getOrientation();

                if(s === orientation) return;

                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    self.setFontSizeByWidth(width = self.getViewportWidth());
                    s === 0 ? (orientation = 0) : (orientation = 1);
                },self.delay);
            }
            handler();

            //Android IOS 有 orientationchange事件
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
            return self;
        };

    }).call(Rem.prototype);
    return new Rem();
}));