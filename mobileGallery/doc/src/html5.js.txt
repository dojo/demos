define(["dojo/_base/lang", "dojo/_base/connect", "dojo/_base/declare", "dojo/_base/window", "dojo/dom", "dojo/dom-geometry", "dojo/_base/Deferred",
	"dojo/DeferredList",  "dojo/io/script",  "dijit/registry", "dojo/query", "./structure", "dojox/mobile/TextArea"],
function (lang, connect, declare, win, dom, geometry, Deferred, DeferredList, script, registry, query, structure) {
	// navigation records to keep the correct view sequence
	var internalNavRecords = [];

	// shortcut for local storage
	var localStorage = win.global.localStorage || null;
	
	// flag on whether the note text has been changed
	var noteChanged = false;

	// current location, preserved for latest geo query
	// when set current addr to display, update google map center
	var currentAddr = "Unknown", currentLat = 0, currentLng = 0;
	// location to display
	var displayLat, displayLng;

	// load item from local storage
	function load(name) {
		if (localStorage) {
			return localStorage.getItem(name);
		} else {
			return "";
		}
	}

	// save item to local storage
	function save(name, val) {
		if (localStorage) {
			localStorage.setItem(name, val);
		}
	}

	// Google Map Encapsulation
	var Map = declare(null, {
		constructor: function(args){
			this.id = args.id;
			this.center = args.center;
			this.options = {
				center: args.center,
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
			// add a marker for current center
			this.marker = new google.maps.Marker({
				map: this.map,
				position: this.center
			});
		},
		setCenter: function(latLng){
			if (latLng &&
				(!this.center ||
				 (!this.center.equals(latLng)))){
				this.center = latLng;
				if (this.map){
					this.map.setCenter(this.center);
					this.marker.setPosition(this.center);
				}
			}
		}, 
		resize: function(){
			google.maps.event.trigger(this.map, "resize");
			// need to reset the center since google map will lose center after resize
			this.map.setCenter(this.center);
		}
	});

	//  singleton of the google map
	var googleMap;

	var loadApiResult = new Deferred();
	// delcare call back for google map JSONP
	var module = lang.getObject("demos.mobileGallery.html5", true);
	module.mapApiLoaded = function(){
		renderGoogleMap();
		loadApiResult.resolve();
	};

	function loadGoogleMapApi(){
		if (!win.global.google ||
			!win.global.google.maps){
			// load the google map API
			script.get({
				url : "http://maps.google.com/maps/api/js",
				content : {
					sensor : false,
					callback: "demos.mobileGallery.html5.mapApiLoaded"
				},
				timeout: 30000,
				error: function(err){
					dom.byId("noteLocMapDiv").innerHTML = err;
					loadApiResult.reject();
				}
			});
		} else {
			// avoid unnecessary deferred resolution since this method could be invoked after many view transition 
			if (loadApiResult === -1) {
				loadApiResult.resolve();
			};
		};
	}


	function renderGoogleMap() {
		if (!googleMap) {
			var mapOptions = {
				id: "noteLocMapDiv",
				center: ((displayLat && displayLng) ? new google.maps.LatLng(displayLat, displayLng) : new google.maps.LatLng(-34.397, 150.644))
			};
			googleMap = new Map(mapOptions);
			googleMap.load();
			googleMap.resize();
		}
	};

	// TOOD: remove this if we have better layout control
	function resizeGoogleMapView() {
		var box = geometry.getMarginBox("html5");
		box.h = win.global.innerHeight - geometry.getMarginBox("header").h;
		geometry.setMarginBox("noteLocMapView", box);
	};


	// call back when geo location is got
	function geoLocGot(coords) {
		currentLat = coords.latitude;
		currentLng = coords.longitude;

		// leverage Google MAP API to do reverse geo query
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
		geocoder.geocode({"latLng":latLng}, function(results, status){
			if (status === google.maps.GeocoderStatus.OK){
				var country = "", state = "", city = "";
				var comps = results[0].address_components;
				for (var i = 0; i < comps.length; ++i){
					var comp = comps[i];
					switch(comp.types[0]){
						case "country":
						      country = comp.short_name;
						      break;
						case "administrative_area_level_1":
						      state = comp.short_name;
						      break;
						case "locality":
						      city = comp.long_name;
						      break;
						default:
					}
				}
				var addr = city + ", " + state + ", " + country;
				currentAddr = addr;
				// if currently there's no displayed address, then use it
				if (dom.byId("noteLocAddr").innerHTML == "Unknown") {
					dom.byId("noteLocAddr").innerHTML = currentAddr;
					googleMap.setCenter(new google.maps.LatLng(currentLat, currentLng));
					displayLat = currentLat;
					displayLng = currentLng;
				}
			} else {
				geoLocErr();
			}
		});
	};

	function geoLocErr() {
		dom.byId("noteLocAddr").innerHTML = "Unknown";
	};

	return {
		init: function() {
			// load from local storage
			var noteLocAddr = load("noteLocAddr");
			if (!noteLocAddr) {
				noteLocAddr = "Unknown";
			}
			
			displayLat = parseFloat(load("noteLocLat"));
			displayLng = parseFloat(load("noteLocLng"));
			// load the date and note text if available
			var noteDate = load("noteDate");
			if (!noteDate) {
				noteDate = (new Date()).toDateString();
			}

			var noteText = load("noteText");
			if (noteText){
				dom.byId("noteDate").innerHTML = noteDate;
				dom.byId("noteLocAddr").innerHTML = noteLocAddr;
				dom.byId("noteText").value = noteText;
			} else {
				dom.byId("noteDate").innerHTML = (new Date()).toDateString();
				dom.byId("noteLocAddr").innerHTML = "Unknown";
				dom.byId("noteText").value = "";
			}
			
			// query the geo location
			registry.byId("html5").on("afterTransitionIn", function() {
				if (this.movedFrom === "source")
					return;
				resizeGoogleMapView();
				loadGoogleMapApi();
				if (!!win.global.navigator.geolocation ||
					loadApiResult.fired !== 1) {
					var geoResult = new Deferred();
					if (loadApiResult.fired === -1){
						// google map not loaded yet, wait for it
						new DeferredList([loadApiResult, geoResult]).then(function(results){
							// failed to get Google map API, then return
							if (!results[0][0]) {
								return;
							}
							// get the geo location ,then do the reverse geo query
							if (results[1][0]) {
								geoLocGot(results[1][1]);
							} else {
								// fail to get geo location, then display the default one
								geoLocErr();
							}
						});
					} else {
						geoResult.then(geoLocGot, geoLocErr);
					};
					win.global.navigator.geolocation.getCurrentPosition(function(position) {
						geoResult.resolve(position.coords);
					}, function(){
						geoResult.reject();
					});
				} else {
					geoLocErr();
				};
			});


			registry.byId("noteText").on("change", function() {
				noteChanged = true;
			});

			// 30 seconds auto save
			setInterval(function(){
				if (noteChanged) {
					save("noteDate", dom.byId("noteDate").innerHTML);
					save("noteLocAddr", currentAddr);
					save("noteLocLat", currentLat);
					save("noteLocLng", currentLng);
					save("noteText", dom.byId("noteText").value);

					dom.byId("noteLocAddr").innerHTML = currentAddr;
					displayLat = currentLat;
					displayLng = currentLng;
					if (googleMap) {
						googleMap.setCenter(new google.maps.LatLng(displayLat, displayLng));
					}
					noteChanged = false;
				}
			}, 30000);

			registry.byId("newNoteBtn").on("click", function(){
				// reset local storage
				localStorage.removeItem("noteDate");
				localStorage.removeItem("noteLocAddr");
				localStorage.removeItem("noteText");

				// update UI
				dom.byId("noteDate").innerHTML = (new Date()).toDateString();
				dom.byId("noteLocAddr").innerHTML = currentAddr;
				displayLat = currentLat;
				displayLng = currentLng;
				if (googleMap && currentLat && currentLng) {
					googleMap.setCenter(new google.maps.LatLng(currentLat, currentLng));
				}
				dom.byId("noteText").value = "";
			});

			registry.byId("showMapBtn").on("click", function(){
				registry.byId("html5Main").performTransition("noteLocMapView", 1, "slide");
			});
			
			registry.byId("html5").on("resize", function(){
				resizeGoogleMapView();
				if (googleMap){
					googleMap.resize();
				}
			});
			registry.byId("noteLocMapView").on("afterTransitionIn", function(){
				if (googleMap) {
					googleMap.resize();
				};
				structure.navRecords.push({
					from: "html5Main",
					fromTitle: "HTML5",
					to: "noteLocMapView",
					toTitle: "HTML5",
					navTitle: "HTML5"
				});
			});
			registry.byId("html5").on("beforeTransitionOUt", function(){
				var navRecords = structure.navRecords;
				internalNavRecords = [];
				for (var i = 0; i < navRecords.length ; ++ i) {
					var navRecord = navRecords[i];
					if (navRecord.from == "navigation" ||
						navRecord.to == "source")
						continue;
					internalNavRecords.push(navRecord);
				};
			});
			connect.subscribe("onAfterDemoViewTransitionIn", function(id){
				if (id === "html5") {
					var navRecords = structure.navRecords;
					for (var i = 0; i < internalNavRecords.length ; ++i) {
						navRecords.push(internalNavRecords[i]);
					}
				}
			});
		}
	};
});
