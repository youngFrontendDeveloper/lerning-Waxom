// 'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        lib: 'build/js/lib/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        video: 'build/video/'
        // favicon: 'build/favicon/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',  
        lib: 'src/js/lib/**/*.js',     
        style: 'src/style/style.less',
        img: 'src/img/**/*.*',
        webp: 'src/img/**/*.{png,jpg}',
        fonts: 'src/fonts/**/*.*',
        sprite: 'src/img/**/*.svg',
        video: 'src/video/*.*'
        // favicon: 'src/favicon.ico'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/style/**/*.less',
        img: 'src/img/**/*.*',
        webp: 'src/img/**/*.{png,jpg}',
        fonts: 'srs/fonts/**/*.*',
        sprite: 'src/img/**/*.svg',
        video: 'src/video/*.*'
    },
    clean: './build/*'
};

/* настройки сервера */
var config = {
    server: {
        baseDir: './build'      
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    less = require('gulp-less'), // модуль для компиляции Less в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    // jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    // pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    del = require('del'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename');
    svgstore = require("gulp-svgstore");
    webp = require("gulp-webp");

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:build', function () {
    return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function () {
    return gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(less()) // less -> css
        .pipe(autoprefixer()) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // получим файл main.js    
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// перенос favicon
// gulp.task('favicon:build', function () {
//     return gulp.src(path.src.favicon)
//         .pipe(gulp.dest(path.build.favicon));
// });


// перенос библиотеки js
// gulp.task('lib:build', function () {
//   return gulp.src(path.src.lib)
//       .pipe(gulp.dest(path.build.lib));
// });

// обработка картинок
gulp.task('sprite:build', function () {
  return gulp.src(path.src.sprite)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(path.build.img))
    .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

gulp.task('image:build', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

gulp.task('webp:build', function () {
  return gulp.src(path.src.webp)
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest(path.build.img));
});

// обработка видео
gulp.task("video:build", function () {
    return gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
        // .pipe(reload({stream:true}))
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// удаление каталога build
gulp.task('clean:build', function () {
    return del(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function () {
  return cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            // 'lib:build',
            'fonts:build',
            // 'favicon:build',
            'image:build',
            'sprite:build',
            'webp:build',
            'video:build'
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.sprite, gulp.series('sprite:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.webp, gulp.series('webp:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
    gulp.watch(path.watch.video, gulp.series('video:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver','watch')
));
