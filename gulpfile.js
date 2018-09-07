const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const pump = require('pump')

gulp.task('build', err =>
  pump(
    gulp.src('src/*.js'),
    babel({
      presets: ['@babel/env']
    }),
    uglify(),
    gulp.dest('./'),
    () => {
      console.log('pipe finished', err);
    }
  )
);

gulp.task('default', ['build']);
