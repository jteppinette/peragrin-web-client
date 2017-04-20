const gulp = require("gulp"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    templates = require("gulp-angular-templatecache"),
    annotate = require("gulp-ng-annotate"),
    jslint = require("gulp-jslint"),
    ignore = require("gulp-ignore"),
    bower = require("main-bower-files");

const dir = {
    output: "public/",
    src: "src/"
}

gulp.task("index", function() {
    return gulp.src(dir.src+"index.html")
        .pipe(gulp.dest(dir.output));
});

gulp.task("assets", function() {
    return gulp.src(dir.src+"assets/**/*")
        .pipe(gulp.dest(dir.output));
});

gulp.task("app:js", function() {
    return gulp.src(dir.src+"**/*.js")
        .pipe(jslint())
        .pipe(ignore.exclude("*.spec.js"))
        .pipe(concat("app.js"))
        .pipe(annotate())
        .pipe(gulp.dest(dir.output));
});

gulp.task("vendor:js", function() {
    return gulp.src(bower({filter: "**/*.js"}))
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(dir.output));
});

gulp.task("templates", function() {
    return gulp.src(dir.src+"**/*.html")
        .pipe(templates("templates.js", {module: "templates", standalone: true}))
        .pipe(gulp.dest(dir.output));
});

gulp.task("css", function() {
    return gulp.src(dir.src+"styles.scss")
        .pipe(sass())
        .pipe(gulp.dest(dir.output));
});

gulp.task("fonts", function() {
    return gulp.src("./bower_components/bootstrap-sass/assets/fonts/bootstrap/*", {base: "./bower_components/bootstrap-sass/assets"})
        .pipe(gulp.dest(dir.output));
});

gulp.task("build", ["index", "assets", "app:js", "vendor:js", "templates", "css", "fonts"]);

gulp.task("default", ["build"]);
