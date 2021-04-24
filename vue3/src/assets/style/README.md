# scss 使用簡介

* `abstract/` 為全局共享變數、mixin，透過 vue.config.js 設置 css loaderOptions 支援所有 scss 格式。
* `base/` 則使用來統一跨瀏覽器樣式差異、消除 margin、padding，於 App.vue 導入。
