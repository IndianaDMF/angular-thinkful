/*
- http://mindthecode.com/lets-build-an-angularjs-app-with-browserify-and-gulp/
-  https://github.com/basti1302/angular-browserify/blob/master/gulpfile.js
-  https://github.com/gulpjs/gulp/tree/master/docs/recipes
-  http://browserify.org/demos.html
-  https://blog.codecentric.de/en/2014/08/angularjs-browserify/
-
- https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917#.rhgoisose
-
-*/
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var stylish = require('jshint-stylish');
var notify = require("gulp-notify");

gulp.task('lint', function() {
    return gulp.src(['./app/*.js', './app/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
});

gulp.task('browserify', function() {
    // set up the browserify instance on a task basis
    var bundler = browserify({
        entries: './app/app.js',
        debug: true
    });

    bundler = watchify(bundler);

    var rebundle = function() {
        return bundler.bundle()
            .pipe(source('./app/app.js'))
            .pipe(ngAnnotate())
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.            
            //.pipe(uglify())
            .on('error', gutil.log)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/'))
    };

    bundler.on('update', rebundle);
    return rebundle()
});

gulp.task('annotate', function(){
   gulp.src('./app/**/*.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./test/')); 
});

gulp.task('templates', function() {
    gulp.src('./app/**/*.html')
      .pipe(gulp.dest('build/'))
});

gulp.task('content', function() {
    gulp.src(['./app/styles/*.css', './app/images/*.gif'])
        .pipe(gulp.dest('build/content/'))
});

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('build/content/'))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        port: process.env.PORT || 3000
    })
});

gulp.task('reload-js', ['browserify'], function(){
  browserSync.reload()
});

gulp.task('reload-templates', ['templates'], function(){
  browserSync.reload()
});

gulp.task('reload-css', ['content', 'bower'], function(){
    browserSync.reload()
});

gulp.task('watch', ['lint', 'templates', 'browserify', 'browser-sync'], function() { 
  gulp.watch('./app/**/*.js', ['lint', 'reload-js']);

  gulp.watch('./app/**/*.css', ['reload-css']);

  gulp.watch('./app/**/*.html', ['reload-templates']); 
  
  gutil.log(gutil.colors.bgGreen('Watching for changes...'))
});

gulp.task('default', ['watch']);

/** Testing 
 * 
 */

var karma = require('karma');
var path = require('path');
var karmaConfig = require('karma/lib/config').parseConfig;

function runKarma(configFilePath, options, cb) {

	configFilePath = path.resolve(configFilePath);

	var server = karma.server;
	var log=gutil.log, colors=gutil.colors;
	var config = karmaConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

	server.start(config, function(exitCode) {
        var message = 'Karma has exited with ' + colors.red(exitCode);
		log(message);        
		cb();
		process.exit(exitCode);
	});
    
    // server.on('run_complete', function(browsers, results){      
    //     notify(results);
    // });
}

/** single run */
gulp.task('test', function(cb) {
	runKarma('karma.conf.js', {
		autoWatch: false,
		singleRun: true
	}, cb);
});

gulp.task('tdd', function(cb) {
	runKarma('karma.conf.js', {
		autoWatch: true,
		singleRun: false
	}, cb);
});