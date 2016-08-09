/**
 * Created by karl on 2016/8/1.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

let modules = ['common', 'manage'];
gulp.task('default', modules);

modules.map(d=> {
    gulp.task(d, ()=> {
        gulp.src("web/Modules/" + d + "/js/*.js")
            .pipe(uglify())
            .pipe(gulp.dest("../out/artifacts/MaintenceSystem_war_exploded/Modules/"+d+"/js"));
    }); 
});

gulp.watch("web/**/*.js",(event)=>{
    gulp.task('default');
    console.log("watcher done");
});

