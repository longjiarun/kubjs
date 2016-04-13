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

	module.exports = __webpack_require__(5);


/***/ },

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.cookie
	 * 
	 * copy from `zepto.cookie.js`，将 expires 单位改为毫秒。
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.cookie = factory(root);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.cookie = factory(root);
	    }
	}(function (root) {
	    /**
	     * ##cookie方法
	     * 
	     * @param {String} key key值，
	     * @param {String} value   设置值，如果未传递，则表示取值
	     * @param {Object} options 配置项
	     * @return {String}  如果未取值，则返回取到的值，如果未赋值，则返回空。
	     */
	    return function (key, value, options) {
	        var days, time, result, decode;

	        options = options || {};

	        if (!options.hasOwnProperty('path')) {
	            options.path = '/';
	        }

	        // A key and value were given. Set cookie.
	        if (arguments.length > 1 && String(value) !== "[object Object]") {
	            // Enforce object

	            if (value === null || value === undefined) options.expires = -1;

	            if (typeof options.expires === 'number') {
	                days = options.expires;
	                time = options.expires = new Date();

	                time.setTime(time.getTime() + days);
	            }

	            value = String(value);

	            return document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('');
	        }

	        // Key and possibly options given, get cookie
	        options = value || {};

	        decode = options.raw ? function (s) {
	            return s;
	        } : decodeURIComponent;

	        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	    };
	});

/***/ }

/******/ });