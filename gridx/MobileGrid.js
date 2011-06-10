dojo.require("demos.gridx.src.Grid");
dojo.require("demos.gridx.src.modules.Header");
dojo.require("demos.gridx.src.modules.Body");
dojo.require("demos.gridx.src.modules.Layout");
dojo.require("demos.gridx.src.modules.VScroller");
dojo.require("demos.gridx.src.modules.HScroller");
dojo.require("demos.gridx.src.modules.SingleSort");
dojo.require("demos.gridx.src.modules.TouchScroller");
dojo.require("demos.gridx.src.modules.Rotater");
dojo.require("demos.gridx.src.core.model.SyncCache");

dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile.View");
dojox.mobile.themeFiles = ["base", ["demos.gridx.src", "Gridx"]];
dojo.require("dojox.mobile.deviceTheme");

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
