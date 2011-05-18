define(["dojo/_base/connect", // dojo.connect
        "dijit/_base/manager", // dijit.byId
        "./structure",
        "dojox/mobile/IconContainer"], function(dojo, dijit, structure) {
	function registerTransitionToHandler(iconId, viewId) {
		dojo.connect(dijit.byId(iconId), "transitionTo", null,
				function() {
			structure.layout.rightPane.currentView = dijit.byId(viewId);
		});
	};
	
	return {
		init : function() {
			registerTransitionToHandler("moveToIcon", "icons-moveTo");
			registerTransitionToHandler("urlIcon", "icons-url");
		}
	};
});