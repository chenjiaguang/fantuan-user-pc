<template>
  <div>
    <input type="file" id="btn_file" style="display:none" @change="change">
    <div ref="editor"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Button } from 'element-ui'
import FantUpload from '@/components/FantUpload'
import editorConfig from '@/lib/editor-config'
import uploadUtil from '@/lib/uploadUtil'
let editor = null
Vue.use(Button)
export default {
  props: ['value'],
  components: { FantUpload },
  data () {
    return {}
  },
  watch: {
    value (val) {
      if (editor && editor.setData) editor.setData(val)
    }
  },
  mounted () {
    window.fantuanUpload = this.upload.bind(this)
    this.create()
  },
  methods: {
    create () {
      if (editor && editor.destroy) {
        editor.destroy()
        editor = null
      }
      editor = window.CKEDITOR.replace(this.$refs.editor, editorConfig)
      editor.setData(this.value)
      editor.on('change', e => {
        this.$emit('input', e.editor.getData())
      })
      editor.on('paste', e => {
        setTimeout(() => {
          uploadUtil.otherUrlToDataSrc(editor)
        }, 0)
      })
      editor.on('fileUploadRequest', async evt => {
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
            xhr.open('POST', res.host, true)
            xhr.send(formData)
            // evt.stop()
          })
          .catch(err => {
            console.log(err)
          })
      })
      editor.on('fileUploadResponse', function (evt) {
        evt.stop()

        var data = evt.data
        var xhr = data.fileLoader.xhr
        var response = JSON.parse(xhr.responseText)

        if (response.msg) {
          // An error occurred during upload.
          data.message = response.msg
          evt.cancel()
        } else {
          data.url = response.data.url
        }
      })
    },
    upload () {
      document.getElementById('btn_file').click()
    },
    async change (e) {
      let files = document.getElementById('btn_file').files
      let datasrc = await uploadUtil.getDataSrc(
        files[files.length - 1]
      )
      // datasrc = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1406800210,1377280389&fm=58'
      editor.insertHtml(`<img src="${datasrc}">`)

      setTimeout(() => {
        uploadUtil.dataSrcToFantUrl(editor)
      }, 1000)

      // 正在上传.cke_upload_uploading img
    }
  }
}
</script>

<style scoped>
.upload {
  /* display: none; */
}
</style>
