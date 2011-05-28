define(["dojo/_base/kernel", // dojo.getObject
        "dojo/_base/html", //  dojo.byId
        "dojo/_base/xhr", // dojo.xhrGet
	"dijit/_base/manager", // dijit.byId

	"dojox/mobile/ProgressIndicator"], function() {
	var prog = null;// progress indicator
	function refreshData() {
		var view = dojo.byId('ajax');
		var pane = dojo.byId('ajaxPane');
		if (prog)
			prog.stop(); // prevent duplicated progress indicators
		prog = dojox.mobile.ProgressIndicator.getInstance();
		view.appendChild(prog.domNode);
		prog.start();
		
		dojo.xhrGet({
			url : 'views/ajaxLoad.html',
			handleAs : 'text',
			load : function(data) {
				prog.stop();
				prog = null;
				pane.innerHTML = data;
				dijit.byId("ajaxContainer").resize();
				},
			error: function(err) {
				pane.innerHTML = err;
			}
		});
	};	


	return {
		init: function() {
			dojo.connect(dojo.byId("ajaxBtn"), "onclick", refreshData);
		}
	};
});
