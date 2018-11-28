﻿/*
 Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

*/
CKEDITOR.plugins.add("contextmenu",{requires:"menu",lang:"en,zh-cn",onLoad:function(){CKEDITOR.plugins.contextMenu=CKEDITOR.tools.createClass({base:CKEDITOR.menu,$:function(a){this.base.call(this,a,{panel:{css:a.config.contextmenu_contentsCss,className:"cke_menu_panel",attributes:{"aria-label":a.lang.contextmenu.options}}})},proto:{addTarget:function(a,e){a.on("contextmenu",function(a){a=a.data;var b=CKEDITOR.env.webkit?f:CKEDITOR.env.mac?a.$.metaKey:a.$.ctrlKey;if(!e||!b){a.preventDefault();if(CKEDITOR.env.mac&&
CKEDITOR.env.webkit){var b=this.editor,c=(new CKEDITOR.dom.elementPath(a.getTarget(),b.editable())).contains(function(a){return a.hasAttribute("contenteditable")},!0);c&&"false"==c.getAttribute("contenteditable")&&b.getSelection().fake(c)}var c=a.getTarget().getDocument(),d=a.getTarget().getDocument().getDocumentElement(),b=!c.equals(CKEDITOR.document),c=c.getWindow().getScrollPosition(),g=b?a.$.clientX:a.$.pageX||c.x+a.$.clientX,h=b?a.$.clientY:a.$.pageY||c.y+a.$.clientY;CKEDITOR.tools.setTimeout(function(){this.open(d,
null,g,h)},CKEDITOR.env.ie?200:0,this)}},this);if(CKEDITOR.env.webkit){var f,d=function(){f=0};a.on("keydown",function(a){f=CKEDITOR.env.mac?a.data.$.metaKey:a.data.$.ctrlKey});a.on("keyup",d);a.on("contextmenu",d)}},open:function(a,e,f,d){!1!==this.editor.config.enableContextMenu&&this.editor.getSelection().getType()!==CKEDITOR.SELECTION_NONE&&(this.editor.focus(),a=a||CKEDITOR.document.getDocumentElement(),this.editor.selectionChange(1),this.show(a,e,f,d))}}})},beforeInit:function(a){var e=a.contextMenu=
new CKEDITOR.plugins.contextMenu(a);a.on("contentDom",function(){e.addTarget(a.editable(),!1!==a.config.browserContextMenuOnCtrl)});a.addCommand("contextMenu",{exec:function(a){var d=0,e=0,b=a.getSelection().getRanges(),b=b[b.length-1].getClientRects(a.editable().isInline());if(b=b[b.length-1])d=b["rtl"===a.lang.dir?"left":"right"],e=b.bottom;a.contextMenu.open(a.document.getBody().getParent(),null,d,e)}});a.setKeystroke(CKEDITOR.SHIFT+121,"contextMenu");a.setKeystroke(CKEDITOR.CTRL+CKEDITOR.SHIFT+
121,"contextMenu")}});