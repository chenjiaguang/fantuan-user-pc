<template>
  <div>
    <FantUpload>
    </FantUpload>
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
      editor.on('fileUploadRequest', async evt => {
        evt.stop()
        // console.log('evt', evt)
        let file = evt.data.requestData.upload.file
        let md5 = await uploadUtil.getMd5(file)
        await this.$ajax('/jv/api/sts/H5', {data: {
          md5: md5
        }}).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
        console.log('end')
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
    }
  }
}
</script>

<style scoped>
.upload {
  /* display: none; */
}
</style>
