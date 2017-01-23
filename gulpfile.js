var gulp = require('gulp');
// todo: #dustArchitecture - try to consolidate dust imports
var dust = require('gulp-dust');
var scss = require('gulp-sass');
var path = require('path');
var nodemon = require('gulp-nodemon');
var bro = require('gulp-bro');
var del = require('del');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var fs = require('fs');
var babelify = require('babelify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var env = process.env.NODE_ENV || 'production';
var isDev = env !== 'production';
var livereload = isDev ? require('gulp-livereload') : null;
var dist = 'dist';

var paths = {
  html: ['src/views/**/*.html'],
  scripts: ['src/scripts/**/*.js'],
  styles: ['src/styles/**/*.scss'],
  images: ['src/images/**/*'],
  fonts: ['src/fonts/**/*'],
  // used for static assets like robots.txt and sitemap.xml
  misc: ['src/misc/**/*'],
  // grab the full version of dust for the front-end
  grabDust: ['node_modules/dustjs-linkedin/dist/dust-full.min.js'],
};

var onError = function(err) {
  gutil.beep();
  console.error(err.message);
}

var taskClean = function(){
  return del('./dist');
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

var taskHtml = function () {
  var process = gulp.src(paths.html)
    .pipe(dust())
    .pipe(gulp.dest(path.join(dist, 'views')));

    return process;
};

var taskStyles = function () {
  var postCssProcessors = [
    autoprefixer({ browsers: ['last 1 versions'] }),
  ];

  var process = gulp.src('./src/styles/main.scss')
    .pipe(newer(dist))
    .pipe(plumber({
      errorHandler: onError,
    }))
    .pipe(scss({
      paths: [path.join(__dirname, 'scss', 'includes')],
      sourceMap: true,
    }))
    .pipe(postcss(postCssProcessors))
    .pipe(gulp.dest(dist));

  if (isDev) {
    return process.pipe(livereload());
  } else {
    return process.pipe(minifyCSS())
      .pipe(gulp.dest(dist));
  }
};

var taskImages = function () {
  return gulp.src(paths.images)
    .pipe(rename({
      dirname: '',
    }))
    .pipe(gulp.dest('dist/images'));
};

var taskFonts = function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'));
};

var taskMisc = function () {
  return gulp.src(paths.misc)
    .pipe(gulp.dest('dist'));
};

var taskGrabDust = function () {
  return gulp.src(paths.grabDust)
    .pipe(gulp.dest('dist'));
};

var taskScripts = function () {
  // todo add more read:false
  var process = gulp.src('src/scripts/main.js', {read: false})
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({
          presets: ['es2015', {}],
        }),
      ],
      debug: (isDev),
    }))
    .pipe(gulp.dest(dist));

  if (isDev) {
    process.pipe(livereload());
  }

  return process;
};

var taskWatch = function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch([paths.scripts, paths.html], ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
};

gulp.task('clean', taskClean);

// workaround helpers until Gulp gets to 4.0 and has sync tasks built in
gulp.task('build', ['clean'], function () {
  taskHtml();
  taskStyles();
  taskImages();
  taskFonts();
  taskMisc();
  taskGrabDust();
  taskScripts();
  return true;
});

gulp.task('html', taskHtml);
gulp.task('scripts', taskScripts);
gulp.task('styles', taskStyles);
gulp.task('images', taskImages);
gulp.task('fonts', taskFonts);
gulp.task('misc', taskMisc);
gulp.task('grabDust', taskGrabDust);
gulp.task('server', ['build'], taskServer);
gulp.task('watch', ['server'], taskWatch);
gulp.task('default', ['watch']);
