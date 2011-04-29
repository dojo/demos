define(["dojo", "dijit", "./structure"], function(dojo, dijit, structure){
	dojo.subscribe("viewsRendered", function initIcons() {
		dojo
		.connect(
				dijit.byId("moveToIcon"),
				"transitionTo",
				null,
				function() {
					structure.layout.rightPane.currentView = dijit
					.byId("icons-moveTo");
				});
		dojo
		.connect(
				dijit.byId("urlIcon"),
				"transitionTo",
				null,
				function() {
					structure.layout.rightPane.currentView = dijit
					.byId("icons-url");
				});
	});
});