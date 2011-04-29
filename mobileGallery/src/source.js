define(["dojo", "dijit", "demos/mobileGallery/src/structure"], function(dojo, dijit){
	dojo.subscribe("viewsRendered", function() {
		dojo.connect(dojo.byId("sourceButton"), "onclick",
				dijit.byId("header"), goToView);
		dojo.connect(dojo.byId("navButton"), "onclick", dijit.byId("header"),
				goToView);
		function goToView(event) {
			var currentView = demos.mobileGallery.src.structure.layout.rightPane.currentView;
			
			if (currentView) {
				var targetView = "";
				var moveDir = 1;
				if (event.target.id === "sourceButton") {
					targetView = "source";
				} else {
					// TODO targetView for navButton should be set to header's
					// moveTo
					// targetView="settings";
					targetView = this.moveTo;
					moveDir = -1;
				}
				if (targetView !== currentView.id) {
					currentView.performTransition(targetView, moveDir,
							this.transition);
				}
			}
		}
	});
});