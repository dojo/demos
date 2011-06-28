define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare"
], function(dojo, _Module){

	return _Module.registerModule(
	dojo.declare('demos.gridx.src.modules.SingleSort', _Module, {
		name: 'singleSort',
		forced: ['header'],
		required: ['layout'],
		
		constructor: function(grid, args){
			//Presort...
			var sort = args.preSingleSort || grid.preSingleSort || {};
			if(sort.colId){
				this._sortId = sort.colId;
				this._sortDescend = sort.descending;
				this.model.sort([sort]);
			}
		},
	
		load: function(args, deferStartup){
			//Bind mouse events for header
			this.connect(this.grid, 'onHeaderCellClick', '_onClick');
			var colId;
			for(colId in this.grid._columnsById){
				this._initHeader(colId);
			}
			//If presorted, update header UI
			if(this._sortId){
				this._updateHeader(this._sortId, this._sortDescend);
			}
			this.loaded.callback();
		},
	
		getAPIPath: function(){
			return {
				singleSort: this
			};
		},
	
		columnMixin: {
			sort: function(isDescending, skipUpdateBody){
				this.grid.singleSort.sort(this.id, isDescending, skipUpdateBody);
				return this;
			},
	
			isSorted: function(){
				return this.grid.singleSort.isSorted(this.id);
			},
	
			clearSort: function(skipUpdateBody){
				if(this.isSorted()){
					this.grid.singleSort.clear(skipUpdateBody);
				}
				return this;
			},
	
			isSortable: function(){
				var col = this.grid._columnsById[this.id];
				return col.sortable || col.sortable === undefined;
			},
	
			setSortable: function(isSortable){
				this.grid._columnsById[this.id].sortable = !!isSortable;
				return this;
			}
		},
	
		//Public--------------------------------------------------------------
		sort: function(colId, isDescending, skipUpdateBody){
			var g = this.grid, col = g._columnsById[colId];
			if(col && (col.sortable || col.sortable === undefined)){
				if(this._sortId !== colId || this._sortDescend === !isDescending){
					this._updateHeader(colId, isDescending);
				}
				this.model.sort([{colId: colId, descending: isDescending}]);
				if(!skipUpdateBody){
					g.body.refresh();
				}
			}
		},
	
		isSorted: function(colId){
			if(colId === this._sortId){
				return this._sortDescend ? -1 : 1;
			}
			return 0;
		},
	
		clear: function(skipUpdateBody){
			if(this._sortId !== null){
				this._initHeader(this._sortId);
				this.model.sort();
				if(!skipUpdateBody){
					var body = this.grid.body;
					this.model.when({}, body.refresh, body);
				}
			}
		},
	
		//Private--------------------------------------------------------------
		_sortId: null,
		_sortDescend: null, 
		
		_initHeader: function(colId){
			//Initialize header structure for single sort
			var str = ["<div class='dojoxGridxSortNode'>", this.grid.column(colId, true).name(), "</div>"].join('');
			this.grid.header.getHeaderNode(colId).innerHTML = str;
		},
	
		_updateHeader: function(colId, isDescending){
			//Change the structure of sorted header
			if(this._sortId !== colId && this._sortId !== null){
				this._initHeader(this._sortId);
			}
			this._sortId = colId;
			this._sortDescend = !!isDescending;
			var str = ["<div class='dojoxGridxSortNode ",
				(isDescending ? 'dojoxGridxSortDown' : 'dojoxGridxSortUp'),
				"'><div class='dojoxGridxArrowButtonChar'>",
				(isDescending ? "▼" : "▲"),
				"</div><div role='presentation' class='dojoxGridxArrowButtonNode'></div><div class='dojoxGridxColCaption'>",
				this.grid.column(colId, true).name(),
				"</div></div>"].join('');
			this.grid.header.getHeaderNode(colId).innerHTML = str;
			this.grid.layout.reLayout();
		},
	
		_onClick: function(e){
			var desc = this._sortId !== e.columnId ? false : !this._sortDescend;
			this.sort(e.columnId, desc);
		}
	}));
});