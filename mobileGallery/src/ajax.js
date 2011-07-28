define(["dojo/_base/kernel", // dojo.getObject
        "dojo/_base/html", //  dojo.byId
        "dojo/_base/connect", // dojo.connect
        "dojo/_base/xhr", // dojo.xhrGet
	"dijit/_base/manager", // dijit.byId

	"dojox/mobile/ProgressIndicator"],
	function(dojo, html, connect, xhr, dijit, ProgressIndicator) {
	var prog = null;// progress indicator
	function refreshData() {
		var view = html.byId('ajax');
		var pane = html.byId('ajaxPane');
		if (prog)
			prog.stop(); // prevent duplicated progress indicators
		prog = ProgressIndicator.getInstance();
		view.appendChild(prog.domNode);
		prog.start();
		
		xhr.get({
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
			connect.connect(html.byId("ajaxBtn"), "onclick", refreshData);
		}
	};
});
