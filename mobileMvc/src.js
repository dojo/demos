require([
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/dom",
	"dojo/has",
	"dijit/registry",
	"dojox/mobile/parser",
	"dojox/mobile/ListItem",
	"dojox/mvc/at",
	"dojox/mvc/Generate",
	"dojox/mvc/Group",
	"dojox/mvc/Output",
	"dojox/mvc/Templated",
	"dojox/mvc/WidgetList",
	"dojox/mvc/_InlineTemplateMixin",
	"demos/mobileMvc/MobileDemoContactModel",
	"demos/mobileMvc/MobileDemoContactListModel",
	"demos/mobileMvc/MobileDemoContactController",
	"demos/mobileMvc/MobileDemoContactListController",
	"demos/mobileMvc/MobileDemoGenerateActions",
	"dojox/mobile",
	"dojox/mobile/deviceTheme",
	"dojox/mobile/Button",
	"dojox/mobile/Heading",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/TextArea",
	"dojox/mobile/TextBox",
	"dojo/domReady!"
], function(lang, aspect, dom, has, registry, parser, ListItem, at){
	if(!has("webkit")){
		require(["dojox/mobile/compat"]);
	}
 	// A workaround for dojox/mobile/_ItemBase.onTouchStart() running setTimeout() callback even if the 
 	// widget has been destroyed. It causes JavaScript error in our "delete" feature.
 	aspect.around(ListItem.prototype, "_setSelectedAttr", function(oldSetSelectedAttr){
 		return function(){
 			if(!this._beingDestroyed){
 				return oldSetSelectedAttr.apply(this, lang._toArray(arguments));
 			}
 		};
 	});
	window.at = at;
	parser.parse();
	dom.byId("wholepage").style.display = "";
});
