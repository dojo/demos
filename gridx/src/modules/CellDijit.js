define([
'dojo',
'../core/_Module',
'dijit',
'dijit/_WidgetBase',
'dijit/_TemplatedMixin',
'dijit/_WidgetsInTemplateMixin'
], function(dojo, _Module, dijit, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin){

/*=====
var columnDefinitionCellDijitMixin = {
	// decorator: Function(gridCellData, rowId, rowIndex) return String
	//		This decorator function is slightly different from the one when this module is not used.
	//		This function should return a template string (see the doc for template string in dijit._TemplatedMixin
	//		and dijit._WidgetsInTemplateMixin). 
	//		In the template string, dijits or widgets can be used and they will be properly set value if they
	//		have the CSS class 'dojoxGridxHasGridCellValue' in their DOM node.
	//		Since setting value will be done automatically, there's no need to use the *gridCellData* here. But of cource
	//		it is still available if you want to use it.
	//		By default the dijits or widgets will be set value using the grid data (the result of the formatter function,
	//		if there is a formatter function for this column), not the store data (the raw data stored in store).
	//		If you'd like to use store data in some dijit, you can simly add a CSS class 'dojoxGridxUseStoreData' to it.
	decorator: null,

	// setCellValue: Function(gridData, storeData, cellWidget)
	//		If the settings in the decorator function can not meet your requirements, you use this function as a kind of complement.
	//		gridData: anything
	//				The data shown in grid cell. It's the result of formatter function if that function exists.
	//		storeData: anything
	//				The raw data in dojo store.
	//		cellWidget: CellWidget
	//				A widget representing the whole cell. This is the container of the templateString returned by decorator.
	//				So you can access any dojoAttachPoint from it (maybe your special dijit or node, and then set value for them).
	setCellValue: null,
};
=====*/

var CellWidget = dojo.declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

	content: '',

	setCellValue: null,

	postMixInProperties: function(){
		this.templateString = ['<div class="dojoxGridxCellWidget">', this.content, '</div>'].join('');
	},

	setValue: function(gridData, storeData){
		dojo.query('.dojoxGridxHasGridCellValue', this.domNode).map(function(node){
			return dijit.byNode(node);
		}).forEach(function(widget){
			if(widget){
				var useStoreData = dojo.hasClass(widget.domNode, 'dojoxGridxUseStoreData');
				widget.set('value', useStoreData ? storeData : gridData);
			}
		});
		if(this.setCellValue){
			this.setCellValue(gridData, storeData, this);
		}
	}
});

