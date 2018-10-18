<template>
  <div class="page">
    <top-nav :buttons="true" :canPreview="false" :canPublish="false" />
    <div class="page-main">
      <div class="overview clearfix">
        <div class="account fl">账号：<span>{{overview.account.name}}</span></div>
        <div class="circle fl">发布于“{{overview.account.name}}”群组</div>
      </div>
      <div class="basic-setting">
        <div class="sava-tip-box">
          <div class="save-tip-content">ctrl+s可以直接保存当前填写的内容</div>
          <div class="box1"></div>
          <div class="box2"></div>
          <div class="box3"></div>
        </div>
        <div class="setting-header" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets-pc/image/head_bg.png)'}">基本信息设置</div>
        <!-- 主题 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动主题</div>
          <div class="form-right fl">
            <input class="form-input form-name" v-model="form.name" placeholder="请输入活动主题，最多30个字" />
          </div>
        </div>
        <!-- 活动封面 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动封面</div>
          <div class="form-right fl clearfix">
            <el-upload
              class="avatar-uploader fl"
              :multiple="false"
              :action="$apiDomain + '/jv/image/upload'"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload">
              <div class="cover-add fl" :class="{added: (form.cover.id && form.cover.url)}" :style="{backgroundImage: 'url(' + ((form.cover.id && form.cover.url) ? form.cover.url : '') + ')'}">
                <div class="cover-btn" :class="{added: (form.cover.id && form.cover.url)}">
                  <div class="cover-btn-text">点击{{(form.cover.id && form.cover.url) ? '更换' : '添加'}}活动封面</div>
                </div>
              </div>
            </el-upload>
            <div class="cover-tip fl">
              <p class="cover-tip-title">温馨提示</p>
              <p class="cover-tip-text">1. 建议尺寸<span style="color:#FF4242;">750*420</span>，按照16：9的比例选图</p>
              <p class="cover-tip-text">2. 图片大小不超过10M</p>
            </div>
          </div>
        </div>
        <!-- 活动时间 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动时间</div>
          <div class="form-right fl clearfix">
            <el-date-picker
              class="fl date-picker"
              prefix-icon="iconfont icon-date"
              :editable="false"
              :clearable="false"
              v-model="form.activity_time.start"
              type="datetime"
              placeholder="请选择开始时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.start"
              @change="changeStart">
            </el-date-picker>
            <div class="fl center-sign">至</div>
            <el-date-picker
              class="fl date-picker"
              prefix-icon="iconfont icon-date"
              :editable="false"
              :clearable="false"
              v-model="form.activity_time.end"
              type="datetime"
              placeholder="请选择结束时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.end"
              @change="changeEnd">
            </el-date-picker>
          </div>
        </div>
        <!-- 截止时间 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">截止时间</div>
          <div class="form-right fl clearfix">
            <div class="deadline-left fl clearfix">
              <el-radio @change="changeDeadline" class="fl form-radio" v-model="form.deadline" label="1">活动结束前均可报名</el-radio>
              <el-radio @change="changeDeadline" class="fl form-radio" v-model="form.deadline" label="2">设置报名截止时间</el-radio>
            </div>
            <el-date-picker
              ref="deadlinePicker"
              class="fl date-picker"
              prefix-icon="iconfont icon-date"
              :disabled="form.deadline === '1'"
              :editable="false"
              :clearable="false"
              v-model="form.deadline_date"
              type="datetime"
              placeholder="请选择截止时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.deadline"
              @change="changeDeadlineDate">
            </el-date-picker>
          </div>
        </div>
        <!-- 活动类型 -->
        <div class="form-item clearfix" style="margin-bottom: 15px;">
          <div class="form-left fl required">活动地点</div>
          <div class="form-right fl">
            <el-radio @change="changeAddress" class="fl form-radio" v-model="form.address" label="1">线上活动</el-radio>
            <el-radio @change="changeAddress" class="fl form-radio" v-model="form.address" label="2">线下活动</el-radio>
          </div>
        </div>
        <!-- 活动地图 -->
        <div class="form-item clearfix" style="margin-top:15px;">
          <div class="form-left fl" style="color:transparent">活动地图</div>
          <div class="form-right fl clearfix">
            <el-select class="fl address-select" style="display:none" :disabled="true" v-model="form.address_data.province" placeholder="选择省" @change="provinceChange">
              <el-option
                v-for="item in selectOptions.province_list"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-select class="fl address-select" v-model="form.address_data.city" placeholder="选择城市" @change="cityChange" @focus="$forceUpdate()">
              <el-option
                v-for="item in selectOptions.city_list[form.address_data.province] || []"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-select class="fl address-select" v-model="form.address_data.district" placeholder="选择区/县">
              <el-option
                v-for="item in selectOptions.district_list || []"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <div class="location-search-box fl clearfix">
              <el-select
                class="location-search-select fl"
                value-key="location"
                v-model="selectOptions.location"
                filterable
                remote
                placeholder="请输入详细地址，例如金贸中路1号店"
                :remote-method="remoteMethod"
                :loading="selectOptions.location_loading">
                <el-option
                  v-for="item in selectOptions.location_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.location">
                </el-option>
              </el-select>
              <div class="location-search-btn fl" @click="resetMarker" :class="{disabled: !selectOptions.location}"><i class="iconfont icon-location" style="font-size:18px;margin-right:5px;vertical-align:middle;"></i><span style="vertical-align:middle">标记位置</span></div>
            </div>
            <div class="amap-instance-container">
              <el-amap vid="ac-location" :center="amap_data.center" :zoom="amap_data.zoom" :map-manager="amap_data.manager" :plugin="amap_data.plugin">
                <el-amap-marker vid="location-marker" :position="location_position.point" :topWhenClick="true" :clickable="true" :draggable="true" :events="location_position.events"></el-amap-marker>
              </el-amap>
            </div>
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
import { Upload, DatePicker, Button, Radio, Select, Option } from 'element-ui'
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
// 初始化vue-amap
let amapManager = VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'ba6c996137985103dfcccd5ac7457ccb',
  // 插件集合
  plugin: ['ToolBar', 'Geolocation', 'PlaceSearch', 'Geocoder', 'DistrictSearch', 'Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'MapType', 'PolyEditor', 'CircleEditor'],
  // ui版本号
  uiVersion: '1.0.11',
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
// let placesearch = new VueAMap.PlaceSearch({
//   city: '海南', // 兴趣点城市
//   citylimit: true // 是否强制限制在设置的城市内搜索
// })
export default {
  data () {
    let self = this
    return {
      value: '',
      canPreview: false,
      canPublish: false,
      overview: {
        account: {
          id: null,
          name: '白日s做梦'
        },
        circle: {
          id: null,
          name: '白日做梦'
        }
      },
      pickerOptions: {
        start: {
          disabledDate: (currentDate) => {
            let now = new Date()
            now.setHours(0)
            now.setMinutes(0)
            now.setSeconds(0)
            now.setMilliseconds(0)
            return currentDate.getTime() < now.getTime()
          }
        },
        end: {
          disabledDate: (currentDate) => {
            let start = this.form.activity_time.start
            let now = new Date()
            now.setHours(0)
            now.setMinutes(0)
            now.setSeconds(0)
            now.setMilliseconds(0)
            let target = start || now
            return currentDate.getTime() < target.getTime()
          }
        },
        deadline: {
          disabledDate: (currentDate) => {
            let start = this.form.activity_time.start
            let end = this.form.activity_time.end
            let now = new Date()
            now.setHours(0)
            now.setMinutes(0)
            now.setSeconds(0)
            now.setMilliseconds(0)
            start = start || now
            if (start && end) {
              return (currentDate.getTime() <= start || currentDate.getTime() >= end)
            } else if (!start && end) {
              return currentDate.getTime() >= end
            } else if (start && !end) {
              return currentDate.getTime() <= start
            } else {
              return false
            }
          }
        }
      },
      selectOptions: {
        province_list: [],
        city_list: {},
        district_list: [],
        location: null,
        location_options: [],
        location_loading: false
      },
      location_position: {
        point: [110.348828, 20.018737],
        events: {
          click (e) {
            console.log('markerPosition', [e.lnglat.lng, e.lnglat.lat])
            if (!self.amap_data.geocoder) { // 解析插件未初始化完成
              return false
            }
            self.amap_data.geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function (status, result) {
              console.log('coder_function', status, result)
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  console.log('result.regeocode.formattedAddress', result.regeocode.formattedAddress)
                }
              } else {
                self.$toast('获取位置失败！')
              }
            })
          },
          dragend (e) {
            console.log('markerPosition', [e.lnglat.lng, e.lnglat.lat])
            if (!self.amap_data.geocoder) { // 解析插件未初始化完成
              return false
            }
            self.amap_data.geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function (status, result) {
              console.log('coder_function', status, result)
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  console.log('result.regeocode.formattedAddress', result.regeocode.formattedAddress)
                }
              } else {
                self.$toast('获取经纬度失败！')
              }
            })
          }
        }
      },
      amap_data: {
        manager: amapManager,
        placesearch: null,
        geocoder: null,
        districtsearch: null,
        plugin: [{
          pName: 'ToolBar',
          events: {
            init (instance) {
              console.log('ToolBar', instance)
            }
          }
        },
        {
          pName: 'Geolocation',
          events: {
            init (o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log('getCurrentPosition', status, result)
                if (result && result.position) {
                  self.amap_data.center = [result.position.lng, result.position.lat]
                  self.location_position.point = [result.position.lng, result.position.lat]
                  // self.loaded = true
                  // self.$nextTick()
                }
              })
            }
          }
        },
        {
          pName: 'PlaceSearch',
          pageSize: 50,
          events: {
            init (placesearch) {
              console.log('placesearch', placesearch)
              self.amap_data.placesearch = placesearch
            }
          }
        },
        {
          pName: 'Geocoder',
          events: {
            init (geocoder) {
              console.log('geocoder', geocoder)
              self.amap_data.geocoder = geocoder
            }
          }
        },
        {
          pName: 'DistrictSearch',
          level: 'country',
          subdistrict: 1,
          events: {
            init (districtsearch) {
              self.amap_data.districtsearch = districtsearch
              self.amap_data.districtsearch.search('中国', function (status, result) {
                if (result && result.info === 'OK') {
                  self.selectOptions.province_list = result.districtList[0].districtList
                  // 固定设置为海南省
                  self.amap_data.districtsearch.setLevel('province')
                  self.selectOptions.province_list.forEach(item => {
                    self.amap_data.districtsearch.search(item.name, function (status, result) {
                      if (result && result.info === 'OK') {
                        console.log(item.name, result)
                        self.selectOptions.city_list[item.name] = result.districtList[0].districtList
                      }
                    })
                  })
                  setTimeout(() => {
                    console.log('citys', self.selectOptions.city_list[self.form.address_data.province])
                  }, 1000)
                }
              })
            }
          }
        }],
        // 海南省政府位置
        center: [110.348828, 20.018737],
        zoom: 12
      },
      form: {
        name: '',
        cover: {
          id: '',
          url: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1539487911&di=5851f925ddb548b4048be227712c12b7&src=http://imgsrc.baidu.com/imgad/pic/item/c75c10385343fbf2618015f7ba7eca8064388fb2.jpg'
        },
        activity_time: {
          start: '',
          end: ''
        },
        deadline: '1',
        deadline_date: '',
        address: '2',
        address_data: {
          province: '海南省',
          city: '海口市',
          district: '',
          location: ''
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
      this.form.cover.id = res.data.id[0]
      // this.form.cover.url = URL.createObjectURL(file.raw)
      this.form.cover.url = res.data.url[0]
    },
    beforeCoverUpload (file) {
      console.log('beforeCoverUpload', file)
      const isLt10M = file.size / 1024 / 1024 < 10 // 限制上传图片小雨10M
      if (!isLt10M) {
        this.$toast('上传头像图片大小不能超过 10MB!')
      }
      return isLt10M
    },
    saveContent (e) {
      let eve = e || window.event
      const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      const controlDown = isMac ? eve.metaKey : eve.ctrlKey
      if (eve.keyCode.toString() === '83' && controlDown) {
        console.log('执行保存操作') // 执行保存操作
        eve.preventDefault()
        eve.stopPropagation()
        return false
      }
    },
    changeStart (date) {
      let msStart = date.getTime()
      let msEnd = this.form.activity_time.end ? this.form.activity_time.end.getTime() : 0
      let msDeadline = this.form.deadline_date ? this.form.deadline_date.getTime() : 0
      if (msStart >= msDeadline) {
        this.$toast('开始时间大于等于截止时间，已重置截止时间！', 3000)
        this.form.deadline_date = ''
      }
      if (msStart >= msEnd && msEnd) {
        this.$toast('开始时间大于结束时间，已重置结束时间！', 3000)
        this.form.activity_time.end = ''
      }
    },
    changeEnd (date) {
      let msStart = this.form.activity_time.start ? this.form.activity_time.start.getTime() : 0
      let msEnd = date.getTime()
      let msDeadline = this.form.deadline_date ? this.form.deadline_date.getTime() : 0
      if (msEnd <= msStart) {
        this.$toast('结束时间必须大于开始时间！', 3000)
        this.form.activity_time.end = ''
        return false
      }
      if (msEnd < msDeadline) {
        this.$toast('结束时间小于截止时间，已重置截止时间', 3000)
        this.form.deadline_date = ''
      }
    },
    changeDeadlineDate (date) {
      let msStart = this.form.activity_time.start ? this.form.activity_time.start.getTime() : 0
      let msEnd = this.form.activity_time.end ? this.form.activity_time.end.getTime() : 0
      let msDeadline = date.getTime()
      if ((msEnd && msDeadline >= msEnd) || (msStart && msDeadline <= msStart)) {
        this.$toast('截止时间必须大于开始时间，且小于结束时间！', 3000)
        this.form.deadline_date = ''
      }
    },
    changeDeadline (label) {
      if (label === '2') {
        this.$refs['deadlinePicker'].focus()
      }
    },
    changeAddress (label) {
      console.log('changeAddress')
    },
    locationMarkerChange (e) {
      console.log('locationMarkerChange', e)
    },
    remoteMethod (query) {
      console.log('remoteMethod', query)
      if (!this.amap_data.placesearch || !query) { // 未初始化过搜索服务 或 没有需要搜索的文字
        return false
      }
      this.amap_data.placesearch.setCity('海南省')
      this.selectOptions.location_loading = true
      this.amap_data.placesearch.search(query, (status, result) => {
        this.selectOptions.location_loading = false
        // 查询成功时，result即对应匹配的POI信息
        console.log('placesearch', status, result)
        if (result && result.info === 'OK' && result.poiList && result.poiList.count) {
          this.selectOptions.location_options = result.poiList.pois
        }
      })
      // this.amap_data.geocoder.setCity('海口')
      // this.amap_data.geocoder.getLocation(query, (status, result) => {
      //   if (status === 'complete' && result.info === 'OK') {
      //     // result中对应详细地理坐标信息
      //     console.log('remoteMethodSuccess', status, result)
      //   } else {
      //     // 未获取到对应的信息
      //     // this.$toast('获取位置失败！')
      //   }
      // })
    },
    resetMarker () {
      if (!this.selectOptions.location) { // 没有选中的地址
        return false
      }
      const lnglat = [this.selectOptions.location.lng, this.selectOptions.location.lat]
      this.location_position.point = lnglat
      this.amap_data.center = lnglat
    },
    provinceChange (province) {
      console.log('provinceChange', province)
      this.form.address_data.city = ''
      this.form.address_data.district = ''
    },
    cityChange (city) {
      console.log('cityChange', city)
      this.form.address_data.district = ''
      if (city) {
        this.amap_data.districtsearch.setLevel('city')
        this.amap_data.districtsearch.search(city, (status, result) => {
          if (result && result.info === 'OK') {
            this.selectOptions.district_list = result.districtList[0].districtList
          }
        })
      } else {
        this.selectOptions.district_list = []
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.saveContent, false)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.saveContent, false)
  }
}
</script>

