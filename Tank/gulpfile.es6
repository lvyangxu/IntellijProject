var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// var htmlmin = require('gulp-htmlmin');
// var del = require('del');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', function () {

    //css bundle and minify
    let modules = ["manage","common","detail","guide","home","reserve"];
    modules.map(d=>{
        gulp.src(["web/modules/"+d+"/css/*.css"])
        .pipe(concatCss("bundle.css"))
            // .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest("../out/artifacts/Tank_war_exploded/modules/"+d+"/css"));
    });
 




});