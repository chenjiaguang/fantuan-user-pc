<template>
  <div class="ft-editor">
    <!-- <button @click="tryUploadAll">tryUploadAll</button> -->
    <div ref="editor"></div>
    <div class="text-num" :class="{'text-num-max':(textNum>10000)}">字数：{{textNum}} / 10000</div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Button } from 'element-ui'
import editorConfig from '@/lib/editor-config'
import uploadUtil from '@/lib/uploadUtil'
import utils from '@/lib/utils'
Vue.use(Button)
export default {
  editor: null,
  props: ['data'],
  data () {
    return {
      textNum: 0
    }
  },
  watch: {
    data (val) {
      if (this.editor && this.editor.setData) this.editor.setData(val)
    }
  },
  mounted () {
    window.fantuanUpload = () => uploadUtil.selectFiles(this.uploadFiles)
    window.fantuanFileToDataSrc = (file) => uploadUtil.getDataSrc(file)
    window.tryUploadOne = (editor) => uploadUtil.tryUploadOne(editor)

    this.create()
  },
  methods: {
    // 获取编辑器内容
    getData () {
      let data = this.editor.getData()
      data = data.replace(/[\r\n]/g, '')
      return data
    },
    textnumchange (num) {
      this.textNum = num
    },
    // 设置编辑器内容
    setData (data) {
      if (this.editor && this.editor.setData) this.editor.setData(data)
    },
    // 打开预览
    preview () {
      // 打开预览的延时需大于200(编辑器失焦时间)
      setTimeout(() => {
        utils.preview(this.getData())
      }, 250)
    },
    // 获取内容字数
    getTextContentLength () {
      let oldhtml = this.editor.document.getBody().getHtml()
      let description = oldhtml.replace(/<.*?>/ig, '').replace(/\u200B/g, '')
      description = utils.escape2Html(description)
      console.log('内容', description)
      return description.length
    },
    // 上传文件回调
    async uploadFiles (files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        let datasrc = await uploadUtil.getDataSrc(file)
        this.editor.insertHtml(`<br/><p style='text-align: center;'><img src="${datasrc}" class='fant-image'/></p>`)
      }
      uploadUtil.tryUploadOne(this.editor)
    },
    // 编辑器初始化
    create (data) {
      if (this.editor) {
        // 如果编辑器已经存在，则直接写入内容
        this.setData(data)
      } else {
        // 基本初始化
        this.handleInit(data)
        // 事件绑定
        this.handleEvent()
      }
    },
    // 编辑器启动
    handleInit (data) {
      if (this.editor && this.editor.destroy) {
        this.editor.destroy()
        this.editor = null
      }
      this.editor = window.CKEDITOR.replace(this.$refs.editor, editorConfig)
      this.setData(data)
    },
    // 编辑器事件绑定
    handleEvent () {
      this.editor.on('change', e => {
        // 编辑器内容变化事件
        this.textnumchange(this.getTextContentLength())
      })
      this.editor.on('contentDom', () => {
        // 绑定保存的按键事件
        this.editor.document.$.addEventListener('keydown', (e) => {
          this.$emit('keydown', e)
        }, false)
        // 初始化计算字数
        this.textnumchange(this.getTextContentLength())
      })
      this.editor.on('afterPaste', e => {
        uploadUtil.tryUploadOne(this.editor)
      })
    }

  }
}
</script>

<style scoped>
.upload {
  /* display: none; */
}
.ft-editor /deep/ .cke {
  border-color: #d2d2d2;
  box-shadow: unset;
}
.ft-editor /deep/ .cke_bottom {
  background: #f5f5f5;
}
.ft-editor /deep/ .cke_path_item,
.ft-editor /deep/ .cke_path_empty {
  color: #666;
}
.text-num {
  position: absolute;
  top: 0;
  right: 12px;
  line-height: 38px;
  font-size: 12px;
}
.text-num-max {
  color: #ff4242;
}
</style>
