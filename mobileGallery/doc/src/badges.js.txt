require([
	"dojo/dom",
	"dijit/registry",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojox/mobile/compat",
	"dojox/mobile/IconContainer",
	"dojox/mobile/Badge"
], function(dom, registry){
	setBadgeValue = function(i){
		var w = registry.byId("icon"+i);
		var badgeVal = w.get("badge");
		var val = dom.byId("val").value || "0";
		w.set("badge", badgeVal ? null : val);
	}
});
