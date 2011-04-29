define(["dojo", "dijit", "dojo/io/script", "dojox/mobile/ProgressIndicator"], function(dojo, dijit, script, ProgressIndicator){
	// demos.mobileGallery.src.map.Map class
	var Map = function(args) {
		this.id = args.id;
		var opt = (args.options ? args.options : {});
		this.options = dojo.mixin({
			zoom : 6,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			center : new google.maps.LatLng(-34.397, 150.644)
		}, opt);
	};
	Map.prototype.load = function() {
		this.map = new google.maps.Map(document.getElementById(this.id),
				this.options);
	};
	Map.prototype.resize = function() {
		google.maps.event.trigger(this.map, "resize");
	};
		
	var isLoaded = false; // flag to indicate whether the map is loaded
	var prog; // progress bar
	
	dojo.provide("demos.mobileGallery.src.map");
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
	
	dojo.subscribe("viewsRendered", function() {
		// lazy load
		dojo.connect(dijit.byId("map"), "onAfterTransitionIn", function() {
			if (isLoaded)
				return;
			
			prog = ProgressIndicator.getInstance();
			var googleMapDiv = dojo.byId("googleMap");
			var mapMargin = dojo.marginBox("map");
			mapMargin.h = window.innerHeight - dojo.marginBox("header").h;
			dojo.marginBox("map", mapMargin);
			googleMapDiv.appendChild(prog.domNode);
			prog.start();
			
			script.get({
				url : "http://maps.google.com/maps/api/js",
				content : {
					sensor : false,
					callback : "demos.mobileGallery.src.map.initMap"
				}
			});
		});
	});
});
