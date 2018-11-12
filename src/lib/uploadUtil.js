import ajax from './ajax'
export default {
  uniqueNameCounter: 0,
  getMd5 (file) {
    return new Promise(function (resolve, reject) {
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let chunkSize = 2097152 // Read in chunks of 2MB
      let chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      let spark = new window.SparkMD5.ArrayBuffer()
      let fileReader = new FileReader()

      fileReader.onload = function (e) {
        spark.append(e.target.result) // Append array buffer
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          resolve(spark.end())
        }
      }

      fileReader.onerror = function (e) {
        reject(e)
      }

      function loadNext () {
        let start = currentChunk * chunkSize
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }

      loadNext()
    })
  },
  getDataSrc (file) {
    return new Promise(function (resolve, reject) {
      let fileReader = new FileReader()
      fileReader.onload = function (e) {
        resolve(e.target.result)
      }
      fileReader.onerror = function (e) {
        reject(e)
      }
      fileReader.readAsDataURL(file)
    })
  },
  dataToFile (data) {
    let base64HeaderRegExp = /^data:(\S*?);base64,/
    let contentType = data.match(base64HeaderRegExp)[1]
    let base64Data = data.replace(base64HeaderRegExp, '')
    let byteCharacters = atob(base64Data)
    let byteArrays = []
    let sliceSize = 512
    let offset, slice, byteNumbers, i, byteArray

    for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      slice = byteCharacters.slice(offset, offset + sliceSize)

      byteNumbers = new Array(slice.length)
      for (i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  },
  selectFile (callback) {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.onchange = (e) => {
      let file = e.currentTarget.files[0]
      callback(file)
    }
    input.click()
  },
  padNumber (input) {
    if (input <= 9) {
      input = '0' + input
    }

    return String(input)
  },
  getUniqueImageFileName (type) {
    let date = new Date()
    let dateParts = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]

    this.uniqueNameCounter += 1

    return 'image-' + window.CKEDITOR.tools.array.map(dateParts, this.padNumber).join('') + '-' + this.uniqueNameCounter + '.' + type
  },
  uploadding: false,
  // 新的触发上传使用这个入口
  tryUploadOne (editor) {
    if (!this.uploadding) {
      this.uploadding = true
      this.uploadOne(editor)
    }
  },
  isDataInSrcImageCanUpload (imgElement) {
    let tempName = imgElement.getAttribute('data-tempName')
    let isDragIcon = imgElement.hasClass('cke_widget_drag_handler')
    return (!tempName) && (!isDragIcon)
  },
  // 接着进行上传使用这个入口(比如在上一步成功以后)
  uploadOne (editor) {
    let imgs = editor.editable().find('img')
    let i
    for (i = 0; i < imgs.count(); i++) {
      let img = imgs.getItem(i)

      let imgSrc = img.getAttribute('src')
      let isDataInSrc = imgSrc && imgSrc.substring(0, 5) === 'data:'
      let isOtherHostSrc = (!isDataInSrc) && imgSrc && (imgSrc.indexOf('fantuanlife.com') === -1)

      if (isDataInSrc && this.isDataInSrcImageCanUpload(img)) {
        let file = this.dataToFile(imgSrc)
        this.getMd5(file).then((md5) => {
          ajax('/jv/api/sts/H5', {
            data: {
              md5: md5
            }
          })
            .then(res => {
              let imgFormat = imgSrc.match(/image\/([a-z]+?);/i)
              imgFormat = (imgFormat && imgFormat[1]) || 'jpg'
              let formData = new FormData()
              formData.append('key', res.dir)
              formData.append('policy', res.policy)
              formData.append('OSSAccessKeyId', res.accessid)
              formData.append('callback', res.callback)
              formData.append('signature', res.signature)
              formData.append('success_action_status', '200')
              formData.append('file', file, this.getUniqueImageFileName(imgFormat))
              ajax(this.$useHttps ? res.host.replace('http://', 'https://') : res.host, {
                data: formData
              }).then((uploadRes) => {
                img.setAttribute('src', uploadRes.data.url)
                img.setAttribute('data-cke-saved-src', uploadRes.data.url)
                setTimeout(() => {
                  this.uploadOne(editor)
                }, 0)
              })
            })
        }).catch(err => {
          console.log(err)
          // 出错中断，释放正在上传的标志
          this.uploadding = false
        })
        break
      } else if (isOtherHostSrc) {
        ajax('/jv/image/uploadbyurl?url=' + encodeURIComponent(imgSrc), {
          method: 'GET'
        }).then(res => {
          let url = res.data.image.url
          if (url) {
            img.setAttribute('src', url)
            img.setAttribute('data-cke-saved-src', url)
            setTimeout(() => {
              this.uploadOne(editor)
            }, 0)
          }
        }).catch(err => {
          // 出错中断，释放正在上传的标志
          this.uploadding = false
          console.log(err)
        })
        break
      }
    }
    if (i === imgs.count()) {
      // 所有图片都已处理，释放正在上传的标志
      this.uploadding = false
    }
  },
  // 是否可以保存或提交
  checkContent (editor) {
    let imgs = editor.editable().find('img')
    let pass = true
    for (let i = 0; i < imgs.count(); i++) {
      let img = imgs.getItem(i)
      // Assign src once, as it might be a big string, so there's no point in duplicating it all over the place.
      let imgSrc = img.getAttribute('src')
      // Image have to contain src=data:...
      let isDataInSrc = imgSrc && imgSrc.substring(0, 5) === 'data:'
      // 是否拖拽按钮
      let canUpload = this.isDataInSrcImageCanUpload(img)
      let isFantuan = imgSrc.indexOf('fantuanlife.com') !== -1
      if ((isDataInSrc && canUpload) || (!isDataInSrc && !isFantuan)) {
        pass = false
        break
      }
    }
    if (!pass) {
      this.tryUploadOne(editor)
    }
    return pass
  }
}
