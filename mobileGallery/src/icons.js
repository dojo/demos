define(["./structure",
		"dijit/registry", // dijit.byId
		"dojox/mobile/IconContainer"],
  function(structure, registry) {
	function registerTransitionToHandler(iconId, viewId) {
		registry.byId(iconId).on("iconClicked", function() {
			structure.layout.rightPane.currentView = viewId;
		});
	};
	return {
		init : function() {
			registerTransitionToHandler("moveToIcon", "icons-moveTo");
			registerTransitionToHandler("urlIcon", "icons-url");
		}
	};
});