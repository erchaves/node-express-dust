var gulp = require('gulp');
var dust = require('gulp-dust');
var scss = require('gulp-sass');
var path = require('path');
var nodemon = require('gulp-nodemon');
var bro = require('gulp-bro');
var del = require('del');
var envify = require('envify/custom');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var jsonminify = require('gulp-jsonminify');
var fs = require('fs');
var babelify = require('babelify');
var inject = require('gulp-inject');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');
var svgmin = require('gulp-svgmin');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var pixrem = require('pixrem');
var autoprefixer = require('autoprefixer');
var Server = require('karma').Server;
var env = process.env.NODE_ENV || 'production';
var livereload = env === 'development' ? require('gulp-livereload') : null;
var dist = 'dist';
var config = require('./etc/.env.js');

var paths = {
  html: ['src/views/**/*.html'],
  scripts: ['src/scripts/**/*.js'],
  styles: ['src/styles/**/*.scss'],
  images: ['src/images/**/*'],
  fonts: ['src/fonts/**/*'],
  // used for static assets like robots.txt and sitemap.xml
  misc: ['src/misc/**/*'],
};

// wraps each task with another task that declares
// a dependeny on the cleaningTaskFunction.
// Returns the list of wrapped task names
var cleanTaskHelper = function (tasks, cleaningTaskFunction) {
  var taskPrefix = 'cleantask_';
  var cleaningTaskName = taskPrefix + 'clean';
  var taskList = [];

  // workaround helpers until Gulp gets to 4.0 and has sync tasks built in
  var registerTasks = function(tasks) {
    tasks.forEach(function(task) {
      var taskName = taskPrefix + task.name;

      // register each task with gulp
      gulp.task(taskName, [cleaningTaskName], function () {
        task();
      });

      // and save the name for ref later.
      taskList.push(taskName);
    });
  };

  // register the actual cleaning task
  gulp.task(cleaningTaskName, cleaningTaskFunction);

  // register the tasks
  registerTasks(tasks);

  // return the list of wrapped tasks
  return taskList;
};

var onError = function(err) {
  gutil.beep();
  console.error(err.message);
}

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
    // .pipe(newer(dist))
    .pipe(dust())
    // .pipe(minifyHTML({
    //   comments: true,
    //   spare: true,
    //   empty: true,
    //   quotes: true,
    // }))
    // .pipe(rename(function(path) {
    //   path.dirname = path.dirname.replace('/html', '');
    // }))
    .pipe(gulp.dest(path.join(dist, 'views')));

    return process;
};

var taskStyles = function () {
  var postCssProcessors = [
    mqpacker,
    autoprefixer({ browsers: ['last 1 versions'] }),
    pixrem,
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

  if (env == 'development') {
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

var taskScripts = function () {
  // todo add more read:false
  var process = gulp.src('src/scripts/main.js', {read: false})
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({ presets: ['es2015'] }),
        envify(config),
      ],
      debug: (env == 'development'),
    }))
    .pipe(gulp.dest(dist));

  if (env == 'development') {
    process.pipe(livereload());
  }

  return process;
};

var taskWatch = function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch([paths.scripts, paths.html, '../modules/**/*'], ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
};

var cleanDist = function(){
  return del('./dist');
};

var distTasks = [
  taskHtml,
  taskScripts,
  taskStyles,
  taskImages,
  taskFonts,
  taskMisc,
];

var wrappedCleanTasks = cleanTaskHelper(distTasks, cleanDist);

gulp.task('clean', cleanDist);
gulp.task('clean-build', wrappedCleanTasks);
gulp.task('html', taskHtml);
gulp.task('scripts', taskScripts);
gulp.task('styles', taskStyles);
gulp.task('images', taskImages);
gulp.task('fonts', taskFonts);
gulp.task('misc', taskMisc);
gulp.task('server', ['clean-build'], taskServer);
gulp.task('watch', ['server'], taskWatch);
gulp.task('build', ['scripts', 'html', 'styles', 'images', 'fonts', 'misc']);
gulp.task('default', ['watch']);
