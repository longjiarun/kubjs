/**
 * 发布流程
 */
var gulp = require("gulp"),
    _ = require("underscore"),
    scp = require('gulp-scp2'),
    ssh = require('gulp-ssh'),
    zip = require('gulp-zip'),
    config={
        ip : '10.2.1.203',
        username : 'longjia',
        pwd : 'longjia@812',
        rootDir : 'kubapi',
        port : '22',
        sh : 'H5.sh',
        build : "build"
    };

gulp.task('zip',function(){
    return gulp.src(config.build+'/**/*')
        .pipe(zip(config.rootDir+'.zip'))
        .pipe(gulp.dest(config.build));
});

gulp.task('sh',function(){
    return gulp.src('H5.sh')
        .pipe(scp({
            host: config.ip,
            port:config.port,
            username: config.username,
            password: config.pwd,
            dest: '/home/'+config.username+'/',
            agent: process.env['SSH_AUTH_SOCK'],
            agentForward: true,
            watch: function(client) {
                client.on('write', function(o) {
                    console.log('write %s', o.destination);
                });
            }
        }))
        .on('error',function(err){
            console.log(err);
        });
});

gulp.task('scp',['zip'],function(){
    return gulp.src(config.build+"/"+config.rootDir+'.zip')
        .pipe(scp({
            host: config.ip,
            port:config.port,
            username: config.username,
            password: config.pwd,
            dest: '/home/'+config.username+'/',
            agent: process.env['SSH_AUTH_SOCK'],
            agentForward: true,
            watch: function(client) {
                client.on('write', function(o) {
                    console.log('write %s', o.destination);
                });
            }
        }))
        .on('error',function(err){
            console.log(err);
        });
});

gulp.task('publish',['scp'],function () {
    var gulpSSH = ssh({
        ignoreErrors: true,
        sshConfig: {
            host: config.ip,
            port: config.port,
            username: config.username,
            password:config.pwd
        }
    });
    return gulpSSH
        .exec(['expect '+config.sh+' '+config.rootDir], {filePath: 'commands.log'})
        .pipe(gulp.dest(config.build+'/logs'));
});

module.exports  = function(options){
    config = _.extend(config,options||{});
}