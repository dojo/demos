define(["./structure",
        "dojo/_base/connect", // dojo.connect
        "dijit/_base/manager", // dijit.byId
        "dojox/mobile/IconContainer"], function(structure, connect, dijit) {
	function registerTransitionToHandler(iconId, viewId) {
		connect.connect(dijit.byId(iconId), "transitionTo", null,
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