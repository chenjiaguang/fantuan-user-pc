# fantuan-user-pc

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).




ckeditor自定义源码部分
clipboard/plugin.js 删除剪贴板过滤
cloudservices/plugin.js fileUploadRequest fileUploadResponse  清空内容
easyimage/plugin.js 删除paste
fantuanimageuploader/*
imagebase/plugin.js 删除paste 不执行_beginUpload 描述框大量修改
uploadimage/plugin.js 大量修改（关键）
uploadwidget/plugin.js 取消此时使用的uploadimage
easyimage.css 样式修改
config.js删除cloudservices
