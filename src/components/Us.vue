<template>
  <div class="us-wrapper" :style="{height: height}">
    <div class="us" ref="box" :style="{position: position, visibility: visibility}">
      <div class="inner-box clearfix">
        <div v-if="!onlyCopyright" class="about-us fl">
          <h6>关于我们</h6>
          <p>范团APP是海南微时刻信息技术有限公司旗下的重点项目，公司地处海口国贸核心地段的5A级写字楼百方大厦，办公面积1500平。公司在职员工100多人，管理团队、技术团队成员均从北上广深引进的优秀人才。相信未来的范团将发展成为海南“互联网+”进程的中坚力量。</p>
        </div>
        <div v-if="!onlyCopyright" class="contact-us fl">
          <h6>联系我们</h6>
          <p>海南微时刻信息技术有限公司</p>
          <p>地址：海口市滨海大道百方大厦15层</p>
          <p>电话：400-680-6307</p>
        </div>
        <div class="copyright">
          <a href="#">Copyright ©2018 范团版权所有&nbsp;&nbsp;|&nbsp;&nbsp;备案号：琼ICP备17001195号-16号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onlyCopyright: { // true：只显示底部版权和备案信息
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      height: 'auto',
      position: 'static',
      visibility: 'hidden'
    }
  },
  methods: {
    resetPosition () {
      const winHeight = window.innerHeight
      const parentHeight = this.$parent.$el.getBoundingClientRect().height
      if (parentHeight > winHeight) {
        this.position = 'static'
        this.visibility = 'visible'
      } else {
        this.position = 'fixed'
        this.visibility = 'visible'
      }
    },
    resetWrapperHeight () {
      if (this.height.replace('px', '') !== this.$refs['box'].getBoundingClientRect().height.toString()) {
        console.log('resetWrapperHeight')
        this.height = this.$refs['box'].getBoundingClientRect().height + 'px'
      }
    }
  },
  updated () {
    this.resetWrapperHeight()
  },
  mounted () {
    this.resetPosition()
    window.addEventListener('resize', this.resetPosition)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resetPosition)
  }
}
</script>

<style scoped>
.us-wrapper{
  width: 100%;
  position: static;
}
.us{
  width: 100%;
  background: #202633;
  left: 0;
  bottom: 0;
}
.inner-box{
  width: 1200px;
  margin: 0 auto;
  color: #B9C4DE;
}
.about-us{
  margin-left: 160px;
  width: 568px;
}
.contact-us{
  margin-left: 70px;
  width: 250px;
}
.about-us h6, .contact-us h6{
  font-size: 18px;
  line-height: 60px;
  padding-top: 9px;
  font-weight: bold;
}
.about-us p, .contact-us p{
  font-size: 14px;
  line-height: 32px;
}
.copyright{
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  clear: both;
}
.copyright a{
  font-size: 14px;
  color: #B9C4DE;
}
</style>
