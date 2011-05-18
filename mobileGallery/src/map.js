define(["dojo/_base/connect", // dojo.connect
        "dojo/_base/declare", // dojo.declare
        "dojo/_base/html", // dojo.marginBox/byId
        "dojo/_base/kernel", // dojo.mixin/getObject
        "dojo/_base/window", // dojo.global
        "dojo/io/script",
        "dijit/_base/manager", // dijit.byId
        "dojox/mobile/ProgressIndicator"], function(){
	// Map class
	var Map = dojo.declare(null, {
		constructor: function(args){
			this.id = args.id;
			var opt = (args.options ? args.options : {});
			this.options = dojo.mixin({
				zoom : 6,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				center : new google.maps.LatLng(-34.397, 150.644)
			}, opt);
		},
		load: function(){
			this.map = new google.maps.Map(document.getElementById(this.id),
					this.options);
		},
		resize: function(){
			google.maps.event.trigger(this.map, "resize");
		}
	});
		
	var isLoaded = false; // flag to indicate whether the map is loaded
	var prog; // progress bar
	
	dojo.getObject("demos.mobileGallery.src.map", true);
	demos.mobileGallery.src.map.initMap = function(){
		prog.stop();
		var googleMap = new Map({
			id : "googleMap"
		});
		googleMap.load();
		// fix resize problem after rotation
		dojo.connect(dijit.byId("map"), "resize", function(){
			var mapBox = dojo.marginBox("map");
			var headerBox = dojo.marginBox("header");
			mapBox.w = headerBox.w;
			mapBox.h = dojo.global.innerHeight - dojo.marginBox("header").h;
			dojo.marginBox("map", mapBox);
			googleMap.resize();
		});
		isLoaded = true;
	};
	
	return {
		init: function(){
			// lazy load
			dojo.connect(dijit.byId("map"), "onAfterTransitionIn", function() {
				if (isLoaded)
					return;
				
				prog = dojox.mobile.ProgressIndicator.getInstance();
				var googleMapDiv = dojo.byId("googleMap");
				var mapMargin = dojo.marginBox("map");
				mapMargin.h = window.innerHeight - dojo.marginBox("header").h;
				dojo.marginBox("map", mapMargin);
				googleMapDiv.appendChild(prog.domNode);
				prog.start();
				
				dojo.io.script.get({
					url : "http://maps.google.com/maps/api/js",
					content : {
						sensor : false,
						callback : "demos.mobileGallery.src.map.initMap"
					},
					error: function(err){
						prog.stop();
						prog = null;
						dojo.byId("googleMap").innerHTML = err;
					}
				});
			});
		}
	};
});
