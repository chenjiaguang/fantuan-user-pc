CKEDITOR.plugins.add('fantuanimageuploader', {
	icons: 'fantuanimage',
	init: function (editor) {
		editor.addCommand('fantuanimageupload', {
			exec: function (editor) {
				//upload需要注册
				window.fantuanUpload()

				// editor.insertHtml(`<img src="http://staticcdntest.fantuanlife.com/uimage/b1/5c/11/3a/b15c113aeddbeb606d938010b88cf8e6.jpg?x-oss-process=image/format,jpg" width="540" height="258">`);
			}
		});
		editor.ui.addButton('Fantuanimage', {
			label: '上传图片',
			command: 'fantuanimageupload',
			toolbar: 'insert'
		});

	}
});