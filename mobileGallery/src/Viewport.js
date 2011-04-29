define(["dojo", "./_base"], function(dojo, _base){
	dojo.provide("demos.mobileGallery.src.Viewport");
	
	var meta = null;// <meta> tag for viewport
	
	// Viewport module. Provide utility to manipulate viewport.
	demos.mobileGallery.src.Viewport = {
		onViewportChange : function() {
			var head = document.getElementsByTagName("head")[0];
			if (!meta) {
				meta = dojo.create('meta');
				dojo.attr(meta, "name", "viewport");
				head.appendChild(meta);
			}
			var	isPortrait = (window.orientation == 0);
			// TODO: decide best dimension for full/non-full screen, 
			// also for different kinds of platforms.
			if (_base.isIPhone) {
				if (isPortrait) {
					dojo.attr(meta,"content",
					"width=device-width,height=416,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				} else {
					dojo.attr(meta,"content",
					"width=device-width,height=268,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				};
			}
		}
	};
});