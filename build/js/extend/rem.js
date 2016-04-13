/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.Rem
	 *
	 * 页面rem适配方案，详见[移动端适配](http://10.1.3.35:8080/hz-front/viewport)。
	 * 
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.Rem = factory(root);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.Rem = factory(root);
	    }
	}(function (root) {
	    var html = document.getElementsByTagName("html")[0],
	        os = {},
	        ua = navigator.userAgent;
	    os.android = /android/i.test(ua);
	    os.mobile = /(android|phone|mobile|tablet|touch)/i.test(ua);
	    os.tablet = os.mobile && /(tablet|touch|ipad)/i.test(ua) || os.android && !/mobile/i.test(ua);

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
	    function Rem(opts) {
	        var defaults = Rem.prototype.defaults,
	            options = {};

	        if (Rem.prototype.instance) return Rem.prototype.instance;
	        Rem.prototype.instance = this;

	        if (opts) {
	            for (var name in defaults) {
	                if (defaults.hasOwnProperty(name)) {
	                    opts[name] == undefined ? options[name] = defaults[name] : options[name] = opts[name];
	                }
	            }
	        } else {
	            options = defaults;
	        }
	        this.options = options;

	        var l;
	        if (options.device && options.device.phone && (l = options.device.phone.length)) {
	            for (var i = 0; i < l; i++) {
	                new RegExp(options.device.phone[i], "i").test(ua) && (os.tablet = false);
	            }
	        }

	        if (options.device && options.device.tablet && (l = options.device.tablet.length)) {
	            for (var i = 0; i < l; i++) {
	                new RegExp(options.device.tablet[i], "i").test(ua) && (os.tablet = true);
	            }
	        }

	        os.mobile && this.handleOrientationChange();
	    }

	    ;(function () {
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
	         */
	        this.defaults = {
	            width: 640,
	            fontSize: 32,
	            delay: 150,
	            device: {
	                phone: ["lenovo-a850"],
	                tablet: []
	            }
	        };

	        /**
	         * ## getFontSize
	         * 
	         * 获取 html 的 font-size
	         * 
	         * @param {Number} w viewport width
	         * @return {Number}   fontsize
	         */
	        this.getFontSize = function (w) {
	            return w ? w * this.options.fontSize / this.options.width : this.options.fontSize;
	        };

	        /**
	         * ## setFontSize
	         * 
	         * 设置 html 的fontsize
	         * 
	         * @param {Number} fontSize fontsize
	         * @return {instance} 当前实例
	         */
	        this.setFontSize = function (fontSize) {
	            html.style.fontSize = fontSize + "px";
	            return this;
	        };

	        /**
	         * ## setFontSizeByWidth
	         * 
	         * 通过viewport 设置fontsize
	         * 
	         * @param {Number} width viewport width
	         *
	         * @return {instance} 当前实例
	         */
	        this.setFontSizeByWidth = function (width) {
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
	        this.getRem = function (value) {
	            return value ? value / this.options.fontSize : 0;
	        };

	        /**
	         * ## getViewportWidth
	         *
	         * 获取设备的CSS像素值
	         * 
	         * @return {Number} width 获取的宽度
	         */
	        this.getViewportWidth = function () {
	            var self = this,
	                options = self.options,
	                iw = window.innerWidth || 100000,
	                bodyw = document.documentElement.offsetWidth,
	                ow = window.outerWidth || iw,
	                sw = window.screen.width || iw,
	                saw = window.screen.availWidth || iw,
	                w;

	            w = Math.min(iw, ow, sw, saw, bodyw);

	            if (w === 100000) {
	                w = 320;
	            }

	            //如果是平板，则采用页面最大宽度
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
	        this.getOrientation = function () {
	            var s;
	            s = window.orientation == 90 || window.orientation == -90 ? 1 : window.orientation ? 0 : s;
	            return s;
	        };

	        /**
	         * ## handleOrientationChange
	         * 
	         * 处理横竖屏切换事件，如果没有横竖屏事件，则监听 resize 事件。
	         *
	         * @return {instance} 当前实例
	         */
	        this.handleOrientationChange = function () {
	            var self = this,
	                options = self.options,
	                width,
	                orientation = -1,
	                timer;
	            function handler() {
	                var s = self.getOrientation();

	                if (s === orientation) return;

	                timer && clearTimeout(timer);
	                //当横竖屏切换时，如果不设置延迟，有可能无法获取到真实宽度
	                timer = setTimeout(function () {
	                    self.setFontSizeByWidth(width = self.getViewportWidth());
	                    s === 0 ? orientation = 0 : orientation = 1;
	                }, options.delay);
	            }
	            self.setFontSizeByWidth(width = self.getViewportWidth());

	            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
	            return self;
	        };
	    }).call(Rem.prototype);
	    return Rem;
	});

/***/ }

/******/ });