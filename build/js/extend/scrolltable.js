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

	module.exports = __webpack_require__(18);


/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _detect = __webpack_require__(7);

	var _detect2 = _interopRequireDefault(_detect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.core = factory(root);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.core = factory(root);
	    }
	}(function (root) {

	    /**
	    * ## Core Constructor
	    *
	    * Core 类，对外提供的是实例化的对象。
	    *
	    * 使用方法：
	    * ```js
	    * //获取url参数
	    * var params = Kub.core.getQuerystring();
	    *
	    * ```
	    */
	    var Core = function Core() {};
	    var toString = Object.prototype.toString;

	    ;(function () {
	        var proto = this;
	        this.constructor = Core;

	        /**
	         * ## os
	         *
	         * 检测系统类型与版本，包含系统类型与版本信息
	         *
	         * 只检测Android 与 IOS, window phone（window phone 未进行完全测试）
	         */
	        this.os = _detect2.default;

	        this.extend = function (target, source) {
	            var deep,
	                args = Array.prototype.slice.call(arguments, 1),
	                length;
	            if (typeof target === "boolean") {
	                deep = target;
	                target = args.shift();
	            }
	            length = args.length;
	            for (var i = 0; i < length; i++) {
	                source = args[i];
	                for (var key in source) {
	                    if (source.hasOwnProperty(key)) {
	                        if (deep && (this.isArray(source[key]) || this.isObject(source[key]))) {
	                            if (this.isArray(source[key]) && !this.isArray(target[key])) {
	                                target[key] = [];
	                            }
	                            if (this.isObject(source[key]) && !this.isObject(target[key])) {
	                                target[key] = {};
	                            }
	                            this.extend(target[key], source[key], deep);
	                        } else {
	                            source[key] !== undefined && (target[key] = source[key]);
	                        }
	                    }
	                }
	            }
	            return target;
	        };

	        ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'].forEach(function (name) {
	            proto['is' + name] = function (obj) {
	                return toString.call(obj) === '[object ' + name + ']';
	            };
	        });

	        //function also is object
	        this.isObject = function (obj) {
	            return toString.call(obj) === "[object Function]" || toString.call(obj) === "[object Object]";
	        };

	        /**
	         * ## inherit
	         *
	         * 类的继承
	         *
	         * @param {Class} c 子类
	         * @param {Class} p 父类
	         */
	        this.inherit = function (c, p) {
	            var F = function F() {};
	            F.prototype = p.prototype;
	            c.prototype = new F();
	            c.prototype.constructor = c;
	            c.uber = p.prototype;
	        };

	        /**
	         * ## htmlToText
	         *
	         * 将html转换为text
	         *
	         * @param {String} value html
	         * @return {String} 处理以后的文本
	         */
	        this.htmlToText = function (value) {
	            //.replace(/&nbsp;|&#160;/gi, '')
	            return value.replace(/<.[^<>]*?>/g, '').replace(/[\n\r\t]/g, "");
	        };

	        this.getOriginUrl = function (url) {
	            var matchs;
	            url = url || window.location.href;
	            return url && (matchs = url.match(/(^[^\?#]*)/)) && matchs[1];
	        };

	        /**
	         *
	         *
	         * 获取 params string
	         * @param {String} url url地址，未传值取 `window.location.href`。
	         * @return {String} params string
	         */
	        var getParamsString = function getParamsString(url) {
	            var matchs;
	            url = url || window.location.href;
	            return url && (matchs = url.match(/^[^\?#]*\?([^#]*)/)) && matchs[1];
	        };

	        //解析 param string 正则表达式
	        var paramsRegxp = /([^=&]+)(=([^&#]*))?/g;

	        /**
	         * ## setParams(废弃)
	         *
	         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href` 的值。
	         *
	         * @param {String} url    url
	         * @param {Object} params 参数对象
	         * @param {Boolean} add   是否追加参数。true：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换
	         */
	        this.setParams = function (url, params, add) {
	            console.log("setParams 即将废弃，使用 setQuerystring 替代");
	            return this.setQuerystring(url, params, {
	                raw: true,
	                append: add
	            });
	        };

	        /**
	         * ## setQuerystring
	         *
	         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href` 的值。
	         *
	         * 使用：
	         * ```js
	         *
	         * //设置当前地址参数
	         *
	         * //默认采用`window.location.href`
	         * Kub.core.setQuerystring({
	         *     name:"kubjs"
	         * });
	         *
	         * //传入url
	         * Kub.core.setQuerystring("http://www.weidian.com?userId=123",{
	         *     name:"kubjs"
	         * });
	         *
	         * //追加参数
	         *
	         * //如果不存在名称为 name 的参数，则新增参数。如果存在则替换其值
	         * Kub.core.setQuerystring({
	         *     name:"kubjs"
	         * },{
	         *     append:true
	         * });
	         *
	         * ```
	         *
	         * @param {String} url    url
	         *
	         * @param {Object} params 参数对象
	         *
	         * @param {Object} opts   配置参数。 raw : 配置是否 encodeURIComponent ，append：是否追加参数。true：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换
	         */
	        this.setQuerystring = function (url, params, opts) {
	            //验证url是否传值，如果 url 未传值，则使用当前页面 url
	            if (this.isObject(url)) {
	                opts = params;
	                params = url;
	                url = window.location.href;
	            }
	            params = params || {};

	            opts = this.extend({
	                append: false,
	                raw: false
	            }, opts || {});

	            var queryString = getParamsString(url),
	                _queryString = "",
	                f = -1,
	                _params = {};

	            //解析 url 中的参数，存放在对象中
	            queryString && queryString.replace(paramsRegxp, function (a, name, c, value) {

	                if (params.hasOwnProperty(name)) {
	                    value = params[name];
	                }
	                _params[name] = value != undefined ? value : "";
	            });

	            //如果是追加，则合并参数
	            if (opts.append) {
	                for (var name in params) {
	                    if (params.hasOwnProperty(name)) {
	                        _params[name] = params[name] != undefined ? params[name] : "";
	                    }
	                }
	            }

	            //将参数合并成字符串
	            for (name in _params) {
	                if (_params.hasOwnProperty(name)) {
	                    _queryString += (++f ? "&" : "") + (_params[name] !== "" ? name + "=" + (opts.raw ? _params[name] : encodeURIComponent(_params[name])) : name);
	                }
	            }

	            //替换掉原来 url 中的 querystring
	            return url.replace(/^([^#\?]*)[^#]*/, function (a, url, hash) {
	                return url + (_queryString ? "?" + _queryString : "");
	            });
	        };

	        /**
	         * ## getQuerystring
	         *
	         * 获取url中的参数。
	         *
	         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
	         *
	         * @param {String} url url地址，未传值取 `window.location.href`。
	         *
	         * @param {Object} opts 配置参数，配置是否 decodeURIComponent
	         *
	         * @return {Object} 返回参数对象
	         */
	        this.getQuerystring = function (url, opts) {

	            if (this.isObject(url)) {
	                opts = url;
	                url = window.location.href;
	            }

	            opts = this.extend({
	                raw: false
	            }, opts || {});

	            url = url || window.location.href;

	            var params = {},
	                queryString = getParamsString(url);

	            queryString && queryString.replace(paramsRegxp, function (a, name, c, value) {
	                params[name] = opts.raw ? value : !!value ? decodeURIComponent(value) : undefined;
	            });

	            return params;
	        };

	        /**
	         * ## getParams(废弃)
	         *
	         * 获取url中的参数。
	         *
	         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
	         *
	         * @param {String} url url地址，未传值取 `window.location.href`。
	         * @return {Object} 返回参数对象
	         */
	        this.getParams = function (url) {
	            console.log("getParams 即将废弃，使用 getQuerystring 替代");
	            return this.getQuerystring(url, {
	                raw: true
	            });
	        };
	    }).call(Core.prototype);

	    return new Core();
	}); /**
	     * # Kub.core
	     *
	     * kubjs 核心模块，该模块只提供最基础的方法。
	     */

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

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.ScrollTable
	 *
	 * 滚动分页
	 *
	 * 由于业务不一样，数据接口与参数经常不一致，所以要配置format与formatAjaxData参数
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root, root.jQuery || root.Zepto, root._, __webpack_require__(6), __webpack_require__(19));
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root._, Kub.core, Kub.LazyLoad);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root._, Kub.core, Kub.LazyLoad);
	    }
	}(function (root, $, _, core, LazyLoad) {

	    /**
	     * ## ScrollTable Constructor
	     *
	     * ScrollTable 类
	     *
	     * 使用方法：
	     * ```js
	     * 
	     * new Kub.ScrollTable();
	     *
	     * ```
	     */
	    function ScrollTable(element, options) {
	        var self = this;

	        this.options = $.extend({}, options, ScrollTable.prototype.defaults, options || {});

	        this.$list = $(options.listSelector);
	        this.$loading = $(options.loadingTemplate).appendTo($(element));

	        if (!this.$loading.length) return;

	        this.page = this.options.defaultPage;
	        LazyLoad.call(this, this.$loading, $.extend(this.options, {
	            waitTime: 0,
	            container: window
	        }));

	        this.$element = $(element);
	    }

	    Kub.core.inherit(ScrollTable, LazyLoad);

	    ;(function () {
	        this.constructor = ScrollTable;

	        /**
	         * ## defaults
	         *
	         * `defaults`默认配置项。
	         *
	         * 配置项说明：
	         * 
	         * * `url`: url地址
	         * 
	         * * `type`: 请求类型
	         * 
	         * * `dataType`: 数据类型
	         * 
	         * * `listSelector`: 列表选择器
	         * 
	         * * `itemSelector`: item选择器，用于删除
	         * 
	         * * `loadingTemplate`: loading 模板
	         * 
	         * * `noDataTemplate`: 无数据模板
	         * 
	         * * `completedTempalte`: 数据全部加载完成以后模板
	         * 
	         * * `template`: item模板
	         * 
	         * * `success`: 成功回调函数
	         * 
	         * * `error`: 失败回调函数
	         * 
	         * * `defaultPage`: 默认页数
	         * 
	         * * `pageSize`: 页面大小
	         * 
	         * * `countKey`: 总数的key
	         * 
	         * * `resultKey`: 数据结果的key
	         * 
	         * * `format`: 格式化后端数据方法，由于每个请求过来的数据可能不一致，所以需要手动格式化。
	         * 
	         * * `formatAjaxData`: 格式化Ajax请求参数，由于每个请求发送的数据格式可能不一致，所以需要手动格式化。
	         */
	        this.defaults = {
	            url: "",
	            type: "get",
	            dataType: "jsonp",
	            listSelector: "ul",
	            itemSelector: ".J_scrollTable",
	            loadingTemplate: '',
	            noDataTemplate: '',
	            completedTempalte: '',
	            template: '',
	            success: null,
	            error: null,
	            defaultPage: 0,
	            pageSize: 10,
	            countKey: "count",
	            resultKey: "result",
	            format: function format(data) {
	                return data;
	            },
	            formatAjaxData: function formatAjaxData(data) {
	                return data;
	            }
	        };

	        this.page = 0;
	        this.pages = null;
	        this.data = [];

	        //获取页数
	        this.getPages = function (total, pageSize) {
	            var p = total / pageSize,
	                _p = parseInt(p);
	            return p !== _p ? _p + 1 : _p;
	        };

	        /**
	         * 继承自LazyLoad，不对外提供接口
	         * @return {Element} 返回还未加载的节点
	         */
	        this.getUnloadedElements = function () {
	            var self = this;
	            return self.$loading.filter(function (index) {
	                return !this.loaded;
	            });
	        };

	        /**
	         * ## refresh
	         * 
	         * 重新刷新table
	         * 
	         * @return {instance} 当前实例
	         */
	        this.refresh = function () {

	            this.$list.empty();

	            this.$loading.show();
	            this.$loading[0].loaded = false;

	            this.$complete && this.$complete.remove();
	            this.$nodata && this.$nodata.remove();

	            this.completed = false;
	            this.page = 0;
	            this.pages = null;

	            this.load();
	            return this;
	        };

	        this.loaded = true;

	        /**
	         * ## load
	         * 
	         * 加载下一页数据
	         * 
	         * @return {instance} 当前实例
	         */
	        this.load = function () {
	            var self = this,
	                options = this.options,
	                page = self.page + 1;

	            //如果加载图片被隐藏，或者加载已完成则不进行加载
	            if (self.$loading[0].offsetWidth <= 0 && self.$loading[0].offsetHeight <= 0 || self.completed || !self.loaded) {
	                return self;
	            }

	            self.page = page;
	            self.loaded = false;

	            if (self.pages == void 0 || self.page <= self.pages) {

	                self.getData({
	                    page: self.page,
	                    pagesize: options.pageSize
	                }, function (data) {
	                    self.loaded = true;
	                    data = options.format ? options.format(data) : data;

	                    //如果没有数据
	                    if (data[options.countKey] == 0 && self.page == 1) {
	                        self.setNoDataStatus();
	                        return self;
	                    }

	                    self.pages = self.getPages(data[options.countKey], options.pageSize);

	                    self.add(data[options.resultKey]);

	                    //判断数据是否加载完成
	                    self.page >= self.pages && self.setCompletedStatus();
	                    self.$container.trigger("scroll");
	                });
	            } else {
	                self.setCompletedStatus();
	            }
	            return self;
	        };

	        this.setCompletedStatus = function () {
	            //加载完成
	            this.$loading.hide();
	            this.$loading[0].loaded = true;
	            this.$complete = $(this.options.completedTempalte).appendTo(this.$element);

	            this.completed = true;
	            return this;
	        };

	        this.setNoDataStatus = function () {
	            this.$loading.hide();
	            this.$loading[0].loaded = true;
	            this.$nodata = $(this.options.noDataTemplate).appendTo(this.$element);

	            this.completed = true;
	            return this;
	        };

	        this.getRenderHtml = function (data) {
	            var length,
	                html = "";
	            if (data && (length = data.length)) {
	                for (var i = 0; i < length; i++) {
	                    html += _.template(this.options.template)({
	                        data: data[i]
	                    });
	                }
	            }

	            return html;
	        };

	        /**
	         * ## add/append
	         * 
	         * 往后添加数据
	         * 
	         * @param {Array} data   需要被添加的数据数组
	         * @return {instance} 当前实例
	         */
	        this.add = this.append = function (data) {
	            var self = this,
	                options = this.options,
	                html;

	            self.data = self.data.concat(data);

	            self.data.length > 0 && self.$nodata && self.$nodata.remove();

	            html = self.getRenderHtml(data);
	            $(html).appendTo(self.$list);
	            return self;
	        };

	        /**
	         * ## preappend
	         * 
	         * 往前添加数据
	         * 
	         * @param {Array} data   需要被添加的数据数组
	         * @return {instance} 当前实例
	         */
	        this.preappend = function (data) {
	            var self = this,
	                options = this.options,
	                html;

	            self.data = data.concat(self.data);

	            self.data.length > 0 && self.$nodata && self.$nodata.remove();

	            html = self.getRenderHtml(data);
	            $(html).prependTo(self.$list);
	            return self;
	        };

	        /**
	         * ## remove
	         * 
	         * 删除数据
	         * 
	         * @param {Object} data   被删除的数据
	         * @return {instance} 当前实例
	         */
	        this.remove = function (data) {
	            var length;
	            if (this.data && (length = this.data.length)) {
	                for (var i = 0; i < length; i++) {
	                    if (this.data[i] == data) {

	                        this.data.splice(i, 1);
	                        this.$element.find(this.options.itemSelector + data.id).remove();

	                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();
	                        this.$container.trigger("scroll");
	                        return this;
	                    }
	                }
	            }
	            return this;
	        };

	        /**
	         * ## getById
	         * 
	         * 通过ID获取数据
	         * 
	         * @param {Number} id   需要被删除的数据ID
	         * @param {String} name ID名称，有可能Id名称不一定是 ”id“
	         * @return {Object}      筛选出来的数据
	         */
	        this.getById = function (id, name) {
	            var data,
	                name = name ? name : "id",
	                param = {};
	            param[name] = id;

	            return (data = this.filter(param)) ? data[0] : null;
	        };

	        /**
	         * ## removeById
	         * 
	         * 通过ID移除数据
	         * 
	         * @param {Number} id   需要被删除的数据ID
	         * @param {String} name ID名称，有可能Id名称不一定是 ”id“
	         * @return {instance} 当前实例
	         */
	        this.removeById = function (id, name) {
	            var length,
	                name = name ? name : "id";

	            if (this.data && (length = this.data.length)) {
	                for (var i = 0; i < length; i++) {
	                    if (this.data[i][name] == id) {
	                        this.data.splice(i, 1);
	                        this.$element.find(this.options.itemSelector + id).remove();

	                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();
	                        this.$container.trigger("scroll");
	                        return this;
	                    }
	                }
	            }
	            return this;
	        };

	        /**
	         * ## filter
	         * 
	         * 筛选数据方法
	         * 
	         * @param {Object} params 参数
	         * @return {Array}         返回筛选出来的方法
	         */
	        this.filter = function (params) {
	            var length,
	                d,
	                _datas = [];

	            if (this.data && (length = this.data.length)) {
	                for (var i = 0; i < length; i++) {
	                    d = this.data[i], flag = true;
	                    for (var name in params) {
	                        if (params[name] !== d[name]) {
	                            flag = false;
	                            break;
	                        }
	                    }
	                    if (flag) {
	                        _datas.push(d);
	                    }
	                }
	            }

	            return _datas;
	        };

	        /**
	         * ## getData
	         * 
	         * 获取数据
	         * 
	         * @param {Object} data    Ajax请求参数
	         * @param {Function} success 请求成功以后回调
	         * @param {Function} error   请求失败以后回调
	         * @return {instance} 当前实例
	         */
	        this.getData = function (data, _success, _error) {
	            var self = this,
	                options = self.options;
	            $.ajax({
	                url: options.url,
	                type: options.type || "get",
	                dataType: options.dataType,
	                data: options.formatAjaxData ? options.formatAjaxData(data) : data,
	                success: function success() {
	                    if (options.success && options.success.apply(this, arguments) === false) {} else {
	                        _success && _success.apply(this, arguments);
	                    }
	                },
	                error: function error() {
	                    if (options.error && options.error.apply(this, arguments) === false) {} else {
	                        _error && _error.apply(this, arguments);
	                    }
	                }
	            });
	            return self;
	        };
	    }).call(ScrollTable.prototype);

	    return ScrollTable;
	});

/***/ },

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.LazyLoad
	 * 
	 * 延迟加载组件。
	 * 
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root, root.jQuery || root.Zepto);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.LazyLoad = factory(root, root.jQuery || root.Zepto);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.LazyLoad = factory(root, root.jQuery || root.Zepto);
	    }
	}(function (root, $) {
	    'use strict';

	    /**
	     * ## LazyLoad Constructor
	     *
	     * LazyLoad 类
	     *
	     * 使用：
	     * ```js
	     * var lazyload = new Kub.LazyLoad($("img"));
	     * ```
	     */

	    var LazyLoad = function LazyLoad(element, options) {
	        this.$element = $(element);

	        this.options = $.extend({}, LazyLoad.prototype.defaults, options || {});
	        this.$window = $(window);
	        this.$container = this.options.container === undefined || this.options.container === window ? (this.containerIsWindow = true, this.$window) : $(this.options.container);
	        this._init();
	    };
	    (function () {

	        this.constructor = LazyLoad;

	        /**
	         * ## defaults
	         *
	         * 默认配置项。
	         *
	         * 配置项说明：
	         * 
	         *   `container` : 图片存放容器，容器会监听事件
	         *   
	         *   `threshold` : 提前加载距离，默认50px
	         *   
	         *   `waitTime` : 等待时间，用户如果在 waitTime 时间内无操作，则会加载剩余默认图片
	         *   
	         *   `delay` : 事件监听时的延迟时间
	         *   
	         *   `attributeName` : 属性名称，默认会从dom上取出地址 `data-attributeName`
	         *   
	         *   `eventName` : 监听的事件名称
	         */
	        this.defaults = {
	            container: window,
	            threshold: 50,
	            waitTime: -1,
	            delay: 150,
	            attributeName: "original",
	            eventName: "scroll resize"
	        };

	        //更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内       
	        this.updateElement = function (element) {
	            var self = this;
	            self.$element = element;
	            //更新 dom 以后立即验证是否有元素已经显示
	            self.loadElementsInViewport();
	            return self;
	        };

	        /**
	         * ## getUnloadedElements
	         * 
	         * 获取所有还未被加载的节点
	         * 
	         * @return {instance} 当前实例
	         */
	        this.getUnloadedElements = function () {
	            var self = this;
	            return self.$element.filter(function (index) {
	                return !this.loaded;
	            });
	        };

	        /**
	         * ## loadAll
	         * 
	         * 强制加载所有图片，无论节点是否在可视区域内
	         * 
	         * @return {instance} 当前实例
	         */
	        this.loadAll = function () {
	            var self = this,
	                options = self.options,
	                elements;
	            elements = self.getUnloadedElements();
	            elements.each(function () {
	                var $this = $(this);
	                self.load($this, $this.attr("data-" + self.options.attributeName));
	            });
	            return self;
	        };

	        //加载所有在可视区域内的图片
	        this.loadElementsInViewport = function () {
	            var self = this,
	                options = self.options,
	                elements;

	            elements = self.getUnloadedElements();
	            elements.length == 0 && (self.completed = true);
	            elements.each(function () {
	                var $this = $(this),
	                    flag = true;

	                flag = self.isVisible($this, options);
	                flag && self.load($this, $this.attr("data-" + self.options.attributeName));
	            });
	            return self;
	        };

	        /**
	         * ## isVisible
	         * 
	         * 是否可见
	         * @param {$}  $this         元素
	         * @param {Object}  options  参数
	         * @return {Boolean}         true ：可见 false ：不可见
	         */
	        this.isVisible = function ($this, options) {
	            var self = this;
	            if (self.abovethetop($this, options)) {
	                return false;
	            } else if (self.belowthefold($this, options)) {
	                return false;
	            }
	            if (self.leftofbegin($this, options)) {
	                return false;
	            } else if (self.rightoffold($this, options)) {
	                return false;
	            }
	            return true;
	        };

	        this._loadAllIfTimeout = function () {
	            var self = this,
	                options = self.options;
	            typeof options.waitTime === "number" && !(options.waitTime !== +options.waitTime) && options.waitTime > 0 && (self._waitTimer = setTimeout(function () {
	                self.loadAll();
	            }, options.waitTime));
	            return self;
	        };

	        this._init = function () {
	            var self = this,
	                options = self.options;

	            this._handle = function () {
	                if (self.completed) {
	                    return;
	                }
	                self._timer && clearTimeout(self._timer);
	                self._waitTimer && clearTimeout(self._waitTimer);
	                self._timer = setTimeout(function () {
	                    self.loadElementsInViewport();
	                    self._loadAllIfTimeout();
	                }, options.delay);
	            };

	            self.loadElementsInViewport();
	            self._loadAllIfTimeout();

	            self.$container.on(options.eventName, self._handle);
	            //有可能 window resize 会影响到元素的位置
	            !self.containerIsWindow && self.$window.on("resize", self._handle);
	        };

	        /**
	         * ## load
	         * 
	         * 加载指定元素
	         * 
	         * @param {$} $element      加载的节点
	         * @param {String} original 图片地址
	         * @return {instance}       当前实例
	         */
	        this.load = function ($element, original) {
	            //如果原图片为空
	            if (!original) {
	                return;
	            }
	            if ($element.is("img")) {
	                $element.attr("src", original);
	            } else {
	                $element.css("background-image", "url('" + original + "')");
	            }
	            $element[0].loaded = true;
	            return this;
	        };

	        /**
	         * ## destroy
	         * 
	         * 销毁对象
	         * @return {instance} 当前实例
	         */
	        this.destroy = function () {
	            var self = this,
	                options = self.options;
	            //取消监听
	            self.$container.off(options.eventName, self._handle);
	            !self.containerIsWindow && self.$window.off("resize", self._handle);
	            //clear timeout
	            self._timer && clearTimeout(self._timer);
	            self._waitTimer && clearTimeout(self._waitTimer);

	            return self;
	        };

	        /**
	         * 是否在可视区域内
	         * 
	         * @param {zepto} element 检查的元素
	         * @return {Boolean} 是：true 否 ：false
	         */
	        this.isInViewport = function ($this) {
	            return !this.belowthefold($this[0], this.options) && !this.abovethetop($this[0], this.options) && !this.rightoffold($this[0], this.options) && !this.leftofbegin($this[0], this.options);
	        };

	        /**
	         * ## belowthefold
	         * 
	         * 是否在视窗下面
	         * 
	         * @param {Element} element 检查的元素
	         * @param {Object} settings 被检查时的参数
	         * @return {Boolean}        是：true 否 ：false
	         */
	        this.belowthefold = function (element, settings) {
	            var fold,
	                $window = $(window);
	            if (settings.container === undefined || settings.container === window) {
	                fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
	            } else {
	                fold = $(settings.container).offset().top + $(settings.container).height();
	            }

	            return fold <= $(element).offset().top - settings.threshold;
	        };

	        /**
	         * ## abovethetop
	         * 
	         * 是否在视窗上面
	         * 
	         * @param {Element} element 检查的元素
	         * @param {Object} settings 被检查时的参数
	         * @return {Boolean}        是：true 否 ：false
	         */
	        this.abovethetop = function (element, settings) {
	            var fold,
	                $window = $(window);

	            if (settings.container === undefined || settings.container === window) {
	                fold = $window.scrollTop();
	            } else {
	                fold = $(settings.container).offset().top;
	            }

	            return fold >= $(element).offset().top + settings.threshold + $(element).height();
	        };

	        /**
	         * ## rightoffold
	         * 
	         * 是否在视窗右侧
	         * 
	         * @param {Element} element 检查的元素
	         * @param {Object} settings 被检查时的参数
	         * @return {Boolean}        是：true 否 ：false
	         */
	        this.rightoffold = function (element, settings) {
	            var fold,
	                $window = $(window);
	            if (settings.container === undefined || settings.container === window) {
	                fold = $window.width() + $window.scrollLeft();
	            } else {
	                fold = $(settings.container).offset().left + $(settings.container).width();
	            }
	            return fold <= $(element).offset().left - settings.threshold;
	        };

	        /**
	         * ## leftofbegin
	         * 
	         * 是否在视窗左侧
	         * 
	         * @param {Element} element 检查的元素
	         * @param {Object} settings 被检查时的参数
	         * @return {Boolean}        是：true 否 ：false
	         */
	        this.leftofbegin = function (element, settings) {
	            var fold,
	                $window = $(window);
	            if (settings.container === undefined || settings.container === window) {
	                fold = $window.scrollLeft();
	            } else {
	                fold = $(settings.container).offset().left;
	            }
	            return fold >= $(element).offset().left + settings.threshold + $(element).width();
	        };
	    }).call(LazyLoad.prototype);
	    return LazyLoad;
	});

/***/ }

/******/ });