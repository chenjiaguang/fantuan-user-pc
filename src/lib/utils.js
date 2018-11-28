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
    let win = window.open('/cwebassets-pc/preview.html', '', 'width=375,height=667')
    if (content === undefined) { return false }
    (function setContent () {
      if (!win.document.getElementById('preview')) {
        setTimeout(setContent, 100)
      } else {
        win.document.getElementById('preview').innerHTML = content
      }
    })()
  },
  formatDateToTime (date) {
    const formatNumber = n => { // 不足2位数的数字，自动在前面补0
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}
