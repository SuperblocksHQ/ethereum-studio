const gulp = require('gulp');

gulp.task('dashboard', () =>
  gulp.src('packages/dashboard/www/**/*').pipe(gulp.dest('www'))
);

gulp.task('statics', () =>
  gulp.src('packages/dashboard/public/**/*').pipe(gulp.dest('www'))
);

gulp.task('default', [
  'dashboard',
  'statics',
]);
