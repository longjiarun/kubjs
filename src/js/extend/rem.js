/**
 * # Kub.Rem
 *
 * 页面rem适配方案，详见[移动端适配](http://10.1.3.35:8080/hz-front/viewport)。
 * 
 */
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

    /**
     * ## Rem Constructor
     *
     * Rem 类，全局只会初始化一个实例对象。第一次初始化以后，第二次会返回上一次初始化的实例。
     *
     * 使用方法：
     * ```js
     * 
     * new Kub.Rem();
     *
     * ```
     */
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

        /**
         * ## defaults
         *
         * `Rem`默认配置项。
         *
         * 配置项说明：
         * 
         * * `width`: 页面宽度。
         * 
         * * `fontSize`: 计算rem的基准像素值，一般不进行修改。
         * 
         * * `delay`: 横竖屏切换时，延迟设置时间。
         *
         * * `limit`: 是否限制宽度。true：当窗口大于`width`时，不做放大处理。false：当窗口大于`width`时，进行放大处理。
         */
        this.defaults = {
            width:640,
            fontSize:32,
            delay:150,      
            limit:true
        };

        /**
         * ## getFontSize
         * 
         * 获取 html 的 font-size
         * 
         * @param {Number} w viewport width
         * @return {Number}   fontsize
         */
        this.getFontSize = function(w){
            return w ? w * this.options.fontSize/ this.options.width : this.options.fontSize;
        };

        /**
         * ## setFontSize
         * 
         * 设置 html 的fontsize
         * 
         * @param {Number} fontSize fontsize
         * @return {instance} 当前实例
         */
        this.setFontSize = function(fontSize){
            html.style.fontSize = fontSize +"px";
            return this;
        }
        
        /**
         * ## setFontSizeByWidth
         * 
         * 通过viewport 设置fontsize
         * 
         * @param {Number} width viewport width
         *
         * @return {instance} 当前实例
         */
        this.setFontSizeByWidth = function(width){
            return this.setFontSize(this.getFontSize(width));
        };

        /**
         * ## getRem
         * 
         * 根据给出的像素值，获取rem
         * 用于在js中换算单位
         * 
         * @param {Number} value 像素值
         * @return {Number}       rem
         */
        this.getRem = function(value){
            return value ? value/this.options.fontSize : 0;
        };

        /**
         * ## getViewportWidth
         *
         * 获取设备的CSS像素值
         * 
         * @return {Number} width 获取的宽度
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

            w = os.tablet ? options.width : w;

            return w;
        };

        /**
         * ## getOrientation
         * 
         * 获取横竖屏状态。
         * 
         * @return {Number}  1 : 横屏 0 : 竖屏 无该属性 ： undefined
         */
        this.getOrientation = function(){
            var s;
            s = (window.orientation == 90 || window.orientation == -90 ) ? 1 : window.orientation ? 0 : s;
            return s;
        };

        /**
         * ## handleOrientationChange
         * 
         * 处理横竖屏切换事件，如果没有横竖屏事件，则监听 resize 事件。
         *
         * @return {instance} 当前实例
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