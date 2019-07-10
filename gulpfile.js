// 必要プラグインの読み込み (var gulp = ~ でも可)
const gulp = require("gulp");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const WebpackStrip = require("strip-loader");
const LicenseInfoWebpackPlugin = require("license-info-webpack-plugin").default;

const pug = require("gulp-pug");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const sassVariables = require("gulp-sass-variables");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const browserSync = require("browser-sync");
const runSequence = require("run-sequence");
const watch = require("gulp-watch");

const pngquant = require("imagemin-pngquant");
const mozjpeg = require("imagemin-mozjpeg");
const imagemin = require("gulp-imagemin");

const minimist = require("minimist");
const del = require("del");

// webpackの設定ファイルの読み込み
const config = require("./config");

let argv = minimist(process.argv.slice(2));
let targettype = argv.env;

let DIST = "";
if (targettype == "stage") {
  DIST = "./dist/stage/";
  console.log("🐥", targettype, "🐥");
} else if (targettype == "production") {
  DIST = "./dist/prod/";
  console.log("🐓", targettype, "🐓");
} else {
  DIST = "./dist/dev/";
  console.log("🥚", targettype, "🥚");
}

/**
 * Default
 */
gulp.task("default", () => {
  console.log("🚀", "Build", "🚀");
  runSequence(
    "clean",
    "pug",
    "copy",
    "images",
    "sass",
    "js",
    "watch",
    "browser-sync"
  );
});

/**
 * Watchs
 */
gulp.task("watch", function() {
  // gulp.watch(SRC_JS + "**/*.js", ['js']); // webpackStream プラグインのなかで watch している。ここで監視するとエラー発生時に止まってしまう。
  watch(SRC_SCSS + "**/*.scss", function() {
    gulp.start("sass");
  });
  watch([SRC_PUG + "**/*.pug"], function() {
    gulp.start("pug");
  });
  // gulp.watch([SRC_PUG + '**/*.pug', '!' + SRC_PUG + '**/_*.pug'], ['pug']);
  watch(SRC_IMAGES + "**/*", function() {
    gulp.start("images");
  });
  watch(SRC_COPYFILE + "**/*", function() {
    gulp.start("copy");
  });
  watch(SRC + "**/*", function() {
    gulp.start("browserSyncSuppressOverReload");
  });
});

/**
 * Images
 */
gulp.task("images", function() {
  gulp
    .src(SRC_IMAGES + "**/*.{jpg,jpeg,png,gif,svg}")
    .pipe(
      imagemin([
        pngquant("65-80"),
        mozjpeg({ quality: 80 }),
        imagemin.svgo(),
        imagemin.gifsicle()
      ])
    )
    .pipe(gulp.dest(DIST + DIST_IMAGES));
  gulp
    .src(SRC_IMAGES + "**/*.{mp4,mp3,webm,woff,woff2,eot,ttf,html,json}")
    .pipe(gulp.dest(DIST + DIST_IMAGES));
});
// gulp.task("images", function() {
//   gulp
//     .src("!" + SRC_IMAGES + "**/*")
//     .pipe(gulp.dest(DIST + DIST_IMAGES));
// });

/**
 * Copy
 */
gulp.task("copy", function() {
  gulp.src("./src/copy/**/*").pipe(gulp.dest(DIST + DIST_COPYFILE));
});

/**
 * Clean
 */
gulp.task("clean", function(cb) {
  return del(DIST + "*", cb);
});

/**
 * JavaScript
 */
gulp.task("js", () => {
  let MODE = "development";
  let StripKey = "logloglog";
  if (targettype == "production") {
    MODE = "production";
    StripKey = "console.log";
  }
  let webpackOption = {
    watch: true,
    mode: MODE,
    entry: WEBPACK_ENTRY,
    output: {
      filename: "[name].js"
    },
    optimization: {},
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              // ES2015（ES6）のコードをES5のコードに変換する
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "es2015",
                    {
                      modules: false
                    }
                  ]
                ]
              }
            },
            {
              // transpileした際に'console.log'を消滅させる
              loader: WebpackStrip.loader(StripKey)
            }
          ]
        }
      ]
    },
    externals: [EXTERNALS],
    plugins: [
      // コンパイル時にアラートを表示
      new WebpackBuildNotifierPlugin({
        title: "My Project Webpack Build",
        logo: SRC_IMAGES + "favicon.png",
        suppressSuccess: "true"
      }),
      // ライセンスコメントを出力
      new LicenseInfoWebpackPlugin({
        glob: "{LICENSE,license,License}*"
      }),
      //ファイルを細かく分析し、まとめられるところはまとめてコード圧縮
      new webpack.optimize.AggressiveMergingPlugin(),
      // JQuery / JQueryライブラリのための定義（Jquery絶対使わないってプロジェクトのときは消去）
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        jquery: "jquery"
      })
    ]
  };

  // 共通して使用するライブラリを vendor.js にまとめる
  if (SPLIT_CHUNKS) {
    webpackOption.optimization.splitChunks = {
      name: "vendor",
      filename: DIST_SCRIPT + "vendor.js",
      chunks: "initial"
    };
  }

  gulp
    .src("")
    .pipe(webpackStream(webpackOption, webpack))
    .pipe(plumber())
    .pipe(gulp.dest(DIST));
});

