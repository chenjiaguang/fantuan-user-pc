'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  IMAGE_UPLOAD_URL:'"https://fantuantest-img.oss-cn-beijing.aliyuncs.com"'
})
