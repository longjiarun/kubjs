/**
 * # LazyLoad
 *
 * 延迟加载组件。
 *
 */

/**
 * @require [core](./core.js.html)
 * @require [Lite](./lite.js.html)
 */
var core = require('./core'),
    $ = require('./lite')

/**
 * ## LazyLoad Constructor
 *
 * `LazyLoad` 构造函数。
 *
 * 使用：
 * ```js
 * var lazyload = new Kub.LazyLoad($('img'))
 * ```
 */
function LazyLoad(element, options) {
    this.$element = $(element)

    this.options = core.extend({}, _prototype.defaults, options || {})

    this.$container = $(this.options.container)

    init(this)
}

var _window = window,
    _prototype = LazyLoad.prototype

var //横竖屏切换时 ，orientationchange 与 resize事件都会触发，所以只需监听 resize 即可
    RESIZE_EVENT = 'resize',
    //三星某款机型在监听非window容器的scroll事件时，会无限次触发，可以使用touchmove替代
    //但可能会出现 页面加载时触发scroll无法触发scroll与惯性滚动停止时，无法触发的情况
    //综上：依旧采用scroll解决，对于某些机型进行忽略
    EVENT_NAME = 'scroll'


//获取所有还未被加载的节点
var getUnloadedElements = function(lazyload) {
    var dom = []

    lazyload.$element.each(function() {
        !this.loaded && dom.push(this)
    })

    return dom
}

//加载所有在可视区域内的图片
var loadElementsInViewport = function(lazyload) {
    var elements

    elements = getUnloadedElements(lazyload)

    lazyload.completed  = elements.length === 0 ? true : false

    elements.forEach(function(element) {
        var $this = $(element)

        lazyload.isVisible($this) && lazyload.load($this)
    })
}

var init = function(lazyload) {
    var options = lazyload.options,
        timer

    var handler = function() {
        if (lazyload.completed) {
            return
        }

        timer && clearTimeout(timer)

        timer = setTimeout(function() {

            loadElementsInViewport(lazyload)

        }, options.delay)
    }

    //页面载入先执行下面
    loadElementsInViewport(lazyload)

    //页面紧接着触发scroll，走下面监听
    lazyload.$container.on(EVENT_NAME, handler)

    $(_window).on(RESIZE_EVENT, handler)
}

/**
 * ## LazyLoad.prototype.defaults
 *
 * 默认配置项。
 *
 * 配置项说明：
 *
 *   `container` : `Selector` 图片存放的容器，容器会监听事件。
 *
 *   `threshold` : `Number` 提前加载距离。
 *
 *   `delay` : `Number` 事件监听时的延迟时间。
 *
 *   `attributeName` : `String` 属性名称。默认会从`element`上取出 `data-original` 属性。
 *
 *   `load` : `Function` 图片加载事件。
 *
 */
_prototype.defaults = {
    container: _window,
    threshold: 200,
    delay: 100,
    attributeName: 'original',
    load:null
}

//更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内
_prototype.updateElement = function(element) {

    this.$element = $(element)

    //更新 dom 以后立即验证是否有元素已经显示
    loadElementsInViewport(this)

    return this
}

/**
 * ## LazyLoad.prototype.loadAll
 *
 * 强制加载所有图片，无论节点是否在可视区域内。
 *
 * @return {instance} 当前实例
 */
_prototype.loadAll = function() {
    var self = this,
        elements

    elements = getUnloadedElements(self)

    this.completed = true

    elements.forEach(function(element) {
        var $this = $(element)

        self.load($this)
    })
    return self
}

/**
 * ## LazyLoad.prototype.isVisible
 *
 * 是否在视窗可见。
 * @param {$}  $this         元素
 * @param {Object}  options  参数
 * @return {Boolean}         true ：可见 false ：不可见
 */
_prototype.isVisible = function($this) {
    var options = this.options,
        element = $this[0]

    //如果节点不可见，则不进行加载
    if(element.offsetWidth == 0 && element.offsetHeight == 0 && element.getClientRects().length == 0){
        return false
    }

    if (this.abovethetop($this, options)) {
        return false
    } else if (this.belowthefold($this, options)) {
        return false
    }
    if (this.leftofbegin($this, options)) {
        return false
    } else if (this.rightoffold($this, options)) {
        return false
    }
    return true
}

/**
 * ## LazyLoad.prototype.load
 *
 * 加载指定元素。
 *
 * @param {$} $element      加载的节点
 * @param {String} original 图片地址
 * @return {instance}       当前实例
 */
_prototype.load = function($element) {

    var options = this.options,
        original = $element.attr('data-' + options.attributeName),
        load = options.load

    //如果原图片为空
    if (!original) {
        return this
    }
    if ($element[0].nodeName === 'IMG') {
        $element.attr('src', original)
    } else {
        $element.css('background-image', 'url(' + original + ')')
    }
    //记录该节点已被加载
    $element[0].loaded = true

    // 触发 load 事件
    load && load.call($element[0])

    return this
}

/**
 * ## LazyLoad.prototype.belowthefold
 *
 * 是否在视窗下面。
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.belowthefold = function(element, settings) {
    var fold,container = settings.container

    if (container === _window) {
        fold = _window.innerHeight  + _window.scrollY
    } else {
        var $container = $(container), offset = $container.offset()

        fold = offset.top + $container[0].offsetHeight
    }

    return fold <= $(element).offset().top - settings.threshold
}

/**
 * ## LazyLoad.prototype.abovethetop
 *
 * 是否在视窗上面。
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.abovethetop = function(element, settings) {
    var fold,container = settings.container

    if (container === _window) {
        fold = _window.scrollY
    } else {
        fold = $(container).offset().top
    }

    var $element = $(element), offset = $element.offset()
    return fold >= offset.top + settings.threshold + $element[0].offsetHeight
}

/**
 * ## LazyLoad.prototype.rightoffold
 *
 * 是否在视窗右侧。
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.rightoffold = function(element, settings) {
    var fold,container = settings.container

    if (container === _window) {
        fold = _window.innerWidth + _window.scrollX
    } else {
        var $container = $(container), offset = $container.offset()
        fold = offset.left + $container[0].offsetWidth
    }
    return fold <= $(element).offset().left - settings.threshold
}

/**
 * ## LazyLoad.prototype.leftofbegin
 *
 * 是否在视窗左侧。
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.leftofbegin = function(element, settings) {
    var fold,container = settings.container

    if (container === _window) {
        fold = _window.scrollX
    } else {
        fold = $(container).offset().left
    }

    var $element = $(element), offset = $element.offset()

    return fold >= offset.left + settings.threshold + $element[0].offsetWidth
}

module.exports = LazyLoad
