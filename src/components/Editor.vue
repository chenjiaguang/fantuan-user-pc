<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>
<script>
let editor = null
export default {
  props: ['value'],
  data () {
    return {}
  },
  watch: {
    value (val) {
      if (editor && editor.setData) editor.setData(val)
    }
  },
  mounted () {
    this.create()
  },
  methods: {
    getEditor () {
      return editor
    },
    create () {
      if (editor && editor.destroy) {
        editor.destroy()
        editor = null
      }
      editor = global.CKEDITOR.replace(this.$refs.editor, [])
      editor.setData(this.value)
    }
  }
}
</script>
