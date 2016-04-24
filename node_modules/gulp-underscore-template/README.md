# gulp-underscore-template

This plugin compiles a set of underscore template files into one commonjs module.

## Usage

In your gulpfile simply pipe every html file into this plugin, then concat them.

It is suggested to minify your html before compiling them.

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var template = require('gulp-underscore-template');
gulp.src('./templates/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        conservativeCollapse: true
    }))
    .pipe(template())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./lib/'))
```

Suggest your file structure is as below:

```
templates
  |- some-page.html
  |- another-page.html
```

Then use the compiled template in your code:

```javascript
var templates = require('./lib/templates');
var tpl1 = templates['some-page'];
var resultHtml = tpl1({ data: 123 });
```

For template syntax please see [underscore template docs](http://underscorejs.org/#template);
