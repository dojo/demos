dojo.provide("demos.cropper.src");

dojo.require("demos.cropper.src.Preview");
dojo.require("dojox.analytics.Urchin");
dojo.require("demos.cropper.src.nav"); 

;(function(d, $){
	
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
		$("#picker").onclick(function(e){
			e.preventDefault();
			
			// it's the link or the img
			var et = e.target,
				src = et.parentNode.href || et.href;
			
			if(src && preview.image.src != src){
				// show the loader after each click
				show.play();
				// when we have a src to load, set both images
				preview.domNode.src = preview.image.src = src; 
				// update the title text:
			//	d.byId("titleText").innerHTML = preview.image.alt = et.alt;
			}
			
		});
		
		// hook up the nav.js link in footer text:
		$("#navjs").onclick(function(e){
			// special syntax to trick build system
			d["require"]("demos.cropper.src.nav"); 
			e.preventDefault();
		});
		
		// shortly after onLoad, track the page (prevent UI blocking)
		new dojox.analytics.Urchin({ 
			acct: "UA-3572741-1", 
			GAonLoad: function(){
				this.trackPageView("/demos/cropper");
			}
		});	
		
	});
	
		
})(dojo, dojo.query);

