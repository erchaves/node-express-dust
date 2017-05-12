const streamSeries = require('stream-series');
const del = require('del');
const path = require('path');
const babelify = require('babelify');
const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const concat = require('gulp-concat');
const scss = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const bro = require('gulp-bro');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const minifyHTML = require('gulp-minify-html');
const minifyCSS = require('gulp-minify-css');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const sugarcone = require('@erchaves/sugarcone');
const sugarconeConfig = require('./sugarcone-config');
const pathDist = sugarconeConfig.pathDist;
const distImages = path.join(pathDist, 'images');
const distFonts = path.join(pathDist, 'fonts');

const env = process.env.NODE_ENV || 'development';
const isDev = env !== 'production';

const livereloadOnProdErr = function(){
    throw 'the watch task is only expected to run in development';
};

const livereload = isDev ? require('gulp-refresh') : livereloadOnProdErr;

const sugarconeGulpUtils = sugarcone.gulpUtils(Object.assign({
  isDebug: isDev,
  // todo: clarify this.
  dustExtensions: path.join(__dirname, 'dust-extensions.js'),
}, sugarconeConfig));

const globs = {
  html: sugarconeGulpUtils.globs.views,
  dustPartials: sugarconeGulpUtils.globs.partials,
  scripts: 'src/scripts/**/*.js',
  styles: 'src/styles/**/*.scss',
  images: 'src/images/**/*',
  fonts: 'src/fonts/**/*',
  // used for static assets like robots.txt and sitemap.xml
  misc: 'src/misc/**/*',
};

var onError = function(err) {
  gutil.beep();
  console.error(err.message);
}

var taskClean = function(){
  return del(pathDist);
};

var taskServer = function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    ignore: ['src/', 'dist/'],
    env: {
      'NODE_ENV': 'development'
    },
  });
};

var taskStyles = function () {
  var postCssProcessors = [
    autoprefixer({ browsers: ['last 1 versions'] }),
  ];

  var process = gulp.src('./src/styles/main.scss')
    .pipe(newer(pathDist))
    .pipe(plumber({
      errorHandler: onError,
    }))
    .pipe(scss({
      paths: [path.join(__dirname, 'scss', 'includes')],
      sourceMap: true,
    }))
    .pipe(postcss(postCssProcessors))
    .pipe(gulp.dest(pathDist));

  if (isDev) {
    return process.pipe(livereload());
  } else {
    return process.pipe(minifyCSS())
      .pipe(gulp.dest(pathDist));
  }
};

var taskImages = function () {
  return gulp.src(globs.images)
    .pipe(rename({
      dirname: '',
    }))
    .pipe(gulp.dest(distImages));
};

var taskFonts = function () {
  return gulp.src(globs.fonts)
    .pipe(rename({
      dirname: '',
    }))
    .pipe(gulp.dest(distFonts));
};

var taskMisc = function () {
  return gulp.src(globs.misc)
    .pipe(gulp.dest(pathDist));
};

var taskScripts = function () {

  var process;

  var transformOptions = [
    babelify.configure({
      presets: ['es2015'],
    }),
  ];

  if (!isDev) {
    transformOptions.push([ 'uglifyify', { global: true } ]);
  }

  process = gulp.src('src/scripts/main.js')
    .pipe(bro({
      insertGlobals: true,
      transform: transformOptions,
      debug: isDev,
    }))
    .pipe(gulp.dest(pathDist));

  if (isDev) {
    process.pipe(livereload());
  }

  return process;
};

var taskWatch = function () {
  if (!isDev) {
    return livereloadOnProdErr();
  }

  livereload.listen();
  gulp.watch(globs.html, ['sugarcone']);
  gulp.watch(globs.misc, ['misc']);
  gulp.watch([globs.scripts, globs.html], ['scripts']);
  gulp.watch(globs.images, ['images']);
  gulp.watch(globs.styles, ['styles']);
  gulp.watch(globs.dustPartials, ['sugarcone']);
};

gulp.task('clean', taskClean);

// workaround helpers until Gulp gets to 4.0 and has sync tasks built in
gulp.task('build', ['clean'], function () {
  taskStyles();
  taskImages();
  taskFonts();
  taskMisc();
  sugarconeGulpUtils.task();
  taskScripts();
  return true;
});

gulp.task('sugarcone', sugarconeGulpUtils.task);
gulp.task('scripts', taskScripts);
gulp.task('styles', taskStyles);
gulp.task('images', taskImages);
gulp.task('fonts', taskFonts);
gulp.task('misc', taskMisc);
gulp.task('server', ['build'], taskServer);
gulp.task('watch', ['server'], taskWatch);
gulp.task('default', ['watch']);
