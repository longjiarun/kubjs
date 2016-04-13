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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.Dialog
	 *
	 * 对话框
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};

	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root, root.jQuery || root.Zepto, root._);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.Dialog = factory(root, root.jQuery || root.Zepto, root._);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.Dialog = factory(root, root.jQuery || root.Zepto, root._);
	    }
	}(function (root, $, _) {

	    /**
	     * ## Dialog Constructor
	     *
	     * Dialog 类
	     *
	     * 使用：
	     * ```js
	     *   //可定制多个按钮
	     *   var dialog = new Kub.Dialog({
	     *       message:"这是个弹窗",
	     *       title:"弹窗",
	     *       buttons:[{
	     *           text:"确定",
	     *           handler:function(e,dialog){
	     *               
	     *           }
	     *       },{
	     *          text:"取消",
	     *          handler:function(e,dialog){
	     *               //返回 event 与 dialog对象
	     *               dialog.close();
	     *          }
	     *       }]
	     *   });
	     * ```
	     */
	    var Dialog = function Dialog(options) {
	        this.options = $.extend({}, Dialog.prototype.defaults, options || {});

	        //由于按钮排列采用CSS解决，所以目前限制最大可包含5个按钮
	        this.options.buttons && this.options.buttons.length > 5 && (this.options.buttons.length = 5);
	        this._init();
	    },
	        $body = $("body"),
	        $html = $body.parent();

	    var ZOOMINCLASS = "kub-animated kub-zoomIn",
	        OVERFLOWCLASS = "kub-ofh",
	        DIALOGID = "J_dialog",
	        DIALOGCLOSEID = "J_dialogClose",
	        DIALOGBUTTONCLASS = "J_dialogButton",

	    //弹窗模板
	    TEMPLATE = '<div class="kub-dialog-modal <%= data.className%> <%if( data.modal ){%> kub-modal <%}%>"> <div class="kub-dialog-wrapper"><div class="kub-dialog-container"> <div class="kub-dialog" id="J_dialog"> <%if(data.showHeader){%> <div class="kub-dialog-header clearfix"> <strong><%= data.title%></strong> <%if(data.closable){%><button class="kub-dialog-button kub-dialog-close" id="J_dialogClose">×</button><%}%> </div> <%}%> <div class="kub-dialog-body"> <%= data.message%> </div> <%if(data.buttons && data.buttons.length){%> <div class="kub-dialog-footer kub-column<%= data.buttons.length%>"> <% for (var i=0,j=data.buttons.length;i<j;i++){%><button class="kub-dialog-button J_dialogButton <%= data.buttons[i].className || ""%>" data-index="<%= i%>"><%= data.buttons[i].text%></button><%}%> </div> <%}%> </div></div></div> </div>';(function () {
	        this.constructor = Dialog;

	        /**
	         * ## defaults
	         *
	         * 默认配置项。
	         *
	         * 配置项说明：
	         * 
	         * * `modal`: 是否显示遮罩层；
	         * 
	         * * `title`: 对话框名称；
	         *
	         * * `showHeader`: 是否显示头部；
	         * 
	         * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效；
	         * 
	         * * `message`: 弹窗内容，可设置成`html`；
	         *
	         * * `className`: 弹窗类名；
	         * 
	         * * `scrollable`: 是否禁用页面滚动条；
	         * 
	         * * `animated`: 是否开启动画效果；
	         *
	         * * `buttons`: 弹窗按钮；
	         * 
	         * ```js
	         * [{   
	         *     text:"按钮名称",//按钮名称
	         *     className:"button-name",//按钮class类名
	         *     handler:function(){
	         *         //按钮单击触发事件
	         *     }
	         * }]
	         * ```
	         */
	        this.defaults = {
	            modal: true,
	            title: "",
	            showHeader: true,
	            closable: true,
	            message: "",
	            className: "",
	            scrollable: true,
	            animated: true,
	            buttons: null
	        };

	        this.i18n = {
	            zh: {
	                ok: "确定",
	                cancel: "取消"
	            },
	            en: {
	                ok: "Ok",
	                cancel: "Cancel"
	            }
	        };

	        //添加本地化，主要用在 `alert`,`confirm`,`prompt`
	        this.addLocale = function (name, locale) {
	            name && locale && (this.i18n[name] = locale);
	            return this;
	        };

	        this.inherit = function (c, p) {
	            var F = function F() {};
	            F.prototype = p.prototype;
	            c.prototype = new F();
	            c.prototype.constructor = c;
	            c.uber = p.prototype;
	        };

	        this._render = function (data) {
	            if (this.completed) {
	                return this;
	            }
	            var compiled = _.template(TEMPLATE),
	                html = compiled({ data: data });
	            this.$element = $(html).appendTo($body);
	            this.completed = true;
	            return this;
	        };

	        this._init = function () {
	            var self = this,
	                options = self.options;

	            //解决 iphone 下，fixed定位问题
	            setTimeout(function () {
	                var $window = $(window);
	                $window.scrollTop($window.scrollTop());
	            }, 5);

	            //渲染数据
	            self._render(options);
	            this.$dialog = this.$element.find("#" + DIALOGID);

	            self.show();

	            self.setPosition();

	            //监听事件
	            self.$element.find("#" + DIALOGCLOSEID).on("click", function () {
	                self.close();
	            });

	            //注册按钮事件
	            self.$element.on("click", "." + DIALOGBUTTONCLASS, function (e) {
	                var index = parseInt($(this).attr("data-index"));
	                options.buttons[index] && options.buttons[index].handler && options.buttons[index].handler.call(this, e, self);
	            });
	        };

	        //采用table-cell居中方式
	        this.setPosition = function () {
	            /*this.$dialog.css({
	                marginTop:-(this.$dialog.height()/2 || 100),
	                top:"50%"
	            });*/
	            return this;
	        };

	        var i = 0,
	            scrollTop;
	        this.disableScrollbar = function () {
	            if (!this.options.scrollable) {
	                i == 0 && (scrollTop = $body.scrollTop());
	                $body.addClass(OVERFLOWCLASS) && $html.addClass(OVERFLOWCLASS);
	            }
	            return this;
	        };

	        this.enableScrollbar = function () {
	            if (!this.options.scrollable) {
	                i < 1 && $body.removeClass(OVERFLOWCLASS) && $html.removeClass(OVERFLOWCLASS) && (i = 0);
	                i == 0 && $body.scrollTop(scrollTop);
	            }
	            return this;
	        };

	        /**
	         * ## show
	         *
	         * 显示弹窗
	         * @return {instance} 返回当前实例
	         */
	        this.show = function () {
	            this.disableScrollbar();

	            !this.options.scrollable && i++;
	            this.$element.show();

	            this.options.animated && this.$dialog.addClass(ZOOMINCLASS);
	            return this;
	        };

	        /**
	         * ## hide
	         *
	         * 隐藏弹窗
	         * @return {instance} 返回当前实例
	         */
	        this.hide = function () {
	            !this.options.scrollable && i--;
	            this.enableScrollbar();

	            this.$element.hide();
	            this.options.animated && this.$dialog.removeClass(ZOOMINCLASS);

	            return this;
	        };

	        /**
	         * ## close
	         *
	         * 关闭弹窗
	         * @return {instance} 返回当前实例
	         */
	        this.close = function () {
	            var self = this;
	            if (this.options.closeHandler && this.options.closeHandler.call(this) === false) {
	                return this;
	            }

	            this.hide();
	            self.$element.remove();

	            return this;
	        };
	    }).call(Dialog.prototype);
	    return Dialog;
	});

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.dateHelper
	 * 
	 * 日期格式化组件。
	 * 
	 * 格式化字符:
	 * 
	    yyyy : 四位年。例如：2015

	    yy   : 二位年份，最后两位。例如 15

	    MMMM : 全称月份。例如 January

	    MMM  : 简称月份。例如 Jan

	    MM   : 两位月份，小于10显示03。例如：11

	    M    : 一位月份，小于10显示3.例如：3或者11

	    dddd : 全称星期。例如：星期一，Sunday

	    ddd  : 简称星期。例如：一，Sun

	    dd   : 两位天数。类似于MM

	    d    : 一位天数。类似于M

	    HH   : 两位小时。类似于MM

	    H    : 一位小时。类似于M

	    mm   : 两位分钟。类似于MM

	    m    : 一位分钟。类似于M

	    ss   : 两位秒数。类似于MM

	    s    : 一位秒数。类似于M

	    aa   : 全称上午或者下午。例如A.M.，P.M.

	    a    : 简称上午或者下午。例如AM.

	*/
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root);
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.dateHelper = factory(root);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.dateHelper = factory(root);
	    }
	}(function (root) {
	    'use strict';

	    /**
	     * ## DateHelper Constructor
	     *
	     * DateHelper 对外提供的是实例化以后的对象。
	     *
	     * 使用：
	     * ```js
	     * //String to Date
	     * "2015-05-20".parseDate("yyyy-MM-dd");
	     *     
	     * //格式化日期
	     * (new Date()).format("yyyy-MM-dd,hh:mm:ss");
	     * ```
	     */

	    var DateHelper = function DateHelper() {};

	    (function () {
	        this.constructor = DateHelper;

	        //本地化，目前包含`en`与`zh`
	        this.i18n = {
	            en: {
	                month: {
	                    abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	                    full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	                },
	                day: {
	                    abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	                    full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	                },
	                amPm: {
	                    abbr: ['AM', 'PM'],
	                    full: ['A.M.', 'P.M.']
	                }
	            },
	            zh: {
	                month: {
	                    abbr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	                    full: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份']
	                },
	                day: {
	                    abbr: ['日', '一', '二', '三', '四', '五', '六'],
	                    full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	                },
	                amPm: {
	                    abbr: ['上午', '下午'],
	                    full: ['上午', '下午']
	                }
	            }
	        };

	        //默认中文
	        this.locale = "zh";

	        /**
	         * ## addLocale
	         * 
	         * 添加本地化
	         * 
	         * @param {String} name   本地化名称
	         * @param {Object} locale 本地化数据
	         * @return {instance}     当前实例
	         */
	        this.addLocale = function (name, locale) {
	            name && locale && (this.i18n[name] = locale);
	            return this;
	        };

	        /**
	         * ## setLocale
	         * 
	         * 设置默认本地化
	         * 
	         * @param {String} name 本地化名称
	         * @return {instance}     当前实例
	         */
	        this.setLocale = function (name) {
	            this.locale = name;
	            return this;
	        };

	        this._get2Year = function (date) {
	            return (date.getFullYear() + "").replace(/\d{2}$/, "00") - 0;
	        };

	        this._get2 = function (value) {
	            return value < 10 ? "0" + value : value;
	        };

	        this._getAmPm = function (date) {
	            return date.getHours() < 12 ? 0 : 1;
	        };

	        //获取相对应的日期相关数据
	        this._getValueByPattern = function (fmt, date) {
	            var self = this;
	            var patterns = {
	                yyyy: date.getFullYear(),
	                yy: date.getFullYear() - self._get2Year(date),
	                MMMM: self.i18n[self.locale].month.full[date.getMonth()],
	                MMM: self.i18n[self.locale].month.abbr[date.getMonth()],
	                MM: self._get2(date.getMonth() + 1),
	                M: date.getMonth() + 1,
	                dddd: self.i18n[self.locale].day.full[date.getDay()],
	                ddd: self.i18n[self.locale].day.abbr[date.getDay()],
	                dd: self._get2(date.getDate()),
	                d: date.getDate(),
	                HH: self._get2(date.getHours()),
	                H: date.getHours(),
	                mm: self._get2(date.getMinutes()),
	                m: date.getMinutes(),
	                ss: self._get2(date.getSeconds()),
	                s: date.getSeconds(),
	                aa: self.i18n[self.locale].amPm.full[self._getAmPm(date)],
	                a: self.i18n[self.locale].amPm.abbr[self._getAmPm(date)]
	            };
	            return patterns[fmt];
	        };

	        /**
	         * ## format
	         * 
	         * 格式化日期
	         * 
	         * @param {Date} date     日期
	         * @param {String} format 日期格式
	         * @return {String}        格式化以后的日期
	         */
	        this.format = function (date, format) {
	            var self = this;
	            if (!date) return;

	            format = format || "yyyy-MM-dd";

	            format = format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|mm|m|ss|s|aa|a)/g, function (part) {
	                return self._getValueByPattern(part, date);
	            });
	            return format;
	        };

	        /**
	         * ## parse
	         * 
	         * 转换日期
	         * 
	         * 此方法存在一个BUG，例如：
	         * 
	         * ```js
	         * //1112会被计算在MM内。
	         * dateHelper.parse("2015-1112","yyyy-MMdd");
	         * ```
	         * 
	         * 所以在使用parse方法时，每一个串使用字符分隔开。类似于：
	         * 
	         * ```js
	         * dateHelper.parse("2015-11-12","yyyy-MM-dd");
	         * ```
	         * 
	         * @param {String} input  字符串
	         * @param {String} format 格式化字符串
	         * @return {Date}          格式化的日期
	         */
	        this.parse = function (input, format) {
	            if (!input || !format) return;
	            var parts = input.match(/(\d+)/g),
	                i = 0,
	                fmt = {};

	            // extract date-part indexes from the format
	            format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function (part) {
	                fmt[part] = i++;
	            });

	            var year = parts[fmt['yyyy']] || parseInt(parts[fmt['yy']], 10) + this._get2Year(new Date()) || 0,
	                month = parts[fmt['MM']] - 1 || parts[fmt['M']] - 1 || 0,
	                day = parts[fmt['dd']] || parts[fmt['d']] || 0,
	                hour = parts[fmt['HH']] || parts[fmt['H']] || 0,
	                minute = parts[fmt['mm']] || parts[fmt['m']] || 0,
	                second = parts[fmt['ss']] || parts[fmt['s']] || 0;

	            return new Date(year, month, day, hour, minute, second);
	        };
	    }).call(DateHelper.prototype);

	    var dateHelper = new DateHelper();

	    // 将 parseDate 方法绑定在 `String` 原型上
	    String.prototype.parseDate = function (format) {
	        return dateHelper.parse(this, format);
	    };

	    // 将 format 方法绑定在 `Date` 原型上
	    Date.prototype.format = function (format) {
	        return dateHelper.format(this, format);
	    };

	    return dateHelper;
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.DatePicker
	 *
	 * 时间选择器。格式化参照 [`date`](date.js.html)
	 *
	 * 依赖于Hammer.js
	 * 
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root, root.jQuery || root.Zepto, root._, __webpack_require__(10), __webpack_require__(2), __webpack_require__(8));
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.DatePicker = factory(root, root.jQuery || root.Zepto, root._, root.Hammer, Kub.Dialog, Kub.dateHelper);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.DatePicker = factory(root, root.jQuery || root.Zepto, root._, root.Hammer, Kub.Dialog, Kub.dateHelper);
	    }
	}(function (root, $, _, Hammer, Dialog) {
	    "use strict";

	    /**
	     * ## DatePicker Constructor
	     *
	     * DatePicker类
	     *
	     * 使用：
	     * ```js
	     *  //采用默认的format yyyy-MM-dd
	     *  var datepicker = new Kub.DatePicker($("#J_datepicker"));
	     *
	     *  //采用默认的format yyyy-MM-dd
	     *  //可配置title 与 本地化
	     *  var datepicker1 = new Kub.DatePicker($("#J_datepicker1"),{
	     *      title:"Date Picker",
	     *      locale:"en"
	     *  });
	     *   
	     *  //自定义format 
	     *  var datepicker2 = new Kub.DatePicker($("#J_datepicker2"),{
	     *      title:"选择时间",
	     *      format:"yyyy-MM-dd,HH:mm:ss",
	     *      confirm:function(e,datepicker){
	     *          //格式化后的date
	     *          console.log(datepicker.formatDate)
	     *          //原始时间
	     *          console.log(datepicker.date)
	     *          //手动关闭选择器
	     *          datepicker.hide();
	     *      }
	     *  });
	     * ```
	     */

	    var DatePicker = function DatePicker(element, options) {
	        var self = this;
	        this.$element = $(element);
	        this.options = $.extend({}, DatePicker.prototype.defaults, options || {});

	        self._init().hide();

	        this.$element.on("click", function (e) {
	            //使输入框失去焦点
	            self.$element[0].blur();
	            self.dialog.show();

	            //解决 iphone 下，fixed定位问题
	            setTimeout(function () {
	                var $window = $(window);
	                $window.scrollTop($window.scrollTop());
	            }, 5);
	            return false;
	        });
	    };

	    var HEIGHTUNIT = 40,
	        DURATION = 0.5,
	        SHOWCLASS = "kub-datepicker-show",
	        VALUECOLUMNCLASS = ".kub-datepicker-column",
	        VALUETAG = "li",
	        VALUECONTAINERTAG = "ul",

	    //时间选择器模板
	    TEMPLATE = '<div class="kub-datepicker"> <div class="kub-datepicker-column year" data-type="year"> <ul> <li class="kub-datepicker-show"></li> <%for(var i=data.yearRange[0];i<= data.yearRange[1];i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= i%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column month"  data-type="month"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 1;i<=12;i++){%> <li class="kub-datepicker-show" data-value="<%= i-1%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column day"  data-type="day"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 1;i<=31;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column hour"  data-type="hour"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=23;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column minute"  data-type="minute"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=59;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-datepicker-column second"  data-type="second"> <ul> <li class="kub-datepicker-show"></li> <%for(var i= 0;i<=59;i++){%> <li class="kub-datepicker-show" data-value="<%= i%>"><%= (i<10 ? ("0" + i) : i)%></li> <%}%> <li class="kub-datepicker-show"></li> </ul> </div> <div class="kub-overlay"></div> </div> ';

	    ;(function () {
	        this.constructor = DatePicker;

	        /**
	         * ## defaults
	         *
	         * 默认配置项
	         *
	         * 配置项说明：
	         *
	         * * `locale`: 本地化。本地化采用CSS实现。
	         * 
	         * * `title`: 时间选择器弹窗名称。
	         * 
	         * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗，并进行赋值。如果传递，需调用`dialog.close()`手动关闭弹窗，并且需要手动填充输入框。
	         * 
	         * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
	         *
	         * * `format`: 日期格式
	         * 
	         * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
	         *
	         * * `className`: 弹窗类名，不建议修改，会影响样式。
	         * 
	         * * `date`: 默认显示时间
	         * 
	         * * `yearRange`: 年份显示区间
	         */
	        this.defaults = {
	            locale: "zh",
	            title: "选择时间",
	            confirm: null,
	            cancel: null,
	            format: "yyyy-MM-dd",
	            closable: false,
	            className: "kub-datepicker-dialog",
	            date: new Date(),
	            yearRange: [1970, 2100]
	        };

	        this._render = function () {
	            if (this.completed) return;
	            var self = this,
	                options = self.options,
	                html = _.template(TEMPLATE)({
	                data: options
	            });

	            self.dialog = new Dialog({
	                title: options.title,
	                locale: options.locale,
	                message: html,
	                closable: options.closable,
	                className: options.className,
	                animated: false,
	                buttons: [{
	                    text: Dialog.prototype.i18n[options.locale].cancel,
	                    handler: function handler(e, dialog) {
	                        options.cancel ? options.cancel.call(this, e, self) : dialog.hide();
	                    }
	                }, {
	                    text: Dialog.prototype.i18n[options.locale].ok,
	                    handler: function handler(e, dialog) {
	                        self.date = self.getDate();
	                        self.formatDate = self.date.format(options.format);

	                        options.confirm ? options.confirm.call(this, e, self) : function () {
	                            self.$element.val(self.formatDate);
	                            dialog.hide();
	                        }();
	                    }
	                }]
	            });
	            self.completed = true;
	            return self;
	        };

	        this._init = function () {
	            var self = this,
	                options = self.options;

	            //创建对话框
	            self._render();

	            self.ui = {
	                year: self.dialog.$element.find(".year"),
	                month: self.dialog.$element.find(".month"),
	                day: self.dialog.$element.find(".day"),
	                hour: self.dialog.$element.find(".hour"),
	                minute: self.dialog.$element.find(".minute"),
	                second: self.dialog.$element.find(".second")
	            };

	            options.format.indexOf("y") === -1 && self.ui.year.empty().remove();
	            options.format.indexOf("M") === -1 && self.ui.month.empty().remove();
	            options.format.indexOf("d") === -1 && self.ui.day.empty().remove();
	            options.format.indexOf("H") === -1 && self.ui.hour.empty().remove();
	            options.format.indexOf("m") === -1 && self.ui.minute.empty().remove();
	            options.format.indexOf("s") === -1 && self.ui.second.empty().remove();

	            //设置本地化
	            self.dialog.$element.addClass("kub-datepicker-" + options.locale);

	            //监听每个元素的滚动事件           
	            self.ui.columns = self.dialog.$element.find(VALUECOLUMNCLASS).each(function () {
	                var $handler = $(this),
	                    hammer = new Hammer($handler[0]);
	                //监听拖动开始事件
	                hammer.get("pan").set({
	                    threshold: 0
	                });
	                hammer.on("panstart", function (event) {
	                    self.ui.currentScrollHandler = $handler;
	                    event.preventDefault();
	                });
	            });

	            HEIGHTUNIT = self.ui.columns.find(VALUETAG).eq(0).height();

	            //设置默认时间
	            self.setDate(options.date);
	            //验证是否存在31天
	            self._setDays(options.date.getFullYear(), options.date.getMonth());

	            //注册全局拖动事件，注册在每一列，会导致拖动不流畅
	            self._registerGlobalScroll();

	            return self;
	        };

	        this._cacheData = function ($this, index) {
	            $this[0].y = index * HEIGHTUNIT;
	            $this[0].index = Math.abs(index);
	            return this;
	        };

	        this._registerGlobalScroll = function () {
	            var self = this,
	                options = self.options,
	                hammer = new Hammer(self.dialog.$element[0]),
	                $handler,
	                index,
	                y,
	                shouldSetDays;

	            //监听拖动开始事件
	            hammer.get("pan").set({
	                threshold: 0
	            });
	            hammer.on("panstart", function (event) {
	                if (self.ui.currentScrollHandler !== $handler) {
	                    $handler = self.ui.currentScrollHandler;
	                    //决定是否设置天数，由于年份与月份决定每月的天数
	                    shouldSetDays = $handler.hasClass("month") || $handler.hasClass("year");
	                    index = 0;
	                    y = $handler[0].y;
	                }
	                event.preventDefault();
	            }).on("panmove", function (event) {
	                $handler && self.setTranslate($handler, 0, y + event.deltaY + "px", 0);
	                event.preventDefault();
	            }).on("panend", function (event) {
	                if ($handler) {
	                    index = -self._getIndex(y + event.deltaY, HEIGHTUNIT, $handler.find("." + SHOWCLASS).length);

	                    self._cacheData($handler, index);

	                    self.setTranslate($handler, 0, $handler[0].y + "px", DURATION);

	                    shouldSetDays && self._setDays(self.getValue("year"), self.getValue("month"));
	                }
	                //结束以后将当前滚动元素至空
	                self.ui.currentScrollHandler = $handler = null;
	                event.preventDefault();
	            });
	            return self;
	        };

	        this._getIndex = function (y, height, max) {
	            //去掉空白的两行
	            max = max - 3;
	            y = y > 0 ? 0 : y;
	            var index = Math.round(Math.abs(y) / height);
	            return index > max ? max : index;
	        };

	        this.setTranslate = function ($this, x, y, duration) {
	            ($this[0].$container ? $this[0].$container : $this[0].$container = $this.find(VALUECONTAINERTAG)).css({
	                "-webkit-transform": "translate(0," + y + ")",
	                transform: "translate(0," + y + ")"
	            });
	            return this;
	        };

	        this._setDays = function (year, month) {
	            var self = this,
	                days = self.getDays(year, month),
	                day = self.getValue("day"),
	                $valueTags = self.ui.day.find(VALUETAG);

	            //移除不在本月的日期
	            $valueTags.addClass(SHOWCLASS).slice(days + 1, $valueTags.length - 1).removeClass(SHOWCLASS);
	            days < day && self.setValue("day", days);
	            return self;
	        };

	        this.getDays = function (year, month) {
	            return new Date(year, month + 1, 0).getDate();
	        };

	        /**
	         * ## setDate
	         *
	         * 设置时间选择器时间
	         * 
	         * @param {Date} date 时间
	         * @return {instance} 当前实例
	         */
	        this.setDate = function (date) {
	            var self = this;
	            ["year", "month", "day", "hour", "minute", "second"].forEach(function (type) {
	                switch (type) {
	                    case "year":
	                        self.setValue(type, date.getFullYear());
	                        break;
	                    case "month":
	                        self.setValue(type, date.getMonth());
	                        break;
	                    case "day":
	                        self.setValue(type, date.getDate());
	                        break;
	                    case "hour":
	                        self.setValue(type, date.getHours());
	                        break;
	                    case "minute":
	                        self.setValue(type, date.getMinutes());
	                        break;
	                    case "second":
	                        self.setValue(type, date.getSeconds());
	                        break;
	                }
	            });
	            return self;
	        };

	        /**
	         * ## getDate
	         *
	         * 获取时间选择器选择的时间
	         * 
	         * @param {Date} date 时间
	         * @return {Date} 获取到的时间
	         */
	        this.getDate = function () {
	            var self = this,
	                options = self.options,
	                values = {
	                year: self.getValue("year"),
	                month: self.getValue("month"),
	                day: self.getValue("day"),
	                hour: self.getValue("hour"),
	                minute: self.getValue("minute"),
	                second: self.getValue("second")
	            };

	            return new Date(values.year, values.month, values.day, values.hour, values.minute, values.second);
	        };

	        /**
	         *
	         * 设置时间选择器中某一列的值，可设置年、月、日、时、分、秒的值
	         *
	         * @param {String} name 对应列的名称（year,month,day,hour,minute,second）
	         * @param {String} value 值
	         * @return {instance} 当前实例
	         */
	        this.setValue = function (name, value) {
	            var $this = this.ui[name],
	                index;

	            index = -($this.find(VALUETAG + '[data-value="' + value + '"]').index() - 1);
	            this._cacheData($this, index);
	            this.setTranslate($this, 0, $this[0].y + "px", 0);

	            return this;
	        };

	        /**
	         *
	         * 获取时间选择器中某一列的值，可获取年、月、日、时、分、秒的值
	         * 
	         * @param {String} name 对应列的名称（year,month,day,hour,minute,second）
	         * @return {Number} 某一列的值
	         */
	        this.getValue = function (name) {
	            var $this = this.ui[name],
	                $valueTags = $this.find(VALUETAG);

	            return $valueTags.length ? parseInt($valueTags.eq($this[0].index + 1).attr("data-value")) : 0;
	        };

	        /**
	         * ## close
	         *
	         * 关闭时间选择器
	         * @return {instance} 当前实例
	         */
	        this.close = function () {
	            this.dialog.close();
	            return this;
	        };

	        /**
	         * ## show
	         *
	         * 显示时间选择器
	         * @return {instance} 当前实例
	         */
	        this.show = function () {
	            this.dialog.show();
	            return this;
	        };

	        /**
	         * ## hide
	         *
	         * 隐藏时间选择器
	         * @return {instance} 当前实例
	         */
	        this.hide = function () {
	            this.dialog.hide();
	            return this;
	        };
	    }).call(DatePicker.prototype);

	    return DatePicker;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*! Hammer.JS - v2.0.4 - 2014-09-28
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2014 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function (window, document, exportName, undefined) {
	    'use strict';

	    var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
	    var TEST_ELEMENT = document.createElement('div');

	    var TYPE_FUNCTION = 'function';

	    var round = Math.round;
	    var abs = Math.abs;
	    var now = Date.now;

	    /**
	     * set a timeout with a given scope
	     * @param {Function} fn
	     * @param {Number} timeout
	     * @param {Object} context
	     * @returns {number}
	     */
	    function setTimeoutContext(fn, timeout, context) {
	        return setTimeout(bindFn(fn, context), timeout);
	    }

	    /**
	     * if the argument is an array, we want to execute the fn on each entry
	     * if it aint an array we don't want to do a thing.
	     * this is used by all the methods that accept a single and array argument.
	     * @param {*|Array} arg
	     * @param {String} fn
	     * @param {Object} [context]
	     * @returns {Boolean}
	     */
	    function invokeArrayArg(arg, fn, context) {
	        if (Array.isArray(arg)) {
	            each(arg, context[fn], context);
	            return true;
	        }
	        return false;
	    }

	    /**
	     * walk objects and arrays
	     * @param {Object} obj
	     * @param {Function} iterator
	     * @param {Object} context
	     */
	    function each(obj, iterator, context) {
	        var i;

	        if (!obj) {
	            return;
	        }

	        if (obj.forEach) {
	            obj.forEach(iterator, context);
	        } else if (obj.length !== undefined) {
	            i = 0;
	            while (i < obj.length) {
	                iterator.call(context, obj[i], i, obj);
	                i++;
	            }
	        } else {
	            for (i in obj) {
	                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	            }
	        }
	    }

	    /**
	     * extend object.
	     * means that properties in dest will be overwritten by the ones in src.
	     * @param {Object} dest
	     * @param {Object} src
	     * @param {Boolean} [merge]
	     * @returns {Object} dest
	     */
	    function extend(dest, src, merge) {
	        var keys = Object.keys(src);
	        var i = 0;
	        while (i < keys.length) {
	            if (!merge || merge && dest[keys[i]] === undefined) {
	                dest[keys[i]] = src[keys[i]];
	            }
	            i++;
	        }
	        return dest;
	    }

	    /**
	     * merge the values from src in the dest.
	     * means that properties that exist in dest will not be overwritten by src
	     * @param {Object} dest
	     * @param {Object} src
	     * @returns {Object} dest
	     */
	    function merge(dest, src) {
	        return extend(dest, src, true);
	    }

	    /**
	     * simple class inheritance
	     * @param {Function} child
	     * @param {Function} base
	     * @param {Object} [properties]
	     */
	    function inherit(child, base, properties) {
	        var baseP = base.prototype,
	            childP;

	        childP = child.prototype = Object.create(baseP);
	        childP.constructor = child;
	        childP._super = baseP;

	        if (properties) {
	            extend(childP, properties);
	        }
	    }

	    /**
	     * simple function bind
	     * @param {Function} fn
	     * @param {Object} context
	     * @returns {Function}
	     */
	    function bindFn(fn, context) {
	        return function boundFn() {
	            return fn.apply(context, arguments);
	        };
	    }

	    /**
	     * let a boolean value also be a function that must return a boolean
	     * this first item in args will be used as the context
	     * @param {Boolean|Function} val
	     * @param {Array} [args]
	     * @returns {Boolean}
	     */
	    function boolOrFn(val, args) {
	        if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) == TYPE_FUNCTION) {
	            return val.apply(args ? args[0] || undefined : undefined, args);
	        }
	        return val;
	    }

	    /**
	     * use the val2 when val1 is undefined
	     * @param {*} val1
	     * @param {*} val2
	     * @returns {*}
	     */
	    function ifUndefined(val1, val2) {
	        return val1 === undefined ? val2 : val1;
	    }

	    /**
	     * addEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function addEventListeners(target, types, handler) {
	        each(splitStr(types), function (type) {
	            target.addEventListener(type, handler, false);
	        });
	    }

	    /**
	     * removeEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function removeEventListeners(target, types, handler) {
	        each(splitStr(types), function (type) {
	            target.removeEventListener(type, handler, false);
	        });
	    }

	    /**
	     * find if a node is in the given parent
	     * @method hasParent
	     * @param {HTMLElement} node
	     * @param {HTMLElement} parent
	     * @return {Boolean} found
	     */
	    function hasParent(node, parent) {
	        while (node) {
	            if (node == parent) {
	                return true;
	            }
	            node = node.parentNode;
	        }
	        return false;
	    }

	    /**
	     * small indexOf wrapper
	     * @param {String} str
	     * @param {String} find
	     * @returns {Boolean} found
	     */
	    function inStr(str, find) {
	        return str.indexOf(find) > -1;
	    }

	    /**
	     * split string on whitespace
	     * @param {String} str
	     * @returns {Array} words
	     */
	    function splitStr(str) {
	        return str.trim().split(/\s+/g);
	    }

	    /**
	     * find if a array contains the object using indexOf or a simple polyFill
	     * @param {Array} src
	     * @param {String} find
	     * @param {String} [findByKey]
	     * @return {Boolean|Number} false when not found, or the index
	     */
	    function inArray(src, find, findByKey) {
	        if (src.indexOf && !findByKey) {
	            return src.indexOf(find);
	        } else {
	            var i = 0;
	            while (i < src.length) {
	                if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
	                    return i;
	                }
	                i++;
	            }
	            return -1;
	        }
	    }

	    /**
	     * convert array-like objects to real arrays
	     * @param {Object} obj
	     * @returns {Array}
	     */
	    function toArray(obj) {
	        return Array.prototype.slice.call(obj, 0);
	    }

	    /**
	     * unique array with objects based on a key (like 'id') or just by the array's value
	     * @param {Array} src [{id:1},{id:2},{id:1}]
	     * @param {String} [key]
	     * @param {Boolean} [sort=False]
	     * @returns {Array} [{id:1},{id:2}]
	     */
	    function uniqueArray(src, key, sort) {
	        var results = [];
	        var values = [];
	        var i = 0;

	        while (i < src.length) {
	            var val = key ? src[i][key] : src[i];
	            if (inArray(values, val) < 0) {
	                results.push(src[i]);
	            }
	            values[i] = val;
	            i++;
	        }

	        if (sort) {
	            if (!key) {
	                results = results.sort();
	            } else {
	                results = results.sort(function sortUniqueArray(a, b) {
	                    return a[key] > b[key];
	                });
	            }
	        }

	        return results;
	    }

	    /**
	     * get the prefixed property
	     * @param {Object} obj
	     * @param {String} property
	     * @returns {String|Undefined} prefixed
	     */
	    function prefixed(obj, property) {
	        var prefix, prop;
	        var camelProp = property[0].toUpperCase() + property.slice(1);

	        var i = 0;
	        while (i < VENDOR_PREFIXES.length) {
	            prefix = VENDOR_PREFIXES[i];
	            prop = prefix ? prefix + camelProp : property;

	            if (prop in obj) {
	                return prop;
	            }
	            i++;
	        }
	        return undefined;
	    }

	    /**
	     * get a unique id
	     * @returns {number} uniqueId
	     */
	    var _uniqueId = 1;
	    function uniqueId() {
	        return _uniqueId++;
	    }

	    /**
	     * get the window object of an element
	     * @param {HTMLElement} element
	     * @returns {DocumentView|Window}
	     */
	    function getWindowForElement(element) {
	        var doc = element.ownerDocument;
	        return doc.defaultView || doc.parentWindow;
	    }

	    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	    var SUPPORT_TOUCH = 'ontouchstart' in window;
	    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	    var INPUT_TYPE_TOUCH = 'touch';
	    var INPUT_TYPE_PEN = 'pen';
	    var INPUT_TYPE_MOUSE = 'mouse';
	    var INPUT_TYPE_KINECT = 'kinect';

	    var COMPUTE_INTERVAL = 25;

	    var INPUT_START = 1;
	    var INPUT_MOVE = 2;
	    var INPUT_END = 4;
	    var INPUT_CANCEL = 8;

	    var DIRECTION_NONE = 1;
	    var DIRECTION_LEFT = 2;
	    var DIRECTION_RIGHT = 4;
	    var DIRECTION_UP = 8;
	    var DIRECTION_DOWN = 16;

	    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	    var PROPS_XY = ['x', 'y'];
	    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	    /**
	     * create new input type manager
	     * @param {Manager} manager
	     * @param {Function} callback
	     * @returns {Input}
	     * @constructor
	     */
	    function Input(manager, callback) {
	        var self = this;
	        this.manager = manager;
	        this.callback = callback;
	        this.element = manager.element;
	        this.target = manager.options.inputTarget;

	        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	        // so when disabled the input events are completely bypassed.
	        this.domHandler = function (ev) {
	            if (boolOrFn(manager.options.enable, [manager])) {
	                self.handler(ev);
	            }
	        };

	        this.init();
	    }

	    Input.prototype = {
	        /**
	         * should handle the inputEvent data and trigger the callback
	         * @virtual
	         */
	        handler: function handler() {},

	        /**
	         * bind the events
	         */
	        init: function init() {
	            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        },

	        /**
	         * unbind the events
	         */
	        destroy: function destroy() {
	            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        }
	    };

	    /**
	     * create new input type manager
	     * called by the Manager constructor
	     * @param {Hammer} manager
	     * @returns {Input}
	     */
	    function createInputInstance(manager) {
	        var Type;
	        var inputClass = manager.options.inputClass;

	        if (inputClass) {
	            Type = inputClass;
	        } else if (SUPPORT_POINTER_EVENTS) {
	            Type = PointerEventInput;
	        } else if (SUPPORT_ONLY_TOUCH) {
	            Type = TouchInput;
	        } else if (!SUPPORT_TOUCH) {
	            Type = MouseInput;
	        } else {
	            Type = TouchMouseInput;
	        }
	        return new Type(manager, inputHandler);
	    }

	    /**
	     * handle input events
	     * @param {Manager} manager
	     * @param {String} eventType
	     * @param {Object} input
	     */
	    function inputHandler(manager, eventType, input) {
	        var pointersLen = input.pointers.length;
	        var changedPointersLen = input.changedPointers.length;
	        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
	        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;

	        input.isFirst = !!isFirst;
	        input.isFinal = !!isFinal;

	        if (isFirst) {
	            manager.session = {};
	        }

	        // source event is the normalized value of the domEvents
	        // like 'touchstart, mouseup, pointerdown'
	        input.eventType = eventType;

	        // compute scale, rotation etc
	        computeInputData(manager, input);

	        // emit secret event
	        manager.emit('hammer.input', input);

	        manager.recognize(input);
	        manager.session.prevInput = input;
	    }

	    /**
	     * extend the data with some usable properties like scale, rotate, velocity etc
	     * @param {Object} manager
	     * @param {Object} input
	     */
	    function computeInputData(manager, input) {
	        var session = manager.session;
	        var pointers = input.pointers;
	        var pointersLength = pointers.length;

	        // store the first input to calculate the distance and direction
	        if (!session.firstInput) {
	            session.firstInput = simpleCloneInputData(input);
	        }

	        // to compute scale and rotation we need to store the multiple touches
	        if (pointersLength > 1 && !session.firstMultiple) {
	            session.firstMultiple = simpleCloneInputData(input);
	        } else if (pointersLength === 1) {
	            session.firstMultiple = false;
	        }

	        var firstInput = session.firstInput;
	        var firstMultiple = session.firstMultiple;
	        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	        var center = input.center = getCenter(pointers);
	        input.timeStamp = now();
	        input.deltaTime = input.timeStamp - firstInput.timeStamp;

	        input.angle = getAngle(offsetCenter, center);
	        input.distance = getDistance(offsetCenter, center);

	        computeDeltaXY(session, input);
	        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	        computeIntervalInputData(session, input);

	        // find the correct target
	        var target = manager.element;
	        if (hasParent(input.srcEvent.target, target)) {
	            target = input.srcEvent.target;
	        }
	        input.target = target;
	    }

	    function computeDeltaXY(session, input) {
	        var center = input.center;
	        var offset = session.offsetDelta || {};
	        var prevDelta = session.prevDelta || {};
	        var prevInput = session.prevInput || {};

	        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	            prevDelta = session.prevDelta = {
	                x: prevInput.deltaX || 0,
	                y: prevInput.deltaY || 0
	            };

	            offset = session.offsetDelta = {
	                x: center.x,
	                y: center.y
	            };
	        }

	        input.deltaX = prevDelta.x + (center.x - offset.x);
	        input.deltaY = prevDelta.y + (center.y - offset.y);
	    }

	    /**
	     * velocity is calculated every x ms
	     * @param {Object} session
	     * @param {Object} input
	     */
	    function computeIntervalInputData(session, input) {
	        var last = session.lastInterval || input,
	            deltaTime = input.timeStamp - last.timeStamp,
	            velocity,
	            velocityX,
	            velocityY,
	            direction;

	        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	            var deltaX = last.deltaX - input.deltaX;
	            var deltaY = last.deltaY - input.deltaY;

	            var v = getVelocity(deltaTime, deltaX, deltaY);
	            velocityX = v.x;
	            velocityY = v.y;
	            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
	            direction = getDirection(deltaX, deltaY);

	            session.lastInterval = input;
	        } else {
	            // use latest velocity info if it doesn't overtake a minimum period
	            velocity = last.velocity;
	            velocityX = last.velocityX;
	            velocityY = last.velocityY;
	            direction = last.direction;
	        }

	        input.velocity = velocity;
	        input.velocityX = velocityX;
	        input.velocityY = velocityY;
	        input.direction = direction;
	    }

	    /**
	     * create a simple clone from the input used for storage of firstInput and firstMultiple
	     * @param {Object} input
	     * @returns {Object} clonedInputData
	     */
	    function simpleCloneInputData(input) {
	        // make a simple copy of the pointers because we will get a reference if we don't
	        // we only need clientXY for the calculations
	        var pointers = [];
	        var i = 0;
	        while (i < input.pointers.length) {
	            pointers[i] = {
	                clientX: round(input.pointers[i].clientX),
	                clientY: round(input.pointers[i].clientY)
	            };
	            i++;
	        }

	        return {
	            timeStamp: now(),
	            pointers: pointers,
	            center: getCenter(pointers),
	            deltaX: input.deltaX,
	            deltaY: input.deltaY
	        };
	    }

	    /**
	     * get the center of all the pointers
	     * @param {Array} pointers
	     * @return {Object} center contains `x` and `y` properties
	     */
	    function getCenter(pointers) {
	        var pointersLength = pointers.length;

	        // no need to loop when only one touch
	        if (pointersLength === 1) {
	            return {
	                x: round(pointers[0].clientX),
	                y: round(pointers[0].clientY)
	            };
	        }

	        var x = 0,
	            y = 0,
	            i = 0;
	        while (i < pointersLength) {
	            x += pointers[i].clientX;
	            y += pointers[i].clientY;
	            i++;
	        }

	        return {
	            x: round(x / pointersLength),
	            y: round(y / pointersLength)
	        };
	    }

	    /**
	     * calculate the velocity between two points. unit is in px per ms.
	     * @param {Number} deltaTime
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Object} velocity `x` and `y`
	     */
	    function getVelocity(deltaTime, x, y) {
	        return {
	            x: x / deltaTime || 0,
	            y: y / deltaTime || 0
	        };
	    }

	    /**
	     * get the direction between two points
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Number} direction
	     */
	    function getDirection(x, y) {
	        if (x === y) {
	            return DIRECTION_NONE;
	        }

	        if (abs(x) >= abs(y)) {
	            return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	        }
	        return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
	    }

	    /**
	     * calculate the absolute distance between two points
	     * @param {Object} p1 {x, y}
	     * @param {Object} p2 {x, y}
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} distance
	     */
	    function getDistance(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];

	        return Math.sqrt(x * x + y * y);
	    }

	    /**
	     * calculate the angle between two coordinates
	     * @param {Object} p1
	     * @param {Object} p2
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} angle
	     */
	    function getAngle(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];
	        return Math.atan2(y, x) * 180 / Math.PI;
	    }

	    /**
	     * calculate the rotation degrees between two pointersets
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} rotation
	     */
	    function getRotation(start, end) {
	        return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
	    }

	    /**
	     * calculate the scale factor between two pointersets
	     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} scale
	     */
	    function getScale(start, end) {
	        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	    }

	    var MOUSE_INPUT_MAP = {
	        mousedown: INPUT_START,
	        mousemove: INPUT_MOVE,
	        mouseup: INPUT_END
	    };

	    var MOUSE_ELEMENT_EVENTS = 'mousedown';
	    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	    /**
	     * Mouse events input
	     * @constructor
	     * @extends Input
	     */
	    function MouseInput() {
	        this.evEl = MOUSE_ELEMENT_EVENTS;
	        this.evWin = MOUSE_WINDOW_EVENTS;

	        this.allow = true; // used by Input.TouchMouse to disable mouse events
	        this.pressed = false; // mousedown state

	        Input.apply(this, arguments);
	    }

	    inherit(MouseInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function MEhandler(ev) {
	            var eventType = MOUSE_INPUT_MAP[ev.type];

	            // on start we want to have the left mouse button down
	            if (eventType & INPUT_START && ev.button === 0) {
	                this.pressed = true;
	            }

	            if (eventType & INPUT_MOVE && ev.which !== 1) {
	                eventType = INPUT_END;
	            }

	            // mouse must be down, and mouse events are allowed (see the TouchMouse input)
	            if (!this.pressed || !this.allow) {
	                return;
	            }

	            if (eventType & INPUT_END) {
	                this.pressed = false;
	            }

	            this.callback(this.manager, eventType, {
	                pointers: [ev],
	                changedPointers: [ev],
	                pointerType: INPUT_TYPE_MOUSE,
	                srcEvent: ev
	            });
	        }
	    });

	    var POINTER_INPUT_MAP = {
	        pointerdown: INPUT_START,
	        pointermove: INPUT_MOVE,
	        pointerup: INPUT_END,
	        pointercancel: INPUT_CANCEL,
	        pointerout: INPUT_CANCEL
	    };

	    // in IE10 the pointer types is defined as an enum
	    var IE10_POINTER_TYPE_ENUM = {
	        2: INPUT_TYPE_TOUCH,
	        3: INPUT_TYPE_PEN,
	        4: INPUT_TYPE_MOUSE,
	        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	    };

	    var POINTER_ELEMENT_EVENTS = 'pointerdown';
	    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	    // IE10 has prefixed support, and case-sensitive
	    if (window.MSPointerEvent) {
	        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	    }

	    /**
	     * Pointer events input
	     * @constructor
	     * @extends Input
	     */
	    function PointerEventInput() {
	        this.evEl = POINTER_ELEMENT_EVENTS;
	        this.evWin = POINTER_WINDOW_EVENTS;

	        Input.apply(this, arguments);

	        this.store = this.manager.session.pointerEvents = [];
	    }

	    inherit(PointerEventInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function PEhandler(ev) {
	            var store = this.store;
	            var removePointer = false;

	            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	            var isTouch = pointerType == INPUT_TYPE_TOUCH;

	            // get index of the event in the store
	            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	            // start and mouse must be down
	            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	                if (storeIndex < 0) {
	                    store.push(ev);
	                    storeIndex = store.length - 1;
	                }
	            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	                removePointer = true;
	            }

	            // it not found, so the pointer hasn't been down (so it's probably a hover)
	            if (storeIndex < 0) {
	                return;
	            }

	            // update the event in the store
	            store[storeIndex] = ev;

	            this.callback(this.manager, eventType, {
	                pointers: store,
	                changedPointers: [ev],
	                pointerType: pointerType,
	                srcEvent: ev
	            });

	            if (removePointer) {
	                // remove from the store
	                store.splice(storeIndex, 1);
	            }
	        }
	    });

	    var SINGLE_TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Touch events input
	     * @constructor
	     * @extends Input
	     */
	    function SingleTouchInput() {
	        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	        this.started = false;

	        Input.apply(this, arguments);
	    }

	    inherit(SingleTouchInput, Input, {
	        handler: function TEhandler(ev) {
	            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	            // should we handle the touch events?
	            if (type === INPUT_START) {
	                this.started = true;
	            }

	            if (!this.started) {
	                return;
	            }

	            var touches = normalizeSingleTouches.call(this, ev, type);

	            // when done, reset the started state
	            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	                this.started = false;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function normalizeSingleTouches(ev, type) {
	        var all = toArray(ev.touches);
	        var changed = toArray(ev.changedTouches);

	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            all = uniqueArray(all.concat(changed), 'identifier', true);
	        }

	        return [all, changed];
	    }

	    var TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Multi-user touch events input
	     * @constructor
	     * @extends Input
	     */
	    function TouchInput() {
	        this.evTarget = TOUCH_TARGET_EVENTS;
	        this.targetIds = {};

	        Input.apply(this, arguments);
	    }

	    inherit(TouchInput, Input, {
	        handler: function MTEhandler(ev) {
	            var type = TOUCH_INPUT_MAP[ev.type];
	            var touches = getTouches.call(this, ev, type);
	            if (!touches) {
	                return;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function getTouches(ev, type) {
	        var allTouches = toArray(ev.touches);
	        var targetIds = this.targetIds;

	        // when there is only one touch, the process can be simplified
	        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	            targetIds[allTouches[0].identifier] = true;
	            return [allTouches, allTouches];
	        }

	        var i,
	            targetTouches,
	            changedTouches = toArray(ev.changedTouches),
	            changedTargetTouches = [],
	            target = this.target;

	        // get target touches from touches
	        targetTouches = allTouches.filter(function (touch) {
	            return hasParent(touch.target, target);
	        });

	        // collect touches
	        if (type === INPUT_START) {
	            i = 0;
	            while (i < targetTouches.length) {
	                targetIds[targetTouches[i].identifier] = true;
	                i++;
	            }
	        }

	        // filter changed touches to only contain touches that exist in the collected target ids
	        i = 0;
	        while (i < changedTouches.length) {
	            if (targetIds[changedTouches[i].identifier]) {
	                changedTargetTouches.push(changedTouches[i]);
	            }

	            // cleanup removed touches
	            if (type & (INPUT_END | INPUT_CANCEL)) {
	                delete targetIds[changedTouches[i].identifier];
	            }
	            i++;
	        }

	        if (!changedTargetTouches.length) {
	            return;
	        }

	        return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
	    }

	    /**
	     * Combined touch and mouse input
	     *
	     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	     * This because touch devices also emit mouse events while doing a touch.
	     *
	     * @constructor
	     * @extends Input
	     */
	    function TouchMouseInput() {
	        Input.apply(this, arguments);

	        var handler = bindFn(this.handler, this);
	        this.touch = new TouchInput(this.manager, handler);
	        this.mouse = new MouseInput(this.manager, handler);
	    }

	    inherit(TouchMouseInput, Input, {
	        /**
	         * handle mouse and touch events
	         * @param {Hammer} manager
	         * @param {String} inputEvent
	         * @param {Object} inputData
	         */
	        handler: function TMEhandler(manager, inputEvent, inputData) {
	            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
	                isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

	            // when we're in a touch event, so  block all upcoming mouse events
	            // most mobile browser also emit mouseevents, right after touchstart
	            if (isTouch) {
	                this.mouse.allow = false;
	            } else if (isMouse && !this.mouse.allow) {
	                return;
	            }

	            // reset the allowMouse when we're done
	            if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
	                this.mouse.allow = true;
	            }

	            this.callback(manager, inputEvent, inputData);
	        },

	        /**
	         * remove the event listeners
	         */
	        destroy: function destroy() {
	            this.touch.destroy();
	            this.mouse.destroy();
	        }
	    });

	    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	    // magical touchAction value
	    var TOUCH_ACTION_COMPUTE = 'compute';
	    var TOUCH_ACTION_AUTO = 'auto';
	    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	    var TOUCH_ACTION_NONE = 'none';
	    var TOUCH_ACTION_PAN_X = 'pan-x';
	    var TOUCH_ACTION_PAN_Y = 'pan-y';

	    /**
	     * Touch Action
	     * sets the touchAction property or uses the js alternative
	     * @param {Manager} manager
	     * @param {String} value
	     * @constructor
	     */
	    function TouchAction(manager, value) {
	        this.manager = manager;
	        this.set(value);
	    }

	    TouchAction.prototype = {
	        /**
	         * set the touchAction value on the element or enable the polyfill
	         * @param {String} value
	         */
	        set: function set(value) {
	            // find out the touch-action by the event handlers
	            if (value == TOUCH_ACTION_COMPUTE) {
	                value = this.compute();
	            }

	            if (NATIVE_TOUCH_ACTION) {
	                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	            }
	            this.actions = value.toLowerCase().trim();
	        },

	        /**
	         * just re-set the touchAction value
	         */
	        update: function update() {
	            this.set(this.manager.options.touchAction);
	        },

	        /**
	         * compute the value for the touchAction property based on the recognizer's settings
	         * @returns {String} value
	         */
	        compute: function compute() {
	            var actions = [];
	            each(this.manager.recognizers, function (recognizer) {
	                if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                    actions = actions.concat(recognizer.getTouchAction());
	                }
	            });
	            return cleanTouchActions(actions.join(' '));
	        },

	        /**
	         * this method is called on each input cycle and provides the preventing of the browser behavior
	         * @param {Object} input
	         */
	        preventDefaults: function preventDefaults(input) {
	            // not needed with native support for the touchAction property
	            if (NATIVE_TOUCH_ACTION) {
	                return;
	            }

	            var srcEvent = input.srcEvent;
	            var direction = input.offsetDirection;

	            // if the touch action did prevented once this session
	            if (this.manager.session.prevented) {
	                srcEvent.preventDefault();
	                return;
	            }

	            var actions = this.actions;
	            var hasNone = inStr(actions, TOUCH_ACTION_NONE);
	            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
	            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

	            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
	                return this.preventSrc(srcEvent);
	            }
	        },

	        /**
	         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	         * @param {Object} srcEvent
	         */
	        preventSrc: function preventSrc(srcEvent) {
	            this.manager.session.prevented = true;
	            srcEvent.preventDefault();
	        }
	    };

	    /**
	     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	     * @param {String} actions
	     * @returns {*}
	     */
	    function cleanTouchActions(actions) {
	        // none
	        if (inStr(actions, TOUCH_ACTION_NONE)) {
	            return TOUCH_ACTION_NONE;
	        }

	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	        // pan-x and pan-y can be combined
	        if (hasPanX && hasPanY) {
	            return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
	        }

	        // pan-x OR pan-y
	        if (hasPanX || hasPanY) {
	            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	        }

	        // manipulation
	        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	            return TOUCH_ACTION_MANIPULATION;
	        }

	        return TOUCH_ACTION_AUTO;
	    }

	    /**
	     * Recognizer flow explained; *
	     * All recognizers have the initial state of POSSIBLE when a input session starts.
	     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	     * Example session for mouse-input: mousedown -> mousemove -> mouseup
	     *
	     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	     * which determines with state it should be.
	     *
	     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	     * POSSIBLE to give it another change on the next cycle.
	     *
	     *               Possible
	     *                  |
	     *            +-----+---------------+
	     *            |                     |
	     *      +-----+-----+               |
	     *      |           |               |
	     *   Failed      Cancelled          |
	     *                          +-------+------+
	     *                          |              |
	     *                      Recognized       Began
	     *                                         |
	     *                                      Changed
	     *                                         |
	     *                                  Ended/Recognized
	     */
	    var STATE_POSSIBLE = 1;
	    var STATE_BEGAN = 2;
	    var STATE_CHANGED = 4;
	    var STATE_ENDED = 8;
	    var STATE_RECOGNIZED = STATE_ENDED;
	    var STATE_CANCELLED = 16;
	    var STATE_FAILED = 32;

	    /**
	     * Recognizer
	     * Every recognizer needs to extend from this class.
	     * @constructor
	     * @param {Object} options
	     */
	    function Recognizer(options) {
	        this.id = uniqueId();

	        this.manager = null;
	        this.options = merge(options || {}, this.defaults);

	        // default is enable true
	        this.options.enable = ifUndefined(this.options.enable, true);

	        this.state = STATE_POSSIBLE;

	        this.simultaneous = {};
	        this.requireFail = [];
	    }

	    Recognizer.prototype = {
	        /**
	         * @virtual
	         * @type {Object}
	         */
	        defaults: {},

	        /**
	         * set options
	         * @param {Object} options
	         * @return {Recognizer}
	         */
	        set: function set(options) {
	            extend(this.options, options);

	            // also update the touchAction, in case something changed about the directions/enabled state
	            this.manager && this.manager.touchAction.update();
	            return this;
	        },

	        /**
	         * recognize simultaneous with an other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        recognizeWith: function recognizeWith(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	                return this;
	            }

	            var simultaneous = this.simultaneous;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (!simultaneous[otherRecognizer.id]) {
	                simultaneous[otherRecognizer.id] = otherRecognizer;
	                otherRecognizer.recognizeWith(this);
	            }
	            return this;
	        },

	        /**
	         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRecognizeWith: function dropRecognizeWith(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            delete this.simultaneous[otherRecognizer.id];
	            return this;
	        },

	        /**
	         * recognizer can only run when an other is failing
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        requireFailure: function requireFailure(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	                return this;
	            }

	            var requireFail = this.requireFail;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (inArray(requireFail, otherRecognizer) === -1) {
	                requireFail.push(otherRecognizer);
	                otherRecognizer.requireFailure(this);
	            }
	            return this;
	        },

	        /**
	         * drop the requireFailure link. it does not remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRequireFailure: function dropRequireFailure(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            var index = inArray(this.requireFail, otherRecognizer);
	            if (index > -1) {
	                this.requireFail.splice(index, 1);
	            }
	            return this;
	        },

	        /**
	         * has require failures boolean
	         * @returns {boolean}
	         */
	        hasRequireFailures: function hasRequireFailures() {
	            return this.requireFail.length > 0;
	        },

	        /**
	         * if the recognizer can recognize simultaneous with an other recognizer
	         * @param {Recognizer} otherRecognizer
	         * @returns {Boolean}
	         */
	        canRecognizeWith: function canRecognizeWith(otherRecognizer) {
	            return !!this.simultaneous[otherRecognizer.id];
	        },

	        /**
	         * You should use `tryEmit` instead of `emit` directly to check
	         * that all the needed recognizers has failed before emitting.
	         * @param {Object} input
	         */
	        emit: function emit(input) {
	            var self = this;
	            var state = this.state;

	            function emit(withState) {
	                self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
	            }

	            // 'panstart' and 'panmove'
	            if (state < STATE_ENDED) {
	                emit(true);
	            }

	            emit(); // simple 'eventName' events

	            // panend and pancancel
	            if (state >= STATE_ENDED) {
	                emit(true);
	            }
	        },

	        /**
	         * Check that all the require failure recognizers has failed,
	         * if true, it emits a gesture event,
	         * otherwise, setup the state to FAILED.
	         * @param {Object} input
	         */
	        tryEmit: function tryEmit(input) {
	            if (this.canEmit()) {
	                return this.emit(input);
	            }
	            // it's failing anyway
	            this.state = STATE_FAILED;
	        },

	        /**
	         * can we emit?
	         * @returns {boolean}
	         */
	        canEmit: function canEmit() {
	            var i = 0;
	            while (i < this.requireFail.length) {
	                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                    return false;
	                }
	                i++;
	            }
	            return true;
	        },

	        /**
	         * update the recognizer
	         * @param {Object} inputData
	         */
	        recognize: function recognize(inputData) {
	            // make a new copy of the inputData
	            // so we can change the inputData without messing up the other recognizers
	            var inputDataClone = extend({}, inputData);

	            // is is enabled and allow recognizing?
	            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	                this.reset();
	                this.state = STATE_FAILED;
	                return;
	            }

	            // reset when we've reached the end
	            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	                this.state = STATE_POSSIBLE;
	            }

	            this.state = this.process(inputDataClone);

	            // the recognizer has recognized a gesture
	            // so trigger an event
	            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	                this.tryEmit(inputDataClone);
	            }
	        },

	        /**
	         * return the state of the recognizer
	         * the actual recognizing happens in this method
	         * @virtual
	         * @param {Object} inputData
	         * @returns {Const} STATE
	         */
	        process: function process(inputData) {}, // jshint ignore:line

	        /**
	         * return the preferred touch-action
	         * @virtual
	         * @returns {Array}
	         */
	        getTouchAction: function getTouchAction() {},

	        /**
	         * called when the gesture isn't allowed to recognize
	         * like when another is being recognized or it is disabled
	         * @virtual
	         */
	        reset: function reset() {}
	    };

	    /**
	     * get a usable string, used as event postfix
	     * @param {Const} state
	     * @returns {String} state
	     */
	    function stateStr(state) {
	        if (state & STATE_CANCELLED) {
	            return 'cancel';
	        } else if (state & STATE_ENDED) {
	            return 'end';
	        } else if (state & STATE_CHANGED) {
	            return 'move';
	        } else if (state & STATE_BEGAN) {
	            return 'start';
	        }
	        return '';
	    }

	    /**
	     * direction cons to string
	     * @param {Const} direction
	     * @returns {String}
	     */
	    function directionStr(direction) {
	        if (direction == DIRECTION_DOWN) {
	            return 'down';
	        } else if (direction == DIRECTION_UP) {
	            return 'up';
	        } else if (direction == DIRECTION_LEFT) {
	            return 'left';
	        } else if (direction == DIRECTION_RIGHT) {
	            return 'right';
	        }
	        return '';
	    }

	    /**
	     * get a recognizer by name if it is bound to a manager
	     * @param {Recognizer|String} otherRecognizer
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer}
	     */
	    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	        var manager = recognizer.manager;
	        if (manager) {
	            return manager.get(otherRecognizer);
	        }
	        return otherRecognizer;
	    }

	    /**
	     * This recognizer is just used as a base for the simple attribute recognizers.
	     * @constructor
	     * @extends Recognizer
	     */
	    function AttrRecognizer() {
	        Recognizer.apply(this, arguments);
	    }

	    inherit(AttrRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof AttrRecognizer
	         */
	        defaults: {
	            /**
	             * @type {Number}
	             * @default 1
	             */
	            pointers: 1
	        },

	        /**
	         * Used to check if it the recognizer receives valid input, like input.distance > 10.
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {Boolean} recognized
	         */
	        attrTest: function attrTest(input) {
	            var optionPointers = this.options.pointers;
	            return optionPointers === 0 || input.pointers.length === optionPointers;
	        },

	        /**
	         * Process the input and return the state for the recognizer
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {*} State
	         */
	        process: function process(input) {
	            var state = this.state;
	            var eventType = input.eventType;

	            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	            var isValid = this.attrTest(input);

	            // on cancel input and we've recognized before, return STATE_CANCELLED
	            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	                return state | STATE_CANCELLED;
	            } else if (isRecognized || isValid) {
	                if (eventType & INPUT_END) {
	                    return state | STATE_ENDED;
	                } else if (!(state & STATE_BEGAN)) {
	                    return STATE_BEGAN;
	                }
	                return state | STATE_CHANGED;
	            }
	            return STATE_FAILED;
	        }
	    });

	    /**
	     * Pan
	     * Recognized when the pointer is down and moved in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PanRecognizer() {
	        AttrRecognizer.apply(this, arguments);

	        this.pX = null;
	        this.pY = null;
	    }

	    inherit(PanRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PanRecognizer
	         */
	        defaults: {
	            event: 'pan',
	            threshold: 10,
	            pointers: 1,
	            direction: DIRECTION_ALL
	        },

	        getTouchAction: function getTouchAction() {
	            var direction = this.options.direction;
	            var actions = [];
	            if (direction & DIRECTION_HORIZONTAL) {
	                actions.push(TOUCH_ACTION_PAN_Y);
	            }
	            if (direction & DIRECTION_VERTICAL) {
	                actions.push(TOUCH_ACTION_PAN_X);
	            }
	            return actions;
	        },

	        directionTest: function directionTest(input) {
	            var options = this.options;
	            var hasMoved = true;
	            var distance = input.distance;
	            var direction = input.direction;
	            var x = input.deltaX;
	            var y = input.deltaY;

	            // lock to axis?
	            if (!(direction & options.direction)) {
	                if (options.direction & DIRECTION_HORIZONTAL) {
	                    direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                    hasMoved = x != this.pX;
	                    distance = Math.abs(input.deltaX);
	                } else {
	                    direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	                    hasMoved = y != this.pY;
	                    distance = Math.abs(input.deltaY);
	                }
	            }
	            input.direction = direction;
	            return hasMoved && distance > options.threshold && direction & options.direction;
	        },

	        attrTest: function attrTest(input) {
	            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
	        },

	        emit: function emit(input) {
	            this.pX = input.deltaX;
	            this.pY = input.deltaY;

	            var direction = directionStr(input.direction);
	            if (direction) {
	                this.manager.emit(this.options.event + direction, input);
	            }

	            this._super.emit.call(this, input);
	        }
	    });

	    /**
	     * Pinch
	     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PinchRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(PinchRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'pinch',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function attrTest(input) {
	            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	        },

	        emit: function emit(input) {
	            this._super.emit.call(this, input);
	            if (input.scale !== 1) {
	                var inOut = input.scale < 1 ? 'in' : 'out';
	                this.manager.emit(this.options.event + inOut, input);
	            }
	        }
	    });

	    /**
	     * Press
	     * Recognized when the pointer is down for x ms without any movement.
	     * @constructor
	     * @extends Recognizer
	     */
	    function PressRecognizer() {
	        Recognizer.apply(this, arguments);

	        this._timer = null;
	        this._input = null;
	    }

	    inherit(PressRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PressRecognizer
	         */
	        defaults: {
	            event: 'press',
	            pointers: 1,
	            time: 500, // minimal time of the pointer to be pressed
	            threshold: 5 // a minimal movement is ok, but keep it low
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_AUTO];
	        },

	        process: function process(input) {
	            var options = this.options;
	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTime = input.deltaTime > options.time;

	            this._input = input;

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
	                this.reset();
	            } else if (input.eventType & INPUT_START) {
	                this.reset();
	                this._timer = setTimeoutContext(function () {
	                    this.state = STATE_RECOGNIZED;
	                    this.tryEmit();
	                }, options.time, this);
	            } else if (input.eventType & INPUT_END) {
	                return STATE_RECOGNIZED;
	            }
	            return STATE_FAILED;
	        },

	        reset: function reset() {
	            clearTimeout(this._timer);
	        },

	        emit: function emit(input) {
	            if (this.state !== STATE_RECOGNIZED) {
	                return;
	            }

	            if (input && input.eventType & INPUT_END) {
	                this.manager.emit(this.options.event + 'up', input);
	            } else {
	                this._input.timeStamp = now();
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Rotate
	     * Recognized when two or more pointer are moving in a circular motion.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function RotateRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(RotateRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof RotateRecognizer
	         */
	        defaults: {
	            event: 'rotate',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function attrTest(input) {
	            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	        }
	    });

	    /**
	     * Swipe
	     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function SwipeRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(SwipeRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof SwipeRecognizer
	         */
	        defaults: {
	            event: 'swipe',
	            threshold: 10,
	            velocity: 0.65,
	            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	            pointers: 1
	        },

	        getTouchAction: function getTouchAction() {
	            return PanRecognizer.prototype.getTouchAction.call(this);
	        },

	        attrTest: function attrTest(input) {
	            var direction = this.options.direction;
	            var velocity;

	            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	                velocity = input.velocity;
	            } else if (direction & DIRECTION_HORIZONTAL) {
	                velocity = input.velocityX;
	            } else if (direction & DIRECTION_VERTICAL) {
	                velocity = input.velocityY;
	            }

	            return this._super.attrTest.call(this, input) && direction & input.direction && input.distance > this.options.threshold && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	        },

	        emit: function emit(input) {
	            var direction = directionStr(input.direction);
	            if (direction) {
	                this.manager.emit(this.options.event + direction, input);
	            }

	            this.manager.emit(this.options.event, input);
	        }
	    });

	    /**
	     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	     * a single tap.
	     *
	     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	     * multi-taps being recognized.
	     * @constructor
	     * @extends Recognizer
	     */
	    function TapRecognizer() {
	        Recognizer.apply(this, arguments);

	        // previous time and center,
	        // used for tap counting
	        this.pTime = false;
	        this.pCenter = false;

	        this._timer = null;
	        this._input = null;
	        this.count = 0;
	    }

	    inherit(TapRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'tap',
	            pointers: 1,
	            taps: 1,
	            interval: 300, // max time between the multi-tap taps
	            time: 250, // max time of the pointer to be down (like finger on the screen)
	            threshold: 2, // a minimal movement is ok, but keep it low
	            posThreshold: 10 // a multi-tap can be a bit off the initial position
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_MANIPULATION];
	        },

	        process: function process(input) {
	            var options = this.options;

	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTouchTime = input.deltaTime < options.time;

	            this.reset();

	            if (input.eventType & INPUT_START && this.count === 0) {
	                return this.failTimeout();
	            }

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (validMovement && validTouchTime && validPointers) {
	                if (input.eventType != INPUT_END) {
	                    return this.failTimeout();
	                }

	                var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
	                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	                this.pTime = input.timeStamp;
	                this.pCenter = input.center;

	                if (!validMultiTap || !validInterval) {
	                    this.count = 1;
	                } else {
	                    this.count += 1;
	                }

	                this._input = input;

	                // if tap count matches we have recognized it,
	                // else it has began recognizing...
	                var tapCount = this.count % options.taps;
	                if (tapCount === 0) {
	                    // no failing requirements, immediately trigger the tap event
	                    // or wait as long as the multitap interval to trigger
	                    if (!this.hasRequireFailures()) {
	                        return STATE_RECOGNIZED;
	                    } else {
	                        this._timer = setTimeoutContext(function () {
	                            this.state = STATE_RECOGNIZED;
	                            this.tryEmit();
	                        }, options.interval, this);
	                        return STATE_BEGAN;
	                    }
	                }
	            }
	            return STATE_FAILED;
	        },

	        failTimeout: function failTimeout() {
	            this._timer = setTimeoutContext(function () {
	                this.state = STATE_FAILED;
	            }, this.options.interval, this);
	            return STATE_FAILED;
	        },

	        reset: function reset() {
	            clearTimeout(this._timer);
	        },

	        emit: function emit() {
	            if (this.state == STATE_RECOGNIZED) {
	                this._input.tapCount = this.count;
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Simple way to create an manager with a default set of recognizers.
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Hammer(element, options) {
	        options = options || {};
	        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	        return new Manager(element, options);
	    }

	    /**
	     * @const {string}
	     */
	    Hammer.VERSION = '2.0.4';

	    /**
	     * default settings
	     * @namespace
	     */
	    Hammer.defaults = {
	        /**
	         * set if DOM events are being triggered.
	         * But this is slower and unused by simple implementations, so disabled by default.
	         * @type {Boolean}
	         * @default false
	         */
	        domEvents: false,

	        /**
	         * The value for the touchAction property/fallback.
	         * When set to `compute` it will magically set the correct value based on the added recognizers.
	         * @type {String}
	         * @default compute
	         */
	        touchAction: TOUCH_ACTION_COMPUTE,

	        /**
	         * @type {Boolean}
	         * @default true
	         */
	        enable: true,

	        /**
	         * EXPERIMENTAL FEATURE -- can be removed/changed
	         * Change the parent input target element.
	         * If Null, then it is being set the to main element.
	         * @type {Null|EventTarget}
	         * @default null
	         */
	        inputTarget: null,

	        /**
	         * force an input class
	         * @type {Null|Function}
	         * @default null
	         */
	        inputClass: null,

	        /**
	         * Default recognizer setup when calling `Hammer()`
	         * When creating a new Manager these will be skipped.
	         * @type {Array}
	         */
	        preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, { enable: false }], [PinchRecognizer, { enable: false }, ['rotate']], [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }], [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']], [TapRecognizer], [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']], [PressRecognizer]],

	        /**
	         * Some CSS properties can be used to improve the working of Hammer.
	         * Add them to this method and they will be set when creating a new Manager.
	         * @namespace
	         */
	        cssProps: {
	            /**
	             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userSelect: 'none',

	            /**
	             * Disable the Windows Phone grippers when pressing an element.
	             * @type {String}
	             * @default 'none'
	             */
	            touchSelect: 'none',

	            /**
	             * Disables the default callout shown when you touch and hold a touch target.
	             * On iOS, when you touch and hold a touch target such as a link, Safari displays
	             * a callout containing information about the link. This property allows you to disable that callout.
	             * @type {String}
	             * @default 'none'
	             */
	            touchCallout: 'none',

	            /**
	             * Specifies whether zooming is enabled. Used by IE10>
	             * @type {String}
	             * @default 'none'
	             */
	            contentZooming: 'none',

	            /**
	             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userDrag: 'none',

	            /**
	             * Overrides the highlight color shown when the user taps a link or a JavaScript
	             * clickable element in iOS. This property obeys the alpha value, if specified.
	             * @type {String}
	             * @default 'rgba(0,0,0,0)'
	             */
	            tapHighlightColor: 'rgba(0,0,0,0)'
	        }
	    };

	    var STOP = 1;
	    var FORCED_STOP = 2;

	    /**
	     * Manager
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Manager(element, options) {
	        options = options || {};

	        this.options = merge(options, Hammer.defaults);
	        this.options.inputTarget = this.options.inputTarget || element;

	        this.handlers = {};
	        this.session = {};
	        this.recognizers = [];

	        this.element = element;
	        this.input = createInputInstance(this);
	        this.touchAction = new TouchAction(this, this.options.touchAction);

	        toggleCssProps(this, true);

	        each(options.recognizers, function (item) {
	            var recognizer = this.add(new item[0](item[1]));
	            item[2] && recognizer.recognizeWith(item[2]);
	            item[3] && recognizer.requireFailure(item[3]);
	        }, this);
	    }

	    Manager.prototype = {
	        /**
	         * set options
	         * @param {Object} options
	         * @returns {Manager}
	         */
	        set: function set(options) {
	            extend(this.options, options);

	            // Options that need a little more setup
	            if (options.touchAction) {
	                this.touchAction.update();
	            }
	            if (options.inputTarget) {
	                // Clean up existing event listeners and reinitialize
	                this.input.destroy();
	                this.input.target = options.inputTarget;
	                this.input.init();
	            }
	            return this;
	        },

	        /**
	         * stop recognizing for this session.
	         * This session will be discarded, when a new [input]start event is fired.
	         * When forced, the recognizer cycle is stopped immediately.
	         * @param {Boolean} [force]
	         */
	        stop: function stop(force) {
	            this.session.stopped = force ? FORCED_STOP : STOP;
	        },

	        /**
	         * run the recognizers!
	         * called by the inputHandler function on every movement of the pointers (touches)
	         * it walks through all the recognizers and tries to detect the gesture that is being made
	         * @param {Object} inputData
	         */
	        recognize: function recognize(inputData) {
	            var session = this.session;
	            if (session.stopped) {
	                return;
	            }

	            // run the touch-action polyfill
	            this.touchAction.preventDefaults(inputData);

	            var recognizer;
	            var recognizers = this.recognizers;

	            // this holds the recognizer that is being recognized.
	            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	            // if no recognizer is detecting a thing, it is set to `null`
	            var curRecognizer = session.curRecognizer;

	            // reset when the last recognizer is recognized
	            // or when we're in a new session
	            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
	                curRecognizer = session.curRecognizer = null;
	            }

	            var i = 0;
	            while (i < recognizers.length) {
	                recognizer = recognizers[i];

	                // find out if we are allowed try to recognize the input for this one.
	                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	                //      that is being recognized.
	                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	                //      this can be setup with the `recognizeWith()` method on the recognizer.
	                if (session.stopped !== FORCED_STOP && ( // 1
	                !curRecognizer || recognizer == curRecognizer || // 2
	                recognizer.canRecognizeWith(curRecognizer))) {
	                    // 3
	                    recognizer.recognize(inputData);
	                } else {
	                    recognizer.reset();
	                }

	                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	                // current active recognizer. but only if we don't already have an active recognizer
	                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                    curRecognizer = session.curRecognizer = recognizer;
	                }
	                i++;
	            }
	        },

	        /**
	         * get a recognizer by its event name.
	         * @param {Recognizer|String} recognizer
	         * @returns {Recognizer|Null}
	         */
	        get: function get(recognizer) {
	            if (recognizer instanceof Recognizer) {
	                return recognizer;
	            }

	            var recognizers = this.recognizers;
	            for (var i = 0; i < recognizers.length; i++) {
	                if (recognizers[i].options.event == recognizer) {
	                    return recognizers[i];
	                }
	            }
	            return null;
	        },

	        /**
	         * add a recognizer to the manager
	         * existing recognizers with the same event name will be removed
	         * @param {Recognizer} recognizer
	         * @returns {Recognizer|Manager}
	         */
	        add: function add(recognizer) {
	            if (invokeArrayArg(recognizer, 'add', this)) {
	                return this;
	            }

	            // remove existing
	            var existing = this.get(recognizer.options.event);
	            if (existing) {
	                this.remove(existing);
	            }

	            this.recognizers.push(recognizer);
	            recognizer.manager = this;

	            this.touchAction.update();
	            return recognizer;
	        },

	        /**
	         * remove a recognizer by name or instance
	         * @param {Recognizer|String} recognizer
	         * @returns {Manager}
	         */
	        remove: function remove(recognizer) {
	            if (invokeArrayArg(recognizer, 'remove', this)) {
	                return this;
	            }

	            var recognizers = this.recognizers;
	            recognizer = this.get(recognizer);
	            recognizers.splice(inArray(recognizers, recognizer), 1);

	            this.touchAction.update();
	            return this;
	        },

	        /**
	         * bind event
	         * @param {String} events
	         * @param {Function} handler
	         * @returns {EventEmitter} this
	         */
	        on: function on(events, handler) {
	            var handlers = this.handlers;
	            each(splitStr(events), function (event) {
	                handlers[event] = handlers[event] || [];
	                handlers[event].push(handler);
	            });
	            return this;
	        },

	        /**
	         * unbind event, leave emit blank to remove all handlers
	         * @param {String} events
	         * @param {Function} [handler]
	         * @returns {EventEmitter} this
	         */
	        off: function off(events, handler) {
	            var handlers = this.handlers;
	            each(splitStr(events), function (event) {
	                if (!handler) {
	                    delete handlers[event];
	                } else {
	                    handlers[event].splice(inArray(handlers[event], handler), 1);
	                }
	            });
	            return this;
	        },

	        /**
	         * emit event to the listeners
	         * @param {String} event
	         * @param {Object} data
	         */
	        emit: function emit(event, data) {
	            // we also want to trigger dom events
	            if (this.options.domEvents) {
	                triggerDomEvent(event, data);
	            }

	            // no handlers, so skip it all
	            var handlers = this.handlers[event] && this.handlers[event].slice();
	            if (!handlers || !handlers.length) {
	                return;
	            }

	            data.type = event;
	            data.preventDefault = function () {
	                data.srcEvent.preventDefault();
	            };

	            var i = 0;
	            while (i < handlers.length) {
	                handlers[i](data);
	                i++;
	            }
	        },

	        /**
	         * destroy the manager and unbinds all events
	         * it doesn't unbind dom events, that is the user own responsibility
	         */
	        destroy: function destroy() {
	            this.element && toggleCssProps(this, false);

	            this.handlers = {};
	            this.session = {};
	            this.input.destroy();
	            this.element = null;
	        }
	    };

	    /**
	     * add/remove the css properties as defined in manager.options.cssProps
	     * @param {Manager} manager
	     * @param {Boolean} add
	     */
	    function toggleCssProps(manager, add) {
	        var element = manager.element;
	        each(manager.options.cssProps, function (value, name) {
	            element.style[prefixed(element.style, name)] = add ? value : '';
	        });
	    }

	    /**
	     * trigger dom event
	     * @param {String} event
	     * @param {Object} data
	     */
	    function triggerDomEvent(event, data) {
	        var gestureEvent = document.createEvent('Event');
	        gestureEvent.initEvent(event, true, true);
	        gestureEvent.gesture = data;
	        data.target.dispatchEvent(gestureEvent);
	    }

	    extend(Hammer, {
	        INPUT_START: INPUT_START,
	        INPUT_MOVE: INPUT_MOVE,
	        INPUT_END: INPUT_END,
	        INPUT_CANCEL: INPUT_CANCEL,

	        STATE_POSSIBLE: STATE_POSSIBLE,
	        STATE_BEGAN: STATE_BEGAN,
	        STATE_CHANGED: STATE_CHANGED,
	        STATE_ENDED: STATE_ENDED,
	        STATE_RECOGNIZED: STATE_RECOGNIZED,
	        STATE_CANCELLED: STATE_CANCELLED,
	        STATE_FAILED: STATE_FAILED,

	        DIRECTION_NONE: DIRECTION_NONE,
	        DIRECTION_LEFT: DIRECTION_LEFT,
	        DIRECTION_RIGHT: DIRECTION_RIGHT,
	        DIRECTION_UP: DIRECTION_UP,
	        DIRECTION_DOWN: DIRECTION_DOWN,
	        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	        DIRECTION_ALL: DIRECTION_ALL,

	        Manager: Manager,
	        Input: Input,
	        TouchAction: TouchAction,

	        TouchInput: TouchInput,
	        MouseInput: MouseInput,
	        PointerEventInput: PointerEventInput,
	        TouchMouseInput: TouchMouseInput,
	        SingleTouchInput: SingleTouchInput,

	        Recognizer: Recognizer,
	        AttrRecognizer: AttrRecognizer,
	        Tap: TapRecognizer,
	        Pan: PanRecognizer,
	        Swipe: SwipeRecognizer,
	        Pinch: PinchRecognizer,
	        Rotate: RotateRecognizer,
	        Press: PressRecognizer,

	        on: addEventListeners,
	        off: removeEventListeners,
	        each: each,
	        merge: merge,
	        extend: extend,
	        inherit: inherit,
	        bindFn: bindFn,
	        prefixed: prefixed
	    });

	    if (( false ? 'undefined' : _typeof(__webpack_require__(11))) == TYPE_FUNCTION && __webpack_require__(12)) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return window[exportName] = Hammer;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module != 'undefined' && module.exports) {
	        module.exports = Hammer;
	    } else {
	        window[exportName] = Hammer;
	    }
	})(window, document, 'Hammer');

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
/******/ ]);