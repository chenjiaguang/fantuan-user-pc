<template>
  <div class="ft-editor">
    <!-- <button @click="tryUploadAll">tryUploadAll</button> -->
    <div ref="editor"></div>
    <div class="text-num" :class="{'text-num-max':(textNum>10000)}">字数：{{textNum}} / 10000</div>
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
      textNum: 0
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
    window.tryUploadOne = (editor) => uploadUtil.tryUploadOne(editor)

    this.create()
  },
  methods: {
    // 获取编辑器内容
    getData () {
      let data = this.editor.getData()
      data = data.replace(/[\r\n]/g, '')
      return data
    },
    textnumchange (num) {
      this.textNum = num
    },
    // 设置编辑器内容
    setData (data) {
      if (this.editor && this.editor.setData) this.editor.setData(data)
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
      uploadUtil.tryUploadOne(this.editor)
    },
    // 编辑器初始化
    create (data) {
      if (this.editor) {
        // 如果编辑器已经存在，则直接写入内容
        this.setData(data)
      } else {
        // 基本初始化
        this.handleInit(data)
        // 事件绑定
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
        // 绑定保存的按键事件
        this.editor.document.$.addEventListener('keydown', (e) => {
          this.$emit('keydown', e)
        }, false)
        // 初始化计算字数
        this.$emit('textnumchange', this.getTextContentLength())
      })
      this.editor.on('afterPaste', e => {
        uploadUtil.tryUploadOne(this.editor)
        // uploadUtil.otherUrlToDataSrc(this.editor)
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
            xhr.open('POST', this.$useHttps ? res.host.replace('http://', 'https://') : res.host, true)
            xhr.send(formData)
            // evt.stop()
          })
          .catch(err => {
            console.log(err)
            // 出错中断，释放正在上传的标志
            uploadUtil.uploadding = false
            uploadUtil.addErrorFileLoader(evt.data.fileLoader)
          })
      })
      this.editor.on('fileUploadResponse', (evt) => {
        evt.stop()

        var data = evt.data
        var xhr = data.fileLoader.xhr
        var response = JSON.parse(xhr.responseText)

        if (response.msg) {
          // An error occurred during upload.
          data.message = response.msg
          evt.cancel()
          // 出错中断，释放正在上传的标志
          uploadUtil.uploadding = false
          uploadUtil.addErrorFileLoader(evt.data.fileLoader)
        } else {
          data.url = utils.getHttpsUrl(response.data.url)
          data.response = {
            'default': utils.getHttpsUrl(response.data.url)
          }
          uploadUtil.removeErrorFileLoader(evt.data.fileLoader)
          // 此时接着上传下一个 不需要使用tryUploadOne
          uploadUtil.uploadOne(this.editor)
        }
      })
      this.editor.on('fileUploadError', (evt) => {
        // 出错中断，释放正在上传的标志
        uploadUtil.uploadding = false
        uploadUtil.addErrorFileLoader(evt.data.fileLoader)
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
.text-num{
  position: absolute;
  top: 0;
  right: 12px;
  line-height: 38px;
  font-size: 12px;
}
.text-num-max{
  color: #FF4242
}
</style>
