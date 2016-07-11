/**
 * # Swiper
 *
 * 切换组件
 */

/**
 * @require [core](./core.js.html)
 * @require [os](./detect.js.html)
 * @require [Lite](./lite.js.html)
 */
var core = require('./core'),
    os = require('./detect'),
    $ = require('./lite')

/**
 * ## Swiper Constructor
 *
 * `Swiper`类。
 *
 * 使用方法：
 * ```js
 * new Kub.Swiper('.swiper',{
 *      slideSelector:'.slide',
 *      slideActiveClass:'active',
 *      paginationSelector:'.pagination li',
 *      paginationActiveClass:'pagination-active',
 *      slide:function(index){
 *          //当前滚动索引
 *      }
 * })
 * ```
 */

function Swiper(element, options) {

    this.options = core.extend(true, {}, _prototype.defaults, options || {})
    this.$element = $(element)

    var ui = this._ui = {
        slides: $(options.slideSelector),
        paginations: $(options.paginationSelector)
    }

    ui.slidesLength = ui.slides.length

    init(this)
}

var $document = $(document),
    isTouch = os.mobile

var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup',
    RESIZE_EVENT = 'resize',
    TRANSITIONEND_EVENT = 'transitionend',
    WEBKIT_TRANSITIONEND_EVENT = 'webkitTransitionEnd',
    HORIZONTAL = 'horizontal',
    //粘性
    VISCOSITY = 5,
    //触摸点偏移量
    TOUCH_THRESHOLD = 5

var _window = window,
    _prototype = Swiper.prototype

//获取触摸点
var getCoords = function(event) {
    var touches = event.touches,
        data = touches && touches.length ? touches : event.changedTouches

    return {
        x: isTouch ? data[0].pageX : event.pageX,
        y: isTouch ? data[0].pageY : event.pageY
    }
}

//获取偏移
var getDistance = function(event, startCoords) {
    var coords = getCoords(event),
        x = coords.x - startCoords.x,
        y = coords.y - startCoords.y

    return {
        distanceX: x,
        distanceY: y
    }
}

//获取位置与索引
var getCoordinates = function(swiper, distanceX, distanceY) {
    var element = swiper._ui.slides[0],
        w = element.offsetWidth,
        h = element.offsetHeight,
        l = swiper._ui.slidesLength,
        index = swiper._ui.active,
        active = index,
        threshold = swiper.options.threshold,
        reach,
        _distanceY = Math.abs(distanceY),
        _distanceX = Math.abs(distanceX)

    if (swiper.options.direction === HORIZONTAL) {

        //达到门槛
        reach = threshold < _distanceX

        //横向
        if (distanceX > 0 && index == 0) {
            //最左侧
            distanceX = distanceX / VISCOSITY

            index = 0

        } else if (distanceX < 0 && index == l - 1) {
            //最右侧
            distanceX = distanceX / VISCOSITY

            index = l - 1

        } else if (reach) {
            //达到最小偏移量

            //取整
            var s = Math.round(_distanceX / w)

            s = s == 0 ? 1 : s

            //向右或者向左
            index = distanceX > 0 ? index - s : index + s
        }

        return {
            x: distanceX + (-w * active),
            y: 0,
            index: index,
            isDefaultPrevented: !(!reach && _distanceX < _distanceY && TOUCH_THRESHOLD < _distanceY)
        }

    } else {

        //达到门槛
        reach = threshold < _distanceY

        //垂直
        if (distanceY > 0 && index == 0) {
            //最上
            distanceY = distanceY / VISCOSITY
            index = 0

        } else if (distanceY < 0 && index == l - 1) {
            //最下
            distanceY = distanceY / VISCOSITY
            index = l - 1

        } else if (reach) {
            //达到最小偏移
            var s = Math.round(_distanceY / h)

            s = s == 0 ? 1 : s

            index = distanceY > 0 ? index - s : index + s
        }

        return {
            x: 0,
            y: distanceY + (-h * active),
            index: index,
            isDefaultPrevented: true
        }
    }
}

var returnFalse = function() {
    return false
}

