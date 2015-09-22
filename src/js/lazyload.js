/**
 * # Kub.LazyLoad
 * 
 * 延迟加载组件。
 * 
 */
!(function(factory){
    var root =this,Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof require !== "undefined" && require.async) {
        module.exports = factory(root, require('zepto'));
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root,root.jQuery||root.Zepto);
    }else if(typeof define === "function"){
        define(function(){
            return Kub.LazyLoad=factory(root,root.jQuery||root.Zepto);
        });
    } else{
        Kub.LazyLoad=factory(root,root.jQuery||root.Zepto);
    }
}(function(root,$){
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
    var LazyLoad = function(element,options){
        this.$element = $(element);

        this.options=$.extend({},LazyLoad.prototype.defaults,options||{});
        this.$window= $(window);
        this.$container = (this.options.container === undefined ||
                      this.options.container === window) ? (this.containerIsWindow=true,this.$window) : ($(this.options.container));
        this._init();
    };
    (function(){

        this.constructor=LazyLoad;

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
        this.defaults={
            container:window,
            threshold:50,
            waitTime:5000,
            delay:150,
            attributeName:"original",
            eventName:"scroll resize"
        };
        
       
        //更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内        
        this.updateElement = function(element){
            var self=this;
            self.$element=element;
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
        this.getUnloadedElements = function(){
            var self =this;
            return self.$element.filter(function(index){
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
        this.loadAll = function(){
            var self=this,options=self.options,elements;
            elements=self.getUnloadedElements();
            elements.each(function(){
                var $this=$(this);
                self.load($this,$this.attr("data-"+self.options.attributeName));
            });
            return self;
        };

        //加载所有在可视区域内的图片
        this.loadElementsInViewport = function(){
            var self=this,options=self.options,elements;

            elements=self.getUnloadedElements();
            elements.length == 0 && (self.completed=true);
            elements.each(function(){
                var $this=$(this),flag=true;

                flag = self.isVisible($this,options);
                flag && self.load($this,$this.attr("data-"+self.options.attributeName));
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
        this.isVisible = function($this,options){
            var self=this;
            if(self.abovethetop($this, options)){
                return false;
            }else if(self.belowthefold($this, options)){
                return false;
            }
            if(self.leftofbegin($this, options)){
                return false;
            }else if(self.rightoffold($this, options)){
                return false;
            }
            return true;
        }

        this._loadAllIfTimeout = function(){
            var self=this,options=self.options;
            typeof options.waitTime ==="number" && !(options.waitTime !== +options.waitTime) && options.waitTime>0 && (self._waitTimer=setTimeout(function(){
                self.loadAll();
            },options.waitTime));
            return self;
        }

        this._init=function(){
            var self=this,options=self.options;

            this._handle = function(){
                if(self.completed){
                    return;
                }
                self._timer && clearTimeout(self._timer);
                self._waitTimer && clearTimeout(self._waitTimer);
                self._timer = setTimeout(function(){
                    self.loadElementsInViewport();
                    self._loadAllIfTimeout();
                },options.delay);
            };

            self.loadElementsInViewport();
            self._loadAllIfTimeout();
            
            self.$container.on(options.eventName,self._handle);
            //有可能 window resize 会影响到元素的位置
            !self.containerIsWindow && self.$window.on("resize",self._handle);
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
        this.load = function($element,original){
            //如果原图片为空
            if(!original){
                return;
            }
            if ($element.is("img")) {
                $element.attr("src", original);
            } else {
                $element.css("background-image", "url('" + original + "')");
            }
            $element[0].loaded=true;
            return this;
        };

        /**
         * ## destory
         * 
         * 销毁对象
         * @return {instance} 当前实例
         */
        this.destory = function(){
            var self=this,options=self.options;
            //取消监听
            self.$container.off(options.eventName,self._handle);
            !self.containerIsWindow && self.$window.off("resize",self._handle);
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
        this.isInViewport = function($this){
            return !this.belowthefold($this[0],this.options) && !this.abovethetop($this[0],this.options) && !this.rightoffold($this[0],this.options) && !this.leftofbegin($this[0],this.options);
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
        this.belowthefold = function(element, settings) {
            var fold,$window=$(window);
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
        this.abovethetop = function(element, settings) {
            var fold,$window=$(window);

            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top;
            }

            return fold >= $(element).offset().top + settings.threshold  + $(element).height();
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
        this.rightoffold = function(element, settings) {
            var fold,$window=$(window);
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
        this.leftofbegin = function(element, settings) {
            var fold,$window=$(window);
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left;
            }
            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };

    }).call(LazyLoad.prototype);
    return LazyLoad;
}));