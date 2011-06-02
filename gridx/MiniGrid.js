dojo.require('demos.gridx.src.Grid');
dojo.require('demos.gridx.src.modules.Header');
dojo.require('demos.gridx.src.modules.Body');
dojo.require('demos.gridx.src.modules.Layout');
dojo.require('demos.gridx.src.modules.VScroller');
dojo.require('demos.gridx.src.modules.HScroller');
dojo.require('demos.gridx.src.modules.SingleSort');
dojo.require('demos.gridx.src.core.model.SyncCache');

dojo.require("dojo.data.ItemFileWriteStore");

var layout = [
	{ field: "id", name:"Index", width:'60px'},
	{ field: "Genre", name:"Genre", width:'150px'},
	{ field: "Artist", name:"Artist", width:'150px'},
	{ field: "Year", name:"Year"},
	{ field: "Name", name:"Name", width:'150px'},
	{ field: "Length", name:"Length", width:'60px'},
	{ field: "Track", name:"Track", width:'50px'},
	{ field: "Composer", name:"Composer"},
	{ field: "Download Date", name:"Download Date", width:'100px'}
];

var mr = demos.gridx.src.modules;

var modules = [
	mr.Header,
	mr.Body,
	mr.Layout,
	mr.HScroller,
	mr.VScroller,
	mr.SingleSort
];

dojo.ready(function(){
	var grid = new demos.gridx.src.Grid({
		id: 'grid',
		store: getStore(500),
		structure: layout,
		modules: modules
	});
	grid.placeAt('gridDiv');
	grid.startup();
});