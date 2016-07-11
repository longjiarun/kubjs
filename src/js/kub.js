/**
 * # Kub
 *
 * `Kub` 对象。kub 框架对外暴露的全局变量，所有组件均绑在`Kub`对象中。
 *
 */
var _window = window,
    Kub = _window.Kub = _window.Kub || {}

Kub.version = '2.1.0'

/**
 * ## Kub.$
 *
 * 类 `Zepto` 模块。
 */
Kub.$ = require('./lite')

/**
 * ## Kub.core
 */
Kub.core = require('./core')

/**
 * ## Kub.os
 */
Kub.os = require('./detect')

/**
 * ## Kub.dateHelper
 */
Kub.dateHelper = require('./date')

/**
 * ## Kub.cookie
 */
Kub.cookie = require('./cookie')

/**
 * ## Kub.LazyLoad
 */
Kub.LazyLoad = require('./lazyload')

/**
 * ## Kub.Dialog
 */
Kub.Dialog = require('./dialog')

/**
 * ## Kub.Alert
 */
Kub.Alert = require('./alert')

/**
 * ## Kub.Confirm
 */
Kub.Confirm = require('./confirm')

/**
 * ## Kub.Prompt
 */
Kub.Prompt = require('./prompt')

/**
 * ## Kub.Toast
 */
Kub.Toast = require('./toast')

/**
 * ## Kub.Loader
 */
Kub.Loader = require('./loader')

/**
 * ## Kub.Swiper
 */
Kub.Swiper = require('./swiper')

/**
 * ## Kub.DatePicker
 */
Kub.DatePicker = require('./datepicker')

/**
 * ## Kub.Touch
 */
Kub.Touch = require('./touch')

module.exports = Kub