/**
 * Sass
 */
gulp.task("sass", function() {
  if (targettype == "production") {
    return gulp
      .src(SRC_SCSS + "**/*.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      .pipe(
        sassVariables({
          $IMAGES_PATH: IMAGES_PATH_PROD,
          $TARGETTYPE: targettype
        })
      )
      .pipe(
        sass({
          outputStyle: "compressed"
        })
      )
      .pipe(autoprefixer({ grid: true }))
      .pipe(gulp.dest(DIST + DIST_CSS));
  } else if (targettype == "stage") {
    return gulp
      .src(SRC_SCSS + "**/*.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      .pipe(sourcemaps.init())
      .pipe(
        sassVariables({
          $IMAGES_PATH: IMAGES_PATH_STAG,
          $TARGETTYPE: targettype
        })
      )
      .pipe(
        sass({
          outputStyle: "expanded"
        })
      )
      .pipe(autoprefixer({ grid: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST + DIST_CSS));
  } else {
    return gulp
      .src(SRC_SCSS + "**/*.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      .pipe(sourcemaps.init())
      .pipe(
        sassVariables({
          $IMAGES_PATH: IMAGES_PATH,
          $TARGETTYPE: targettype
        })
      )
      .pipe(
        sass({
          outputStyle: "expanded"
        })
      )
      .pipe(autoprefixer({ grid: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST + DIST_CSS));
  }
});

/**
 * Pug
 */
gulp.task("pug", () => {
  return gulp
    .src([SRC_PUG + "**/*.pug", "!" + SRC_PUG + "**/_*.pug"])
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(DIST + DIST_HTML));
});

jsPathSet = () => {
  if (targettype == "stage") {
    return JS_PATH_STAG;
  } else if (targettype == "production") {
    return JS_PATH_PROD;
  } else {
    return JS_PATH;
  }
};

cssPathSet = () => {
  if (targettype == "stage") {
    return CSS_PATH_STAG;
  } else if (targettype == "production") {
    return CSS_PATH_PROD;
  } else {
    return CSS_PATH;
  }
};

const pugOptions = {
  pretty: PUG_PRETTY,
  locals: {
    SITE_NAME: SITE_NAME,
    SITE_URL:
      targettype == "prod"
        ? SITE_OGP_URL
        : targettype == "stage"
        ? STAGE_SITE_URL
        : DIST_SITE_URL,
    SITE_DESCRIPTION: SITE_DESCRIPTION,
    SITE_KEYWORDS: SITE_KEYWORDS,
    SITE_OGP_URL:
      targettype == "prod"
        ? SITE_OGP_URL
        : targettype == "stage"
        ? STAGE_SITE_URL
        : DIST_SITE_URL,
    SITE_OGP_TITLE: SITE_OGP_TITLE,
    SITE_OGP_DESCRIPTION: SITE_OGP_DESCRIPTION,
    SITE_OGP_IMAGE:
      (targettype == "prod"
        ? SITE_OGP_URL
        : targettype == "stage"
        ? STAGE_SITE_URL
        : DIST_SITE_URL) + SITE_OGP_IMAGE,
    SITE_OGP_SITE_NAME: SITE_OGP_SITE_NAME,
    SITE_OGP_TYPE: SITE_OGP_TYPE,
    SITE_OGP_LOCALE: SITE_OGP_LOCALE,
    SITE_OGP_APP_ID: SITE_OGP_APP_ID,
    GA_ID: GA_ID,

    LANG: LANG,

    IMAGES_PATH:
      targettype == "prod"
        ? IMAGES_PATH
        : targettype == "stage"
        ? IMAGES_PATH_STAG
        : IMAGES_PATH_PROD,

    SITE_PATH:
      targettype == "prod"
        ? SITE_PATH_HTML_PROD
        : targettype == "stage"
        ? SITE_PATH_HTML_STAG
        : SITE_PATH_HTML,

    JS_PATH: jsPathSet(),
    CSS_PATH: cssPathSet(),

    TARGETTYPE: targettype
  }
};

/**
 * Browser Sync
 */
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: DIST
    },
    reloadThrottle: 1800
  });
});

var timeoutidBs;
gulp.task("browserSyncSuppressOverReload", () => {
  clearTimeout(timeoutidBs);
  timeoutidBs = setTimeout(function() {
    browserSync.reload();
    if (targettype == "stage") {
      console.log("🐥 " + targettype + " 🐥");
    } else if (targettype == "production") {
      console.log("🐓 " + targettype + " 🐓");
    } else {
      console.log("🥚 " + targettype + " 🥚");
    }
  }, 500);
});

// http://bit.ly/2JYfx26
// http://bit.ly/2DgGXLI
// http://bit.ly/2lKAcJs
// http://bit.ly/2ItoUlN
// http://bit.ly/2KsBCDk
// http://bit.ly/2MxrkCD
// http://bit.ly/2MtrZol
// http://bit.ly/2Ko5QHy
// http://bit.ly/2Mp2hkS
// http://bit.ly/2Ks92lk
// http://bit.ly/2Mra8hW
// http://bit.ly/2Km8Zrj
