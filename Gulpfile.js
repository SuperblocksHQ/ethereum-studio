const gulp = require('gulp');
const { series } = require('gulp');

function copyDashboard() {
    return gulp
        .src('packages/dashboard/dist/**/*')
        .pipe(
            gulp.dest('www')
        );
}

function copyWebServer() {
    return gulp
        .src('packages/web-server/dist/**/*')
        .pipe(
            gulp.dest('www')
        );
}

// export tasks
exports.copyDashboard = copyDashboard;
exports.copyWebServer = copyWebServer;
exports.default = series(copyDashboard, copyWebServer);
