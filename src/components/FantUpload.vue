<template>
  <el-upload
    ref="upload"
    class="upload"
    :action="uploadAction"
    :data="uploadData"
    :show-file-list="false"
    :before-upload="beforeUpload"
    >
  </el-upload>
</template>

<script>
import Vue from 'vue'
import { Upload } from 'element-ui'
import uploadUtil from '../lib/uploadUtil'
Vue.use(Upload)
export default {
  data () {
    return {
      uploadAction: '',
      uploadData: {}
    }
  },
  mounted () {
  },
  methods: {
    upload () {
      this.$refs.upload.$el.getElementsByClassName('el-upload__input')[0].click()
    },
    async beforeUpload (file) {
      let md5 = await uploadUtil.getMd5(file)
      return this.$ajax('/jv/api/sts/H5', {data: {
        md5: md5
      }}).then(res => {
        this.uploadData = {
          'key': res.dir,
          'policy': res.policy,
          'OSSAccessKeyId': res.accessid,
          'callback': res.callback,
          'signature': res.signature,
          'success_action_status': '200' // 让服务端返回200，不设置则默认返回204
        }
        this.uploadAction = res.host
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload {
  display: none;
}
</style>
