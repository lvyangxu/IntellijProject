/**
 * Created by karl on 2016/8/1.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('default', function() {
    // place code for your default task here
    gulp.src("MaintenceSystem/*.js")
        .pipe(uglify())
        .pipe(gulp.dest('build/minified_templates'));

});