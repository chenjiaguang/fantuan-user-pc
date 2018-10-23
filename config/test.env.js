'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  API_DOMAIN_HTTPS: '"https://fanttest.fantuanlife.com"',
  IMAGE_UPLOAD_URL: '"https://fantuantest-img.oss-cn-beijing.aliyuncs.com"'
})
