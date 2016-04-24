/**
 * # Kub.DatePicker
 *
 * 时间选择器。格式化参照 [`date`](date.js.html)
 *
 */

/**
 * ## DatePicker Constructor
 *
 * DatePicker类
 *
 * 使用：
 * ```js
 *  //采用默认的format yyyy-MM-dd
 *  var datepicker = new Kub.DatePicker($('#J_datepicker'))
 *
 *  //采用默认的format yyyy-MM-dd
 *  //可配置title 与 本地化
 *  var datepicker1 = new Kub.DatePicker($('#J_datepicker1'),{
 *      title:'Date Picker',
 *      locale:'en'
 *  })
 *
 *  //自定义format
 *  var datepicker2 = new Kub.DatePicker($('#J_datepicker2'),{
 *      title:'选择时间',
 *      format:'yyyy-MM-dd,HH:mm:ss',
 *      confirm:function(e,datepicker){
 *          //格式化后的date
 *          console.log(datepicker.formatDate)
 *          //手动关闭选择器
 *          datepicker.hide()
 *      }
 *  })
 * ```
 */
var core = require('./core'),
    $ = require('./lite'),
    Dialog = require('./dialog'),
    date = require('./date'),
    template = require('./tpl/datepicker')

var HEIGHT_UNIT = 50,
    COLUMN_ITEM_SHOW_CLASS = 'kub-datepicker-show',
    COLUMN_SELECTOR = '.kub-datepicker-column',
    COLUMN_ITEM_SELECTOR = 'li',
    COLUMN_CONTAINER_SELECTOR = 'ul'

var $document = $(document),
    isTouch = core.os.mobile

var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup'

function DatePicker(element, options) {
    this.$element = $(element)
    this.options = core.extend({}, _prototype.defaults, options || {})

    init(this)
}

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

var returnFalse = function() {
    return false
}

