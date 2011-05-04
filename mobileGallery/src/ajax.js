define(["dojo", "dojox/mobile/ProgressIndicator"], function(dojo, ProgressIndicator) {
	var prog = null;// progress indicator
	
	dojo.provide("demos.mobileGallery.src.ajax");
	demos.mobileGallery.src.ajax = {
		refreshData : function() {
			var view = dojo.byId('ajax');
			var pane = dojo.byId('ajaxPane');
			if (prog)
				prog.stop(); // prevent duplicated progress indicators
			prog = ProgressIndicator.getInstance();
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