define(["dojo/_base/kernel", // dojo.getObject
        "dojo/_base/html", //  dojo.byId
        "dojo/_base/xhr", // dojo.xhrGet
        "dojox/mobile/ProgressIndicator"], function() {
	var prog = null;// progress indicator
	
	dojo.getObject("demos.mobileGallery.src.ajax", true);
	demos.mobileGallery.src.ajax = {
		refreshData : function() {
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
				},
				error: function(err) {
					pane.innerHTML = err;
				}
			});
		}
	};
});