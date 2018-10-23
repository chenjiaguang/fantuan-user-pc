let config = {}
config.toolbar = [
  // Source
  ['Format', 'FontSize', 'TextColor', 'BGColor', 'Underline', 'Bold', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'RemoveFormat', 'Fantuanimage']
]
// config.removeButtons = 'Save,NewPage,Preview,Print,Templates,Font,Italic,Strike,Subscript,Superscript,RemoveFormat,Blockquote,CreateDiv,Indent,Outdent,NumberedList,BulletedList,BidiRtl,BidiLtr,Language,Cut,Copy,Paste,PasteText,PasteFromWord,Redo,Replace,Find,Undo,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,Link,Unlink,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,Maximize,About'

// config.language = 'en'
config.height = 1000
config.disallowedContent = 'a'
config.allowedContent = true
// config.removePlugins = 'image'
config.extraPlugins = ['fantuanimageuploader']
config.imageUploadUrl = process.env.IMAGE_UPLOAD_URL
// config.extraAllowedContent = '*(*)' // 允许class属性

// config.cloudServices_tokenUrl = 'xxx'
// config.cloudServices_uploadUrl = process.env.IMAGE_UPLOAD_URL
config.easyimage_defaultStyle = 'alignLeft'
config.easyimage_toolbar = []
export default config
