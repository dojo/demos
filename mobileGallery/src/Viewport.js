define(["dojo/_base/lang", 
        "dojo/dom-construct","dojo/dom-prop", 
        "dojox/mobile/sniff"], function(lang, domConstruct, domProp, has){
	lang.getObject("demos.mobileGallery.src.Viewport", true);
	
	var meta = null;// <meta> tag for viewport
	
	// Viewport module. Provide utility to manipulate viewport.
	demos.mobileGallery.src.Viewport = {
		onViewportChange : function() {
			var head = document.getElementsByTagName("head")[0];
			if (!meta) {
				meta = domConstruct.create('meta');
				domProp.set(meta, "name", "viewport");
				head.appendChild(meta);
			}
			var isPortrait = (window.orientation == 0);
			// TODO: decide best dimension for full/non-full screen, 
			// also for different kinds of platforms.
			if (has("iphone")) {
				if (isPortrait) {
					domProp.set(meta,"content",
					"width=device-width,height=416,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				} else {
					domProp.set(meta,"content",
					"width=device-width,height=268,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
				};
			}
		}
	};
	return demos.mobileGallery.src.Viewport;
});