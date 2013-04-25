define(["dojo/on",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-geometry",
        "dojo/io/script",
	"dijit/registry",
	"dojox/mobile/ProgressIndicator",
	"./structure"],
function(on, declare, lang, win, dom, domGeom, script, registry, ProgressIndicator, structure){
	// Map class
	var Map = declare(null, {
		constructor: function(args){
			this.id = args.id;
			this.location = args.location;
			this.options = {
				center: args.location,
				zoom : (structure.layout.leftPane.hidden ? 11 : 12),
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				panControl: false,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				streetViewControl: true,
				overviewMapControl: false,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
				}
			};
		},
		load: function(){
			this.map = new google.maps.Map(document.getElementById(this.id),
					this.options);
			// add a marker for current location
			var marker = new google.maps.Marker({
				map: this.map,
				position: this.location
			});
			// search the address of current location
			var geocoder = new google.maps.Geocoder();
			var infoWindow = new google.maps.InfoWindow();
			var map = this.map;
			geocoder.geocode({"latLng":this.location}, function(results, status){
				if (status === google.maps.GeocoderStatus.OK){
					google.maps.event.addListener(marker, "click", function(){
						infoWindow.setContent("<b>Location</b><br>" + results[0].formatted_address.replace(", ", "<br"));
						infoWindow.open(map, this);
					});
				};
			});

		},
		resize: function(){
			google.maps.event.trigger(this.map, "resize");
		}
	});
	
	var isLoaded = false; // flag to indicate whether the map is loaded
	var prog; // progress bar
	
	function showMap(latLng) {
		var googleMap = new Map({
			id : "googleMap",
			location: (latLng ? latLng : new google.maps.LatLng(-34.397, 150.644))
		});
		googleMap.load();
		prog.stop();
		// fix resize problem after rotation
		on(registry.byId("map"), "resize", function(){
			var mapBox = domGeom.getMarginBox("map");
			var headerBox = domGeom.getMarginBox("header");
			mapBox.w = headerBox.w;
			mapBox.h = win.global.innerHeight - domGeom.getMarginBox("header").h;
			domGeom.setMarginBox("map", mapBox);
			googleMap.resize();
		});
		isLoaded = true;
	}
	
	var mapDemo = lang.getObject("demos.mobileGallery.src.map", true);
	mapDemo.initMap = function(){
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(function(position) {
				var myLatLng = new google.maps.LatLng(
						position.coords.latitude, position.coords.longitude);
				showMap(myLatLng);
			}, function(){showMap();});
		else
			showMap();
	};
	
	function loadMap(){
		script.get({
			url : "http://maps.google.com/maps/api/js",
			content : {
				sensor : false,
				callback : "demos.mobileGallery.src.map.initMap"
			},
			timeout: 30000,
			error: function(err){
				prog.stop();
				dom.byId("googleMap").innerHTML = err;
			}
		});
	};
	
	return {
		init: function(){
			// lazy load
			on(registry.byId("map"), "afterTransitionIn", function() {
				if (isLoaded)
					return;
				var mapMargin = domGeom.getMarginBox("map");
				mapMargin.h = window.innerHeight - domGeom.getMarginBox("header").h;
				domGeom.setMarginBox("map", mapMargin);
				prog = ProgressIndicator.getInstance();
				prog.stop();
				dom.byId("rightPane").appendChild(prog.domNode);
				prog.start();
				loadMap();
			});
		}
	};
});
