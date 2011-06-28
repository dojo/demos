require([
	"demos/gridx/src/Grid",
	"demos/gridx/src/modules/Header",
	"demos/gridx/src/modules/Body",
	"demos/gridx/src/modules/Layout",
	"demos/gridx/src/modules/VScroller",
	"demos/gridx/src/modules/HScroller",
	"demos/gridx/src/modules/SingleSort",
	"demos/gridx/src/modules/TouchScroller",
	"demos/gridx/src/modules/Rotater",
	"demos/gridx/src/core/model/SyncCache",
	"dojo/data/ItemFileWriteStore",
	"dojox/mobile/parser",
	"dojox/mobile/View",
	"dojox/mobile/deviceTheme",
	"dijit/_base"
], function(){
	dojox.mobile.themeFiles = ["base", ["demos.gridx.src", "Gridx"]];

	var structure = [
		{field: "id", name:"Index", width: "50px"},
		{field: "Name", name:"Name", width: "135px"},
		{field: "Artist", name:"Artist", width: "135px"}
	];
	var landscapeStructure = [
		{field: "id", name:"Index", width: "50px"},
		{field: "Name", name:"Name", width: "110px"},
		{field: "Artist", name:"Artist", width: "110px"},
		{field: "Length", name:"Length", width: "50px"},
		{field: "Album", name:"Album", width: "110px"},
		{field: "Year", name:"Year", width: "50px"}
	];
	
	var mr = demos.gridx.src.modules;
	
	var modules = [
		mr.Header,
		mr.Body,
		mr.Layout,
		mr.SingleSort,
		mr.TouchScroller,
		mr.Rotater
	];
	
	dojo.ready(function(){
		var grid = new demos.gridx.src.Grid({
			id: "grid",
			store: getStore(100),
			structure: structure,
			landscapeStructure: landscapeStructure,
			modules: modules
		});
		grid.placeAt("gridDiv");
		grid.startup();
	});
});