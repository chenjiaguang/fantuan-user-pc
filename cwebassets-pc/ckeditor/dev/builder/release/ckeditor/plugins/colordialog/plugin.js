/*
 Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

*/
CKEDITOR.plugins.colordialog={requires:"dialog",lang:"en,zh-cn",init:function(b){var d=new CKEDITOR.dialogCommand("colordialog");d.editorFocus=!1;b.addCommand("colordialog",d);CKEDITOR.dialog.add("colordialog",this.path+"dialogs/colordialog.js");b.getColorFromDialog=function(d,g){var c,f,e;c=function(a){f(this);a="ok"==a.name?this.getValueOf("picker","selectedColor"):null;/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(a)&&(a="#"+a);d.call(g,a)};f=function(a){a.removeListener("ok",c);a.removeListener("cancel",
c)};e=function(a){a.on("ok",c);a.on("cancel",c)};b.execCommand("colordialog");if(b._.storedDialogs&&b._.storedDialogs.colordialog)e(b._.storedDialogs.colordialog);else CKEDITOR.on("dialogDefinition",function(a){if("colordialog"==a.data.name){var b=a.data.definition;a.removeListener();b.onLoad=CKEDITOR.tools.override(b.onLoad,function(a){return function(){e(this);b.onLoad=a;"function"==typeof a&&a.call(this)}})}})}}};CKEDITOR.plugins.add("colordialog",CKEDITOR.plugins.colordialog);