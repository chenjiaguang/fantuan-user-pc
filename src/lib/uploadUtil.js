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
  async otherUrlToDataSrc (editor) {
    let imgs = editor.editable().find('img')
    for (let i = 0; i < imgs.count(); i++) {
      let img = imgs.getItem(i)
      let imgSrc = img.getAttribute('src')
      let needtofigure = img.getAttribute('data-needtofigure')
      if (imgSrc && imgSrc.substring(0, 5) !== 'data:' && imgSrc.indexOf('fantuanlife.com') === -1 && needtofigure) {
        let dataSrc = await new Promise(function (resolve, reject) {
          let img = new Image()
          img.crossOrigin = 'Anonymous'
          img.onload = function () {
            var canvas = document.createElement('CANVAS')
            var ctx = canvas.getContext('2d')
            var dataURL
            canvas.height = this.height
            canvas.width = this.width
            ctx.drawImage(this, 0, 0)
            dataURL = canvas.toDataURL('jpg')
            resolve(dataURL)
            canvas = null
          }
          img.src = imgSrc
        })
        img.setAttribute('src', dataSrc)
        img.setAttribute('data-cke-saved-src', dataSrc)
      }
    }
    this.dataSrcToFantUrl(editor)
  },
  dataSrcToFantUrl (editor) {
    let fileTools = window.CKEDITOR.fileTools
    let uploadUrl = fileTools.getUploadUrl(editor.config, 'image')

    let imgs = editor.editable().find('img')
    for (let i = 0; i < imgs.count(); i++) {
      let img = imgs.getItem(i)

      // Assign src once, as it might be a big string, so there's no point in duplicating it all over the place.
      let imgSrc = img.getAttribute('src')
      // Image have to contain src=data:...
      let isDataInSrc = imgSrc && imgSrc.substring(0, 5) === 'data:'
      let isRealObject = img.data('cke-realelement') === null

      // We are not uploading images in non-editable blocs and fake objects (https://dev.ckeditor.com/ticket/13003).
      if (isDataInSrc && isRealObject && !img.data('cke-upload-id') && !img.isReadOnly(1)) {
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
      }
    }
  }
}
