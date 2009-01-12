dojo.provide("demos.cropper.src");
dojo.require("demos.cropper.src.preview");
// dojo . require("dojox.image.Lightbox");

;(function(d, $){
	
	// if testing from pre-1.3, a provide dojo.create() implemenetation
	if(!d.create && d.version.minor < 3 && dojo.version.major == 1){
		
		d.create = function(t, a, r, p){
			var n = d.doc.createElement(t);
			if(a){ d.attr(n, a) }
			if(r){ d.place(n, r, p) }
			return n;
		};
		d.destroy = d._destroyElement;
		
	}
		
	d.addOnLoad(function(){
		
		// create a default instance of this:
		var preview = new image.Preview({}, "me");
		
		$("#footing").onclick(function(e){
			e.preventDefault();
			
			var et = e.target,
				// it's the link or the img
				src = et.parentNode.href || et.href;
				
			if(src){
				preview.domNode.src = src;
				preview.image.src = src; 
				dojo.byId("title").innerHTML = preview.image.alt = et.alt;
			}
			
		});

		// just don't load Lightbox resource if you don't want this:
		if(dojox && dojox.image && dojox.image.Lightbox){
			var lb = new dojox.image.LightboxDialog(); lb.startup();
			dojo.connect(preview.preview, "onclick", function(e){
				lb.show({ href: preview.image.src, title:preview.title });
			});
		}
		
	});
	
		
})(dojo, dojo.query);

