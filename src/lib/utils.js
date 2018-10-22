export default {
  getHttpsUrl (url) {
    if (url.startsWith('http://')) {
      // 只替换第一个
      return url.replace('http://', 'https://')
    }
  },
  preview (content) {
    let win = window.open('/user-pc/cwebassets-pc/preview.html', '', 'width=375,height=667')
    if (content === undefined) { return false }
    (function setContent () {
      if (!win.document.getElementById('preview')) {
        setTimeout(setContent, 100)
      } else {
        win.document.getElementById('preview').innerHTML = content
      }
    })()
  }
}
