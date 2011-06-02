dojo.require("demos.gridx.src.Grid");
dojo.require("demos.gridx.src._tests.GridConfig");
dojo.require('demos.gridx.src.core.model.AsyncCache');
dojo.require('demos.gridx.src.core.model.SyncCache');

dojo.require('demos.gridx.src.modules.Header');
dojo.require('demos.gridx.src.modules.Body');
dojo.require('demos.gridx.src.modules.Layout');
dojo.require('demos.gridx.src.modules.HScroller');
dojo.require('demos.gridx.src.modules.VScroller');
dojo.require('demos.gridx.src.modules.VirtualVScroller');
dojo.require('demos.gridx.src.modules.SingleSort');
dojo.require('demos.gridx.src.modules.select.Row');
dojo.require('demos.gridx.src.modules.select.Column');
dojo.require('demos.gridx.src.modules.select.Cell');
dojo.require('demos.gridx.src.modules.move.Row');
dojo.require('demos.gridx.src.modules.move.Column');
dojo.require('demos.gridx.src.modules.move.Cell');
dojo.require('demos.gridx.src.modules.dnd.Row');
dojo.require('demos.gridx.src.modules.dnd.Column');
dojo.require('demos.gridx.src.modules.dnd.Cell');
dojo.require('demos.gridx.src.modules.ColumnResizer');
dojo.require('demos.gridx.src.modules.Pagination');
dojo.require('demos.gridx.src.modules.PaginationBar');
dojo.require('demos.gridx.src.modules.NestedSorting');
dojo.require('demos.gridx.src.modules.filter.Filter');
dojo.require('demos.gridx.src.modules.filter.FilterBar');
dojo.require('demos.gridx.src.modules.CellDijit');
dojo.require('demos.gridx.src.modules.Edit');

dojo.require("dojo.data.ItemFileWriteStore");

dojo.require('dijit.form.NumberTextBox');
dojo.require('dijit.form.DateTextBox');
dojo.require('dojo.date.locale');

var	layout = [
	{ field: "id", name:"Index", dataType:"number", width:'60px'},
	{ field: "Artist", name:"Artist", editable: true, width:'150px'},
	{ field: "Year", name:"Year", dataType:"number", 
		editable: true, 
		editor: dijit.form.NumberTextBox
	},
	{ field: "Name", name:"Name", width:'150px'},
	{ field: "Length", name:"Length", width:'60px'},
	{ field: "Track", name:"Track", width:'50px'},
	{ field: "Composer", name:"Composer", dataType:"boolean"},
	{ field: "Download Date", name:"Date", dataType:"date", 
		editable: true, 
		editor: dijit.form.DateTextBox,
		editorArgs: {
			fromGridToEditor: setDate,
			fromEditorToGrid: getDate,
			dijitProperties: {
				constraints: {
					datePattern: 'yyyy/M/d'
				}
			}
		}
	},
	{ field: "Last Played", name:"Last Played", dataType:"time",
		editable: true,
		editor: dijit.form.TimeTextBox,
		editorArgs: {
			fromGridToEditor: setTime,
			fromEditorToGrid: getTime
		}
	}
];

var textDecorator = function(){
	return "<div dojoType='dijit.form.TextBox' class='dojoxGridxHasGridCellValue' style='width: 100%;'></div>";
};

var setDate = function(storeData){
	var res = dojo.date.locale.parse(storeData, {
		selector: 'date',
		datePattern: 'yyyy/M/d'
	});
	return res;
};

var getDate = function(d){
	res = dojo.date.locale.format(d, {
		selector: 'date',
		datePattern: 'yyyy/M/d'
	});
	return res;
};

var setTime = function(storeData){
	var res = dojo.date.locale.parse(storeData, {
		selector: 'time',
		timePattern: 'hh:mm:ss'
	});
	return res;
};

var getTime = function(d){
	res = dojo.date.locale.format(d, {
		selector: 'time',
		timePattern: 'hh:mm:ss'
	});
	return res;
};

var coreModules = [
	demos.gridx.src.modules.Header,
	demos.gridx.src.modules.Body,
	demos.gridx.src.modules.Layout,
	demos.gridx.src.modules.HScroller
];

var mr = demos.gridx.src.modules;
var modules = {
	"vertical scroll": {
		"default": mr.VirtualVScroller,
		defaultCheck: true
	},
	sort: {
		single: mr.SingleSort,
		nested: mr.NestedSorting
	},
	"column resize": {
		"default": mr.ColumnResizer
	},
	"row select": {
		"default": mr.select.Row
	},
	"column select": {
		"default": mr.select.Column
	},
	"cell select": {
		"default": mr.select.Cell
	},
	"row dnd": {
		"default": mr.dnd.Row
	},
	"column dnd": {
		"default": mr.dnd.Column
	},
	"cell dnd": {
		"default": mr.dnd.Cell
	},
	"pagination bar": {
		"default": mr.PaginationBar
	},
	"filter bar": {
		"default": mr.filter.FilterBar
	},
	"cell dijit": {
		"default": mr.CellDijit
	},
	"edit": {
		"default": mr.Edit
	}//,
//	"row move api": {
//		"default": mr.move.Row
//	},
//	"column move api": {
//		"default": mr.move.Column
//	},
//	"cell move api": {
//		"default": mr.move.Cell
//	},
//	"pagination api": {
//		"default": mr.Pagination
//	},
//	"filter api": {
//		"default": mr.filter.Filter
//	}
};
function createGrid(args){
	destroyGrid();
	var mods = window.config.getMods();
	var grid = window.grid = new demos.gridx.src.Grid({
		id: 'grid',
		store: getStore(2000),
		structure: layout,
		modules: mods
	});
	grid.placeAt('gridDiv');
	grid.startup();
}
function destroyGrid(){
	if(window.grid){
		window.grid.destroyRecursive();
		window.grid = null;
	}
}
dojo.ready(function(){
	var config = window.config = new demos.gridx.src._tests.GridConfig({
		modules: modules,
		coreModules: coreModules,
	}, 'gridConfig');
	config.startup();
	
	var create = dojo.byId('create');
	dojo.connect(config.createBtn, 'click', createGrid);
	
	createGrid();
});