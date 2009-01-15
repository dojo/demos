dojo.provide("demos.cropper.src");

dojo.require("demos.cropper.src.Preview");
dojo.require("dojox.analytics.Urchin");

// experimental thought:
// dojo . require("dojox.image.Lightbox");

;(function(d, $){
	
//	// if testing from pre-1.3, a provide dojo.create() implemenetation
//	if(!d.create && d.version.minor < 3 && dojo.version.major == 1){
//		d.create = function(t, a, r, p){
//			var n = d.doc.createElement(t);
//			if(a){ d.attr(n, a) }
//			if(r){ d.place(n, r, p) }
//			return n;
//		};
//		d.destroy = d._destroyElement;
//	}
		
	d.addOnLoad(function(){
		
		// basic loading indicator code:
		var loadIndicator = d.byId("loader"),
			hide = d.fadeOut({ node: loadIndicator }),
			show = d.fadeIn({ node: loadIndicator })
		;
		
		// create a default instance of this:
		var preview = new image.Preview({
			// hide the loader after each img onload:
			imageReady: d.hitch(hide, "play"),
			hoverable:true
		}, "me");
		// or if no ref needed: $("#me").preview();
		
		// setup the clicking for the thumbnails
		$("#footing").onclick(function(e){
			e.preventDefault();
			
			// it's the link or the img
			var et = e.target,
				src = et.parentNode.href || et.href;
				
			if(src){
				// show the loader after each click
				show.play();
				// when we have a src to load, set both images
				preview.domNode.src = src;
				preview.image.src = src; 
				// update the title text:
				d.byId("titleText").innerHTML = preview.image.alt = et.alt;
			}
			
		});
		
		// just don't load Lightbox resource if you don't want this:
		if(dojox && dojox.image && dojox.image.Lightbox){
			
			var lb = new dojox.image.LightboxDialog(); lb.startup();
			d.connect(preview.preview, "onclick", function(e){
				// if we click on the preview node of our Preview widget, 
				// show the image in a lightbox:
				lb.show({ 
					href: preview.image.src, 
					title:preview.title 
				});
			});
			
		}
		
		// shortly after onLoad, track the page (prevent UI blocking)
		new dojox.analytics.Urchin({ 
			acct: "UA-3572741-1", 
			GAonLoad: function(){
				this.trackPageView("/demos/cropper");
			}
		});	
				
	});
	
		
})(dojo, dojo.query);

