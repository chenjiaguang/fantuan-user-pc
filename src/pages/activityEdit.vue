<template>
  <div class="page" @click.stop="showLocationOptions = false">
    <top-nav :buttons="true" :canPreview="canPreview" :canPublish="canPublish" @preview="preview" @publish="publish" />
    <div class="page-main">
      <div class="overview clearfix">
        <div class="account fl">账号：<span>{{overview.account.name}}</span></div>
        <div class="circle fl">发布于“{{overview.circle.name}}”群组</div>
      </div>
      <div class="sava-tip-box">
        <div class="save-tip-content">ctrl+s可以直接保存当前填写的内容</div>
        <div class="box1"></div>
        <div class="box2"></div>
        <div class="box3"></div>
      </div>
      <div class="basic-setting">
        <div class="setting-header" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets-pc/image/head_bg.png)'}">基本信息设置</div>
        <!-- 主题 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动主题</div>
          <div class="form-right fl">
            <input class="form-input form-name" :maxlength="30" v-model="form.name" placeholder="请输入活动主题，最多30个字" />
          </div>
        </div>
        <!-- 活动封面 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动封面</div>
          <div class="form-right fl clearfix">
            <el-upload
              class="avatar-uploader fl"
              :disabled="uploadLoading"
              :multiple="false"
              :action="$imageUploadUrl"
              :data="upload_data"
              :drag="true"
              :show-file-list="false"
              :before-upload="beforeCoverUpload"
              :http-request="httpRequest">
              <div class="cover-add fl" :class="{added: (form.cover.id && form.cover.url), loading: uploadLoading, error: uploadError}" :style="{backgroundImage: 'url(' + ((form.cover.id && form.cover.url) ? form.cover.url : '') + ')'}">
                <div v-show="uploadLoading || uploadError" class="loading-box">
                  <loading-icon v-show="uploadLoading" class="loading-icon" :size="34"/>
                  <p v-show="uploadError" class="loading-text">上传失败，重新上传</p>
                </div>
                <div v-show="!(uploadLoading || uploadError)" class="cover-btn" :class="{added: (form.cover.id && form.cover.url)}">
                  <i class="iconfont icon-camera"></i>
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
              popper-class="ft-popper-1"
              prefix-icon="iconfont icon-date"
              :editable="false"
              :clearable="false"
              v-model="form.activity_time.start"
              type="datetime"
              placeholder="请选择开始时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.start"
              @change="changeStart"
              @focus="focusPicker">
            </el-date-picker>
            <div class="fl center-sign">至</div>
            <el-date-picker
              class="fl date-picker"
              popper-class="ft-popper-2"
              prefix-icon="iconfont icon-date"
              :editable="false"
              :clearable="false"
              v-model="form.activity_time.end"
              type="datetime"
              placeholder="请选择结束时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.end"
              @change="changeEnd"
              @focus="focusPicker">
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
              popper-class="ft-popper-3"
              prefix-icon="iconfont icon-date"
              :disabled="form.deadline === '1'"
              :editable="false"
              :clearable="false"
              v-model="form.deadline_date"
              type="datetime"
              placeholder="请选择截止时间"
              default-time="00:00:00"
              :picker-options="pickerOptions.deadline"
              @change="changeDeadlineDate"
              @focus="focusPicker">
            </el-date-picker>
          </div>
        </div>
        <!-- 活动类型 -->
        <div class="form-item clearfix" style="margin-bottom: 15px;">
          <div class="form-left fl required">活动地点</div>
          <div class="form-right fl">
            <el-radio class="fl form-radio" v-model="form.address" label="1">线上活动</el-radio>
            <el-radio class="fl form-radio" v-model="form.address" label="2">线下活动</el-radio>
          </div>
        </div>
        <!-- 活动地图 -->
        <div v-show="form.address.toString() === '2'" class="form-item clearfix" style="margin-top:15px;">
          <div class="form-left fl" style="color:transparent">活动地图</div>
          <div class="form-right fl clearfix">
            <el-select class="fl address-select" popper-class="ft-popper-4" value-key="name" style="display:none" disabled v-model="form.address_data.province" placeholder="选择省" @change="provinceChange" @focus="e => focusSelector('ft-popper-4', e)">
              <el-option
                v-for="item in selectOptions.province_list"
                :key="item.name"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <el-select class="fl address-select" popper-class="ft-popper-5" value-key="name" v-model="form.address_data.city" placeholder="选择城市" @change="cityChange" @focus="e => focusSelector('ft-popper-5', e)">
              <el-option
                v-for="item in selectOptions.city_list[form.address_data.province.name]"
                :key="item.name"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <el-select class="fl address-select" popper-class="ft-popper-6" value-key="name" v-model="form.address_data.district" placeholder="选择区/县" @focus="e => focusSelector('ft-popper-6', e)">
              <el-option
                v-for="item in selectOptions.district_list"
                :key="item.name"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <div class="location-search-box fl clearfix">
              <input class="location-address" v-model="form.address_data.location" placeholder="请输入详细地址，例如金贸中路1号店" @input="remoteMethod" @focus="showLocationOptions = true" @click.stop />
              <!-- <el-select
                class="location-search-select fl"
                value-key="id"
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
                  :value="item">
                </el-option>
              </el-select> -->
              <div class="location-search-btn fl" @click="resetMarker(selectOptions.location)" :class="{disabled: !selectOptions.location}"><i class="iconfont icon-location" style="font-size:18px;margin-right:5px;vertical-align:middle;"></i><span style="vertical-align:middle">标记位置</span></div>
              <ul class="location-search-options" v-show="showLocationOptions">
                <li class="location-search-options-content" v-show="selectOptions.location_options && selectOptions.location_options.length > 0" v-for="item in selectOptions.location_options" :key="item.id" @click="resetMarker(item, true, true)">{{item.name}}</li>
                <li class="location-search-options-content" v-show="!(selectOptions.location_options && selectOptions.location_options.length > 0)">暂无数据</li>
              </ul>
            </div>
            <div class="amap-instance-container">
              <el-amap vid="ac-location" :center="amap_data.center" :zoom="amap_data.zoom" :map-manager="amap_data.manager" :plugin="amap_data.plugin">
                <el-amap-marker v-if="location_position.point" vid="location-marker" :position="location_position.point" :topWhenClick="true" :clickable="true" :draggable="true" :events="location_position.events"></el-amap-marker>
              </el-amap>
            </div>
          </div>
        </div>
        <!-- 活动详情 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">活动详情</div>
          <div class="form-right fl" style="width:793px">
            <editor ref="editor" @keydown="saveContent" />
          </div>
        </div>
      </div>
      <div class="fee-setting">
        <div class="setting-header" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets-pc/image/head_bg.png)'}">费用设置</div>
        <!-- 票种设置 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">票种设置</div>
          <div class="form-right fl">
            <ul class="ticket-box">
              <li class="ticket-header clearfix">
                <div class="header-name fl">票种</div>
                <div class="header-price fl">金额(元)</div>
                <div class="header-amount fl">总数</div>
                <div class="header-btn fl">操作</div>
              </li>
              <li class="ticket-item clearfix" v-if="form.ticket_data && form.ticket_data.length > 0" v-for="item in form.ticket_data" :key="item.key">
                <input class="ticket-name fl" placeholder="请输入票种名称，最多输入15字" v-model="item.name" :maxlength="15" />
                <input class="ticket-price fl" placeholder="免费请填0" v-model="item.price" @input.stop="limitInput" @keypress.stop="limitPrice" />
                <input class="ticket-amount fl" placeholder="无限制可不填" v-model="item.amount" @input.stop="limitInput" @keypress="limitMax" />
                <div class="ticket-btn fl"><i @click.stop="deleteTicket(item.key)" class="iconfont icon-delete delete-ticket" :title="(form.ticket_data && form.ticket_data.length === 1) ? '至少保留一个有效票种' : ''" :class="{disabled: (form.ticket_data && form.ticket_data.length <= 1)}"></i></div>
              </li>
              <li v-if="form.ticket_data && (form.ticket_data.length === 0 || form.ticket_data.length < 20)" class="ticket-bottom-btn">
                <div @click.stop="addTicket" class="add-ticket">
                  <div class="inner">
                    <div class="inner-content"><i class="iconfont icon-jiahao"></i>添加票种</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 限购设置 -->
        <div class="form-item clearfix">
          <div class="form-left fl">限购设置</div>
          <div class="form-right fl">
            <input class="activity-limit" placeholder="每个账号的限购数量大于0，若无限制则无需填写" v-model="form.ticket_limit" @input.stop="limitInput" @keypress="limitMax" />
          </div>
        </div>
        <!-- 费用中是否包含保险 -->
        <div class="form-item clearfix">
          <div class="form-left fl" style="line-height:20px">费用中是否包含保险</div>
          <div class="form-right fl">
            <el-radio class="fl form-radio" style="min-width:unset;" v-model="form.has_insurance" label="1">包含</el-radio>
            <el-radio class="fl form-radio" style="min-width:unset;" v-model="form.has_insurance" label="2">不包含</el-radio>
          </div>
        </div>
      </div>
      <div class="other-setting">
        <div class="setting-header" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets-pc/image/head_bg.png)'}">其他设置</div>
        <!-- 报名表单设置 -->
        <div class="form-item clearfix">
          <div class="form-left fl required" style="line-height:20px;padding-left:15px;box-sizing:border-box;">报名表单设置</div>
          <div class="form-right fl clearfix" style="width:793px">
            <el-checkbox-group class="user-form-list fl clearfix" v-model="form.form_list">
              <el-checkbox class="fl" label="phone" disabled>手机</el-checkbox>
              <el-checkbox class="fl" label="name">姓名</el-checkbox>
              <el-checkbox class="fl" label="gender">性别</el-checkbox>
              <el-checkbox class="fl" label="idcard">身份证</el-checkbox>
              <el-checkbox class="fl" label="wechat">微信号</el-checkbox>
            </el-checkbox-group>
            <span class="fr" style="font-size:16px;line-height:40px;color:#bbb">(设置用户报名时的填写信息)</span>
          </div>
        </div>
        <!-- 咨询电话 -->
        <div class="form-item clearfix">
          <div class="form-left fl required">咨询电话</div>
          <div class="form-right fl">
            <input class="activity-limit" placeholder="请输入主办方联系电话" v-model="form.sponsor_tel" />
          </div>
        </div>
      </div>
      <div class="agreement">
        <el-checkbox class="agreement-checkbox" v-model="form.agreement" disabled>我同意<a href="https://fanttest.fantuanlife.com/h5/agreement?type=activity">《范团活动发布协议》</a></el-checkbox>
      </div>
    </div>
    <us :onlyCopyright="false" />
  </div>
