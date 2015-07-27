!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return  Kub.Viewport = factory(root);
        });
    } else {
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

        //default settings
        this.defaults = {
            width:640,      //页面宽度
            delay:150,
            limit:true
        };

        /**
         * create meta viewport tag
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
         * set meta viewport content value
         * 如果页面默认开始就设置了 viewport，则在有些浏览器，后面修改也无法改变 viewport
         * @param {String} value content value
         */
        this.setViewportValue = function(value){
            var viewport = document.getElementById(viewportId);
            !viewport ? (viewport = this.createViewportElement(value)) : viewport.setAttribute("content", value);
            return this;
        };

        /**
         * get the actual width of window , actually is the device-width
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
         * get the window orientation 
         * @return {Number} direction 1 : 横屏 0 : 竖屏
         */
        this.getOrientation = function(){
            var s;
            s = (window.orientation == 90 || window.orientation == -90 ) ? 1 : window.orientation ? 0 : s;
            return s;
        };

        /**
         * 监听浏览器横竖屏
         * 有些浏览器修改 viewport 不会起作用,会存在bug
         * 有些浏览器并不需要重新设置viewport ,浏览器会自动适应
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
        };

        /**
         * device-width * default-scale(1) = options.width * scale
         *
         * 0表示不进行缩放
         */
        this.getViewportScale = function(){
            var self=this,options = self.options,scale,w;

            w = self.getDeviceWidth() || options.width;
            
            scale = options.limit ? w > options.width ? 0 : w / options.width : w / options.width;

            return scale;
        };

        /**
         * set viewport value by scale
         * Android IOS 未考虑 window phone
         * @param {Number} scale 
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

    }).call(Viewport.prototype);
    return Viewport;
}));