define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/query"
], function(dojo, _Module){
	
	dojo.declare('demos.gridx.src.modules.NestedSorting', _Module, {
		name: 'nestedSorting',
		required: ['body'],
		
		constructor: function(){
			this._sortData = [];
		},
		getAPIPath: function(){
			return {
				nestedSorting: this
			}
		},
		load: function(args, deferStartup){
			var _this = this, g = this.grid, body = dojo.body();
			deferStartup.then(function(){
				_this._init();
				_this.loaded.callback();
			});
		},
		setSort: function(sortData){
			//summary:
			//	Init the sorting status by def data
			this._sortData = sortData;
		},
		sort: function(colid){
			//summary:
			//	Sort one column in nested sorting state
			var d = dojo.filter(this._sortData, function(d){return d.colId === colid})[0];
			
			if(d){
				if(d.descending === false){
					d.descending = true;
				}else if(d.descending === true){
					var i = dojo.indexOf(this._sortData, d);
					this._sortData.splice(i, 1);
				}else{
					console.warn('Unknow colum sorting status: ', d);
				}
			}else{
				d = {colId: colid, descending: false};	
				this._sortData.push(d);
			}
			
			this._doSort();
			this._updateUI();
		},
		
		clear: function(){
			//summary:
			//	Clear the sorting state
			this._sortData.length = 0;
			this._doSort();
			this._updateUI();
		},
		
		
		//Private---------------------------------------------------------------------------
		_init: function(){
			this.connect(this.grid.header.domNode, 'onclick', '_onHeaderClick');
			this.connect(this.grid.header.domNode, 'onmouseover', '_onMouseOver');
			this.connect(this.grid.header.domNode, 'onmouseout', '_onMouseOut');
			this._initHeader();
		},
		_initHeader: function(){
			var table = this.grid.header.domNode.firstChild.firstChild;
			var tds = table.rows[0].cells;
			dojo.forEach(table.rows[0].cells, function(td){
				dojo.create('div', {
					className: 'dojoxGridxSortBtn dojoxGridxSortBtnNested', 
					innerHTML: '1',
					title: 'Nested Sort'
				}, td, 'first');
				
				dojo.create('div', {
					className: 'dojoxGridxSortBtn dojoxGridxSortBtnSingle', 
					innerHTML: '&nbsp;',
					title: 'Single Sort'
				}, td, 'first');
				
			});
		},
		
		_onHeaderClick: function(e){
			var btn = e.target, colid;
			if(dojo.hasClass(btn, 'dojoxGridxSortBtn')){
				colid = dojo.attr(btn.parentNode, 'colid');
			}else{ return; }
			
			if(dojo.hasClass(btn, 'dojoxGridxSortBtnSingle')){
				//single sort
				if(this._sortData.length > 1){
					this._sortData.length = 0;
				}
				var d = dojo.filter(this._sortData, function(data){return data.colId === colid})[0];
				this._sortData.length = 0;
				if(d){this._sortData.push(d);}
				this.sort(colid);
			}else if(dojo.hasClass(btn, 'dojoxGridxSortBtnNested')){
				//nested sort
				this.sort(colid);
			}
		},
		
		_onMouseOver: function(e){
			dojo.addClass(this.grid.header.domNode, 'dojoxGridxHeaderHover');
			return;
			if(!e.target.tagName 
				|| e.target.tagName.toLowerCase() !== 'th'
				|| this._sortData.length !== 1
				|| dojo.hasClass(e.target.parentNode, 'dojoxGridxCellSortedMain')
			){return;}
			dojo.addClass(this.grid.header.domNode, 'dojoxGridxShowNestedBtn');
		},
		_onMouseOut: function(e){
			dojo.removeClass(this.grid.header.domNode, 'dojoxGridxHeaderHover');
			return;
			if(!e.target.tagName 
				|| e.target.tagName.toLowerCase() !== 'th'
			){return;}
			dojo.removeClass(this.grid.header.domNode, 'dojoxGridxShowNestedBtn');
		},
		
		_doSort: function(){
			var g = this.grid, d = this._sortData;
			g.model.sort(d);
			g.model.when({}, g.body.refresh, g.body);
		},
		
		_updateUI: function(){
			dojo.removeClass(this.grid.domNode, 'dojoxGridxSingleSorted');
			dojo.removeClass(this.grid.domNode, 'dojoxGridxNestedSorted');
			dojo.query('th', this.grid.header.domNode).forEach(function(cell){
				var colid = dojo.attr(cell, 'colid');
				dojo.removeClass(cell, 'dojoxGridxCellSorted');
				dojo.removeClass(cell, 'dojoxGridxCellSortedDesc');
				dojo.removeClass(cell, 'dojoxGridxCellSortedAsc');
				dojo.removeClass(cell, 'dojoxGridxCellSortedMain');
				cell.childNodes[1].innerHTML = this._sortData.length + 1;
				var d = dojo.filter(this._sortData, function(data){return data.colId === colid;})[0];
				if(!d){return;};
				var i = dojo.indexOf(this._sortData, d) + 1;
				cell.childNodes[1].innerHTML = i;
				dojo.addClass(cell, 'dojoxGridxCellSorted');
				if(d === this._sortData[0]){dojo.addClass(cell, 'dojoxGridxCellSortedMain');}
				if(d.descending){dojo.addClass(cell, 'dojoxGridxCellSortedDesc');}
				else {dojo.addClass(cell, 'dojoxGridxCellSortedAsc');}
			}, this);
			if(this._sortData.length === 1){
				dojo.addClass(this.grid.domNode, 'dojoxGridxSingleSorted');
			}
			else if(this._sortData.length > 1){
				dojo.addClass(this.grid.domNode, 'dojoxGridxNestedSorted');
			}
		}
	});
	
	return demos.gridx.src.modules.NestedSorting;

});