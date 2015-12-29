var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer")
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var sourcemaps = require('gulp-sourcemaps');

//　自動更新
gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});

//htmlタスク
gulp.task('html',function(){
  gulp.src('./*.html')          //実行するファイル
    .pipe(plumber())
    //.pipe(gulp.dest("./*.html"))
    .pipe(browser.reload({stream:true}))
});

// sass compile
gulp.task("sass", function() {
    gulp.src("./css/*.scss")
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', "ie 10"],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./css"))
        .pipe(browser.reload({stream:true}))
});

// gulp監視
gulp.task("default",['server'], function() {
    gulp.watch("./css/*.scss",["sass"]);
    gulp.watch(['*.html'],['html']);    //htmlファイルを監視
    gulp.watch(['./css/*.scss'],['sass']); //scssファイルを監視
    gulp.watch(['./css/*.css'],['html']); //cssファイルを監視
});
