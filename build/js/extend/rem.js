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
        os.android = /android/i.test(ua);
        os.mobile = /(android|phone|mobile|tablet|touch)/i.test(ua);
        os.tablet = os.mobile && /(tablet|touch|ipad)/i.test(ua) ||  os.android && !/mobile/i.test(ua);

    function Rem(opts){
        var defaults = Rem.prototype.defaults,options = {};
        
        if(Rem.prototype.instance) return Rem.prototype.instance;
        Rem.prototype.instance = this;

        if(opts){
            for(var name in defaults){
                if(defaults.hasOwnProperty(name)){
                    opts[name] == undefined ? options[name] = defaults[name] : options[name] = opts[name];
                }
            }
        }else{
            options = defaults;
        }
        this.options = options;

        os.mobile && this.handleOrientationChange();
    }

    ;(function(){
        this.constructor = Rem;

        this.defaults = {
            width:640,
            fontSize:32,
            delay:150,      
            limit:true
        };

        /**
         * 获取 html 的 font-size
         * @param  {Number} w viewport width
         * @return {Number}   font-size
         */
        this.getFontSize = function(w){
            return w ? w * this.options.fontSize/ this.options.width : this.options.fontSize;
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
            return value ? value/this.options.fontSize : 0;
        };

        /**
         * get the viewport width
         * @return {Number} width
         */
        this.getViewportWidth = function(){
            var self=this,
                options = self.options,
                iw = window.innerWidth,
                ow = window.outerWidth,
                sw = window.screen.width,
                saw = window.screen.availWidth,
                w;
            w = Math.min(iw,ow,sw,saw);
            options.limit && (w = w > options.width ? options.width : w);
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
                //当横竖屏切换时，如果不设置延迟，有可能无法获取到真实宽度
                timer = setTimeout(function(){
                    self.setFontSizeByWidth(width = self.getViewportWidth());
                    s === 0 ? (orientation = 0) : (orientation = 1);
                },options.delay);
            }
            self.setFontSizeByWidth(width = self.getViewportWidth());

            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
            return self;
        };

    }).call(Rem.prototype);
    return Rem;
}));