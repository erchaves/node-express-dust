const streamSeries = require('stream-series');
const del = require('del');
const path = require('path');
const babelify = require('babelify');
const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const dust = require('gulp-dust');
const concat = require('gulp-concat');
const tap = require('gulp-tap');
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

const viewsPath = path.join(__dirname, 'src/views');
const dist = path.join(__dirname, 'dist');
const distImages = path.join(dist, 'images');
const distFonts = path.join(dist, 'fonts');
const fileExtRegex = /\.[^/.]+$/;

const env = process.env.NODE_ENV || 'development';
const isDev = env !== 'production';

const livereloadOnProdErr = function(){
    throw 'the watch task is only expected to run in development';
};
const livereload = isDev ? require('gulp-refresh') : livereloadOnProdErr;

var paths = {
  html: ['src/views/**/*.html'],
  scripts: ['src/scripts/**/*.js'],
  styles: ['src/styles/**/*.scss'],
  images: ['src/images/**/*'],
  fonts: ['src/fonts/**/*'],
  // used for static assets like robots.txt and sitemap.xml
  misc: ['src/misc/**/*'],
  dust: ['node_modules/dustjs-linkedin/dist/dust-core.min.js'],
  dustSetup: ['src/scripts/dust-setup.js'],
  dustPartials: ['src/views/partials/**/*.html'],
};

var onError = function(err) {
  gutil.beep();
  console.error(err.message);
}

var taskClean = function(){
  return del(dist);
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
    .pipe(dust({
      config: {
          // the dust whitespace parser is broken https://github.com/linkedin/dustjs/issues/238
        whitespace: true,
      },
    }))
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
    .pipe(gulp.dest(distImages));
};

var taskFonts = function () {
  return gulp.src(paths.fonts, {read: false})
    .pipe(gulp.dest(distFonts));
};

var taskMisc = function () {
  return gulp.src(paths.misc, {read: false})
    .pipe(gulp.dest(dist));
};

var getDustPartials = function () {
  return gulp.src(paths.dustPartials)
    .pipe(dust({
      name: file => {
        var relPath = path.relative(viewsPath, file.path);
        // strip ext
        var dustName = relPath.replace(fileExtRegex, '');

        return dustName;
      },
    }));
};

var taskDustBuild = function () {
  var dustSrc = gulp.src(paths.dust);
  var dustSetup = gulp.src(paths.dustSetup);
  var dustPartials = getDustPartials();

  return streamSeries(dustSrc, dustSetup, dustPartials)
    .pipe(concat('dust-build.js'))
    .pipe(gulp.dest(dist));
};

var taskScripts = function () {
  // todo add more read:false
  var process = gulp.src('src/scripts/main.js', {read: false})
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({
          presets: ['react', 'es2015'],
          plugins: [
            ['transform-react-jsx', {'pragma':'h'}],
          ],
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
  if (!isDev) {
    return livereloadOnProdErr();
  }

  livereload.listen();
  gulp.watch(paths.html, ['html']);
  gulp.watch([paths.scripts, paths.html], ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.dustPartials, ['dustBuild']);
};

gulp.task('clean', taskClean);

// workaround helpers until Gulp gets to 4.0 and has sync tasks built in
gulp.task('build', ['clean'], function () {
  taskHtml();
  taskStyles();
  taskImages();
  taskFonts();
  taskMisc();
  taskDustBuild();
  taskScripts();
  return true;
});

gulp.task('html', taskHtml);
gulp.task('scripts', taskScripts);
gulp.task('styles', taskStyles);
gulp.task('images', taskImages);
gulp.task('fonts', taskFonts);
gulp.task('misc', taskMisc);
gulp.task('dustBuild', taskDustBuild);
gulp.task('server', ['build'], taskServer);
gulp.task('watch', ['server'], taskWatch);
gulp.task('default', ['watch']);
