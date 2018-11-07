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
  errorFileLoaders: [],
  uploadding: false,
  removeErrorFileLoader (fileLoader) {
    let i = this.errorFileLoaders.findIndex((_fileLoader) => {
      return _fileLoader.id === fileLoader.id
    })
    if (i !== -1) {
      this.errorFileLoaders.splice(i, 1)
    }
  },
  addErrorFileLoader (fileLoader) {
    let i = this.errorFileLoaders.findIndex((_fileLoader) => {
      return _fileLoader.id === fileLoader.id
    })
    if (i === -1) {
      this.errorFileLoaders.push(fileLoader)
    }
  },
  // 新的触发上传使用这个入口
  tryUploadOne (editor) {
    if (!this.uploadding) {
      this.uploadding = true
      this.uploadOne(editor)
    }
  },
  // 接着进行上传使用这个入口(比如在上一步成功以后)
  uploadOne (editor) {
    console.log('uploadOne')
    if (this.errorFileLoaders.length) {
      this.errorFileLoaders[0].upload(' ')
      return
    }

    let fileTools = window.CKEDITOR.fileTools
    let uploadUrl = fileTools.getUploadUrl(editor.config, 'image')

    let imgs = editor.editable().find('img')
    let i
    for (i = 0; i < imgs.count(); i++) {
      let img = imgs.getItem(i)

      // Assign src once, as it might be a big string, so there's no point in duplicating it all over the place.
      let imgSrc = img.getAttribute('src')
      // Image have to contain src=data:...
      let isDataInSrc = imgSrc && imgSrc.substring(0, 5) === 'data:'
      let isOtherHostSrc = (!isDataInSrc) && imgSrc && (imgSrc.indexOf('fantuanlife.com') === -1)
      let isRealObject = img.data('cke-realelement') === null
      let tempName = img.getAttribute('data-tempName')

      // We are not uploading images in non-editable blocs and fake objects (https://dev.ckeditor.com/ticket/13003).
      if (isDataInSrc && isRealObject && !img.data('cke-upload-id') && !img.isReadOnly(1) && !tempName) {
        // Note that normally we'd extract this logic into a separate function, but we should not duplicate this string, as it might
        // be large.
        let imgFormat = imgSrc.match(/image\/([a-z]+?);/i)
        let loader

        imgFormat = (imgFormat && imgFormat[1]) || 'jpg'

        loader = editor.uploadRepository.create(imgSrc, this.getUniqueImageFileName(imgFormat))
        loader.upload(uploadUrl)

        fileTools.markElement(img, 'uploadimage', loader.id)

        fileTools.bindNotifications(editor, loader)

        editor.widgets.initOn(img, 'uploadimage')

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
  }
}
