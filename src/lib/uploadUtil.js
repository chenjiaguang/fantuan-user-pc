export default {
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
  }
}
