/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	var uniqueNameCounter = 0,
		// Black rectangle which is shown before the image is loaded.
		loadingImage = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs=';

	// Returns number as a string. If a number has 1 digit only it returns it prefixed with an extra 0.
	function padNumber( input ) {
		if ( input <= 9 ) {
			input = '0' + input;
		}

		return String( input );
	}

	// Returns a unique image file name.
	function getUniqueImageFileName( type ) {
		var date = new Date(),
			dateParts = [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];

		uniqueNameCounter += 1;

		return 'image-' + CKEDITOR.tools.array.map( dateParts, padNumber ).join( '' ) + '-' + uniqueNameCounter + '.' + type;
	}

	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'uploadwidget',

		onLoad: function() {
			CKEDITOR.addCss(
				'.cke_upload_uploading img{' +
					'opacity: 0.3' +
				'}'
			);
		},

		init: function( editor ) {
			// Do not execute this paste listener if it will not be possible to upload file.
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				return;
			}

			var fileTools = CKEDITOR.fileTools,
				uploadUrl = fileTools.getUploadUrl( editor.config, 'image' );

			if ( !uploadUrl ) {
				return;
			}

			// Handle images which are available in the dataTransfer.
			fileTools.addUploadWidget( editor, 'uploadimage', {
				supportedTypes: /image\/(jpeg|png|gif|bmp)/,

				uploadUrl: uploadUrl,

				fileToElement: function(file) {
					var img = new CKEDITOR.dom.element( 'img' );
					let tempName=getUniqueImageFileName('jpg')
					img.setAttribute( 'src', loadingImage );
					img.setAttribute( 'data-needtofigure', "true" );
					img.setAttribute( 'data-tempName', tempName);
					window.fantuanFileToDataSrc(file).then((datasrc)=>{
						let imgs = editor.editable().find('img')
						for (let i = 0; i < imgs.count(); i++) {
							let img = imgs.getItem(i)
							if (img.getAttribute( 'data-tempName')) {
								img.setAttribute( 'src', datasrc );
								img.setAttribute('data-cke-saved-src', datasrc)
								window.fantuanDataSrcToFantUrl(editor)
								break;
							}
						}
					})
					return img;
				},

				parts: {
					img: 'img'
				},

				onUploading: function( upload ) {
					// Show the image during the upload.
					this.parts.img.setAttribute( 'src', upload.data );
				},

				onUploaded: function( upload ) {
					// Width and height could be returned by server (https://dev.ckeditor.com/ticket/13519).
					var $img = this.parts.img.$,
						width = upload.responseData.width || $img.naturalWidth,
						height = upload.responseData.height || $img.naturalHeight;
					

						// fant-image
					let html=`
					<figure class="easyimage easyimage-align-left">
						<img src="${upload.url}" />
						<figcaption></figcaption>
					</figure>
					`

					let tempDoc = document.implementation.createHTMLDocument( '' )
					let temp = new CKEDITOR.dom.element(tempDoc.body)
					temp.appendHtml(html);
					let figure = temp.find( 'figure' );
					editor.widgets.initOn(figure, 'easyimage')

					this.replaceWith(figure.$[0].outerHTML+'<p></p>');
				}
			} );

		}
	} );

	/**
	 * The URL where images should be uploaded.
	 *
	 * @since 4.5
	 * @cfg {String} [imageUploadUrl='' (empty string = disabled)]
	 * @member CKEDITOR.config
	 */
} )();