//添加重复子节点
var appendCloneChildren = function(swiper) {

    if (swiper.options.infinite) {
        var $slides = swiper._ui.slides,
            first = $slides[0],
            last = $slides[swiper._ui.slidesLength - 1],
            parentElement = first.parentElement

        parentElement.insertBefore(last.cloneNode(true), first)
        parentElement.appendChild(first.cloneNode(true))

        swiper._ui.slidesLength += 2
    }
}

//重置索引值
var resetSlideIndex = function(swiper) {
    var index = swiper._ui.active,
        length = swiper._ui.slidesLength

    if (swiper.options.infinite) {

        if (index === length - 1) {
            swiper.slide(1, 0)
        }

        if (index === 0) {
            swiper.slide(length - 2, 0)
        }
    }
}

//设置偏移量
var setTranslate = function($element, x, y) {
    core.isNumber(x) && (x += 'px')
    core.isNumber(y) && (y += 'px')

    var t = 'translate3d(' + x + ',' + y + ',0)'

    $element.css({
        '-webkit-transform': t,
        'transform': t
    })
}

//设置偏移速度
var setDuration = function($element, duration) {
    core.isNumber(duration) && (duration += 'ms')

    $element.css({
        '-webkit-transition-duration': duration,
        'transition-duration': duration
    })
}

var getActualIndex = function(index, length) {
    return index < 0 ? 0 : index >= length ? length - 1 : index
}

//设置容器偏移量
var setContainerTranslate = function(swiper, x, y, duration) {
    var $element = swiper.$element

    duration = duration || 0

    setDuration($element, duration)
    setTranslate($element, x, y)
}

//添加选中类
var setActiveClass = function(swiper, index) {
    var options = swiper.options,
        slideActiveClass = options.slideActiveClass,
        paginationActiveClass = options.paginationActiveClass

    //添加选中的class
    swiper._ui.slides.removeClass(slideActiveClass).eq(index).addClass(slideActiveClass)

    swiper._ui.paginations.removeClass(paginationActiveClass).eq(index).addClass(paginationActiveClass)
}

//监听slide完成事件
var bindTransitionEndEvent = function(swiper) {
    var $element = swiper.$element

    var handler = function() {
        var options = swiper.options,
            callback = options.slide,
            index = swiper._ui.active

        resetSlideIndex(swiper)

        //计算出真实索引值
        options.infinite && (index = swiper._ui.active - 1)

        callback && callback.call(swiper, index)
    }

    //duration == 0 无法触发
    //translate 值未改变也无法触发
    $element.on(TRANSITIONEND_EVENT, handler).on(WEBKIT_TRANSITIONEND_EVENT, handler)
}

//监听横竖屏切换
var bindOrientationChangeEvent = function(swiper) {
    var timer

    function handler() {
        timer && clearTimeout(timer)
        timer = setTimeout(function() {
            swiper.slide(swiper._ui.active)
        }, 200)
    }
    $(_window).on(RESIZE_EVENT, handler)
}

//绑定事件
var bindEvents = function(swiper) {
    var flag = false,
        startCoords

    var start = function(event) {
            stopAuto(swiper)

            flag = true
            event = event.originalEvent || event

            resetSlideIndex(swiper)

            startCoords = getCoords(event)

            setDuration(swiper.$element, null)
        },
        move = function(event) {
            if (!flag) return
            event = event.originalEvent || event

            var distance = getDistance(event, startCoords),
                coordinates = getCoordinates(swiper, distance.distanceX, distance.distanceY)

            coordinates.isDefaultPrevented && (event.preventDefault(),setTranslate(swiper.$element, coordinates.x, coordinates.y))
        },
        end = function(event) {
            if (!flag) return
            flag = false

            event = event.originalEvent || event

            var distance = getDistance(event, startCoords),
                index = getCoordinates(swiper, distance.distanceX, distance.distanceY).index

            swiper.slide(index)

            beginAuto(swiper)
        }

    //监听横竖屏
    bindOrientationChangeEvent(swiper)

    //触发回调函数
    bindTransitionEndEvent(swiper)

    swiper.$element.on(START_EVENT, start)
    $document.on(MOVE_EVENT, move)
    $document.on(END_EVENT, end)

    swiper.$element[0].onselectstart = returnFalse
    swiper.$element[0].ondragstart = returnFalse
}

