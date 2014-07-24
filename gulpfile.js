var gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-spawn-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    espower = require('gulp-espower'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    merge = require('lodash.merge'),
    config = {
        bundle: {
            standalone: 'assert',
            srcFile: './lib/power-assert.js',
            destDir: './build',
            destName: 'power-assert.js'
        },
        test: {
            base: './test/',
            pattern: '**/*_test.js',
            poweredDir: './espowered_tests/',
            toBeInstrumented: function () {
                return this.base + 'tobe_instrumented/' + this.pattern;
            },
            notToBeInstrumented: function () {
                return this.base + 'not_tobe_instrumented/' + this.pattern;
            },
            amd: 'test/test-amd.html',
            browser: 'test/test-browser.html'
        }
    };

function runMocha(pattern, extraOptions) {
    extraOptions = extraOptions || {};
    return gulp
        .src(pattern, {read: false})
        .pipe(mocha(merge({
            bin: './node_modules/.bin/mocha',
            R: 'dot',
            c: true
        }, extraOptions)))
        .on('error', gutil.log);
}

function runMochaWithEspowerLoader() {
    return runMocha(config.test.base + config.test.pattern, {r: './enable_power_assert'});
}

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        port: 9001,
        keepalive: true
    });
});

gulp.task('watch', function () {
    gulp.watch('{lib,test}/**/*.js', runMochaWithEspowerLoader);
    runMochaWithEspowerLoader();
});

gulp.task('clean_bundle', function () {
    return gulp
        .src(config.bundle.destDir, {read: false})
        .pipe(clean());
});

gulp.task('bundle', function() {
    var bundleStream = browserify(config.bundle.srcFile).bundle({standalone: config.bundle.standalone});
    return bundleStream
        .pipe(source(config.bundle.destName))
        .pipe(gulp.dest(config.bundle.destDir));
})

gulp.task('clean_espower', function () {
    return gulp
        .src(config.test.poweredDir, {read: false})
        .pipe(clean());
});

gulp.task('copy_others', function(){
    return gulp
        .src(config.test.notToBeInstrumented(), {base: config.test.base})
        .pipe(gulp.dest(config.test.poweredDir));
});

gulp.task('espower', function() {
    return gulp
        .src(config.test.toBeInstrumented(), {base: config.test.base})
        .pipe(espower())
        .pipe(gulp.dest(config.test.poweredDir));
});

gulp.task('unit', function () {
    return runMochaWithEspowerLoader();
});

gulp.task('test_generated', function () {
    return runMocha(config.test.poweredDir + config.test.pattern);
});

gulp.task('test_amd', function () {
    return gulp
        .src(config.test.amd)
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test_browser', function () {
    return gulp
        .src(config.test.browser)
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test', function() {
    runSequence(
        ['clean_espower', 'clean_bundle'],
        ['espower', 'copy_others', 'bundle'],
        ['unit','test_generated','test_browser','test_amd']
    );
});

gulp.task('just_test', ['unit','test_generated','test_browser','test_amd']);
gulp.task('clean', ['clean_espower', 'clean_bundle']);