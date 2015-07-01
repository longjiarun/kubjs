/**
 * 日期格式化组件,提供parseDate与format方法
 * 格式化字符:
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
 * 使用：
*     //String to Date
*     "2015-05-20".parseDate("yyyy-MM-dd");
*     
*     //格式化日期
*     (new Date()).format("yyyy-MM-dd,hh:mm:ss");
 * author : longjia@koudai.com
 */
!(function(root, factory) {
    if (typeof define === "function") {
        define(function() {
            return root.dateHelper = factory(root);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root);
    } else {
        root.dateHelper = factory(root);
    }
}(this, function(root) {
    'use strict';
    var DateHelper = function() {
        var i = DateHelper.prototype.instance;
        if (i && i instanceof DateHelper) {
            return i;
        } else {
            DateHelper.prototype.instance = this;
        }
    };

    (function() {
        this.constructor = DateHelper;

        //本地化，目前包含中文与英文
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
         * 添加本地化
         * @param {String} name  本地化名称
         * @param {Object} locale 本地化数据
         */
        this.addLocale = function(name, locale) {
            name && locale && (this.i18n[name] = locale);
            return this;
        };

        /**
         * 设置默认本地化
         * @param {String} name 本地化名称
         */
        this.setLocale = function(name) {
            this.locale = name;
            return this;
        };

        this._get2Year = function(date) {
            return (date.getFullYear() + "").replace(/\d{2}$/, "00") - 0;
        };

        this._get2 = function(value) {
            return value < 10 ? "0" + value : value;
        };

        this._getAmPm = function(date) {
            return date.getHours() < 12 ? 0 : 1;
        };

        //获取相对应的日期相关数据
        this._getValueByPattern = function(fmt, date) {
            var self = this;
            var patterns = {
                yyyy : date.getFullYear(),
                yy   : date.getFullYear() - self._get2Year(date),
                MMMM : self.i18n[self.locale].month.full[date.getMonth()],
                MMM  : self.i18n[self.locale].month.abbr[date.getMonth()],
                MM   : self._get2(date.getMonth() + 1),
                M    : date.getMonth() + 1,
                dddd : self.i18n[self.locale].day.full[date.getDay()],
                ddd  : self.i18n[self.locale].day.abbr[date.getDay()],
                dd   : self._get2(date.getDate()),
                d    : date.getDate(),
                HH   : self._get2(date.getHours()),
                H    : date.getHours(),
                mm   : self._get2(date.getMinutes()),
                m    : date.getMinutes(),
                ss   : self._get2(date.getSeconds()),
                s    : date.getSeconds(),
                aa   : self.i18n[self.locale].amPm.full[self._getAmPm(date)],
                a    : self.i18n[self.locale].amPm.abbr[self._getAmPm(date)]
            };
            return patterns[fmt];
        };

        /**
         * 格式化日期
         * @param  {Date} date     日期
         * @param  {String} format 日期格式
         * @return {String}        格式化以后的日期
         */
        this.format = function(date, format) {
            var self = this;
            if(!date) return;

            format = format || "yyyy-MM-dd";
            
            format = format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|mm|m|ss|s|aa|a)/g, function(part) {
                return self._getValueByPattern(part, date);
            });
            return format;
        };

        /**
         * 转换日期
         * 此方法存在一个BUG
         * 例如：dateHelper.parse("2015-1112","yyyy-MMdd");//1112会被计算在MM内。
         * 所以在使用parse方法时，每一个串使用字符分隔开。类似于：dateHelper.parse("2015-11-12","yyyy-MM-dd");
         * @param  {String} input  字符串
         * @param  {String} format 格式化字符串
         * @return {Date}          格式化的日期
         */
        this.parse = function(input, format) {
            if(!input || !format) return;
            var parts = input.match(/(\d+)/g),
                i = 0,
                fmt = {};

            // extract date-part indexes from the format
            format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function(part) {
                fmt[part] = i++;
            });

            var year = parts[fmt['yyyy']] || ( parseInt( parts[fmt['yy']] , 10 ) + this._get2Year(new Date())) || 0,

                month = (parts[fmt['MM']] - 1) || (parts[fmt['M']] - 1) || 0,

                day = parts[fmt['dd']] || parts[fmt['d']] || 0,

                hour = parts[fmt['HH']] || parts[fmt['H']] || 0,

                minute = parts[fmt['mm']] || parts[fmt['m']] || 0,

                second = parts[fmt['ss']] || parts[fmt['s']] || 0;

            return new Date(year, month, day, hour, minute, second);
        };
    }).call(DateHelper.prototype);

    var dateHelper = new DateHelper();

    // 将 parseDate 方法绑定在String原型上
    String.prototype.parseDate = function(format){
        return dateHelper.parse(this,format);
    };

    // 将 format 方法绑定在Date原型上
    Date.prototype.format = function(format){
        return dateHelper.format(this,format);
    };

    return dateHelper;
}));