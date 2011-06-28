define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/query"
], function(dojo, _Module){

	return _Module.registerModule(
	dojo.declare('demos.gridx.src.modules.Body', _Module, {
		name: "body",
	
		getAPIPath: function(){
			return {
				body: this
			};
		},
	
		load: function(args, deferStartup){
			this.domNode = this.grid.bodyNode;
			this.grid._connectEvents(this.domNode, '_onMouseEvent', this);
			this.batchConnect(
				[this.model, 'onDelete', '_onDelete'],
				[this.model, 'onNew', '_onNew'],
				[this.model, 'onSet', '_onSet'],
				[this.model, 'onSizeChange', '_onSizeChange'],
				[this.grid, 'onRowMouseOver', '_onRowMouseHover'],
				[this.grid, 'onRowMouseOut', '_onRowMouseHover'],
				[this.grid, 'onCellMouseOver', '_onCellMouseHover'],
				[this.grid, 'onCellMouseOut', '_onCellMouseHover']
			);
			this.model.when({}, function(){
				if(!this.logicalCount){
					this.logicalCount = this.model.size();
				}
				this.loaded.callback();
			}, this);
		},
	
		rowMixin: {
			node: function(){
				return this.grid.body.getRowNode(this.id);
			}
		},
	
		cellMixin: {
			node: function(){
				return this.grid.body.getCellNode(this.row.id, this.column.id);
			}
		},
	
		//Public-----------------------------------------------------------------------------
		
		//[readonly] Index of the first rendered row in body.
		start: 0,
	
		//[readonly] Number of all the current rendered rows in body.
		count: 0,
	
		logicalStart: 0,
	
		logicalCount: 0,
	
		//[read/write] Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,
	
		autoChangeSize: true,
	
		getRowNode: function(id){
			return dojo.query("[rowid=" + id + "]", this.domNode)[0];
		},
	
		getRowNodeByIndex: function(index){
			return dojo.query("[rowindex=" + index + "]", this.domNode)[0];
		},
		
		getCellNode: function(rowId, columnId){
			var rowNode = this.getRowNode(rowId);
			return dojo.query("[colid=" + columnId + "]", rowNode)[0];
		},
	
		refresh: function(start, count){
			var model = this.model, _this = this;
			return model.when({}).then(function(){
				if(start >= 0){
					if(!(count > 0)){
						count = model.size();
					}
					var end = start + count,
						curEnd = _this.start + _this.count;
					if(curEnd < end){
						end = curEnd;
					}
					if(_this.start > start){
						start = _this.start;
					}
					count = end - start;
					if(start < end){
						var i = start, node = _this.getRowNodeByIndex(i);
						dojo.place(_this._buildRowFrames(start, count), node, 'before');
						dojo.when(_this._buildRows(start, count), function(){
							for(; i < end && node; ++i){
								var tmp = node.nextSibling;
								dojo.destroy(node);
								node = tmp;
							}
							_this.onChange(start, count);
						});
					}
				}else{
					_this.renderRows(_this.start, _this.count);
				}
			});
		},
		
		//Package--------------------------------------------------------------------------------
		setRange: function(start, count){
			if(this.logicalStart !== start || this.logicalCount !== count){
				var size = this.model.size();
	//            if(start < size){
					if(start + count >= size){
						count = size - start;
					}
					this.logicalStart = start;
					this.logicalCount = count;
					this.domNode.innerHTML = "";
					this.onRangeChange(start, count);
	//            }
			}
		},
	
		renderRows: function(start, count, position/*?top|bottom*/){
			var d, _this = this, size = this.model.size(), str = '';
			if(start + count >= size){
				count = size - start > 0 ? size - start : 0;
			}
			if(count > 0){
				str = this._buildRowFrames(start, count);
			}
			if(count > 0 && position === 'top'){
				this.count += this.start - start;
				this.start = start;
				dojo.place(str, this.domNode, 'first');
			}else if(count > 0 && position === 'bottom'){
				this.count = start + count - this.start;
				dojo.place(str, this.domNode, 'last');
			}else{
				this.start = start;
				this.count = count;
				var nd = this.domNode;
				nd.scrollTop = 0;
				nd.innerHTML = str;
			}
			d = this._buildRows(start, count);
			dojo.when(d, function(){
				_this.onChange(start, count);
			});
		},
	
		unrenderRows: function(count, preOrPost){
			if(count > 0){
				var i = 0, bn = this.domNode;
				if(preOrPost === 'post'){
					for(; i < count && bn.lastChild; ++i){
						bn.removeChild(bn.lastChild);
					}
				}else{
					var t = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						t -= bn.firstChild.offsetHeight;
						bn.removeChild(bn.firstChild);
					}
					this.start += i;
					bn.scrollTop = t > 0 ? t : 0;
				}
				this.count -= i;
			}
		},
	
		//Events--------------------------------------------------------------------------------
		onBeforeRow: function(){},
		onAfterRow: function(){},
		onRangeChange: function(/*start, count*/){},
		onChange: function(/*start, count*/){},
		onNew: function(/*id, index, rowCache*/){},
		onDelete: function(/*id, index*/){},
		onSet: function(/*id, index, rowCache*/){},
	
		//Private---------------------------------------------------------------------------
		_buildRowFrames: function(start, count){
			var i, end = start + count, s = [], gridId = this.grid.id;
			for(i = start; i < end; ++i){
				s.push('<div class="dojoxGridxRow dojoxGridxRowDummy" rowindex="', i, '"></div>');
			}
			return s.join('');
		},
	
		_buildRows: function(start, count){
			var d, _this = this;
			if(count > 0){
				var i; end = start + count, uncachedRows = [];
				for(i = start; i < end; ++i){
					if(!this._buildRowContent(i)){
						uncachedRows.push(i);
					}
				}
				if(uncachedRows.length){
					d = this._buildUncachedRows(uncachedRows);
				}
			}
			return d;
		},
	
		_buildUncachedRows: function(uncachedRows){
			return this.model.when(uncachedRows, function(){
				var i;
				for(i = uncachedRows.length - 1; i >= 0; --i){
					this._buildRowContent(uncachedRows[i]);
				}
			}, this);
		},
	
		_buildRowContent: function(rowIndex){
			var rowNode = dojo.query("[rowindex='" + rowIndex + "']", this.domNode)[0];
			if(rowNode){
				var rowCache = this.model.index(rowIndex);
				if(rowCache){
					var rowId = this.model.indexToId(rowIndex);
					dojo.removeClass(rowNode, "dojoxGridxRowDummy");
					dojo.attr(rowNode, 'rowid', rowId);
					this.onBeforeRow(rowNode, rowId, rowIndex, rowCache);
					rowNode.innerHTML = this._buildCells(rowCache.data, rowId, rowIndex);
					this.onAfterRow(rowNode, rowId, rowIndex, rowCache);
					return true;
				}
				return null;
			}
			return false;
		},
	
		_buildCells: function(rowData, rowId, rowIndex){
			var i, col, len, s, 
				columns = this.grid._columns,
				sb = ['<table border="0" cellpadding="0" cellspacing="0"><tr>'];
			for(i = 0, len = columns.length; i < len; ++i){
				col = columns[i];
				sb.push('<td class="dojoxGridxCell" colid="', col.id, '" style="width: ', col.width, '">');
				if(col.decorator){
					s = col.decorator(rowData[col.id], rowId, rowIndex);
				}else if(col.template){
					s = col.template.replace(/\$\{([^}]+)\}/ig, function(m, key){
						return rowData[key];
					});
				}else{
					s = rowData[col.id];
				}
				sb.push(s, '</td>');
			}
			sb.push('</tr></table>');
			return sb.join('');
		}, 
	
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onCell' + eventName,
				evtRow = 'onRow' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.rowIndex >= 0){
					if(e.columnIndex >= 0){
						g[evtCell](e);
					}
					g[evtRow](e);
				}
			}
		},
	
		_decorateEvent: function(e){
			var node = e.target || e.originalTarget, g = this.grid;
			while(node && node !== g.bodyNode){
				if(node.tagName.toLowerCase() === 'td' && dojo.hasClass(node, 'dojoxGridxCell')){
					var col = g._columnsById[dojo.attr(node, 'colid')];
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(node.tagName.toLowerCase() === 'div' && dojo.hasClass(node, 'dojoxGridxRow')){
					e.rowId = dojo.attr(node, 'rowid');
					e.rowIndex = parseInt(dojo.attr(node, 'rowindex'), 10);
					return;
				}
				node = node.parentNode;
			}
		},
	
		_onSet: function(id, index, rowCache){
			if(this.autoUpdate){
				var rowNode = this.getRowNode(id);
				if(rowNode){
					this.onBeforeRow(rowNode, id, index, rowCache);
					rowNode.innerHTML = this._buildCells(rowCache.data);
					this.onAfterRow(rowNode, id, index, rowCache);
					this.onSet(id, index, rowCache);
					this.onChange(index, 1);
				}
				
			}
		},
	
		_onNew: function(id, index, rowCache){
			if(this.autoUpdate && this.start + this.count === this.model.size()){
				//The last row is shown, so the new row should be added.
				this.renderRows(this.start + this.count, 1, "bottom");
				this.onNew(id, index, rowCache);
				this.onChange(index, 1);
			}
		},
	
		_onDelete: function(id){
			if(this.autoUpdate){
				var node = this.getRowNode(id);
				if(node){
					var sibling, index, count = 0;
					for(sibling = node; sibling; sibling = sibling.nextSibling){
						index = parseInt(dojo.attr(sibling, 'rowindex'), 10);
						dojo.attr(sibling, 'rowindex', index - 1);
						++count;
					}
					dojo.destroy(node);
					this.onDelete(id, index);
					this.onChange(index, count);
				}
			}
		},
	
		_onSizeChange: function(size, oldSize){
			if(this.autoChangeSize && this.logicalStart === 0 && this.logicalCount === oldSize){
				this.logicalCount = size;
				this.onRangeChange(this.logicalStart, size);
			}
		},
		
		_onRowMouseHover: function(event){
			var rowNode = this.getRowNode(event.rowId);
			if(event.type == "mouseover"){
				dojo.addClass(rowNode, "dojoxGridxRowOver");
			}else if(event.type == "mouseout"){
				dojo.removeClass(rowNode, "dojoxGridxRowOver");
			}
		},
		
		_onCellMouseHover: function(event){
			var cellNode = this.getCellNode(event.rowId, event.columnId);
			if(event.type == "mouseover"){
				dojo.addClass(cellNode, "dojoxGridxCellOver");
			}else if(event.type == "mouseout"){
				dojo.removeClass(cellNode, "dojoxGridxCellOver");
			}
		}
	}));
});