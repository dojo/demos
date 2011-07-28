define(["dojo/_base/connect", // dojo.connect
        "dojo/_base/declare", // dojo.declare
        "dojo/_base/html", // dojo.marginBox/byId
        "dojo/_base/kernel", // dojo.mixin/getObject
        "dojo/_base/window", // dojo.global
        "dojo/io/script", // dojo.io.script
        "dijit/_base/manager", // dijit.byId
        "dojox/mobile/ProgressIndicator"],
        function(connect, declare, html, dojo, win, script, dijit, ProgressIndicator){
	// Map class
	var Map = declare(null, {
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
		connect.connect(dijit.byId("map"), "resize", function(){
			var mapBox = html.marginBox("map");
			var headerBox = html.marginBox("header");
			mapBox.w = headerBox.w;
			mapBox.h = win.global.innerHeight - html.marginBox("header").h;
			html.marginBox("map", mapBox);
			googleMap.resize();
		});
		isLoaded = true;
	};
	
	return {
		init: function(){
			// lazy load
			connect.connect(dijit.byId("map"), "onAfterTransitionIn", function() {
				if (isLoaded)
					return;
				
				prog = ProgressIndicator.getInstance();
				var googleMapDiv = html.byId("googleMap");
				var mapMargin = html.marginBox("map");
				mapMargin.h = window.innerHeight - html.marginBox("header").h;
				html.marginBox("map", mapMargin);
				googleMapDiv.appendChild(prog.domNode);
				prog.start();
				
				script.get({
					url : "http://maps.google.com/maps/api/js",
					content : {
						sensor : false,
						callback : "demos.mobileGallery.src.map.initMap"
					},
					error: function(err){
						prog.stop();
						prog = null;
						html.byId("googleMap").innerHTML = err;
					}
				});
			});
		}
	};
});
