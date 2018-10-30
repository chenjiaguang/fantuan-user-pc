let config = {}

config.plugins = 'basicstyles,dialogui,dialog,notification,button,toolbar,clipboard,enterkey,entities,floatingspace,wysiwygarea,indent,indentlist,fakeobjects,link,list,undo,lineutils,widgetselection,widget,filetools,notificationaggregator,uploadwidget,uploadimage,imagebase,balloonpanel,balloontoolbar,xml,ajax,easyimage,panel,floatpanel,listblock,richcombo,format,font,panelbutton,colorbutton,justify,removeformat,magicline'
config.skin = 'office2013'

// Dialog windows are also simplified.
config.removeDialogTabs = 'link:advanced'

config.toolbar = [
  // Source
  ['Format', 'FontSize', 'TextColor', 'BGColor', 'Underline', 'Bold', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'RemoveFormat', 'Fantuanimage']
]
config.removeButtons = ''
// config.removeButtons = 'Save,NewPage,Preview,Print,Templates,Font,Italic,Strike,Subscript,Superscript,RemoveFormat,Blockquote,CreateDiv,Indent,Outdent,NumberedList,BulletedList,BidiRtl,BidiLtr,Language,Cut,Copy,Paste,PasteText,PasteFromWord,Redo,Replace,Find,Undo,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,Link,Unlink,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,Maximize,About'

// config.language = 'en'
config.height = 600
// config.disallowedContent = 'a'
// config.allowedContent = true
config.pasteFilter = null
config.allowedContent = {
  $1: {
    // Use the ability to specify elements as an object.
    elements: window.CKEDITOR.dtd,
    attributes: true,
    styles: true,
    classes: true
  }
}
config.disallowedContent = 'script; *[on*]'
// config.removePlugins = 'image'
config.extraPlugins = ['fantuanimageuploader']
config.imageUploadUrl = process.env.IMAGE_UPLOAD_URL
// config.extraAllowedContent = '*(*)' // 允许class属性

// config.cloudServices_tokenUrl = 'xxx'
// config.cloudServices_uploadUrl = process.env.IMAGE_UPLOAD_URL
config.easyimage_defaultStyle = 'alignLeft'
// config.easyimage_toolbar = []
export default config
