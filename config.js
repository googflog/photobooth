//
DIST_SITE_URL = "";
STAGE_SITE_URL = "";

/** META */
SITE_NAME = "PhotoBooth";
SITE_URL = "";
SITE_DESCRIPTION = "ディスプリプション";
SITE_KEYWORDS = "キーワード,キーワード,キーワード";
SITE_OGP_URL = SITE_URL;
SITE_OGP_TITLE = SITE_NAME;
SITE_OGP_DESCRIPTION = SITE_DESCRIPTION;
SITE_OGP_IMAGE = "";
SITE_OGP_SITE_NAME = SITE_NAME;
SITE_OGP_TYPE = "article";
SITE_OGP_LOCALE = "ja_JP";
SITE_OGP_APP_ID = "";
GA_ID = "";

LANG = "ja";

/** 書き出しファイル内パス FilePath */
IMAGES_PATH = "./assets/images/";
IMAGES_PATH_STAG = IMAGES_PATH;
IMAGES_PATH_PROD = IMAGES_PATH;

JS_PATH = "./assets/scripts/";
JS_PATH_STAG = JS_PATH;
JS_PATH_PROD = JS_PATH;

CSS_PATH = "./assets/styles/";
CSS_PATH_STAG = CSS_PATH;
CSS_PATH_PROD = CSS_PATH;

SITE_PATH_HTML = "/";
SITE_PATH_HTML_STAG = "/stage/";
SITE_PATH_HTML_PROD = "/";

/** Pug Options HTML圧縮 */
PUG_PRETTY = true;

/** WebPack JavaScript */
WEBPACK_ENTRY = {
  "assets/scripts/app": "./src/scripts/main.js"
};

// モジュール を WebPack の バンドル対象 から外して外部依存させる
EXTERNALS = {
  // jquery: "$"
  // TweenMax: true,
  // swiper: true
};

// 共通して使用するライブラリを vendor.js にまとめる
SPLIT_CHUNKS = false;

/** とりあえず複製するファイル */
SRC_COPYFILE = "./src/copy/";
DIST_COPYFILE = "/";

/** 監視 Source */
SRC = "./src/";
SRC_IMAGES = "./src/images/";
SRC_JS = "./src/scripts/";
SRC_SCSS = "./src/styles/";
SRC_PUG = "./src/templates/";

/** 書出し Dist */
DIST_IMAGES = "./assets/images/";
DIST_CSS = "./assets/styles/";
DIST_HTML = "./";

// vendor.js に使っている
DIST_SCRIPT = "./assets/scripts/";

/** JS,CSS キャッシュ防止 */
VERSION = ""; //"?v="+ Date.now();