return _Module.registerModule(
dojo.declare("demos.gridx.src.modules.CellDijit", _Module, {
	name: 'cellDijit',

	required: ['body'],

	getAPIPath: function(){
		return {
			cellDijit: this
		};
	},

	constructor: function(){
		this._decorators = {};
	},

	load: function(){
		var i, col, columns = this.grid._columns;
		var dummy = function(){
			return "";
		};
		for(i = columns.length - 1; i >= 0; --i){
			col = columns[i];
			if(col.decorator){
				col.userDecorator = col.decorator;
				col.decorator = dummy;
				col._cellWidgets = [];
				col._spareWidgets = [];
			}
		}
		this.connect(this.grid.body, 'onAfterRow', '_showDijits');
		this.connect(this.grid.body, 'unrenderRows', '_collectSpareWidgets');
		this.loaded.callback();
	},

	destory: function(){
		this.inherited(arguments);
		var i, j, col, columns = this.grid._columns;
		for(i = columns.length - 1; i >= 0; --i){
			col = columns[i];
			if(col._cellWidgets){
				for(j = col._cellWidgets.length - 1; j >= 0; --j){
					col._cellWidgets[j].destroyRecursive();
				}
				for(j = col._spareWidgets.length - 1; j >= 0; --j){
					col._spareWidgets[j].destoryRecursive();
				}
				delete col._cellWidgets;
				delete col._spareWidgets;
			}
		}
	},

	//Public-----------------------------------------------------------------
	setCellDecorator: function(rowId, colId, decorator, setCellValue){
		var rowDecs = this._decorators[rowId];
		if(!rowDecs){
			rowDecs = this._decorators[rowId] = {};
		}
		var cellDec = rowDecs[colId];
		if(!cellDec){
			cellDec = rowDecs[colId] = {};
		}
		cellDec.decorator = decorator;
		cellDec.setCellValue = setCellValue;
		cellDec.widget = null;
	},

	restoreCellDecorator: function(rowId, colId){
		var rowDecs = this._decorators[rowId];
		if(rowDecs){
			var cellDec = rowDecs[colId];
			if(cellDec){
				if(cellDec.widget){
					//Because dijit.form.TextBox use setTimeout to fire onInput event, 
					//so we can not simply destroy the widget when ENTER key is pressed for an editing cell!!
					var parentNode = cellDec.widget.domNode.parentNode;
					if(parentNode){
						parentNode.innerHTML = null;
					}
					window.setTimeout(function(){
						cellDec.widget.destroyRecursive();
						cellDec.widget = null;
						cellDec.decorator = null;
						cellDec.setCellValue = null;
					}, 0);
				}
			}
			delete rowDecs[colId];
		}
	},

	getCellWidget: function(rowId, colId){
		var cellNode = this.grid.body.getCellNode(rowId, colId);
		if(cellNode){
			var widgetNode = dojo.query('.dojoxGridxCellWidget', cellNode)[0];
			if(widgetNode){
				return dijit.byNode(widgetNode);
			}
		}
		return null;
	},

	//Private---------------------------------------------------------------
	_showDijits: function(rowNode, id, index, rowCache){
		var i, col, cellNode, cellWidget, columns = this.grid._columns;
		for(i = columns.length - 1; i >= 0; --i){
			col = columns[i];
			if(col.userDecorator || this._getSpecialCellDec(id, col.id)){
				cellNode = dojo.query('[colid="' + col.id + '"]', rowNode)[0];
				if(cellNode){
					cellWidget = this._getCellWidget(col, id, index, rowCache);
					cellNode.innerHTML = "";
					cellWidget.placeAt(cellNode);
					cellWidget.startup();
				}
			}
		}
	},

	_getCellWidget: function(column, rowId, rowIndex, rowCache){
		var widget = this._getSpecialWidget(column, rowId, rowIndex, rowCache),
			gridData = rowCache.data[column.id],
			storeData = rowCache.rawData[column.field];
		if(!widget){
			if(column._spareWidgets.length){
				widget = column._spareWidgets.pop();
			}else{
				widget = new CellWidget({
					content: column.userDecorator(gridData, rowId, rowIndex),
					setCellValue: column.setCellValue
				});
			}
			column._cellWidgets.push(widget);
		}
//        console.log("cell widget: ", column._cellWidgets.length + column._spareWidgets.length);
		widget.rowIndex = rowIndex;
		widget.setValue(gridData, storeData);
		return widget;
	},

	_collectSpareWidgets: function(){
		var bn = this.grid.bodyNode,
			start = parseInt(dojo.attr(bn.firstChild, 'rowindex'), 10),
			end = parseInt(dojo.attr(bn.lastChild, 'rowindex'), 10),
			columns = this.grid._columns,
			i, col, j, widget;
		for(i = columns.length - 1; i >= 0; --i){
			col = columns[i];
			if(col._cellWidgets){
				for(j = col._cellWidgets.length - 1; j >= 0; --j){
					widget = col._cellWidgets[j];
					if(widget.rowIndex < start || widget.rowIndex > end){
						col._cellWidgets.splice(j, 1);
						col._spareWidgets.push(widget);
					}
				}
				var toRelease = col._spareWidgets.length - this.grid.body.count;
				for(; toRelease > 0; --toRelease){
					widget = col._spareWidgets.pop();
					widget.destroyRecursive();
					widget = null;
				}
			}
		}
	},

	_getSpecialCellDec: function(rowId, colId){
		var rowDecs = this._decorators[rowId];
		return rowDecs && rowDecs[colId];
	},

	_getSpecialWidget: function(column, rowId, rowIndex, rowCache){
		var rowDecs = this._decorators[rowId];
		if(rowDecs){
			var cellDec = rowDecs[column.id];
			if(cellDec){
				if(!cellDec.widget && cellDec.decorator){
					cellDec.widget = new CellWidget({
						content: cellDec.decorator(rowCache.data[column.id], rowId, rowIndex),
						setCellValue: cellDec.setCellValue
					});
				}
				return cellDec.widget;
			}
		}
		return null;
	}
}));
});

