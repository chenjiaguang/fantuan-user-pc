<template>
  <div class="page">
    <top-nav :buttons="false" />
    <div class="page-main">
      <img class="qr-code" v-if="qrcode" :src="$apiDomain + '/jv/anonymous/login/webLoginCode/' + qrcode" alt="登录二维码" />
      <div class="scan-tip">扫描二维码</div>
      <div class="scan-sub-tip">在电脑端进行活动编辑</div>
    </div>
    <us :onlyCopyright="true" />
  </div>
</template>

<script>
import TopNav from '@/components/TopNav'
import Us from '@/components/Us'
export default {
  data () {
    return {
      qrcode: ''
    }
  },
  components: { TopNav, Us },
  methods: {
    login () {
      let rData = {
        webLoginCode: this.qrcode,
        token: 'c79f001778cf4c1c85571ad6611e134d',
        extraInfo: {
          userName: '陈加尧',
          circleId: 10,
          circleName: '群组的名称'
        }
      }
      this.$ajax('/jv/anonymous/login/webLoginCode/check', {data: rData}).then(res => {
        console.log('成功错误', res)
      }).catch(err => {
        console.log('登录错误', err)
      })
    },
    getQrcode (length) {
      let rString = ''
      let timeStr = new Date().getTime().toString()
      timeStr = timeStr.substring(timeStr.length - length)
      let rendomStr = this.getRandom(length)
      for (let i = 0; i < length; i++) {
        rString += (rendomStr[i] + timeStr[i])
      }
      return rString
    },
    getRandom (length) {
      if (length > 0) {
        let data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        let nums = ''
        for (let i = 0; i < length; i++) {
          let r = parseInt(Math.random() * 61)
          nums += data[r]
        }
        return nums
      } else {
        return false
      }
    },
    getUserInfo (qrcode) {
      if (!qrcode) {
        return false
      }
      let rData = {
        webLoginCode: qrcode
      }
      this.$ajax('/jv/anonymous/login/webLoginCode/ask', {data: rData, dontToast: true}).then(res => {
        console.log('userInfo_res', res)
        if (res && res.data && !res.error) { // 获取用户信息成功
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('userId', res.data.uid)
          sessionStorage.setItem('userName', res.data.extraInfo.userName)
          sessionStorage.setItem('circleId', res.data.extraInfo.circleId)
          sessionStorage.setItem('circleName', res.data.extraInfo.circleName)
          this.$router.replace({name: 'ActivityEdit'})
        }
      }).catch(err => {
        if (err && err.data && err.data.error) {
          console.log('userInfo_err', err)
          if (err.data.error.toString() === '2001') {
            // 重新获取
            console.log('链接超时')
            this.getUserInfo(qrcode)
          } else {
            console.log('获取信息出错')
          }
        }
      })
    }
  },
  mounted () {
    console.log('mounted', this.getQrcode(8))
    this.qrcode = this.getQrcode(6)
    this.getUserInfo(this.qrcode)
    setTimeout(() => {
      this.login()
    })
  }
}
</script>

<style scoped>
.page-main{
  width: 1000px;
  min-height: 1012px;
  border-radius: 6px;
  background: #fff;
  margin: 10px auto 30px;
  text-align: center;
  overflow: hidden;
}
.qr-code{
  width: 300px;
  height: 300px;
  display: block;
  margin: 174px auto 0;
  box-shadow: 0 5px 10px rgba(0,0,0,0.3);
}
.scan-tip{
  font-size: 32px;
  color: #009AFF;
  line-height: 40px;
  padding-top: 40px;
}
.scan-sub-tip{
  font-size: 24px;
  line-height: 32px;
  color: #999;
  padding-top: 36px;
}
</style>
