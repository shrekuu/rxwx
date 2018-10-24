const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const pump = require('pump')

gulp.task('default', err =>
  pump(
    gulp.src(['rx.js', 'rxwx.js']),
    babel({
      presets: ['@babel/env']
    }),
    uglify(),
    rename({
      suffix: '.min'
    }),
    gulp.dest('./')
  )
)
