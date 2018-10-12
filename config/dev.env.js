'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  WEIXINLOGINJUMP_HTTPS: '"https://fanttest.fantuanlife.com/user-pc/weixinLoginJump"',
  WEIXINLOGINJUMP_HTTP: '"http://192.168.1.199:8080/user-pc/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuanlife.com/cweb-pc/index.html#"',
  LOGO_URL:'"http://fanttest.fantuanlife.com/user-pc/cwebassets-pc/image/van_logo.png"'
})
