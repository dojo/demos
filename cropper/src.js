define([
	"dojo/ready",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/_base/fx",
	"dojo/dom",
	"dojox/analytics/Urchin",
	"demos/cropper/src/Preview",
	"demos/cropper/src/nav"
], function (ready, query, lang, fx, dom, analyticsUrchin, cropperSrcPreview, cropperSrcNav) {
	
	ready(function(){
		
		// basic loading indicator code:
		var loadIndicator = dom.byId("loader"),
			hide = fx.fadeOut({ node: loadIndicator }),
			show = fx.fadeIn({ node: loadIndicator })
		;
		
		// create a default instance of this:
		var preview = new image.Preview({
			// hide the loader after each img onload:
			imageReady: lang.hitch(hide, "play"),
			hoverable:true
		}, "me");
		// or if no ref needed: $("#me").preview();
		
		// setup the clicking for the thumbnails
		query("#picker").onclick(function(e){
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
		query("#navjs").onclick(function(e){
			require(["demo/src/nav"]);
			e.preventDefault();
		});
		
		// shortly after onLoad, track the page (prevent UI blocking)
		new analyticsUrchin({
			acct: "UA-3572741-1",
			GAonLoad: function(){
				this.trackPageView("/demos/cropper");
			}
		});
		
	});
});