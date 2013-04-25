require([
	"dojo/_base/kernel", 
	"dojo/_base/html", 
	"dojo/_base/array",
	"dojo/dom",
	"dojo/ready",
	"dojo/json",
	"dijit/registry",
	"dojox/geo/openlayers/Map", 
	"dijit/Menu", 
	"dijit/MenuItem", 
	"dijit/PopupMenuItem", 
	"dojo/parser"], 
	function(dojo, html, array, dom, ready, json, registry, Map){

	var map;
	
	var setBaseLayer = function(o){
		map.setBaseLayerType(o);
		updateTF(o);
	};
	
	var updateTF = function(o){
		var ta = dom.byId("textArea");
		ta.innerHTML = "Params: " + json.stringify(o).replace(/[,]/g, " ");
		var bl = map.getOLMap().baseLayer;
		if(bl && bl.getURL){
			var msg = bl.getURL(new OpenLayers.Bounds());
		}
	};
	
	var wireHandlers = function(){
		var handlers = [
			["osm", {
				baseLayerName : "OpenStreetMap", 
				baseLayerType : dojox.geo.openlayers.BaseLayerType.OSM
			}],
			["google", {
				baseLayerName : "Google", 
				baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE
			}],
			["gTerrain", {
				baseLayerName : 'GoogleTerrain',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE,
 				baseLayerOptions : {
 					type : google.maps.MapTypeId.TERRAIN,
 					numZoomLevels : 20
				}
			}],
			["gHybrid", { 
				baseLayerName : 'GoogleHybrid',
				baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE,
				baseLayerOptions:{
					type : google.maps.MapTypeId.HYBRID,
					numZoomLevels : 20
				}
			}],
			["gSatellite", {
				baseLayerName : 'GoogleSatellite',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE,
 				baseLayerOptions : {
 					type: google.maps.MapTypeId.SATELLITE,
 					numZoomLevels: 20
				}
			}],
			["wms", {
 				baseLayerName : 'WebMapService',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.WMS
			}],
			["yahoo", {
 				baseLayerName : 'Yahoo',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.YAHOO
			}],
			["arcGisStreet", {
 				baseLayerName : 'ArcGisStreetMap',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS
			}],
			["arcGisRelief", {
 				baseLayerName : 'ArcGisWorldShadedRelief',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS,
 				baseLayerUrl : 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_ShadedRelief_World_2D/MapServer/export'
			}],
			["esri2D", {
 				baseLayerName : 'ESRIImageryWorld2D',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS,
 				baseLayerUrl : 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/export'
			}],
			["us2D", {
 				baseLayerName : 'ArcGisNGSTopoUS2D',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS,
 				baseLayerUrl : 'http://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer/export'
			}],
			["physical", {
 				baseLayerName : 'ArcGisWorldPhysicalMap',
 				baseLayerType : dojox.geo.openlayers.BaseLayerType.ARCGIS,
 				baseLayerUrl : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/export'
			}],
			["arcGisNoArg", dojox.geo.openlayers.BaseLayerType.ARCGIS]
		];
		array.forEach(handlers, function(h){
			registry.byId(h[0]).on("Click", function(){
				setBaseLayer(h[1]);
			});
		});
	};

	ready(function(){
		var options = {
			baseLayerName: "TheMap",
			baseLayerType: dojox.geo.openlayers.BaseLayerType.GOOGLE,
			touchHandler: true,
			accessible: true
		};
		var menu = dom.byId("menu");
		html.style(menu, "visibility", "visible");
		map = new Map("map", options);
		map.fitTo([-160, 70, 160, -70]);
		updateTF(options);
		wireHandlers();		
	});
});