//获取当月最大天数
var getDays = function(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

//根据偏移量算出索引值
var getIndexByDistance = function(y, max) {
    //去掉空白的两行
    max = max - 3
    y = y > 0 ? 0 : y
    var index = Math.round(Math.abs(y) / HEIGHT_UNIT)
    return index > max ? max : index
}

//设置偏移速度
var setDuration = function($this, duration) {
    var $container = $this[0].$container,
        transition = 'transform 200ms ease-out',
        webkiTransition = '-webkit-transform 200ms ease-out'

    $container.css({
        '-webkit-transition': duration != null ? webkiTransition : null,
        'transition': duration != null ? transition : null
    })
}

//设置偏移速度
var setTranslate = function($this, x, y) {
    var $container = $this[0].$container,
        t

    core.isNumber(x) && (x += 'px')
    core.isNumber(y) && (y += 'px')

    t = 'translate(' + x + ',' + y + ')'

    !$container && ($container = $this[0].$container = $this.find(COLUMN_CONTAINER_SELECTOR))

    $container.css({
        '-webkit-transform': t,
        'transform': t
    })
}

var init = function(datepicker) {
    var options = datepicker.options,
        $element,
        ui

    //创建对话框
    render(datepicker)

    $element = datepicker.$element[0].dialog.$element

    ui = datepicker._ui = {
        year: $element.find('.year'),
        month: $element.find('.month'),
        day: $element.find('.day'),
        hour: $element.find('.hour'),
        minute: $element.find('.minute'),
        second: $element.find('.second')
    }

    ui.columns = $element.find(COLUMN_SELECTOR)

    HEIGHT_UNIT = ui.columns.find(COLUMN_ITEM_SELECTOR)[0].offsetHeight

    datepicker.hide()

    options.format.indexOf('y') === -1 && (ui.year.remove())
    options.format.indexOf('M') === -1 && (ui.month.remove())
    options.format.indexOf('d') === -1 && (ui.day.remove())
    options.format.indexOf('H') === -1 && (ui.hour.remove())
    options.format.indexOf('m') === -1 && (ui.minute.remove())
    options.format.indexOf('s') === -1 && (ui.second.remove())

    //设置本地化
    $element.addClass('kub-datepicker-' + options.locale)

    //设置默认时间
    datepicker.setDate(options.date)

    bindEvents(datepicker)
}

//渲染对话框
var render = function(datepicker) {
    var options = datepicker.options,
        html = template(options)

    datepicker.$element[0].dialog = new Dialog({
        title: options.title,
        message: html,
        className: options.className,
        buttons: [{
            text: options.cancelText,
            handler: function(e, dialog) {
                var cancel = options.cancel
                cancel ? cancel.call(this, e, datepicker) : dialog.hide()
            }
        }, {
            text: options.confirmText,
            handler: function(e, dialog) {
                var confirm = options.confirm

                var formatDate = datepicker.getDate().format(options.format)

                confirm ? confirm.call(this, e, datepicker, formatDate) : function() {
                    datepicker.$element[0].value = formatDate
                    dialog.hide()
                }()
            }
        }]
    })
}

//绑定事件
var bindEvents = function(datepicker) {
    var flag = false,
        $activeElement

    var start = function(event) {
            flag = true
            event = event.originalEvent || event

            this.startCoords = getCoords(event)

            $activeElement = $(this)

            setDuration($activeElement, null)
            event.preventDefault()
        },
        move = function(event) {
            if (!flag) return
            event = event.originalEvent || event

            var distance = getDistance(event, $activeElement[0].startCoords)

            setTranslate($activeElement, 0, distance.distanceY - HEIGHT_UNIT * $activeElement[0].index)
        },
        end = function(event) {
            if (!flag) return
            flag = false
            event = event.originalEvent || event

            var distance = getDistance(event, $activeElement[0].startCoords),
                max = $activeElement.find('.' + COLUMN_ITEM_SHOW_CLASS).length,
                index = getIndexByDistance(distance.distanceY - HEIGHT_UNIT * $activeElement[0].index, max)

            $activeElement[0].index = Math.abs(index)

            resetDays(datepicker, getValue(datepicker, 'year'), getValue(datepicker, 'month'))

            setDuration($activeElement, 200)

            setTranslate($activeElement, 0, -HEIGHT_UNIT * $activeElement[0].index)
        }

    datepicker._ui.columns.on(START_EVENT, function() {
        start.apply(this, arguments)
        this.onselectstart = returnFalse
        this.ondragstart = returnFalse
    })

    $document.on(MOVE_EVENT, move)
    $document.on(END_EVENT, end)

    bindInputFocusEvent(datepicker)
}

//绑定输入框聚焦事件
var bindInputFocusEvent = function(datepicker) {
    datepicker.$element.on('click', function(e) {
        //使输入框失去焦点
        datepicker.$element[0].blur()

        datepicker.show()

        return false
    })
}

//重置每月最大天数
var resetDays = function(datepicker, year, month) {
    var days = getDays(year, month),
        day = getValue(datepicker, 'day'),
        $items = datepicker._ui.day.find(COLUMN_ITEM_SELECTOR)

    //移除不在本月的日期
    $items.addClass(COLUMN_ITEM_SHOW_CLASS).slice(days + 1, $items.length - 1).removeClass(COLUMN_ITEM_SHOW_CLASS)

    days < day && setValue(datepicker, 'day', days)
}

//设置时间选择器中某一列的值，可设置年、月、日、时、分、秒的值
var setValue = function(datepicker, name, value) {
    var $this = datepicker._ui[name],
        index

    index = parseInt($this.find(COLUMN_ITEM_SELECTOR + '[data-value="' + value + '"]').attr('data-index'))

    $this[0].index = index

    setTranslate($this, 0, -index * HEIGHT_UNIT)
}

//获取时间选择器中某一列的值，可获取年、月、日、时、分、秒的值
var getValue = function(datepicker, name) {
    var $this = datepicker._ui[name],
        $items = $this.find(COLUMN_ITEM_SELECTOR),
        index = $this[0].index + 1,
        value = $items.eq(index).attr('data-value')

    return value ? parseInt(value) : 0
}

var _prototype = DatePicker.prototype

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
 * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗，并进行赋值。如果传递，需调用`datepicker.close()`手动关闭弹窗，并且需要手动填充输入框。
 *
 * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`datepicker.close()`手动关闭弹窗。
 *
 * * `format`: 日期格式
 *
 * * `className`: 弹窗类名，不建议修改，会影响样式。
 *
 * * `date`: 默认显示时间
 *
 * * `yearRange`: 年份显示区间
 */
_prototype.defaults = {
    locale: 'zh',
    title: '选择时间',
    confirmText: '确定',
    confirm: null,
    cancelText: '取消',
    cancel: null,
    format: 'yyyy-MM-dd',
    className: 'kub-datepicker-dialog',
    date: new Date(),
    yearRange: [1970, 2100]
}

/**
 * ## setDate
 *
 * 设置时间选择器时间
 *
 * @param {Date} date 时间
 * @return {instance} 当前实例
 */
_prototype.setDate = function(date) {
    var self = this,
        year = date.getFullYear(),
        month = date.getMonth()

    ;['year', 'month', 'day', 'hour', 'minute', 'second'].forEach(function(type) {
        switch (type) {
            case 'year':
                setValue(self, type, year)
                break
            case 'month':
                setValue(self, type, month)
                break
            case 'day':
                setValue(self, type, date.getDate())
                break
            case 'hour':
                setValue(self, type, date.getHours())
                break
            case 'minute':
                setValue(self, type, date.getMinutes())
                break
            case 'second':
                setValue(self, type, date.getSeconds())
                break
        }
    })

    //验证是否存在31,30,29天
    resetDays(self, year, month)

    return self
}

/**
 * ## getDate
 *
 * 获取时间选择器选择的时间
 *
 * @param {Date} date 时间
 * @return {Date} 获取到的时间
 */
_prototype.getDate = function() {
    var values = {
        year: getValue(this, 'year'),
        month: getValue(this, 'month'),
        day: getValue(this, 'day'),
        hour: getValue(this, 'hour'),
        minute: getValue(this, 'minute'),
        second: getValue(this, 'second')
    }

    return new Date(values.year, values.month, values.day, values.hour, values.minute, values.second)
}

/**
 * ## close
 *
 * 关闭时间选择器
 * @return {instance} 当前实例
 */
_prototype.close = function() {
    this.$element[0].dialog.close()
    return this
}

/**
 * ## show
 *
 * 显示时间选择器
 * @return {instance} 当前实例
 */
_prototype.show = function() {
    this.$element[0].dialog.show()
    return this
}

/**
 * ## hide
 *
 * 隐藏时间选择器
 * @return {instance} 当前实例
 */
_prototype.hide = function() {
    this.$element[0].dialog.hide()
    return this
}

module.exports = DatePicker
