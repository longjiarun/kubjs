/*
说明：
    适配方案，采用scale进行适配。目前已兼容ios、android，其余设备保证正常使用。
    注意：平板下，保证页面在640宽度。让其两侧留有空白，由于放大后，页面相当模糊，影响使用。
    此适配方案已兼容公司所有测试机，含android2.3。尚未全面使用，在等待用户的反馈。
    发现问题，可及时向我反馈 longjia@koudai.com
问题:
    1、在横竖屏切换时，会出现页面放大或缩小。（浏览器无法触发事件，浏览器bug。设备较少，可采取监控机制解决，但开销太大，没必要。）
    2、点击链接或者前进后退，页面放大或缩小。（浏览器本身问题，后续采用rem适配方案可解决）
使用方法：
    引入如下js，无需插入meta标签
    <script type="text/javascript" src="js/lib/viewport.js"></script>
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return  Kub.viewport = factory(root);
        });
    } else {
        Kub.viewport = factory(root);
    }
}(this,function(root){
    var Viewport=function(options){
        this.options = this.extend(Viewport.prototype.defaults,options||{});
        this._init();
    };
    
    ;(function(){
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
 
        var toString = Object.prototype.toString,viewportId="J_viewport";

        this.constructor = Viewport;
        //default settings
        this.defaults = {
            width:640,              //页面宽度
            specialDevices:null,     //特殊设备，无法通过适配方案进行适配的设备
            delay:200
        };

        /**
         * extend function like $.extend()
         */
        this.extend = function(target,source){
            var deep,args = Array.prototype.slice.call(arguments,1),length;
            if(typeof target === "boolean"){
                deep = target;
                target = args.shift();
            }
            length = args.length;
            for(var i=0;i<length;i++){
                source = args[i];
                for(var key in source){
                    if(source.hasOwnProperty(key)){
                        if(deep && (this.isArray(source[key]) || this.isObject(source[key]) )){
                            if(this.isArray(source[key]) && !this.isArray(target[key])){
                                target[key]=[];
                            }
                            if(this.isObject(source[key]) && !this.isObject(target[key])){
                                target[key]={};
                            }
                            this.extend(target[key],source[key],deep);
                        }else{
                            (source[key] !== undefined )&& (target[key] = source[key]);
                        }
                    }
                }
            }
            return target;
        };

        /**
         * isArray 
         * @return {Boolean}    true/false
         */
        this.isArray = Array.isArray || function(obj){
            return toString.call(obj) === "[object Array]";
        };

        /**
         * function also is object
         */
        this.isObject = function(obj){
            return toString.call(obj) === "[object Function]" || toString.call(obj) === "[object Object]";
        };

        this._init = function(){
            var self=this,options=self.options,scale;
            if(!os.mobile){
                return;
            }
            //如果是 Android，处理横竖屏情况
            os.android && self.handleOrientationChange();
            
            !self.setSpecialDevices() && self.setViewportByScale(scale = self.getViewportScale());
            
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
         * handler special devices , the options of specialDevices is Array. 
         * device has {pattern,dpi,scale}. ths pattern test target device. 
         * if dpi isn't null,then set viewport value by this. also ths scale.
         * @return {Boolean} is in the specialDevices return false, is not return true.
         */
        this.setSpecialDevices = function() {
            var self = this,
                options = self.options,
                specialDevices = options.specialDevices;

            if (specialDevices && self.isArray(specialDevices)) {
                for (var i = 0, j = specialDevices.length; i < j; i++) {
                    if (specialDevices[i].pattern && toString.call(specialDevices[i].pattern) === "[object RegExp]" && specialDevices[i].pattern.test(ua)) {
                        specialDevices[i].dpi && self.setViewportByDPI(specialDevices[i].dpi);
                        specialDevices[i].scale && self.setViewportByScale(specialDevices[i].scale);
                        return true;
                    }
                }
            }
            return false;
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
            return w
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
            var self=this,options = self.options,
                orientation = -1,timer;
            function handler() {
                var s = self.getOrientation();

                if(s === orientation) return;

                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    self.setViewportByScale(scale = self.getViewportScale());
                    s ===0 ? (orientation = 0) : (orientation = 1);
                },options.delay);
            }
            //Android IOS 有 orientationchange事件
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
        };

        /**
         * device-width * default-scale(1) = options.width * scale
         */
        this.getViewportScale = function(){
            var self=this,options = self.options,scale;
            scale = (self.getDeviceWidth() || options.width) / options.width;
            return scale;
        };

        /**
         * set viewport value by scale
         * Android IOS 未考虑 window phone
         * @param {Number} scale 
         */
        this.setViewportByScale = function(scale){
            var self=this,options = self.options;

            //平板下面不进行全屏，两侧让其留有空白
            if(os.tablet){
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
    return new Viewport();
}));