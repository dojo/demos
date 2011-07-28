define(["dojo/_base/kernel", // dojo.getObject
        "dojo/_base/html", // dojo.create/attr
        "./_base"], function(dojo, html, _base){
	dojo.getObject("demos.mobileGallery.src.Viewport", true);
	
	var meta = null;// <meta> tag for viewport
	
	// Viewport module. Provide utility to manipulate viewport.
	demos.mobileGallery.src.Viewport = {
		onViewportChange : function() {
			var head = document.getElementsByTagName("head")[0];
			if (!meta) {
				meta = html.create('meta');
				html.attr(meta, "name", "viewport");
				head.appendChild(meta);
			}
			var	isPortrait = (window.orientation == 0);
			// TODO: decide best dimension for full/non-full screen, 
			// also for different kinds of platforms.
			if (_base.isIPhone) {
				if (isPortrait) {
					html.attr(meta,"content",
					"width=device-width,height=416,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				} else {
					html.attr(meta,"content",
					"width=device-width,height=268,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				};
			}
		}
	};
	return 	demos.mobileGallery.src.Viewport;
});