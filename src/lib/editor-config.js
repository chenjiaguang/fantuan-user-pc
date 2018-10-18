let config = {}
config.toolbar = [
  // Source
  ['Format', 'FontSize', 'TextColor', 'BGColor', 'Underline', 'Bold', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'RemoveFormat', 'Image', 'Fantuanimage']
]
// config.removeButtons = 'Save,NewPage,Preview,Print,Templates,Font,Italic,Strike,Subscript,Superscript,RemoveFormat,Blockquote,CreateDiv,Indent,Outdent,NumberedList,BulletedList,BidiRtl,BidiLtr,Language,Cut,Copy,Paste,PasteText,PasteFromWord,Redo,Replace,Find,Undo,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,Link,Unlink,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,Maximize,About'

// config.language = 'en'
config.height = 1000
config.allowedContent = true
config.extraPlugins = ['fantuanimageuploader']
config.imageUploadUrl = 'http://fantuantest-img.oss-cn-beijing.aliyuncs.com'
// config.extraAllowedContent = '*(*)' // 允许class属性

export default config
