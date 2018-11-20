'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  ASSETS_PUBLIC_PATH: '"https://staticcdntest.fantuan.cn/pch5/"',
  API_DOMAIN: '"http://fanttest.fantuan.cn"',
  API_DOMAIN_HTTPS: '"https://fanttest.fantuan.cn"'
})
