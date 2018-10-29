﻿/*
 Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

*/
(function(){function V(a,c,d){return n(c)&&n(d)&&d.equals(c.getNext(function(a){return!(E(a)||F(a)||u(a))}))}function z(a){this.upper=a[0];this.lower=a[1];this.set.apply(this,a.slice(2))}function O(a){var c=a.element;if(c&&n(c)&&(c=c.getAscendant(a.triggers,!0))&&a.editable.contains(c)){var d=P(c);if("true"==d.getAttribute("contenteditable"))return c;if(d.is(a.triggers))return d}return null}function ka(a,c,d){r(a,c);r(a,d);a=c.size.bottom;d=d.size.top;return a&&d?0|(a+d)/2:a||d}function w(a,c,d){return c=
c[d?"getPrevious":"getNext"](function(b){return b&&b.type==CKEDITOR.NODE_TEXT&&!E(b)||n(b)&&!u(b)&&!A(a,b)})}function q(a,c,d){return a>c&&a<d}function P(a,c){if(a.data("cke-editable"))return null;for(c||(a=a.getParent());a&&!a.data("cke-editable");){if(a.hasAttribute("contenteditable"))return a;a=a.getParent()}return null}function la(a){var c=a.doc,d=G('\x3cspan contenteditable\x3d"false" data-cke-magic-line\x3d"1" style\x3d"'+Q+"position:absolute;border-top:1px dashed "+a.boxColor+'"\x3e\x3c/span\x3e',
c),b=CKEDITOR.getUrl(this.path+"images/"+(t.hidpi?"hidpi/":"")+"icon"+(a.rtl?"-rtl":"")+".png");v(d,{attach:function(){this.wrap.getParent()||this.wrap.appendTo(a.editable,!0);return this},lineChildren:[v(G('\x3cspan title\x3d"'+a.editor.lang.magicline.title+'" contenteditable\x3d"false"\x3e\x26#8629;\x3c/span\x3e',c),{base:Q+"height:17px;width:17px;"+(a.rtl?"left":"right")+":17px;background:url("+b+") center no-repeat "+a.boxColor+";cursor:pointer;"+(t.hc?"font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;":
"")+(t.hidpi?"background-size: 9px 10px;":""),looks:["top:-8px; border-radius: 2px;","top:-17px; border-radius: 2px 2px 0px 0px;","top:-1px; border-radius: 0px 0px 2px 2px;"]}),v(G(W,c),{base:X+"left:0px;border-left-color:"+a.boxColor+";",looks:["border-width:8px 0 8px 8px;top:-8px","border-width:8px 0 0 8px;top:-8px","border-width:0 0 8px 8px;top:0px"]}),v(G(W,c),{base:X+"right:0px;border-right-color:"+a.boxColor+";",looks:["border-width:8px 8px 8px 0;top:-8px","border-width:8px 8px 0 0;top:-8px",
"border-width:0 8px 8px 0;top:0px"]})],detach:function(){this.wrap.getParent()&&this.wrap.remove();return this},mouseNear:function(){r(a,this);var b=a.holdDistance,c=this.size;return c&&q(a.mouse.y,c.top-b,c.bottom+b)&&q(a.mouse.x,c.left-b,c.right+b)?!0:!1},place:function(){var b=a.view,c=a.editable,d=a.trigger,h=d.upper,g=d.lower,l=h||g,p=l.getParent(),m={};this.trigger=d;h&&r(a,h,!0);g&&r(a,g,!0);r(a,p,!0);a.inInlineMode&&H(a,!0);p.equals(c)?(m.left=b.scroll.x,m.right=-b.scroll.x,m.width=""):(m.left=
l.size.left-l.size.margin.left+b.scroll.x-(a.inInlineMode?b.editable.left+b.editable.border.left:0),m.width=l.size.outerWidth+l.size.margin.left+l.size.margin.right+b.scroll.x,m.right="");h&&g?m.top=h.size.margin.bottom===g.size.margin.top?0|h.size.bottom+h.size.margin.bottom/2:h.size.margin.bottom<g.size.margin.top?h.size.bottom+h.size.margin.bottom:h.size.bottom+h.size.margin.bottom-g.size.margin.top:h?g||(m.top=h.size.bottom+h.size.margin.bottom):m.top=g.size.top-g.size.margin.top;d.is(C)||q(m.top,
b.scroll.y-15,b.scroll.y+5)?(m.top=a.inInlineMode?0:b.scroll.y,this.look(C)):d.is(D)||q(m.top,b.pane.bottom-5,b.pane.bottom+15)?(m.top=a.inInlineMode?b.editable.height+b.editable.padding.top+b.editable.padding.bottom:b.pane.bottom-1,this.look(D)):(a.inInlineMode&&(m.top-=b.editable.top+b.editable.border.top),this.look(x));a.inInlineMode&&(m.top--,m.top+=b.editable.scroll.top,m.left+=b.editable.scroll.left);for(var n in m)m[n]=CKEDITOR.tools.cssLength(m[n]);this.setStyles(m)},look:function(a){if(this.oldLook!=
a){for(var b=this.lineChildren.length,c;b--;)(c=this.lineChildren[b]).setAttribute("style",c.base+c.looks[0|a/2]);this.oldLook=a}},wrap:new R("span",a.doc)});for(c=d.lineChildren.length;c--;)d.lineChildren[c].appendTo(d);d.look(x);d.appendTo(d.wrap);d.unselectable();d.lineChildren[0].on("mouseup",function(b){d.detach();S(a,function(b){var c=a.line.trigger;b[c.is(I)?"insertBefore":"insertAfter"](c.is(I)?c.lower:c.upper)},!0);a.editor.focus();t.ie||a.enterMode==CKEDITOR.ENTER_BR||a.hotNode.scrollIntoView();
b.data.preventDefault(!0)});d.on("mousedown",function(a){a.data.preventDefault(!0)});a.line=d}function S(a,c,d){var b=new CKEDITOR.dom.range(a.doc),e=a.editor,f;t.ie&&a.enterMode==CKEDITOR.ENTER_BR?f=a.doc.createText(J):(f=(f=P(a.element,!0))&&f.data("cke-enter-mode")||a.enterMode,f=new R(K[f],a.doc),f.is("br")||a.doc.createText(J).appendTo(f));d&&e.fire("saveSnapshot");c(f);b.moveToPosition(f,CKEDITOR.POSITION_AFTER_START);e.getSelection().selectRanges([b]);a.hotNode=f;d&&e.fire("saveSnapshot")}
function Y(a,c){return{canUndo:!0,modes:{wysiwyg:1},exec:function(){function d(b){var d=t.ie&&9>t.version?" ":J,f=a.hotNode&&a.hotNode.getText()==d&&a.element.equals(a.hotNode)&&a.lastCmdDirection===!!c;S(a,function(d){f&&a.hotNode&&a.hotNode.remove();d[c?"insertAfter":"insertBefore"](b);d.setAttributes({"data-cke-magicline-hot":1,"data-cke-magicline-dir":!!c});a.lastCmdDirection=!!c});t.ie||a.enterMode==CKEDITOR.ENTER_BR||a.hotNode.scrollIntoView();a.line.detach()}return function(b){b=b.getSelection().getStartElement();
var e;b=b.getAscendant(Z,1);if(!aa(a,b)&&b&&!b.equals(a.editable)&&!b.contains(a.editable)){(e=P(b))&&"false"==e.getAttribute("contenteditable")&&(b=e);a.element=b;e=w(a,b,!c);var f;n(e)&&e.is(a.triggers)&&e.is(ma)&&(!w(a,e,!c)||(f=w(a,e,!c))&&n(f)&&f.is(a.triggers))?d(e):(f=O(a,b),n(f)&&(w(a,f,!c)?(b=w(a,f,!c))&&n(b)&&b.is(a.triggers)&&d(f):d(f)))}}}()}}function A(a,c){if(!c||c.type!=CKEDITOR.NODE_ELEMENT||!c.$)return!1;var d=a.line;return d.wrap.equals(c)||d.wrap.contains(c)}function n(a){return a&&
a.type==CKEDITOR.NODE_ELEMENT&&a.$}function u(a){if(!n(a))return!1;var c;(c=ba(a))||(n(a)?(c={left:1,right:1,center:1},c=!(!c[a.getComputedStyle("float")]&&!c[a.getAttribute("align")])):c=!1);return c}function ba(a){return!!{absolute:1,fixed:1}[a.getComputedStyle("position")]}function L(a,c){return n(c)?c.is(a.triggers):null}function aa(a,c){if(!c)return!1;for(var d=c.getParents(1),b=d.length;b--;)for(var e=a.tabuList.length;e--;)if(d[b].hasAttribute(a.tabuList[e]))return!0;return!1}function na(a,
c,d){c=c[d?"getLast":"getFirst"](function(b){return a.isRelevant(b)&&!b.is(oa)});if(!c)return!1;r(a,c);return d?c.size.top>a.mouse.y:c.size.bottom<a.mouse.y}function ca(a){var c=a.editable,d=a.mouse,b=a.view,e=a.triggerOffset;H(a);var f=d.y>(a.inInlineMode?b.editable.top+b.editable.height/2:Math.min(b.editable.height,b.pane.height)/2),c=c[f?"getLast":"getFirst"](function(a){return!(E(a)||F(a))});if(!c)return null;A(a,c)&&(c=a.line.wrap[f?"getPrevious":"getNext"](function(a){return!(E(a)||F(a))}));
if(!n(c)||u(c)||!L(a,c))return null;r(a,c);return!f&&0<=c.size.top&&q(d.y,0,c.size.top+e)?(a=a.inInlineMode||0===b.scroll.y?C:x,new z([null,c,I,M,a])):f&&c.size.bottom<=b.pane.height&&q(d.y,c.size.bottom-e,b.pane.height)?(a=a.inInlineMode||q(c.size.bottom,b.pane.height-e,b.pane.height)?D:x,new z([c,null,da,M,a])):null}function ea(a){var c=a.mouse,d=a.view,b=a.triggerOffset,e=O(a);if(!e)return null;r(a,e);var b=Math.min(b,0|e.size.outerHeight/2),f=[],k,h;if(q(c.y,e.size.top-1,e.size.top+b))h=!1;else if(q(c.y,
e.size.bottom-b,e.size.bottom+1))h=!0;else return null;if(u(e)||na(a,e,h)||e.getParent().is(fa))return null;var g=w(a,e,!h);if(g){if(g&&g.type==CKEDITOR.NODE_TEXT)return null;if(n(g)){if(u(g)||!L(a,g)||g.getParent().is(fa))return null;f=[g,e][h?"reverse":"concat"]().concat([T,M])}}else e.equals(a.editable[h?"getLast":"getFirst"](a.isRelevant))?(H(a),h&&q(c.y,e.size.bottom-b,d.pane.height)&&q(e.size.bottom,d.pane.height-b,d.pane.height)?k=D:q(c.y,0,e.size.top+b)&&(k=C)):k=x,f=[null,e][h?"reverse":
"concat"]().concat([h?da:I,M,k,e.equals(a.editable[h?"getLast":"getFirst"](a.isRelevant))?h?D:C:x]);return 0 in f?new z(f):null}function U(a,c,d,b){for(var e=c.getDocumentPosition(),f={},k={},h={},g={},l=y.length;l--;)f[y[l]]=parseInt(c.getComputedStyle.call(c,"border-"+y[l]+"-width"),10)||0,h[y[l]]=parseInt(c.getComputedStyle.call(c,"padding-"+y[l]),10)||0,k[y[l]]=parseInt(c.getComputedStyle.call(c,"margin-"+y[l]),10)||0;d&&!b||N(a,b);g.top=e.y-(d?0:a.view.scroll.y);g.left=e.x-(d?0:a.view.scroll.x);
g.outerWidth=c.$.offsetWidth;g.outerHeight=c.$.offsetHeight;g.height=g.outerHeight-(h.top+h.bottom+f.top+f.bottom);g.width=g.outerWidth-(h.left+h.right+f.left+f.right);g.bottom=g.top+g.outerHeight;g.right=g.left+g.outerWidth;a.inInlineMode&&(g.scroll={top:c.$.scrollTop,left:c.$.scrollLeft});return v({border:f,padding:h,margin:k,ignoreScroll:d},g,!0)}function r(a,c,d){if(!n(c))return c.size=null;if(!c.size)c.size={};else if(c.size.ignoreScroll==d&&c.size.date>new Date-ga)return null;return v(c.size,
U(a,c,d),{date:+new Date},!0)}function H(a,c){a.view.editable=U(a,a.editable,c,!0)}function N(a,c){a.view||(a.view={});var d=a.view;if(!(!c&&d&&d.date>new Date-ga)){var b=a.win,d=b.getScrollPosition(),b=b.getViewPaneSize();v(a.view,{scroll:{x:d.x,y:d.y,width:a.doc.$.documentElement.scrollWidth-b.width,height:a.doc.$.documentElement.scrollHeight-b.height},pane:{width:b.width,height:b.height,bottom:b.height+d.y},date:+new Date},!0)}}function pa(a,c,d,b){for(var e=b,f=b,k=0,h=!1,g=!1,l=a.view.pane.height,
p=a.mouse;p.y+k<l&&0<p.y-k;){h||(h=c(e,b));g||(g=c(f,b));!h&&0<p.y-k&&(e=d(a,{x:p.x,y:p.y-k}));!g&&p.y+k<l&&(f=d(a,{x:p.x,y:p.y+k}));if(h&&g)break;k+=2}return new z([e,f,null,null])}CKEDITOR.plugins.add("magicline",{lang:"en,zh-cn",init:function(a){var c=a.config,d=c.magicline_triggerOffset||30,b={editor:a,enterMode:c.enterMode,triggerOffset:d,holdDistance:0|d*(c.magicline_holdDistance||.5),boxColor:c.magicline_color||"#ff0000",rtl:"rtl"==c.contentsLangDirection,tabuList:["data-cke-hidden-sel"].concat(c.magicline_tabuList||
[]),triggers:c.magicline_everywhere?Z:{table:1,hr:1,div:1,ul:1,ol:1,dl:1,form:1,blockquote:1}},e,f,k;b.isRelevant=function(a){return n(a)&&!A(b,a)&&!u(a)};a.on("contentDom",function(){var d=a.editable(),g=a.document,l=a.window;v(b,{editable:d,inInlineMode:d.isInline(),doc:g,win:l,hotNode:null},!0);b.boundary=b.inInlineMode?b.editable:b.doc.getDocumentElement();d.is(B.$inline)||(b.inInlineMode&&!ba(d)&&d.setStyles({position:"relative",top:null,left:null}),la.call(this,b),N(b),d.attachListener(a,"beforeUndoImage",
function(){b.line.detach()}),d.attachListener(a,"beforeGetData",function(){b.line.wrap.getParent()&&(b.line.detach(),a.once("getData",function(){b.line.attach()},null,null,1E3))},null,null,0),d.attachListener(b.inInlineMode?g:g.getWindow().getFrame(),"mouseout",function(c){if("wysiwyg"==a.mode)if(b.inInlineMode){var d=c.data.$.clientX;c=c.data.$.clientY;N(b);H(b,!0);var e=b.view.editable,f=b.view.scroll;d>e.left-f.x&&d<e.right-f.x&&c>e.top-f.y&&c<e.bottom-f.y||(clearTimeout(k),k=null,b.line.detach())}else clearTimeout(k),
k=null,b.line.detach()}),d.attachListener(d,"keyup",function(){b.hiddenMode=0}),d.attachListener(d,"keydown",function(c){if("wysiwyg"==a.mode)switch(c.data.getKeystroke()){case 2228240:case 16:b.hiddenMode=1,b.line.detach()}}),d.attachListener(b.inInlineMode?d:g,"mousemove",function(c){f=!0;if("wysiwyg"==a.mode&&!a.readOnly&&!k){var d={x:c.data.$.clientX,y:c.data.$.clientY};k=setTimeout(function(){b.mouse=d;k=b.trigger=null;N(b);f&&!b.hiddenMode&&a.focusManager.hasFocus&&!b.line.mouseNear()&&(b.element=
ha(b,!0))&&((b.trigger=ca(b)||ea(b)||ia(b))&&!aa(b,b.trigger.upper||b.trigger.lower)?b.line.attach().place():(b.trigger=null,b.line.detach()),f=!1)},30)}}),d.attachListener(l,"scroll",function(){"wysiwyg"==a.mode&&(b.line.detach(),t.webkit&&(b.hiddenMode=1,clearTimeout(e),e=setTimeout(function(){b.mouseDown||(b.hiddenMode=0)},50)))}),d.attachListener(ja?g:l,"mousedown",function(){"wysiwyg"==a.mode&&(b.line.detach(),b.hiddenMode=1,b.mouseDown=1)}),d.attachListener(ja?g:l,"mouseup",function(){b.hiddenMode=
0;b.mouseDown=0}),a.addCommand("accessPreviousSpace",Y(b)),a.addCommand("accessNextSpace",Y(b,!0)),a.setKeystroke([[c.magicline_keystrokePrevious,"accessPreviousSpace"],[c.magicline_keystrokeNext,"accessNextSpace"]]),a.on("loadSnapshot",function(){var c,d,e,f;for(f in{p:1,br:1,div:1})for(c=a.document.getElementsByTag(f),e=c.count();e--;)if((d=c.getItem(e)).data("cke-magicline-hot")){b.hotNode=d;b.lastCmdDirection="true"===d.data("cke-magicline-dir")?!0:!1;return}}),this.backdoor={accessFocusSpace:S,
boxTrigger:z,isLine:A,getAscendantTrigger:O,getNonEmptyNeighbour:w,getSize:U,that:b,triggerEdge:ea,triggerEditable:ca,triggerExpand:ia})},this)}});var v=CKEDITOR.tools.extend,R=CKEDITOR.dom.element,G=R.createFromHtml,t=CKEDITOR.env,ja=CKEDITOR.env.ie&&9>CKEDITOR.env.version,B=CKEDITOR.dtd,K={},I=128,da=64,T=32,M=16,C=4,D=2,x=1,J=" ",fa=B.$listItem,oa=B.$tableContent,ma=v({},B.$nonEditable,B.$empty),Z=B.$block,ga=100,Q="width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
X=Q+"border-color:transparent;display:block;border-style:solid;",W="\x3cspan\x3e"+J+"\x3c/span\x3e";K[CKEDITOR.ENTER_BR]="br";K[CKEDITOR.ENTER_P]="p";K[CKEDITOR.ENTER_DIV]="div";z.prototype={set:function(a,c,d){this.properties=a+c+(d||x);return this},is:function(a){return(this.properties&a)==a}};var ha=function(){function a(a,d){var b=a.$.elementFromPoint(d.x,d.y);return b&&b.nodeType?new CKEDITOR.dom.element(b):null}return function(c,d,b){if(!c.mouse)return null;var e=c.doc,f=c.line.wrap;b=b||c.mouse;
var k=a(e,b);d&&A(c,k)&&(f.hide(),k=a(e,b),f.show());return!k||k.type!=CKEDITOR.NODE_ELEMENT||!k.$||t.ie&&9>t.version&&!c.boundary.equals(k)&&!c.boundary.contains(k)?null:k}}(),E=CKEDITOR.dom.walker.whitespaces(),F=CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),ia=function(){function a(a){var b=a.element,e,f,k;if(!n(b)||b.contains(a.editable)||b.isReadOnly())return null;k=pa(a,function(a,b){return!b.equals(a)},function(a,b){return ha(a,!0,b)},b);e=k.upper;f=k.lower;if(V(a,e,f))return k.set(T,
8);if(e&&b.contains(e))for(;!e.getParent().equals(b);)e=e.getParent();else e=b.getFirst(function(b){return c(a,b)});if(f&&b.contains(f))for(;!f.getParent().equals(b);)f=f.getParent();else f=b.getLast(function(b){return c(a,b)});if(!e||!f)return null;r(a,e);r(a,f);if(!q(a.mouse.y,e.size.top,f.size.bottom))return null;for(var b=Number.MAX_VALUE,h,g,l,p;f&&!f.equals(e)&&(g=e.getNext(a.isRelevant));)h=Math.abs(ka(a,e,g)-a.mouse.y),h<b&&(b=h,l=e,p=g),e=g,r(a,e);if(!l||!p||!q(a.mouse.y,l.size.top,p.size.bottom))return null;
k.upper=l;k.lower=p;return k.set(T,8)}function c(a,b){return!(b&&b.type==CKEDITOR.NODE_TEXT||F(b)||u(b)||A(a,b)||b.type==CKEDITOR.NODE_ELEMENT&&b.$&&b.is("br"))}return function(c){var b=a(c),e;if(e=b){e=b.upper;var f=b.lower;e=!e||!f||u(f)||u(e)||f.equals(e)||e.equals(f)||f.contains(e)||e.contains(f)?!1:L(c,e)&&L(c,f)&&V(c,e,f)?!0:!1}return e?b:null}}(),y=["top","left","right","bottom"]})();CKEDITOR.config.magicline_keystrokePrevious=CKEDITOR.CTRL+CKEDITOR.SHIFT+51;
CKEDITOR.config.magicline_keystrokeNext=CKEDITOR.CTRL+CKEDITOR.SHIFT+52;