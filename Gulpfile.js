const gulp = require('gulp');
const { series } = require('gulp');

function copyDashboard() {
    return gulp
        .src('packages/dashboard/dist/**/*')
        .pipe(
            gulp.dest('www')
        );
}

// export tasks
exports.copyDashboard = copyDashboard;
exports.default = series(copyDashboard);