<style scoped>
.page-main{
  width: 1200px;
  margin: 0 auto;
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
  padding-top: 30px;
  overflow: visible;
  position: relative;
}
.sava-tip-box{
  width: 120px;
  font-size: 14px;
  line-height: 20px;
  position: absolute;
  left: 981px;
  top: 230px;
  overflow: visible;
}
.save-tip-content{
  padding: 7px 24px 7px 10px;
  background: linear-gradient(90deg, rgba(0,154,255, 0.65), rgba(0,192,255,0.65));
  border-radius: 0 37px 37px 0;
  color: #fff;
}
.sava-tip-box .box1{
  border-width: 0 26px 8px 0;
  border-style: solid;
  border-color: transparent #29AEFF transparent transparent;
  position: absolute;
  left: 0;
  bottom: -8px;
}
.sava-tip-box .box2{
  width: 7px;
  height: 8px;
  background: #29AEFF;
  position: absolute;
  left: 19px;
  bottom: -8px;
}
.sava-tip-box .box3{
  border-width: 7px 7px 0 0;
  border-style: solid;
  border-color: #29AEFF transparent transparent transparent;
  position: absolute;
  left: 19px;
  bottom: -15px;
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
.form-left.required:before{
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
  border: 1px solid #D2D2D2;
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
  position: relative;
  cursor: pointer;
}
.cover-add.added{
  border-width: 0;
}
.cover-add.added:hover:before{
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.2);
  z-index: 1
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
  z-index: 2;
}
.cover-add:hover .cover-btn{
  border-color: #009AFF;
  background-image: url('/user-pc/cwebassets-pc/image/add_cover_hover.png');
  background-size: 72px 63px;
}
.cover-add.added .cover-btn{
  border-color: transparent;
  background-image: url('/user-pc/cwebassets-pc/image/add_cover_added.png');
  background-size: 76px 67px;
  opacity: 0;
}
.cover-add.added:hover .cover-btn{
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
.cover-add:hover .cover-btn-text{
  color: #009AFF;
}
.added:hover .cover-btn-text{
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

.date-picker{
  width: 366px;
  height: 40px;
  cursor: pointer;
}
.date-picker /deep/ .el-input__inner{
  padding: 0 40px 0 10px;
  border-color: #D2D2D2;
  border-radius: 0;
}
.date-picker /deep/ .icon-date{
  font-size: 24px;
  color: #BCBCBC;
}
.date-picker /deep/ .el-input__prefix{
  right: 8px;
  left: unset;
}
.center-sign{
  width: 61px;
  text-align: center;
  font-size: 16px;
  color: #333;
  line-height: 40px;
}
</style>

<style>
.el-date-table__row td:first-child, .el-date-table__row td:last-child{
  color: #FF2B2B;
}
.deadline-left{
  width: 427px;
}
.form-radio{
  line-height: 40px;
}
/* .edit-address{
  clear: both;
} */
.address-select{
  width: 175px;
  margin-right: 16px;
}
.address-select /deep/ .el-input__inner{
  border-radius: 0;
  padding-left: 10px;
}
.location-search-box{
  width: 409px;
  border: 1px solid #D2D2D2;
  position: relative;
}
.location-search-box /deep/ .el-input__inner{
  height: 38px;
  line-height: 38px;
  padding-left: 10px;
}
.location-search-select /deep/ .el-input__inner{
  border: none;
  border-radius: 0;
  width: 306px;
  cursor: text;
}
.location-search-select /deep/ .el-select__caret{
  cursor: text !important;
}
.location-search-btn{
  width: 90px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}
.location-search-btn.disabled{
  background: #A6A6A6;
}
/* 地图 */
.amap-instance-container{
  width: 793px;
  height: 350px !important;
  clear: both;
  padding-top: 15px;
  overflow: hidden;
}
</style>
