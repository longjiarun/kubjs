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

	module.exports = __webpack_require__(7);


/***/ },

/***/ 7:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ua = navigator.userAgent,
	    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
	    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	    wp = ua.match(/Windows Phone ([\d.]+)/),
	    os = {};

	//android
	android ? (os.android = true, os.version = android[2]) : os.android = false;

	//iphone
	iphone && !ipod ? (os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')) : os.iphone = false;

	//ipad
	ipad ? (os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')) : os.ipad = false;

	//ipod
	ipod ? (os.ios = os.ipod = true, os.version = ipod[3].replace(/_/g, '.')) : os.ipod = false;

	//window phone
	wp ? (os.wp = true, os.version = wp[1]) : os.wp = false;

	!os.iphone && !os.ipad && !os.ipod && (os.ios = false);

	os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false;
	os.tablet = !os.phone && (os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua)) ? true : false;
	os.mobile = os.phone || os.tablet;

	exports.default = os;

/***/ }

/******/ });