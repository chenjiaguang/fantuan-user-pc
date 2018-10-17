<script>
import uploadUtil from '../lib/uploadUtil'
export default {
  data () {
    return {
      uploadAction: '',
      uploadData: {}
    }
  },
  methods: {
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
