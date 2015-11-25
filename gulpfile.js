var gulp = require('gulp'),
    npmi = require('gulp-install'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),

    tsOpts = {
        module: "commonjs",
        noImplicitAny: true,
        sourceMap: true
    },

    builddir = 'buildOutput',
    sources = {
        ts: 'tests/*.ts'               
    };

gulp.task('ts', function () {
    return gulp
        .src(sources.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsOpts))
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(builddir));

});

gulp.task('clean', function (cb) {
    return del(builddir + '*', cb);
});

gulp.task('watch', ['default'], function () {
    gulp.watch([sources.ts], ['ts']);
});

// From gulp version 4.0 .start is not supported. 
gulp.task('default', ['clean'], function () {
    gulp.start('ts');
});