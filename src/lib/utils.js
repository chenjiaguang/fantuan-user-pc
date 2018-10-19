export default {
  getHttpsUrl (url) {
    if (url.startsWith('http://') === 0) {
      // 只替换第一个
      return url.replace('http://', 'https://')
    }
  }
}