</template>

<script>
import Vue from 'vue'
import TopNav from '@/components/TopNav'
import Us from '@/components/Us'
import LoadingIcon from '@/components/LoadingIcon'
import Editor from '@/components/Editor'
import uploadUtil from '@/lib/uploadUtil'
import axios from 'axios'
import { Upload, DatePicker, Button, Radio, Select, Option, CheckboxGroup, Checkbox } from 'element-ui'
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
// 初始化vue-amap
let amapManager = VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'ba6c996137985103dfcccd5ac7457ccb',
  // 插件集合
  plugin: ['ToolBar', 'PlaceSearch', 'Geocoder', 'DistrictSearch'],
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
    console.log('imageUploadUrl', this.$imageUploadUrl)
    return {
      showLocationOptions: false,
      upload_data: {},
      uploadLoading: false,
      uploadError: false,
      value: '',
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
        point: null,
        events: {
          // click (e) {
          //   if (!self.amap_data.geocoder) { // 解析插件未初始化完成
          //     return false
          //   }
          //   self.amap_data.geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function (status, result) {
          //     if (status === 'complete' && result.info === 'OK') {
          //       if (result && result.regeocode) {
          //         console.log('result.regeocode.formattedAddress', result.regeocode.formattedAddress)
          //       }
          //     } else {
          //       self.$toast('获取位置失败！')
          //     }
          //   })
          // },
          dragend (e) { // 拖拽结束时，设置marker位置
            self.location_position.point = [e.target.Uh.position.lng, e.target.Uh.position.lat]
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
                    if (item.name === '海南省') {
                      // 将海南省设置为默认选项
                      self.form.address_data.province = item
                    }
                    self.amap_data.districtsearch.search(item.name, function (status, result) {
                      if (result && result.info === 'OK') {
                        self.selectOptions.city_list[item.name] = result.districtList[0].districtList
                        if (item.name === '海南省') {
                          result.districtList[0].districtList.forEach(item => {
                            if (item.name === '海口市') {
                              // 将海口市设置为默认选项
                              self.form.address_data.city = item
                              self.cityChange(item)
                            }
                          })
                        }
                      }
                    })
                  })
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
          url: ''
        },
        activity_time: {
          start: '',
          end: ''
        },
        deadline: '1',
        deadline_date: '',
        address: '2',
        address_data: {
          province: {},
          city: {},
          district: {},
          location: ''
        },
        ticket_data: [{name: '', price: '', amount: '', key: new Date().getTime()}],
        ticket_limit: '',
        has_insurance: '2',
        form_list: ['phone'],
        sponsor_tel: '',
        agreement: true,
        // editor的默认内容
        editorContent: ''
      }
    }
  },
  components: { TopNav, Us, LoadingIcon, Editor },
  computed: {
    canPreview: function () {
      return this.confirmActivity(true)
    },
    canPublish: function () {
      return this.confirmActivity(true)
    }
  },
  methods: {
    confirmActivity (dontToast) { // 检查出编辑框外的必填项是否都已填写完全
      let { name, cover: {id, url}, activity_time: {start, end}, deadline, deadline_date: deadlineDate, address, ticket_data: ticketData, sponsor_tel: sponsorTel } = this.form
      let location = this.selectOptions.location
      const errorObj = {
        name: name ? '' : '请填写活动主题',
        cover: (id && url) ? '' : '请上传活动封面',
        activityTime: (start && end) ? '' : '请选择活动时间',
        deadline: (deadline.toString() === '1' || (deadline.toString() === '2' && deadlineDate)) ? '' : '请设置正确的截止时间',
        address: (address.toString() === '1' || (address.toString() === '2' && location)) ? '' : '请填写正确的活动地点',
        ticket: (ticketData.length > 0 && ticketData.filter(item => item.name && item.name && (item.price || item.price === 0)).length === ticketData.length) ? '' : '请设置至少一种有效的票种',
        sponsorTel: sponsorTel ? '' : '请填写咨询电话'
      }
      let flat = true
      for (let i in errorObj) {
        if (errorObj[i]) {
          flat = false
          if (!dontToast) {
            this.$toast(errorObj[i])
          }
          break
        }
      }
      return flat
    },
    focusPicker (e) {
      let eve = e || window.event
      let className = eve.popperClass
      let pos = eve.$el.getBoundingClientRect()
      let top = pos.top + pos.height + (document.documentElement.scrollTop || document.body.scrollTop)
      let st = document.getElementById(className)
      if (!st) {
        st = document.createElement('style')
        st.id = className
      }
      st.innerHTML = '.el-picker-panel.' + className + '{top:' + top + 'px !important}'
      document.getElementsByTagName('body')[0].appendChild(st)
    },
    focusSelector (className, e) {
      let eve = e || window.event
      let pos = eve.currentTarget.getBoundingClientRect()
      let top = pos.top + pos.height + (document.documentElement.scrollTop || document.body.scrollTop)
      let st = document.getElementById(className)
      if (!st) {
        st = document.createElement('style')
        st.id = className
      }
      st.innerHTML = '.el-select-dropdown.' + className + '{top:' + top + 'px !important}'
      document.getElementsByTagName('body')[0].appendChild(st)
    },
    checkContent () { // 检查编辑框中的图片是否已上传完毕
      let editor = this.$refs['editor'].editor
      let imgs = editor.editable().find('img')
      let pass = true
      for (let i = 0; i < imgs.count(); i++) {
        let img = imgs.getItem(i)
        // Assign src once, as it might be a big string, so there's no point in duplicating it all over the place.
        let imgSrc = img.getAttribute('src')
        let imgClass = img.getAttribute('class')
        // Image have to contain src=data:...
        let isDataInSrc = imgSrc && imgSrc.substring(0, 5) === 'data:'
        // 是否拖拽按钮
        let isDragIcon = imgClass && imgClass.indexOf('cke_widget_drag_handler') !== -1
        let isFantuan = imgSrc.indexOf('fantuanlife.com') !== -1
        if ((isDataInSrc && !isDragIcon) || (!isDataInSrc && !isFantuan)) {
          pass = false
        }
      }
      return pass
    },
    preview () {
      console.log('预览')
      if (this.checkContent()) {
        // 预览
      } else {
        // 提示编辑器中有图片未上传
      }
    },
    publish () {
      console.log('发布')
      if (this.checkContent()) {
        // 发布
      } else {
        // 提示编辑器中有图片未上传
      }
    },
    beforeCoverUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10 // 限制上传图片小雨10M
      if (!isLt10M) {
        this.$toast('图片大于10M，请重新上传')
      }
      return isLt10M
    },
    httpRequest (upload) { // oss直传图片
      console.log('httpRequest')
      const setData = async () => {
        this.uploadLoading = true
        this.uploadError = false
        let md5 = await uploadUtil.getMd5(upload.file)
        await this.$ajax('/jv/api/sts/H5', {
          data: {
            md5: md5
          }
        })
          .then(res => {
            let formData = new FormData()
            formData.append('key', res.dir)
            formData.append('policy', res.policy)
            formData.append('OSSAccessKeyId', res.accessid)
            formData.append('callback', res.callback)
            formData.append('signature', res.signature)
            formData.append('success_action_status', '200')
            formData.append('file', upload.file)
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            axios.post(this.$imageUploadUrl, formData, config).then(res => {
              console.log('uploadSuccess', res)
              this.uploadLoading = false
              this.form.cover.id = res.data.imageId
              this.form.cover.url = res.data.url
            }).catch(err => {
              this.uploadLoading = false
              this.uploadError = true
              console.log(err)
            })
          })
          .catch(err => {
            this.uploadLoading = false
            this.uploadError = true
            console.log(err)
          })
      }
      setData()
    },
    saveContent (e) {
      let eve = e || window.event
      const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      const controlDown = isMac ? eve.metaKey : eve.ctrlKey
      if (eve.keyCode.toString() === '83' && controlDown) {
        console.log('保存，编辑器内容为:', this.$refs['editor'].getData()) // 执行保存操作
        eve.preventDefault()
        eve.stopPropagation()
        return false
      }
    },
    changeStart (date) {
      let msStart = date.getTime()
      let msEnd = this.form.activity_time.end ? this.form.activity_time.end.getTime() : 0
      let msDeadline = this.form.deadline_date ? this.form.deadline_date.getTime() : 0
      if (msStart >= msDeadline && msDeadline !== 0) {
        if (this.form.deadline === '2') {
          this.$toast('开始时间大于等于截止时间，已重置截止时间！', 3000)
        }
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
      if (msEnd < msDeadline && msDeadline !== 0) {
        if (this.form.deadline === '2') {
          this.$toast('结束时间小于截止时间，已重置截止时间', 3000)
        }
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
    remoteMethod (e) { // 实时模糊搜索地址
      let eve = e || window.event
      const query = eve.currentTarget.value
      if (this.amap_data.placesearch && query) { // 搜索服务已初始化完成 且 有需要搜索的文字
        let {province, city, district} = this.form.address_data
        let adcode = district.adcode || city.adcode || province.adcode
        this.amap_data.placesearch.setCity(adcode)
        this.selectOptions.location_loading = true
        this.amap_data.placesearch.search(query, (status, result) => {
          this.selectOptions.location_loading = false
          // 查询成功时，result即对应匹配的POI信息
          if (result && result.info === 'OK' && result.poiList && result.poiList.count) {
            this.selectOptions.location_options = result.poiList.pois
            this.selectOptions.location = result.poiList.pois[0]
            // this.resetMarker(result.poiList.pois[0])
          }
        })
      }
    },
    resetMarker (location, resetName, dontChangePos) {
      let _location = location || this.selectOptions.location
      if (!_location) { // 没有选中的地址
        return false
      }
      if (!this.form.address_data.location && !resetName) { // 搜索框中无搜索内容时，设置位置为空
        this.location_position.point = null
        return false
      }
      const lnglat = [_location.location.lng, _location.location.lat]
      this.selectOptions.location = _location
      if (!dontChangePos) {
        this.location_position.point = lnglat
        this.amap_data.center = lnglat
      }
      if (resetName) {
        this.form.address_data.location = _location.name
      }
    },
    provinceChange (province) { // 改变选中的省份时，重置城市，区/县
      this.form.address_data.city = {}
      this.form.address_data.district = {}
    },
    cityChange (city) { // 改变选中的城市时，重置区/县
      this.form.address_data.district = {}
      if (city) {
        this.amap_data.districtsearch.setLevel('city')
        this.amap_data.districtsearch.search(city.adcode, (status, result) => {
          if (result && result.info === 'OK' && this.form.address_data.city.name === city.name) {
            this.selectOptions.district_list = result.districtList[0].districtList
          }
        })
      } else {
        this.selectOptions.district_list = []
      }
    },
    addTicket () { // 添加票种
      if (this.form.ticket_data && this.form.ticket_data.length >= 20) {
        return false
      }
      if (!this.form.ticket_data) {
        this.form.ticket_data = [{name: '', price: '', amount: '', key: new Date().getTime()}]
      } else {
        this.form.ticket_data.push({name: '', price: '', amount: '', key: new Date().getTime()})
      }
    },
    deleteTicket (key) { // 删除票种
      if (!this.form.ticket_data || (this.form.ticket_data && this.form.ticket_data.length <= 1)) { // 不存在或者只有一项时，不可删除
        return false
      }
      this.form.ticket_data = this.form.ticket_data.filter(item => item.key !== key)
    },
    limitPrice (e) { // 价格输入框输入过滤，需是最多两位小数的非负数
      let eve = e || window.event
      let oldVal = eve.currentTarget.value
      let newVal = oldVal + eve.key
      let result = /^([0]|([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(newVal)
      if (!result) {
        eve.returnValue = false
      }
    },
    limitInput (e) {
      let eve = e || window.event
      let val = eve.currentTarget.value
      let numVal = val.replace(/[^0-9.]/ig, '')
      let dbDotPos = numVal.indexOf('..')
      let dotLen = numVal.match(/\.s/ig) ? numVal.match(/\./ig).length : 0
      if (dbDotPos !== -1) {
        numVal = numVal.substr(0, numVal.indexOf('.')).replace('.', '').substr(0, 6)
        return false
      } else if (dotLen > 1) {
        let secondDotPos = numVal.indexOf('.', numVal.indexOf('.') + 1)
        numVal = numVal.substr(0, secondDotPos).substr(0, 6)
      } else {
        numVal = numVal.substr(0, 6)
      }
      eve.currentTarget.value = numVal
      // eve.currentTarget.value = '543'
      // setTimeout(() => {
      //   console.log('limitInput', val, this.form.ticket_data)
      // }, 500)
      // let eve = e || window.event
      // console.log('limitDown', eve.keyCode)
      // if ((eve.keyCode >= 48 && eve.keyCode <= 57) || (eve.keyCode >= 96 && eve.keyCode <= 105) || eve.keyCode === 8 || eve.keyCode === 110) {

      // } else {
      //   console.log('prevent')
      //   // eve.returnValue = false
      //   eve.preventDefault()
      //   // return false
      // }
    },
    limitMax (e) { // 限购数量，需是正整数
      let eve = e || window.event
      let oldVal = eve.currentTarget.value
      let newVal = oldVal + eve.key
      let result = /^[1-9]\d*$/.test(newVal)
      if (!result) {
        eve.returnValue = false
      }
    }
  },
  mounted () {
    // 绑定ctrl+s事件
    document.addEventListener('keydown', this.saveContent, false)
    let info = {}
    info.token = sessionStorage.getItem('token')
    info.userId = sessionStorage.getItem('userId')
    info.userName = sessionStorage.getItem('userName')
    info.circleId = sessionStorage.getItem('circleId')
    info.circleName = sessionStorage.getItem('circleName')
    this.overview.account.id = info.userId
    this.overview.account.name = info.userName
    this.overview.circle.id = info.circleId
    this.overview.circle.name = info.circleName
    console.log('info', info)
    if (!info.token) { // 不存在token时重定向到首页扫码
      this.$router.replace({name: 'ScanCode'})
    }
  },
  beforeDestroy () {
    // 移除ctrl+s事件
    document.removeEventListener('keydown', this.saveContent, false)
  }
}
</script>

<style scoped>
.page-main /deep/ input::placeholder, .page-main /deep/ select::placeholder, .page-main /deep/ textarea::placeholder{
  color: #BBBBBB;
}
.page-main{
  width: 1200px;
  margin: 0 auto;
  position: relative;
}
.page-main input{
  color: #333;
}
.page-main /deep/ input, .page-main /deep/ select{
  transition: border-color 300ms;
}
.page-main /deep/ input:hover, .page-main /deep/ select:hover{
  border-color: #009AFF;
}
.page-main /deep/ input:focus, .page-main /deep/ select:focus{
  border-color: #009AFF;
}
.page-main /deep/ .el-radio__label, .page-main /deep/ .el-checkbox__label{
  font-size: 16px;
  font-weight: normal;
}
.page-main /deep/ .el-upload-dragger{
  border-radius: 0;
  border: none;
  width: unset;
  height: unset;
}
.page-main /deep/ .el-input__inner{
  font-size: 16px;
  color: #333;
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
.basic-setting, .fee-setting, .other-setting{
  width: 1000px;
  border-radius: 6px;
  background: #fff;
  margin: 10px auto 0;
  padding-top: 30px;
  overflow: hidden;
  position: relative;
}
.fee-setting, .other-setting{
  margin: 25px auto 0;
}
.sava-tip-box{
  width: 120px;
  font-size: 14px;
  line-height: 20px;
  position: fixed;
  left: 50%;
  margin-left: 481px;
  top: 50%;
  overflow: visible;
  z-index: 2;
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
  font-weight: bold;
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
.cover-add.error, .cover-add.loading{
  cursor: default;
}
.cover-add.added:before{
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.2);
  z-index: 1;
  opacity: 0;
  transition: opacity 300ms;
}
.cover-add.added:hover:before{
  opacity: 1;
}
.cover-add.loading:hover:before, .cover-add.error:hover:before{
  background-color: transparent;
}
.cover-btn{
  width: 328px;
  height: 168px;
  box-sizing: border-box;
  border: 1px dashed #D2D2D2;
  margin: 15px auto;
  /* background-image: url('/user-pc/cwebassets-pc/image/add_cover.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 76px 67px; */
  position: relative;
  z-index: 2;
  transition: all 300ms;
}
.cover-add:hover .cover-btn{
  border-color: #009AFF;
  /* background-image: url('/user-pc/cwebassets-pc/image/add_cover_hover.png');
  background-size: 72px 63px; */
}
.cover-add.added .cover-btn{
  border-color: transparent;
  /* background-image: url('/user-pc/cwebassets-pc/image/add_cover_added.png');
  background-size: 76px 67px; */
  opacity: 0;
}
.cover-add.added:hover .cover-btn{
  opacity: 1;
}
.icon-camera{
  display: block;
  font-size: 76px;
  color: #BBBBBB;
  position: relative;
  top: 50%;
  margin-top: -38px;
  transition: all 300ms;
}
.cover-add:hover .icon-camera{
  color: #009AFF;
}
.cover-add.added:hover .icon-camera{
  color: #fff;
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
  transition: all 300ms;
}
.cover-add:hover .cover-btn-text{
  color: #009AFF;
}
.added:hover .cover-btn-text{
  color: #fff;
}
.loading-box{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0,0,0,0.2);
  z-index: 3;
  transition: all 300ms;
}
.loading-text{
  font-size: 16px;
  line-height: 32px;
  color: #FE3232;
  cursor: pointer;
  position: absolute;
  width: 160px;
  left: 50%;
  top: 50%;
  margin-left: -80px;
  margin-top: -16px;
}
.loading-icon{
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -17px;
  margin-top: -17px;
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
.deadline-left{
  width: 427px;
}
.form-radio{
  line-height: 40px;
  min-width: 184px;
}
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
  /* border: 1px solid #D2D2D2; */
  position: relative;
  overflow: visible;
  /* transform: border-color 300ms; */
}
.location-search-options{
  width: 306px;
  max-height: 420px;
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 5;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  color: #333;
  padding: 10 0px;
  border-radius: 6px;
  border: 1px solid #D2D2D2;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.location-search-options-content{
  width: 100%;
  font-size: 16px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 10px;
}
.location-search-options-content:hover{
  background-color: #f5f7fa;
}
.location-address{
  border: none;
  border-radius: 0;
  width: 409px;
  height: 40px;
  line-height: 38px;
  font-size: 16px;
  color: #333;
  cursor: text;
  padding-left: 10px;
  padding-right: 101px;
  border: 1px solid #D2D2D2;
  transition: border-color 300ms;
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
.location-search-btn:hover{
  background: #0189E3;
  color: #D2EDFF;
}
.location-search-btn.disabled{
  background: #A6A6A6;
  color: #fff;
}
/* 地图 */
.amap-instance-container{
  width: 793px;
  height: 350px !important;
  clear: both;
  padding-top: 15px;
  overflow: hidden;
}
/* 票种设置 */
.ticket-box{
  width: 793px;
  border-left: 1px solid #D2D2D2;
  border-right: 1px solid #D2D2D2;
}
.ticket-item{
  border-bottom: 1px solid #D2D2D2;
}
.ticket-header{
  width: 100%;
  height: 54px;
  line-height: 54px;
  font-size: 16px;
  background: #F5F5F5;
  color: #333;
  text-align: center;
  border-top: 1px solid #D2D2D2;
}
.header-name{
  width: 46%;
}
.ticket-name{
  margin: 24px 1.26%;
  width: 43.48%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #D2D2D2;
  font-size: 16px;
  text-align: center;
}
.header-price,.header-amount,.header-btn{
  width: 18%;
  position: relative;
}
.ticket-price,.ticket-amount{
  margin: 24px 1.26%;
  width: 15.48%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #D2D2D2;
  font-size: 16px;
  text-align: center;
}
.ticket-btn{
  margin: 24px 1.26%;
  width: 15.48%;
  height: 38px;
  line-height: 38px;
  text-align: center;
}
.delete-ticket{
  font-size: 24px;
  color: #9A9A9A;
  cursor: pointer;
}
.delete-ticket.disabled{
  color: #CCCCCC;
}
.header-price:before,.header-amount:before,.header-btn:before{
  content: "";
  display: block;
  width: 1px;
  height: 28px;
  background: #D2D2D2;
  position: absolute;
  left: 0;
  top: 13px;
}
.ticket-bottom-btn{
  padding: 13px 0 30px;
  border-bottom: 1px solid #D2D2D2;
}
.add-ticket{
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  height: 40px;
  line-height: 38px;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  user-select: none;
  cursor: pointer;
  width: 130px;
  color: #009AFF;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
.add-ticket:hover {
  background: linear-gradient(90deg, #009AFF, #00C0FF);
  color: #fff;
}
.add-ticket .inner{
  background: transparent;
  left: 1px;
  top: 1px;
  bottom: 1px;
  right: 1px;
  vertical-align: middle;
  position: absolute;
}
.add-ticket .inner-content{
  background: #fff;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.add-ticket:hover .inner-content{
  background: transparent;
}
.add-ticket .icon-jiahao{
  margin-right: 7px;
}

/* 限购设置 */
.activity-limit{
  width: 388px;
  height: 38px;
  line-height: 38px;
  border: 1px solid #D2D2D2;
  padding-left: 10px;
  box-sizing: content-box;
  font-size: 16px;
}
/* 报名表单设置 */
.user-form-list{
  line-height: 40px;
}
/* 勾选协议 */
.agreement{
  width: 1000px;
  border-radius: 6px;
  background: #fff;
  margin: 15px auto 30px;
}
.agreement-checkbox{
  margin-left: 65px;
  line-height: 40px;
}
.agreement-checkbox a{
  color: #009AFF;
}
</style>

<style>
.el-date-table__row td:first-child, .el-date-table__row td:last-child{
  color: #FF2B2B;
}
.test-box{
  width: 50px;
  height: 50px;
  /* background: #fff; */
}
</style>
