/**
 * 解决数字计算问题,没有对参数进行校验，会影响效率，所以保证传入到方法中的参数为数值型
 * 亲，出现bug,你知道怎么找到我
 * 使用：
 *     var a = 0.1,b=0.2;
 *     a.add(b).add(a);
 *
 *     a.toFixed2(2) //默认四舍五入
 *     a.toFixed2(2,true) 不进行四舍五入
 
 * author : longjia@koudai.com
 */
!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root);
    } else {
        root.calculator = factory(root);
    }
}(this,function(root){
    'use strict';
    var Calculator = function(){
        var i = Calculator.prototype.instance;
        if( i && i instanceof Calculator){
            return i;
        }else{
            Calculator.prototype.instance = this;
        }
    };

    (function(){
        this.constructor = Calculator;

        //未排除 NaN
        this.isNumber = function(value){
            return Object.prototype.toString.call(value) === "[object Number]";
        };

        /**
         * 得到数值的小数点位数
         * @param  {Number} value
         * @return {Number}        位数
         */
        this.getDecimalDigit = function(value){
            value = Math.abs(value);
            var l = value.toString().length - parseInt(value,10).toString().length -1;
            return  l < 0 ? 0 : l;
        };

        /**
         * 通过正则匹配得到数值的小数点位数，效率没有上面方法高
         * @param  {Number} value
         * @return {Number}        位数
         */
        this._getDecimalDigit = function(value){
            var reg = /^-?\d+(\.(\d+))?/,ary = value.toString().match(reg);

            return ary && ary[2] ? ary[2].length : 0;
        };

        /**
         * 四舍五入或者不四舍五入保留指定小数位
         * 类似于Number.toFixed (解决ie下 Math.toFixed 函数bug)
         * @param  {Number}  value 数值
         * @param  {Number}  l     保留小数点位数
         * @param  {Boolean} f     是否进行四舍五入 default:四舍五入 true:不进行四舍五入
         * @return {String}        保留小数后String
         */
        this.toFixed2 = function(value,l,f){
            var reg = /^(-?\d+)(\.(\d+))?/,m = value.toString().match(reg),i,d,z;
            if(l<0) return value;
            if(m){
                //匹配 .11
                i = m[1] || "0";

                value = Number(l != 0 ? i + ( m[3] ? "." + m[3].substr(0,l) : "") : i);

                //默认进行四舍五入
                if(!f && m[3] && parseInt(m[3].substr(l,1),10) >= 5){
                    value = this.add(value, value >= 0 ? Math.pow(10,-l) : -Math.pow(10,-l) );
                }

                z = l - this.getDecimalDigit(value);
                value = value.toString();

                value = z > 0 ? value + (z === l ? "." : "") + new Array(z+1).join("0") : value;

                return value;
            }
        };
        
        /**
         * 将a 与 b 乘以相同倍数,得到乘以相同倍数的数值和放大倍数
         * @param  {Number} a
         * @param  {Number} b
         */
        function calculate (a,b){
            var _a,_b,r1 = this.getDecimalDigit(a),r2 =this.getDecimalDigit(b), d = r1 -r2 , _d = Math.pow(10,Math.abs(d)) , m = Math.pow(10, Math.max(r1, r2));
            
            _a = Number(a.toString().replace(".",""));
            _b = Number(b.toString().replace(".",""));

            a = r1 ? d < 0 ? _a * _d : _a : a * m;
            b = r2 ? d > 0 ? _b * _d : _b : b * m;

            return {
                a:a,
                b:b,
                m:m
            };
        }

        //加法
        this.add = function(a,b){
            var o = calculate.call(this,a,b);
            return (o.a + o.b) / o.m;
        };

        //减法
        this.sub = function(a,b){
            return this.add(a,-b);
        };

        //乘法
        this.mul = function(a,b){
            var o = calculate.call(this,a,b);
            return ( o.a * o.b ) / (o.m * o.m);
        };

        //除法
        this.div = function(a,b){
            var o = calculate.call(this,a,b);
            return o.a / o.b;
        };

        //添加到 Number.prototype 上
        var f = ["add","sub","mul","div","toFixed2"],i=f.length,proto = Calculator.prototype;
        while(i--){
            (function(i){
                Number.prototype[f[i]] = function(b,c){
                    return proto[f[i]].call(proto,this,b,c);
                };
            })(i);
        }

    }).call(Calculator.prototype);
    
    return new Calculator();
}));