<template>
  <div class="nav-wrapper">
    <div class="nav-fixer">
      <div class="nav-box clearfix" :style="{}">
        <img class="big-logo fl" alt="范团" :src="$assetsPublicPath + '/cwebassets-pc/image/van_logo.png'" />
        <img class="sub-logo fl" :src="$assetsPublicPath + '/cwebassets-pc/image/van_sub_logo.png'" />
        <div v-if="buttons" @click="publish" class="publish-btn fr" :class="{disabled: !canPublish}">
          <div class="inner">发布</div>
        </div>
        <div v-if="buttons" @click="preview" class="preview-btn fr" :class="{disabled: !canPreview}">
          <div class="inner">预览</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttons: { // 是否显示预览、发布按钮
      type: Boolean,
      required: true
    },
    canPreview: { // 预览按钮是否可点击
      type: Boolean,
      required: false
    },
    canPublish: { // 发布按钮是否可点击
      type: Boolean,
      required: false
    }
  },
  data () {
    return {}
  },
  methods: {
    publish () {
      if (!this.canPublish) { // disabled状态
        return false
      }
      this.$emit('publish')
    },
    preview () {
      if (!this.canPreview) { // disabled状态
        return false
      }
      this.$emit('preview')
    }
  },
  mounted () {
    console.log('navigator', navigator)
  }
}
</script>

<style scoped>
.nav-wrapper{
  width: 100%;
  height: 90px;
  position: relative;
  z-index: 9999;
}
.nav-fixer{
  width: 100%;
  height: 90px;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.nav-box{
  width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.big-logo{
  margin: 24px 27px 0 17px;
  width: 105px;
}
.sub-logo{
  margin-top: 50px;
  width: 75px;
}
.publish-btn, .preview-btn{
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  height: 38px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  font-size: 16px;
  user-select: none;
  cursor: pointer;
}
.preview-btn{
  width: 110px;
  color: #009AFF;
  margin: 26px 0 0 0;
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
  padding: 1px;
  overflow: hidden;
  position: relative;
  box-sizing: content-box;
}
.publish-btn{
  width: 150px;
  color: #fff;
  margin: 26px 100px 0 30px;
}
.preview-btn:hover {
  background: #0189E3;
  color: #0189E3;
}
.publish-btn:hover{
  background: #0189E3;
  color: #D2EDFF;
}
.publish-btn .inner{
  background: transparent;
}
.preview-btn .inner{
  background: #fff;
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
.publish-btn.disabled, .preview-btn.disabled{
  background: #E6E6E6;
  color: #999;
}
.publish-btn.disabled .inner, .preview-btn.disabled .inner{
  background: transparent;
}
</style>
