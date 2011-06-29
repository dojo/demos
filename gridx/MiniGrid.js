require([
	'demos/gridx/src/Grid',
	'demos/gridx/src/modules/Header',
	'demos/gridx/src/modules/Body',
	'demos/gridx/src/modules/Layout',
	'demos/gridx/src/modules/VScroller',
	'demos/gridx/src/modules/HScroller',
	'demos/gridx/src/modules/SingleSort',
	'demos/gridx/src/core/model/SyncCache',
	'demos/gridx/src/modules/ColumnResizer',
	'demos/gridx/src/modules/select/Row',
	"dojo/data/ItemFileWriteStore",
	"dijit/_base"
], function(){
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
		mr.select.Row,
		mr.HScroller,
		mr.VScroller,
		mr.SingleSort,
		mr.ColumnResizer
	];
	
	dojo.ready(function(){
		var grid = new demos.gridx.src.Grid({
			id: 'grid',
			store: getStore(200),
			structure: layout,
			modules: modules
		});
		grid.placeAt('gridDiv');
		grid.startup();
	});
});