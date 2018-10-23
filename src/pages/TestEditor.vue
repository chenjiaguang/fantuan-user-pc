<template>
  <div>
    <Editor ref="editor" @keydown="saveContent"/>
  </div>
</template>

<script>
import Editor from '../components/Editor'
export default {
  components: {Editor},
  data () {
    return {
      editorContent: '初始化默认内容'
    }
  },
  computed: {},
  mounted () {
    document.addEventListener('keydown', this.saveContent, false)
    this.$refs.editor.create(this.editorContent)
  },
  methods: {
    saveContent (e) {
      let eve = e || window.event
      const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      const controlDown = isMac ? eve.metaKey : eve.ctrlKey
      if (eve.keyCode.toString() === '83' && controlDown) {
        console.log('执行保存操作') // 执行保存操作
        console.log('编辑器内容', this.$refs.editor.getData())
        eve.preventDefault()
        eve.stopPropagation()
        return false
      }
    }
  }
}
</script>

<style scoped>
</style>
