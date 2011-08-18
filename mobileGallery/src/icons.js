define(["./structure","dojo/on", 
		"dijit/registry", // dijit.byId
		"dojox/mobile/IconContainer"],
  function(structure, on, registry) {
	function registerTransitionToHandler(iconId, viewId) {
		on(registry.byId(iconId), "iconClicked", function() {
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