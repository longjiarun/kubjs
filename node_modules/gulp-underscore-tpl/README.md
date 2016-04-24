## Install

```
npm install gulp-underscore-tpl --save
```

## Options

options see [underscore template](http://underscorejs.org/#template).

## How to use

```
var template = require('gulp-underscore-tpl')
gulp.task('tpl', function() {
    return gulp.src('tpl/*.html')
        .pipe(template(/*options*/))
        .pipe(gulp.dest('js/tpl'))
});
```

## Input

tpl.html

```
<h1><%= name%></h1>
```

## Output
tpl.js

```
module.exports = function(data){
    var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
    __p+='<h1>'+
    ((__t=( name))==null?'':__t)+
    '</h1>';
    return __p;
};
```

## LICENSE
MIT [http://www.opensource.org/licenses/mit-license.php]