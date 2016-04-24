//try {
    var _window = window,
        Kub = _window.Kub = _window.Kub || {}

    Kub.$ = require('./lite')

    Kub.core = require('./core')

    Kub.dateHelper = require('./date')

    Kub.cookie = require('./cookie')

    Kub.LazyLoad = require('./lazyload')

    Kub.Dialog = require('./dialog')

    Kub.Alert = require('./alert')

    Kub.Confirm = require('./confirm')

    Kub.Prompt = require('./prompt')

    Kub.Toast = require('./toast')

    Kub.Loader = require('./loader')

    Kub.Swiper = require('./swiper')

    Kub.DatePicker = require('./datepicker')

    if (typeof define === 'function') {
        define(function() {
            return Kub
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Kub
    }

// } catch (e) {
//     alert(e.message)
// }
