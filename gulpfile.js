const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const imagemin = require('gulp-imagemin')
const server = require('browser-sync').create()
const del = require('del')
const exec = require('gulp-exec')

function bundleJS() {
  return gulp
    .src('src/js/index.js', { allowEmpty: true })
    .pipe(exec('parcel build src/js/index.js --out-dir build/js'))
    .pipe(plumber())
    .pipe(server.stream())
}

function style() {
  return gulp
    .src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 versions'],
          grid: true
        })
      ])
    )
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
}

function views() {
  return gulp
    .src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(
      pug({
        basedir: './src/pug',
        pretty: true
      })
    )
    .pipe(gulp.dest('build'))
    .pipe(server.stream())
}

function images() {
  return gulp
    .src('src/img/**/*.{png,jpg,gif}')
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true })
      ])
    )
    .pipe(gulp.dest('build/img'))
}

function clean() {
  return del('build')
}

function copy() {
  return gulp
    .src(['src/fonts/**/*.{woff,woff2,ttf}', 'src/img/**/*.svg'], {
      base: 'src'
    })
    .pipe(gulp.dest('build'))
}

// function js() {
//   return gulp
//     .src('src/js/**/*.js')
//     .pipe(gulp.dest('build/js'))
//     .pipe(server.stream())
// }

function build(done) {
  gulp.series(clean, copy, bundleJS, images, views, style, seriesDone => {
    seriesDone()
    done()
  })()
}

gulp.task('bundleJS', bundleJS)
gulp.task('style', style)
gulp.task('views', views)
gulp.task('images', images)
gulp.task('clean', clean)
gulp.task('copy', copy)
gulp.task('build', build)
// gulp.task('js', js)

gulp.task('serve', () => {
  server.init({
    server: {
      baseDir: 'build',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    notify: false,
    open: false,
    cors: true,
    ui: false
  })

  gulp.watch('src/scss/**/*.{css,scss}', style)
  gulp.watch('src/pug/**/*.pug', views)
  gulp.watch('src/js/**/*.js', bundleJS)
})