//偏移到指定的位置
var slideTo = function(swiper, index, duration) {
    var element = swiper._ui.slides[0]

    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
    if (swiper.options.direction === HORIZONTAL) {
        //横向
        var w = element.offsetWidth

        setContainerTranslate(swiper, -index * w, 0, duration)
    } else {
        //垂直
        var h = element.offsetHeight

        setContainerTranslate(swiper, 0, -index * h, duration)
    }
}

// 开始自动切换
var beginAuto = function(swiper){
    var options = swiper.options,
        _ui = swiper._ui,
        auto = options.auto

    auto && (swiper._timer = setInterval(function(){
        // 由于一些特殊设计
        // 对非循环滚动采用自动计算索引值的方式
        options.infinite ? swiper.next() : swiper.slide( (_ui.active + 1) % _ui.slidesLength )
    }, auto))
}

// 停止自动切换
var stopAuto = function(swiper){
    var timer = swiper._timer

    timer && clearInterval(timer)
}

//初始化
var init = function(swiper) {
    var options = swiper.options

    appendCloneChildren(swiper)

    //设置默认样式
    swiper.$element.css(options.style.swiper)

    var initialSlide = options.initialSlide || 0
    options.infinite && (initialSlide = initialSlide + 1)

    //滚动到默认位置
    swiper.slide(initialSlide, 0)

    beginAuto(swiper)

    //绑定事件
    bindEvents(swiper)
}

/**
 * ## Swiper.prototype.defaults
 *
 * `Swiper`默认配置项。
 *
 * 配置项说明：
 *
 * * `direction`: `String` 切换方向。horizontal ：横向， vertical ：纵向。
 *
 * * `threshold`: `Number` 最小触发距离。手指移动距离必须超过`threshold`才允许切换。
 *
 * * `duration`: `Number` 切换速度。
 *
 * * `auto`: `Number` 自动切换速度。0表示不自动切换，默认为0 。
 *
 * * `infinite`: `Boolean` 是否循环滚动 true ：循环 false ：不循环。
 *
 * * `initialSlide`: `Number` 初始化滚动位置。
 *
 * * `slideSelector`: `Selector` 滚动元素。
 *
 * * `slideActiveClass`: `String` 滚动元素选中时的类名。
 *
 * * `paginationSelector`: `Selector` 缩略图或icon。
 *
 * * `paginationActiveClass`: `String` 缩略图或icon选中时的类名。
 *
 * * `slide`: `Function` 切换回调函数。
 */

_prototype.defaults = {
    //vertical
    direction: HORIZONTAL,
    threshold: 50,
    duration: 300,
    infinite: false,
    initialSlide: 0,
    slideSelector: '',
    slideActiveClass: '',
    paginationSelector: '',
    paginationActiveClass: '',
    slide: null,
    style: {
        swiper: {
            '-webkit-transition-property': '-webkit-transform',
            'transition-property': 'transform',
            '-webkit-transition-timing-function': 'ease-out',
            'transition-timing-function': 'ease-out'
        }
    }
}

/**
 * ## Swiper.prototype.slide
 *
 * 滚动到指定索引值位置
 *
 * @param  {index} index 滚动索引值
 * @param  {duration} duration 滚动速度，默认配置的`duration`。
 * @return {instance}    当前实例
 */
_prototype.slide = function(index, duration) {
    var options = this.options

    //如果speed为空，则取默认值
    duration = duration == null ? options.duration : duration

    //取出实际的索引值,保存当前索引值
    this._ui.active = index = getActualIndex(index, this._ui.slidesLength)

    //通过索引值设置偏移
    slideTo(this, index, duration)

    //设置选中状态Class
    setActiveClass(this, options.infinite ? index - 1 : index)

    return this
}

/**
 * ## Swiper.prototype.next
 *
 * 切换到下一个
 *
 * @param  {duration} duration 滚动速度，默认配置的`duration`。
 * @return {instance}    当前实例
 */
_prototype.next = function(duration) {
    return this.slide(this._ui.active + 1, duration)
}

/**
 * ## Swiper.prototype.prev
 *
 * 切换到上一个
 *
 * @param  {duration} duration 滚动速度，默认配置的`duration`。
 * @return {instance}    当前实例
 */
_prototype.prev = function(duration) {
    return this.slide(this._ui.active - 1, duration)
}

module.exports = Swiper
