define([
	"dojo/_base/kernel",
	"../../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/html",
	"dojo/query"
], function(dojo, _Module){

	return _Module.registerModule(
	dojo.declare('demos.gridx.src.modules.select.Column', _Module, {
		
		name: "selectColumn",
		
		//When body becomes a standard module, we can simply omit this line.
		required: ['body'],
		
		load: function(args){
			this.batchConnect(
				[this.grid, 'onHeaderCellClick', '_onSelectByMouse'],
				[this.grid.body, 'onChange', '_onBodyChange']
			);
			this.subscribe('gridClearSelection_' + this.grid.id, dojo.hitch(this, 'clear', true));
			this.loaded.callback();
		},
		
		getAPIPath: function(){
			return {
				select: {
					column: this
				}
			};
		},
		
		columnMixin: {
			select: function(){
				this.grid.select.column._markById(this.id, true);
				return this;
			},
			
			deselect: function(){
				this.grid.select.column._markById(this.id, false);
				return this;
			},
			
			isSelected: function(){
				return this.grid.select.column.isSelected(this.id);
			}
		},
		
		//Public API----------------------------------------------------------------------
		
		enabled: true,
	
		multiple: true,
	
		autoClear: true,
		
		selectById: function(id){
			if(this.enabled && !this.grid.selectDisabled){
				this._markById(id, true);
				return this;
			}
		},
		
		deselectById: function(id){
			if(this.enabled && !this.grid.selectDisabled){
				this._markById(id, false);
				return this;
			}
		},
		
		isSelected: function(id){
			var c = this.grid._columnsById[id];
			return !!(c && c._selected);
		},
		
		getSelectedIds: function(){
			var ids = [], g = this.grid, i, count = g._columns.length, c;
			for(i = 0; i < count; ++i){
				c = g._columns[i];
				if(c._selected){
					ids.push(c.id);
				}
			}
			return ids;
		},
		
		clear: function(notPublish){
			if(this.enabled && !this.grid.selectDisabled){
				var columns = this.grid._columns, i, count = columns.length;
				for(i = 0; i < count; ++i){
					this._markById(columns[i].id, false);
				}
				if(!notPublish){
					dojo.publish('gridClearSelection_' + this.grid.id);
				}
				return this;
			}
		},
		
		//Events--------------------------------------------------------------------------------
		onSelected: function(/* columnObject */){},
		onDeselected: function(/* columnObject */){},
		
		//Private-------------------------------------------------------------------------------
		_markById: function(id, toSelect){
			var c = this.grid._columnsById[id];
			toSelect = !!toSelect;
			if(c && !c._selected == toSelect){
				c._selected = toSelect;
				this._highlight(id, toSelect);
				this[toSelect ? "onSelected" : "onDeselected"](this.grid.column(id, true));
			}
		},
		
		_highlight: function(id, toHighlight){
			dojo.query("[colid='" + id + "']", this.grid.bodyNode).forEach(function(node){
				dojo[toHighlight ? 'addClass' : 'removeClass'](node, 'dojoxGridxColumnSelected');
			});
		},
		
		_onSelectByMouse: function(e){
			if(this.enabled && !this.grid.selectDisabled){
				var toSelect = true;
				if(this.multiple && e.ctrlKey){
					toSelect = !this.isSelected(e.columnId);
				}else if(!this.multiple || this.autoClear){
					this.clear();
				}
				this._markById(e.columnId, toSelect);
			}
		},
		
		_onBodyChange: function(start, count){
			var end = start + count, i, columns = this.grid._columnsById;
			for(i = start; i < end; ++i){
				var rowNode = this.grid.body.getRowNodeByIndex(i);
				dojo.query('.dojoxGridxCell', rowNode).forEach(function(node){
					var col = columns[dojo.attr(node, 'colid')];
					if(col._selected){
						dojo.addClass(node, 'dojoxGridxColumnSelected');
					}
				});
			}
		}
	}));
});