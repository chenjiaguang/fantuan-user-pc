CKEDITOR.plugins.add('fantuanimageuploader', {
	icons: 'fantuanimage',
	init: function (editor) {
		editor.addCommand('fantuanimageupload', {
			exec: function (editor) {
				//upload需要注册
				window.fantuanUpload()
			}
		});
		editor.ui.addButton('Fantuanimage', {
			label: '上传图片',
			command: 'fantuanimageupload',
			toolbar: 'insert'
		});

	}
});