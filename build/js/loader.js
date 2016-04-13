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

	module.exports = __webpack_require__(25);


/***/ },

/***/ 2:
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

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/**
	 * # Kub.Loader
	 * 
	 * 加载等待框
	 * @extend [Dialog](dialog.js.html)
	 */
	!function (factory) {
	    var root = this,
	        Kub = root.Kub = root.Kub ? root.Kub : {};
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory(root, root._, root.jQuery || root.Zepto, __webpack_require__(2));
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Kub.Loader = factory(root, root._, root.jQuery || root.Zepto, Kub.Dialog);
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        Kub.Loader = factory(root, root._, root.jQuery || root.Zepto, Kub.Dialog);
	    }
	}(function (root, _, $, Dialog) {

	    /**
	     * ## Loader Constructor
	     *
	     * 初始化`Loader`类，`Loader`并不提供实例方法，实例方法均继承于`Dialog`。
	     *
	     * 使用方法：
	     * ```js
	     * var loader = new Kub.Loader();
	     * //隐藏loader
	     * loader.hide();
	     * ```
	     */
	    var Loader = function Loader(options) {
	        var self = this;
	        this.options = $.extend({}, Loader.prototype.defaults, options || {}, {
	            showHeader: false,
	            closable: false,
	            buttons: null
	        });

	        this.options.message = _.template(TEMPLATE)({ data: this.options });

	        Dialog.call(this, this.options);
	    };

	    //加载等待框模板
	    var TEMPLATE = '<div class="kub-spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div> <div class="kub-loader-message"><%= data.message%></div>';

	    //继承于 `Dialog`
	    Dialog.prototype.inherit(Loader, Dialog);

	    ;(function () {
	        this.constructor = Loader;

	        /**
	         * ## defaults
	         *
	         * `Loader`默认配置项。
	         *
	         * 配置项说明：
	         * 
	         * * `className`: 弹窗类名，不建议修改，会影响样式。
	         * 
	         * * `message`: 加载文字提示
	         * 
	         * * `modal`: 是否显示遮罩层。
	         */
	        this.defaults = {
	            scrollable: true,
	            className: "kub-loader",
	            modal: true,
	            message: "加载中..."
	        };
	    }).call(Loader.prototype);

	    return Loader;
	});

/***/ }

/******/ });