var gutil = require('gulp-util'),
    through = require('through2'),
    _ = require('underscore'),
    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-underscore-tpl';

module.exports = function (options) {
    options = options || {};

    function compile (file) {
        var html = file.contents.toString(),
            template = _.template(html, options).source;
        return 'module.exports = ' + template + ';';
    }

    return through.obj(function (file, enc, callback) {

        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }

        var filePath = file.path;

        try {
            var content = compile(file);

            file.contents = new Buffer(content);

            file.path = gutil.replaceExtension(file.path, '.js');
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, err, {fileName: filePath}));
            return callback();
        }

        this.push(file);
        callback();
    });
};
