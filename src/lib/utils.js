export default {
  getHttpsUrl (url) {
    if (url.startsWith('http://')) {
      // 只替换第一个
      return url.replace('http://', 'https://')
    }
  },
  escape2Html (str) {
    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t] })
  },
  preview (content) {
    let win = window.open('/pch5/cwebassets-pc/preview.html', '', 'width=375,height=667')
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
