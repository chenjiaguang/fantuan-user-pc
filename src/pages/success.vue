<template>
  <div class="page">
    <top-nav :buttons="false" />
    <div class="page-body">
      <i class="iconfont icon-tick"></i>
      <p class="success-tip">发布成功！</p>
      <p class="success-sub-tip">请耐心等待管理员审核~</p>
      <div class="close-btn">关闭此页面</div>
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
  components: {TopNav, Us}
}
</script>

<style scoped>
.page-body{
  width: 1000px;
  background: #fff;
  border-radius: 6px;
  margin: 10px auto 30px;
  min-height: 1040px;
  overflow: hidden;
}
.icon-tick{
  display: block;
  font-size: 110px;
  width: 110px;
  color: #00A4FF;
  margin: 200px auto 0;
}
.success-tip{
  font-size: 32px;
  line-height: 42px;
  margin: 0 0 30px;
  color: #009DFF;
  text-align: center;
}
.success-sub-tip{
  font-size: 18px;
  line-height: 22px;
  color: #959595;
  margin-bottom: 58px;
  text-align: center;
}
.close-btn{
  width: 150px;
  height: 38px;
  line-height: 38px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  border-radius: 6px;
  margin: 0 auto 50px;
  cursor: pointer;
}
.close-btn:hover{
  background: #0189E3;
  color: #D2EDFF;
}
</style>
