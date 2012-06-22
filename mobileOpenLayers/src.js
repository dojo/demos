require(["dojo/ready", "dojo/dom", "dojo/topic", "dojo/_base/sniff", "dojox/mobile","dojox/mobile/parser","dojox/mobile/compat",
"dojox/mobile/deviceTheme","dojo/on","dojo/_base/connect","dojo/_base/html","dijit/registry",
"dojox/geo/openlayers/widget/Map","demos/mobileOpenLayers/src/NavigationControl"], 
function(ready,dom,topic,ua,mobile,parser,compat,deviceTheme,on,connect,html,registry,Map,NavigationControl){

	var map;
	var currentLocation;
	var pHeight = 0;

	var resizeView = function(resizeOnly){
		var view2 = dom.byId("mapPage");
		
		if(view2.style.visibility == "hidden" || view2.style.display == "none"){
			return;
		}
		
		var wsize = mobile.getScreenSize();
		// needed for IE, because was overriden to 0 at some point
		if(ua("ie")){
			dom.byId("map").style.width = "100%";
		}else{
			// on Android, the window size is changing a bit when scrolling!
			// ignore those resize
			
			if(wsize.h > pHeight - 64 && wsize.h < pHeight + 64){
				return;
			}
		}
		
		pHeight = wsize.h;
		var box = { h: wsize.h - 45 };
		var mapget = registry.byId("map");
		if(mapget){
			mapget.resize(box);	
			if(!resizeOnly)
				updateMap();
		}
	};

	ready(function(){
		
		var mapPage = registry.byId("mapPage");
		on(mapPage,"AfterTransitionIn",afterTransition);
		
		var paris = registry.byId("paris");
		connect.connect(paris, "onClick", paris, click);

		var ny = registry.byId("newyork");
		connect.connect(ny, "onClick", ny, click);

		var lc = registry.byId("lacolle");
		connect.connect(lc, "onClick", lc, click);

		topic.subscribe("/dojox/mobile/resizeAll", resizeView);
	});

	function afterTransition(){
		if (!map){
			var options = {
				baseLayerName : "TheMap",
				touchHandler : true,
				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS
			};
			map = new Map(options,"map");
			map.startup();
	
			var olMap = map.map.getOLMap();
			var ctrl = new NavigationControl({
				dojoMap : map
			});
			olMap.addControl(ctrl);
			resizeView(true);
		}
		fitTo();
	}

	var locs = {
		paris : [2.350833, 48.856667, 10],
		newyork : [-74.00597, 40.71427, 11],
		lacolle : [7.1072435, 43.686842, 15]
	};

	var locNames = {
		paris : "Paris",
		newyork : "New York",
		lacolle : "La Colle sur Loup"
	};

	function click(e){
		var id = this.id;
		currentLocation = id;
		var name = locNames[id];
		var header = registry.byId("mapHeader");
		header.set("label", name);
	};

	function fitTo(loc){
		if (!loc)
			loc = currentLocation;
		var l = locs[loc];
		var p = map.map.transformXY(l[0], l[1]);
		var ll = new OpenLayers.LonLat(p.x, p.y);
		var olm = map.map.getOLMap();
		var center = ll;
		var zoom = l[2];
		olm.zoom = null;
		olm.setCenter(center, zoom);
	};

	function updateMap(){
		var olm = map.map.getOLMap();
		var center = olm.getCenter();
		if (center != null) {
			var zoom = olm.getZoom();
			olm.zoom = null;
			olm.setCenter(center, zoom);
		}
	};
});
