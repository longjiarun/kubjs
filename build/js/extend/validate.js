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

	module.exports = __webpack_require__(20);


/***/ },

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.validate
	 *
	 * 验证
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.validate = factory(root);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.validate = factory(root);
	    }
	}(function (root) {

	    /**
	     * ## Validate Constructor
	     *
	     * Validate 类，返回为实例化后的对象。
	     *
	     * 使用方法：
	     * ```js
	     * //验证是否为Email
	     * Kub.validate.isEmail("weidian.com");
	     *
	     * ```
	     */
	    function Validate() {}

	    Validate.prototype = {
	        constructor: Validate,

	        /**
	         * ## isEmail
	         * 验证邮件
	         */
	        isEmail: function isEmail(value) {
	            return !!(value && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value));
	        },

	        /**
	         * ## isQQ
	         * 验证QQ
	         */
	        isQQ: function isQQ(value) {
	            return new RegExp(/^[1-9]\d{4,}$/).test(value);
	        },

	        /**
	         * ## isIdcard
	         * 验证身份证号码
	         */
	        isIdcard: function isIdcard(value) {
	            return new RegExp(/^\d{15}(\d{2}[A-Za-z0-9])?$/).test(value);
	        },

	        /**
	         * ## isChinese
	         * 验证中文
	         */
	        isChinese: function isChinese(value) {
	            return new RegExp(/^[\u0391-\uFFE5]+$/).test(value);
	        },

	        /**
	         * ## isIp
	         * 验证Ip
	         */
	        isIp: function isIp(value) {
	            return new RegExp(/^([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}$/).test(value);
	        },

	        /**
	         * ## isTelphone
	         * 验证电话号码
	         */
	        isTelphone: function isTelphone(value) {
	            return new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{7,8}$)/).test(value);
	        },

	        /**
	         * ## isMobilephone
	         * 验证手机号码
	         */
	        isMobilephone: function isMobilephone(value) {
	            return new RegExp(/^\d{11}$/).test(value);
	        },

	        /**
	         * ## isPhone
	         * 验证是否是电话号码或者手机号码
	         */
	        isPhone: function isPhone(value) {
	            return this.isTelphone(value) || this.isMobilephone(value);
	        },

	        /**
	         * ## isUrl
	         * 验证url地址
	         */
	        isUrl: function isUrl(value) {
	            return new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(value);
	        },

	        /**
	         * ## isInteger
	         * 验证整数
	         */
	        isInteger: function isInteger(value) {
	            return new RegExp(/^-?\d+$/).test(value);
	        },

	        /**
	         * ## isPositiveInteger
	         * 验证正整数
	         */
	        isPositiveInteger: function isPositiveInteger(value) {
	            return new RegExp(/^[1-9]\d*$/).test(value);
	        },

	        /**
	         * ## isNegativeInteger
	         * 验证负整数
	         */
	        isNegativeInteger: function isNegativeInteger(value) {
	            return new RegExp(/^-[1-9]\d*$/).test(value);
	        },

	        /**
	         * ## isNumber
	         * 验证数字
	         */
	        isNumber: function isNumber(value) {
	            return !isNaN(Number(value));
	        },

	        /**
	         * ## isNegativeNumber
	         * 验证负数
	         */
	        isNegativeNumber: function isNegativeNumber(value) {
	            return this.isNumber(value) && Number(value) < 0;
	        },

	        /**
	         * ## isPositiveNumber
	         * 验证正数
	         */
	        isPositiveNumber: function isPositiveNumber(value) {
	            return this.isNumber() && Number(value) > 0;
	        }
	    };
	    return new Validate();
	});

/***/ }

/******/ });