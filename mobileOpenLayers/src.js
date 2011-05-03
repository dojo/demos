dojo.require("dojox.geo.openlayers.widget.Map");
dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile");
dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");
dojo.require("demos.mobileOpenLayers.src.NavigationControl");

var map;
var currentLocation;

dojo.addOnLoad(function(){
	var options = {
		baseLayerName: "TheMap",
		touchHandler: true,
		baseLayerType: dojox.geo.openlayers.BaseLayerType.ARCGIS
	};
	
	map = new dojox.geo.openlayers.widget.Map(options);
	
	dojo.place(map.domNode, "map");
	map.startup();
	
	var olMap = map.map.getOLMap();
	var ctrl = new demos.mobileOpenLayers.src.NavigationControl({
		dojoMap: map
	});
	olMap.addControl(ctrl);
	var mapPage = dijit.byId("mapPage");
	dojo.connect(mapPage, "onAfterTransitionIn", mapPage, afterTransition);
	
	var paris = dijit.byId("paris");
	dojo.connect(paris, "onClick", paris, click);
	
	var ny = dijit.byId("newyork");
	dojo.connect(ny, "onClick", ny, click);
	
	var lc = dijit.byId("lacolle");
	dojo.connect(lc, "onClick", lc, click);
	
	dojo.connect(window, "onresize", resize);
});

function afterTransition(){
	fitTo();
}

function resize(){
	setTimeout(updateMap, 0);
}

var locs = {
	paris: [2.350833, 48.856667, 10],
	newyork: [-74.00597, 40.71427, 11],
	lacolle: [7.1072435, 43.686842, 15]
};

function click(e){
	currentLocation = this.id;
}

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
}

function updateMap(){
	var olm = map.map.getOLMap();
	var center = olm.getCenter();
	if (center != null) {
		var zoom = olm.getZoom();
		olm.zoom = null;
		olm.setCenter(center, zoom);
	}
}
