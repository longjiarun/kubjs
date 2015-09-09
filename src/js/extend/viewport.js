/**
 * # Kub.Viewport
 *
 * 页面scale适配方案，详见[移动端适配](http://10.1.3.35:8080/hz-front/viewport)。
 * 
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return  Kub.Viewport = factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root);
    }else {
        Kub.Viewport = factory(root);
    }
}(this,function(root){
    //只考虑 ios,android,window phone 
    var ua = navigator.userAgent,
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        os = {};

    if (android) os.android = true, os.version = android[2];
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;

    os.windows = /windows/i.test(ua);
    os.windowsPhone = os.windows && /phone/i.test(ua);
    os.windowsTablet = os.windows && /touch/i.test(ua) && !os.windowsPhone;

    os.tablet = os.android && !/mobile/i.test(ua) || os.ipad || os.windowsTablet;
    os.mobile = os.android || os.ios || os.windowsPhone;

    /**
     * ## Viewport Constructor
     *
     * Viewport 类，全局只会初始化一个实例对象。第一次初始化以后，第二次会返回上一次初始化的实例
     *
     * 使用方法：
     * ```js
     * 
     * new Kub.Viewport();
     *
     * ```
     */
    var Viewport=function(opts){
        var defaults = Viewport.prototype.defaults,options = {};
        
        if(Viewport.prototype.instance) return Viewport.prototype.instance;
        Viewport.prototype.instance = this;

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

        if(!os.mobile){
            return this;
        }

        //如果是 Android，处理横竖屏情况
        os.android && this.handleOrientationChange();
        this.setViewportByScale(this.getViewportScale());
    };
    
    ;(function(){
        
        var toString = Object.prototype.toString, viewportId="J_viewport";

        this.constructor = Viewport;

        /**
         * ## defaults
         *
         * `Viewport`默认配置项。
         *
         * 配置项说明：
         * 
         * * `width`: 页面宽度。
         * 
         * * `delay`: 横竖屏切换时，延迟设置时间。
         *
         * * `expires`: cookie缓存时间，默认10天。
         *
         * * `limit`: 是否限制宽度。true：当窗口大于`width`时，不做放大处理。false：当窗口大于`width`时，进行放大处理。
         */
        this.defaults = {
            width:640,      //页面宽度
            delay:150,
            expires:864000000,
            limit:true
        };

        /**
         * ## createViewportElement
         * 
         * 创建meta标签
         * 
         * @return {Element} viewport elment
         */
        this.createViewportElement = function(value){
            var viewport = document.createElement("meta");
            viewport.id=viewportId;
            viewport.name="viewport";
            value && (viewport.content = value);
            document.getElementsByTagName("head")[0].appendChild(viewport);
            return viewport;
        };

        /**
         * ## setViewportValue
         * 设置 meta 标签值
         * 
         * 如果页面默认开始就设置了 viewport，则在有些浏览器，后面修改也无法改变 viewport
         * 
         * @param {String} value content value
         * @return {instance} 当前实例
         */
        this.setViewportValue = function(value){
            var viewport = document.getElementById(viewportId);

            //在当前目录下缓存value
            this.cookie("viewport",value,{
                path:"./",
                expires:this.options.expires
            });
            !viewport ? (viewport = this.createViewportElement(value)) : viewport.setAttribute("content", value);
            return this;
        };

        /**
         * ## getDeviceWidth
         * 
         * 获取设备的物理像素宽
         * 
         * @return {Number} width
         */
        this.getDeviceWidth = function(){
            var self=this,options = self.options,
                iw = window.innerWidth,
                ow = window.outerWidth,
                sw = window.screen.width,
                saw = window.screen.availWidth,
                w = Math.max(ow,sw);

            //Android4 以下
            if(os.android && parseInt(os.version) <4){
                //2.3 中横屏有可能获取的宽度不正确
                if(ow>sw){
                    w = Math.max(ow,sw);
                }else{
                    w = Math.min(ow,sw);
                }
            }
            
            return w;
        };

        /**
         * ## getOrientation
         * 
         * 获取窗口横竖屏状态
         * 
         * @return {Number} direction 1 : 横屏 0 : 竖屏
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
         * 有些浏览器修改 viewport 不会起作用,会存在bug。
         * 
         * 有些浏览器并不需要重新设置viewport ,浏览器会自动适应。
         * @return {instance} 当前实例
         */
        this.handleOrientationChange = function(){
            var self=this,
                options = self.options,
                orientation = -1,timer,scale;
            function handler() {
                var s = self.getOrientation();

                if(s === orientation) return;

                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    self.setViewportByScale(scale = self.getViewportScale());
                    s ===0 ? (orientation = 0) : (orientation = 1);
                },options.delay);
            }

            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
            return self;
        };

        /**
         * ## getViewportScale
         *
         * 获取缩放比
         * 
         * 原理：device-width * default-scale(1) = options.width * scale
         * 
         * 0表示不进行缩放
         * 
         * @return {Number} 缩放比
         */
        this.getViewportScale = function(){
            var self=this,options = self.options,scale,w;

            w = self.getDeviceWidth() || options.width;
            
            //如果是平板，则采用`width`最大宽度
            scale = os.tablet ? 0 : w / options.width;

            return scale;
        };

        /**
         * ## setViewportByScale
         * 
         * 通过scale设置viewport值
         * 
         * @param {Number} scale 
         * @return {instance} 当前实例
         */
        this.setViewportByScale = function(scale){
            var self=this,options = self.options;

            //如果不限制宽度
            if(scale == 0){
                self.setViewportValue("width=device-width,user-scalable=no");
            }else{
                // android webkit内核
                if(os.android && /WebKit/i.test(ua)) {
                    self.setViewportValue("width="+options.width+",target-densitydpi=device-dpi,initial-scale="+scale+",maximum-scale="+scale+",minimum-scale="+scale);
                }else if(os.ios) {
                    self.setViewportValue("width="+options.width+",user-scalable=no");
                }else{
                    self.setViewportValue("width="+options.width);
                }
            }
            return self;
        };

        //设置cookie
        this.cookie = function (key, value, options) {
            var days, time, result, decode;

            options = options || {};

            if(!options.hasOwnProperty('path')){
                options.path = '/';
            }

            // A key and value were given. Set cookie.
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                // Enforce object
                options = $.extend({}, options);

                if (value === null || value === undefined) options.expires = -1;

                if (typeof options.expires === 'number') {
                    days = (options.expires);
                    time = options.expires = new Date();

                    time.setTime(time.getTime() + days)
                }

                value = String(value);

                return (document.cookie = [
                    encodeURIComponent(key), '=',
                    options.raw ? value : encodeURIComponent(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''))
            }

            // Key and possibly options given, get cookie
            options = value || {};

            decode = options.raw ? function (s) { return s } : decodeURIComponent;

            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
        }

    }).call(Viewport.prototype);
    return Viewport;
}));