/**
 * # Kub.LazyLoad
 *
 * 延迟加载组件。
 *
 */

/**
 * ## LazyLoad Constructor
 *
 * LazyLoad 类
 *
 * 使用：
 * ```js
 * var lazyload = new Kub.LazyLoad($('img'))
 * ```
 */

var $ = require('./lite'),
    core = require('./core')

function LazyLoad(element, options) {
    this.$element = $(element)

    this.options = core.extend({}, _prototype.defaults, options || {})
    this.$window = $(window)
    this.$container = (this.options.container === undefined ||
        this.options.container === window) ? (this.containerIsWindow = true, this.$window) : ($(this.options.container))
    _init(this)
}



var _loadAllIfTimeout = function(lazyload) {
    var options = lazyload.options
    typeof options.waitTime === 'number' && !(options.waitTime !== +options.waitTime) && options.waitTime > 0 && (lazyload._waitTimer = setTimeout(function() {
        lazyload.loadAll()
    }, options.waitTime))
    return lazyload
}

var _init = function(lazyload) {
    var options = lazyload.options

    lazyload._handle = function() {
        if (lazyload.completed) {
            return
        }
        lazyload._timer && clearTimeout(lazyload._timer)
        lazyload._waitTimer && clearTimeout(lazyload._waitTimer)
        lazyload._timer = setTimeout(function() {
            lazyload.loadElementsInViewport()
            _loadAllIfTimeout(lazyload)
        }, options.delay)
    }

    lazyload.loadElementsInViewport()
    _loadAllIfTimeout(lazyload)

    lazyload.$container.on(options.eventName, lazyload._handle)
    //有可能 window resize 会影响到元素的位置
    !lazyload.containerIsWindow && lazyload.$window.on('resize', lazyload._handle)
}


var _prototype = LazyLoad.prototype
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
_prototype.defaults = {
    container: window,
    threshold: 50,
    waitTime: -1,
    delay: 150,
    attributeName: 'original',
    eventName: 'scroll resize'
}

//更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内
_prototype.updateElement = function(element) {
    var self = this
    self.$element = element
    //更新 dom 以后立即验证是否有元素已经显示
    self.loadElementsInViewport()
    return self
}

/**
 * ## getUnloadedElements
 *
 * 获取所有还未被加载的节点
 *
 * @return {instance} 当前实例
 */
_prototype.getUnloadedElements = function() {
    var self = this,dom = []

    return self.$element.each(function(index) {
        !this.loaded && dom.push(this)
    })

    return $(dom)
}

/**
 * ## loadAll
 *
 * 强制加载所有图片，无论节点是否在可视区域内
 *
 * @return {instance} 当前实例
 */
_prototype.loadAll = function() {
    var self = this,
        options = self.options,
        elements
    elements = self.getUnloadedElements()
    elements.each(function() {
        var $this = $(this)
        self.load($this, $this.attr('data-' + self.options.attributeName))
    })
    return self
}

//加载所有在可视区域内的图片
_prototype.loadElementsInViewport = function() {
    var self = this,
        options = self.options,
        elements

    elements = self.getUnloadedElements()
    elements.length == 0 && (self.completed = true)
    elements.each(function() {
        var $this = $(this),
            flag = true

        flag = self.isVisible($this, options)
        flag && self.load($this, $this.attr('data-' + self.options.attributeName))
    })
    return self
}

/**
 * ## isVisible
 *
 * 是否可见
 * @param {$}  $this         元素
 * @param {Object}  options  参数
 * @return {Boolean}         true ：可见 false ：不可见
 */
_prototype.isVisible = function($this, options) {
    var self = this
    if (self.abovethetop($this, options)) {
        return false
    } else if (self.belowthefold($this, options)) {
        return false
    }
    if (self.leftofbegin($this, options)) {
        return false
    } else if (self.rightoffold($this, options)) {
        return false
    }
    return true
}


/**
 * ## load
 *
 * 加载指定元素
 *
 * @param {$} $element      加载的节点
 * @param {String} original 图片地址
 * @return {instance}       当前实例
 */
_prototype.load = function($element, original) {
    //如果原图片为空
    if (!original) {
        return
    }
    if ($element[0].nodeName === 'IMG') {
        $element.attr('src', original)
    } else {
        $element.css('background-image', 'url(' + original + ')')
    }
    $element[0].loaded = true
    return this
}

/**
 * ## destroy
 *
 * 销毁对象
 * @return {instance} 当前实例
 */
_prototype.destroy = function() {
    var self = this,
        options = self.options
    //取消监听
    self.$container.off(options.eventName, self._handle)
    !self.containerIsWindow && self.$window.off('resize', self._handle)
    //clear timeout
    self._timer && clearTimeout(self._timer)
    self._waitTimer && clearTimeout(self._waitTimer)

    return self
}

/**
 * 是否在可视区域内
 *
 * @param {zepto} element 检查的元素
 * @return {Boolean} 是：true 否 ：false
 */
_prototype.isInViewport = function($this) {
    return !this.belowthefold($this[0], this.options) && !this.abovethetop($this[0], this.options) && !this.rightoffold($this[0], this.options) && !this.leftofbegin($this[0], this.options)
}

/**
 * ## belowthefold
 *
 * 是否在视窗下面
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.belowthefold = function(element, settings) {
    var fold
    if (settings.container === undefined || settings.container === window) {
        fold = window.innerHeight  + window.scrollY
    } else {
        var offset = $(settings.container).offset()

        fold = offset.top + offset.height
    }

    return fold <= $(element).offset().top - settings.threshold
}

/**
 * ## abovethetop
 *
 * 是否在视窗上面
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.abovethetop = function(element, settings) {
    var fold

    if (settings.container === undefined || settings.container === window) {
        fold = window.scrollY
    } else {
        fold = $(settings.container).offset().top
    }

    var offset = $(element).offset()
    return fold >= offset.top + settings.threshold + offset.height
}

/**
 * ## rightoffold
 *
 * 是否在视窗右侧
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.rightoffold = function(element, settings) {
    var fold
    if (settings.container === undefined || settings.container === window) {
        fold = window.innerWidth + window.scrollX
    } else {
        var offset = $(settings.container).offset()
        fold = offset.left + offset.width
    }
    return fold <= $(element).offset().left - settings.threshold
}

/**
 * ## leftofbegin
 *
 * 是否在视窗左侧
 *
 * @param {Element} element 检查的元素
 * @param {Object} settings 被检查时的参数
 * @return {Boolean}        是：true 否 ：false
 */
_prototype.leftofbegin = function(element, settings) {
    var fold
    if (settings.container === undefined || settings.container === window) {
        fold = window.scrollX
    } else {
        fold = $(settings.container).offset().left
    }

    var offset = $(element).offset()

    return fold >= offset.left + settings.threshold + offset.width
}

module.exports = LazyLoad
