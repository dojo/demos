require(["dojo/ready","dojox/mobile","dojox/mobile/parser","dojox/mobile/compat",
"dojox/mobile/deviceTheme","dojo/on","dojo/_base/connect","dojo/_base/html","dijit/registry",
"dojox/geo/openlayers/widget/Map","demos/mobileOpenLayers/src/NavigationControl"], 
function(ready,mobile,parser,compat,deviceTheme,on,connect,html,registry,Map,NavigationControl){

	var map;
	var currentLocation;

	ready(function(){
		var options = {
			baseLayerName : "TheMap",
			touchHandler : true,
			baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS
		};

		map = new Map(options);

		html.place(map.domNode, "map");
		map.startup();

		var olMap = map.map.getOLMap();
		var ctrl = new NavigationControl({
			dojoMap : map
		});
		olMap.addControl(ctrl);
		var mapPage = registry.byId("mapPage");
		on(mapPage,"AfterTransitionIn",afterTransition);
		
		var paris = registry.byId("paris");
		connect.connect(paris, "onClick", paris, click);

		var ny = registry.byId("newyork");
		connect.connect(ny, "onClick", ny, click);

		var lc = registry.byId("lacolle");
		connect.connect(lc, "onClick", lc, click);

		on(window, "resize", resize);
	});

	function afterTransition(){
		fitTo();
	}

	function resize(){
		setTimeout(updateMap, 0);
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
