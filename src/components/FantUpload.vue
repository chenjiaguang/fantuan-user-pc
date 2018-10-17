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
import upload from '@/mixins/upload'
import { Upload } from 'element-ui'
Vue.use(Upload)
export default {
  data () {
    return {}
  },
  mixins: [upload],
  mounted () {
    window.fantuanUpload = this.upload.bind(this)
  },
  methods: {
    upload () {
      this.$refs.upload.$el.getElementsByClassName('el-upload__input')[0].click()
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
