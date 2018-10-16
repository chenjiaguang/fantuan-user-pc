<template>
  <div class="page">
    <top-nav :buttons="true" :canPreview="false" :canPublish="false" />
    <div class="page-main">
      <div class="overview clearfix">
        <div class="account fl">账号：<span>{{overview.account.name}}</span></div>
        <div class="circle fl">发布于“{{overview.account.name}}”群组</div>
      </div>
      <div class="basic-setting">
        <div class="setting-header" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets-pc/image/head_bg.png)'}">基本信息设置</div>
        <!-- 主题 -->
        <div class="form-item clearfix">
          <div class="form-left fl">活动主题</div>
          <div class="form-right fl">
            <input class="form-input form-name" v-model="form.name" placeholder="请输入活动主题，最多30个字" />
          </div>
        </div>
        <!-- 活动封面 -->
        <div class="form-item clearfix">
          <div class="form-left fl">活动封面</div>
          <div class="form-right fl clearfix">
            <div class="cover-add fl" :style="{backgroundImage: 'url(' + ((form.cover.id && form.cover.url) ? form.cover.url : '') + ')', borderWidth: (form.cover.id && form.cover.url) ? 0 : '1px'}">
              <div class="cover-btn" :class="{added: (form.cover.id && form.cover.url)}">
                <div class="cover-btn-text">点击{{(form.cover.id && form.cover.url) ? '更换' : '添加'}}活动封面</div>
              </div>
            </div>
            <div class="cover-tip fl">
              <p class="cover-tip-title">温馨提示</p>
              <p class="cover-tip-text">1. 建议尺寸<span style="color:#FF4242;">750*420</span>，按照16：9的比例选图</p>
              <p class="cover-tip-text">2. 图片大小不超过10M</p>
            </div>
            <el-upload
              class="avatar-uploader fl"
              :multiple="false"
              :action="$apiDomain + '/jv/image/upload'"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload">
              上传
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <us :onlyCopyright="false" />
  </div>
</template>

<script>
import Vue from 'vue'
import TopNav from '@/components/TopNav'
import Us from '@/components/Us'
import { Upload } from 'element-ui'
Vue.use(Upload)
export default {
  data () {
    return {
      canPreview: false,
      canPublish: false,
      overview: {
        account: {
          id: null,
          name: '白日做梦'
        },
        circle: {
          id: null,
          name: '白日做梦'
        }
      },
      form: {
        name: '',
        cover: {
          id: '5',
          url: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1539487911&di=5851f925ddb548b4048be227712c12b7&src=http://imgsrc.baidu.com/imgad/pic/item/c75c10385343fbf2618015f7ba7eca8064388fb2.jpg'
        }
      }
    }
  },
  components: { TopNav, Us },
  methods: {
    preview () {
      console.log('preview11')
    },
    publish () {
      console.log('publish11')
    },
    handleCoverSuccess (res, file) {
      console.log('handleCoverSuccess', res, file)
      this.form.cover.if = res.data.id[0]
      this.form.cover.url = URL.createObjectURL(file.raw);
    },
    beforeCoverUpload (file) {
      console.log('beforeCoverUpload', file)
      const isLt10M = file.size / 1024 / 1024 < 10; // 限制上传图片小雨10M
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style scoped>
.page-main{
  width: 1200px;
}
.overview{
  width: 1000px;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  margin: 10px auto 0;
  border-radius: 6px;
  background: #fff;
  box-sizing: border-box;
  padding: 0 20px;
}
.account{
  margin-right: 100px;
}
.account span{
  color: #009AFF;
}
.basic-setting{
  width: 1000px;
  border-radius: 6px;
  background: #fff;
  margin: 10px auto 0;
  overflow: hidden;
}
.setting-header{
  width: 172px;
  height: 37px;
  line-height: 37px;
  font-size: 18px;
  color: #fff;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  margin-top: 30px;
  padding-right: 12px;
}
.form-item{
  margin: 30px 45px;
}
.form-left{
  width: 84px;
  font-size: 16px;
  color: #333;
  position: relative;
  line-height: 40px;
  text-align: right;
  margin-right: 18px;
}
.form-left:before{
  content: "*";
  font-size: 16px;
  color: #FF2323;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
}
.form-input:hover, .form-input:focus{
  border-color: #009AFF;
}
.form-name{
  width: 793px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid #9CA3B4;
  font-size: 16px;
  text-indent: 8px;
}
.cover-add{
  width: 360px;
  height: 200px;
  box-sizing: border-box;
  border: 1px solid #D2D2D2;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.cover-btn{
  width: 328px;
  height: 168px;
  box-sizing: border-box;
  border: 1px dashed #D2D2D2;
  margin: 15px auto;
  background-image: url('/user-pc/cwebassets-pc/image/add_cover.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 76px 67px;
  position: relative;
  cursor: pointer;
}
.cover-btn:hover{
  border-color: #009AFF;
  background-image: url('/user-pc/cwebassets-pc/image/add_cover_hover.png');
  background-size: 72px 63px;
}
.cover-btn.added{
  border-color: transparent;
  background-image: url('/user-pc/cwebassets-pc/image/add_cover_added.png');
  background-size: 76px 67px;
  opacity: 0;
}
.cover-btn.added:hover{
  opacity: 1;
}
.cover-btn-text{
  width: 100%;
  font-size: 16px;
  line-height: 56px;
  color: #BBBBBB;
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
}
.cover-btn:hover .cover-btn-text{
  color: #009AFF;
}
.cover-btn.added:hover .cover-btn-text{
  color: #fff;
}
.cover-tip{
  margin-left: 40px;
  font-size: 16px;
  line-height: 32px;
}
.cover-tip-title{
  color: #009AFF;
  margin-bottom: 12px;
}
.cover-tip-text{
  color: #999;
}
</style>
