define(["dojo", "dijit"], function(dojo, dijit){
	dojo.subscribe("viewsRendered", function initList() {
		var view = dijit.byId("list");
		
		dojo.connect(view, "onAfterTransitionIn", view, function() {
			// initialize list data
			var data = [ {
				firstName : "Julio",
				lastName : "Cesaer"
			}, {
				firstName : "Robert",
				lastName : "Pinch"
			}, {
				firstName : "Alan",
				lastName : "Sturtz"
			}, {
				firstName : "Clayton",
				lastName : "Clear"
			} ];
			var listWidget = dijit.byId("listWidget");
			listWidget.set("items", data);
		});
	});
});