var koa = require('koa'),
    path = require('path'),
    send = require('koa-send'),
    app = koa();


var port = 3300;

app.use(function*(next) {
    var filePath;

    filePath = path.join(process.cwd(), this.request.path);

    yield send(this, filePath, {
        root: '/',
        index: 'index.html'
    });
});


app.listen(port);

console.log('服务启动。地址 http://dev.weidian.com:' + port);
