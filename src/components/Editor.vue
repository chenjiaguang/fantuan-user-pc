<template>
  <div class="ft-editor">
    <!-- <button @click="preview">preview</button> -->
    <div ref="editor"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Button } from 'element-ui'
import editorConfig from '@/lib/editor-config'
import uploadUtil from '@/lib/uploadUtil'
import utils from '@/lib/utils'
Vue.use(Button)
export default {
  editor: null,
  props: ['data'],
  data () {
    return {
      errorFileLoaders: []
    }
  },
  watch: {
    data (val) {
      if (this.editor && this.editor.setData) this.editor.setData(val)
    }
  },
  mounted () {
    window.fantuanUpload = () => uploadUtil.selectFile(this.uploadFile)
    window.fantuanFileToDataSrc = (file) => uploadUtil.getDataSrc(file)
    window.fantuanDataSrcToFantUrl = (editor) => uploadUtil.dataSrcToFantUrl(editor)

    this.create()
  },
  methods: {
    // 获取编辑器内容
    getData () {
      let data = this.editor.getData()
      data = data.replace(/[\r\n]/g, '')
      return data
    },
    // 设置编辑器内容
    setData (data) {
      if (this.editor && this.editor.setData) this.editor.setData(data)
    },
    // 尝试把所有需要上传的图片进行上传（包括先前发生错误的）
    tryUploadAll () {
      uploadUtil.otherUrlToDataSrc(this.editor)
      for (let i = 0; i < this.errorFileLoaders.length; i++) {
        var fileLoader = this.errorFileLoaders[i]
        fileLoader.upload('empty')
      }
    },
    // 打开预览
    preview () {
      // 打开预览的延时需大于200(编辑器失焦时间)
      setTimeout(() => {
        utils.preview(this.getData())
      }, 250)
    },
    // 获取内容字数
    getTextContentLength () {
      let oldhtml = this.editor.document.getBody().getHtml()
      let description = oldhtml.replace(/<.*?>/ig, '').replace(/\u200B/g, '')
      description = utils.escape2Html(description)
      console.log('内容', description)
      return description.length
    },
    // 上传文件回调
    async uploadFile (file) {
      let datasrc = await uploadUtil.getDataSrc(file)
      this.editor.insertHtml(`<img src="${datasrc}" data-needtofigure="true"/>`)
      uploadUtil.dataSrcToFantUrl(this.editor)
    },
    addFileLoader (fileLoader) {
      let i = this.errorFileLoaders.findIndex((_fileLoader) => {
        return _fileLoader.id === fileLoader.id
      })
      if (i !== -1) {
        this.errorFileLoaders.splice(i, 1)
      }
    },
    removeFileLoader (fileLoader) {
      let i = this.errorFileLoaders.findIndex((_fileLoader) => {
        return _fileLoader.id === fileLoader.id
      })
      if (i === -1) {
        this.errorFileLoaders.push(fileLoader)
      }
    },
    // 编辑器初始化
    create (data) {
      if (this.editor) {
        this.setData(data)
      } else {
        this.handleInit(data)
        this.handleEvent()
      }
    },
    // 编辑器启动
    handleInit (data) {
      if (this.editor && this.editor.destroy) {
        this.editor.destroy()
        this.editor = null
      }
      this.editor = window.CKEDITOR.replace(this.$refs.editor, editorConfig)
      this.setData(data)
    },
    // 编辑器事件绑定
    handleEvent () {
      this.editor.on('change', e => {
        // 编辑器内容变化事件
        this.$emit('textnumchange', this.getTextContentLength())
      })
      this.editor.on('contentDom', () => {
        this.editor.document.$.addEventListener('keydown', (e) => {
          this.$emit('keydown', e)
        }, false)
        // 编辑器初始化完成事件

        this.$emit('textnumchange', this.getTextContentLength())
      })
      this.editor.on('afterPaste', e => {
        // 编辑器粘贴结束事件
        console.log('afterPaste')
        uploadUtil.otherUrlToDataSrc(this.editor)
      })
      this.editor.on('fileUploadRequest', async evt => {
        evt.stop()
        let file = evt.data.requestData.upload.file
        let md5 = await uploadUtil.getMd5(file)
        await this.$ajax('/jv/api/sts/H5', {
          data: {
            md5: md5
          }
        })
          .then(res => {
            let formData = new FormData()
            let xhr = evt.data.fileLoader.xhr
            formData.append('key', res.dir)
            formData.append('policy', res.policy)
            formData.append('OSSAccessKeyId', res.accessid)
            formData.append('callback', res.callback)
            formData.append('signature', res.signature)
            formData.append('success_action_status', '200')
            formData.append('file', file, evt.data.requestData.upload.name)
            console.log('xhr', xhr)
            xhr.open('POST', this.$useHttps ? res.host.replace('http://', 'https://') : res.host, true)
            xhr.send(formData)
            this.addFileLoader(evt.data.fileLoader)
            // evt.stop()
          })
          .catch(err => {
            console.log(err)
            this.removeFileLoader(evt.data.fileLoader)
          })
      })
      this.editor.on('fileUploadResponse', function (evt) {
        evt.stop()

        var data = evt.data
        var xhr = data.fileLoader.xhr
        var response = JSON.parse(xhr.responseText)

        if (response.msg) {
          // An error occurred during upload.
          data.message = response.msg
          evt.cancel()
        } else {
          data.url = utils.getHttpsUrl(response.data.url)
          data.response = {
            'default': utils.getHttpsUrl(response.data.url)
          }
        }
      })
    }

  }
}
</script>

<style scoped>
.upload {
  /* display: none; */
}
.ft-editor /deep/ .cke{
  border-color: #D2D2D2;
  box-shadow: unset;
}
.ft-editor /deep/ .cke_bottom{
  background: #F5F5F5;
}
.ft-editor /deep/ .cke_path_item, .ft-editor /deep/ .cke_path_empty{
  color: #666;
}
</style>
