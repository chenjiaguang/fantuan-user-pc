'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const _https = false
module.exports = merge(prodEnv, {
  // 通过该https的值来，决定在dev环境下是否开启https
  HTTPS: _https,
  ASSETS_PUBLIC_PATH: '"/pch5/"',
  NODE_ENV: '"development"',
  API_DOMAIN: '"http://fanttest.fantuan.cn"',
  API_DOMAIN_HTTPS: '"https://fanttest.fantuan.cn"'
})
