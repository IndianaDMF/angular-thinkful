var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync');

var watchify = require('watchify');


gulp.task('lint', function() {
    return gulp.src('src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
});

gulp.task('browserify', function(){
	var bundler = browserify({
		entries: 'src/main.js',
		debug: true		
	});
    
     bundler = watchify(bundler);
	
	  var rebundle = function() {
        return bundler.bundle()
            .pipe(source('src/main.js'))
            .pipe(ngAnnotate())
            .pipe(buffer())			
            .pipe(sourcemaps.init({
                loadMaps: true
            }))        
            .on('error', gutil.log)     
            .pipe(sourcemaps.write('./'))       
            .pipe(gulp.dest('build/'))
    };
	
    bundler.on('update', rebundle);
	return rebundle();
});

gulp.task('templates', function() {
    gulp.src('src/*.html')
      .pipe(gulp.dest('build/'))
});

gulp.task('content', function() {
    gulp.src('src/*.css')
        .pipe(gulp.dest('build/content/'))
});

gulp.task('reload-js', ['browserify'], function(){
  browserSync.reload()
});

gulp.task('reload-templates', ['templates'], function(){
  browserSync.reload()
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        port: process.env.PORT || 3000
    })
});

gulp.task('watch', ['lint', 'templates', 'content', 'browserify', 'browser-sync'], function() { 
  gulp.watch('src/*.js', ['lint', 'reload-js']);

  gulp.watch('src/*.html', ['reload-templates']);
  gutil.log(gutil.colors.bgGreen('Watching for changes...'))
});

gulp.task('default', ['watch']);