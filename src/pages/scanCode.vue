<template>
  <div class="page">
    <top-nav :buttons="false" />
    <div class="page-main">
      <img class="qr-code" :src="$assetsPublicPath + '/cwebassets-pc/image/qr_test.png'" alt="二维码" />
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
    return {}
  },
  components: { TopNav, Us },
  methods: {
    preview () {
      console.log('preview11')
    },
    publish () {
      console.log('publish11')
    }
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
