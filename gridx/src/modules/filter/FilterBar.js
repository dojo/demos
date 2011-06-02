define([
'dojo',
'dijit',
'../../core/_Module',
"dojo/text!../../templates/FilterBar.html",
'dijit/TooltipDialog',
'dijit/Tooltip',
'./Filter',
'./FilterDialog',
'dojo/i18n!../../nls/FilterBar'
], function(dojo, dijit, _Module, template){

/*=====
var columnDefinitionFilterMixin = {
	// filterable: Boolean
	//		If FALSE, then this column should not occur in the Filter Definition Dialog for future rules.
	//		But this does not influence existing filter rules. Default to be TRUE.
	filterable: true,

	// disabledConditions: String[]
	//		If provided, all the listed conditions will not occur in the Filter Definition Dialog for future rules.
	//		But this does not influence existing filter rules. Default to be an empty array.
	disabledConditions: [],

	// dataType: String
	//		Specify the data type of this column. Should be one of "string", "number", "date", "time", and "boolean".
	//		Case insensitive. Data type decides which conditions to use in the Filter Definition Dialog.
	dataType: 'string',

	// dataTypeArgs: Object
	//		Passing any other special config options for this column. For example, if the column is of type 'date', but the data
	//		in store is of string type, then a 'converter' function is needed here:
	//		dataTypeArgs: {
	//			useRawData: true,
	//			converter: function(v){
	//				return dojo.date.locale.parse(v, {...});
	//			}
	//		}
	dataTypeArgs: {},
};
=====*/

return _Module.registerModule(
dojo.declare('demos.gridx.src.modules.filter.FilterBar', _Module, {
	name: 'filterBar',
	
	forced: ['filter'],
	
	getAPIPath: function(){
		return {
			filterBar: this
		};
	},

	load: function(args, startup){
		//summary:
		//	Init filter bar UI
		this.domNode = dojo.create('div', {
			innerHTML: template,
			'class': 'dojoxGridxFilterBar'
		});
		dojo.parser.parse(this.domNode);
		dojo.toggleClass(this.domNode, 'dojoxGridxFilterBarHideCloseBtn', !this.closeFilterBarButton);
		this.grid.layout.register(this, 'domNode', 'headerNode', 5);
		this._nls = dojo.i18n.getLocalization("demos.gridx.src", "FilterBar");
		this._initWidgets();
		this._initConditionStores();
		//this._buildFilterState();
		this.connect(this.domNode, 'onclick', 'onDomClick');
		this.connect(this.domNode, 'onmouseover', 'onDomHover');
		this.loaded.callback();
	},
	
	onDomClick: function(e){
		if(e.target && dojo.attr(e.target, 'action') === 'clear'){
			this.clearFilter();
		}
	},
	onDomHover: function(e){
	},
	
	applyFilter: function(filterData){
		var F = demos.gridx.src.modules.filter.Filter;
		var exps = [], filter;
		this.filterData = filterData;
		function getExpression(condition, data, type){
			var c = data.condition, isNot = false;
			if(/^not/.test(c)){
				isNot = true;
				c = c.replace(/^not/g, '');
				c = c.charAt(0).toLowerCase() + c.substring(1);
			}
			var exp = F[c](F.column(data.colId, type), F.value(data.value, type));
			if(isNot){exp = F.not(exp);}
			return exp;
		}
		dojo.forEach(filterData.conditions, function(data){
			if(data.colId){
				var type = this.grid.column(data.colId).dataType();
				var colExp = F.column(data.colId, type);
				if(data.condition === 'range'){
					exps.push(F.and(F.greaterEqual(colExp, F.value(data.value.start, type)),
						F.lessEqual(colExp, F.value(data.value.end, type))));
				}else{
					exps.push(getExpression(data.condition, data, type));
				}
			}else{
				//any column
				
				var type = 'string', arr = [];
				dojo.forEach(this.grid.columns(), function(col){
					
					if(!col.isFilterable()){return;}
					arr.push(getExpression(data.condition, data, type));
				}, this);
				exps.push(F.or.apply(F, arr));
			}
		}, this);
		if(filterData.type === 'all'){
			filter = F.and.apply(F, exps);
		}else{
			filter = F.or.apply(F, exps);
		}
		this.grid.filter.setFilter(filter);
		var _this = this;
		this.model.when({}).then(function(){
			_this._currentSize = _this.model.size();
			_this._totalSize = _this.model._cache.size();
			_this._buildFilterState();
		});
	},
	
	clearFilter: function(){
		this.filterData = null;
		this.grid.filter.clearFilter();
		this._buildFilterState();
		this._filterDialog.clear();
	},

	columnMixin: {
		isFilterable: function(){
			// summary:
			//		Check if this column is filterable.
			// return: Boolean
			return this.grid._columnsById[this.id].filterable !== false;
		},

		setFilterable: function(filterable){
			// summary:
			//		Set filterable for this column.
			// filterable: Boolean
			//		TRUE for filterable, FALSE for not.
			// return:
			//		column object itself
			this.grid._columnsById[this.id].filterable = !!filterable;
			return this;
		},

		dataType: function(){
			// summary:
			//		Get the data type of this column. Always lowercase.
			// return: String
			return (this.grid._columnsById[this.id].dataType || 'string').toLowerCase();
		},

		setDataType: function(type, typeArgs){
			// summary:
			//		Set data type of this column.
			// reutrn:
			//		column object itself.
			type = type.toLowerCase();
			//Is there a shorter way to do this?
			if({
				'string': 1,
				'number': 1,
				'date': 1,
				'time': 1,
				'boolean': 1
			}[type]){
				var col = this.grid._columnsById[this.id];
				col.dateType = type;
				col.dataTypeArgs = typeArgs;
			}
			return this;
		},

		filterConditions: function(){
			// summary:
			//		Get the available conditions for this column.	
			return this.grid.filterBar._getColumnConditions(this.id);
		},

		enableFilterCondition: function(condition, toEnable){
			// summary:
			//		Enable/Disable a condition for a specific column. 	
			// condition: String
			//		A condition name.
			// toEnable: Boolean?
			//		TRUE enable this condition; FALSE to disable this condition. Default is TRUE.
			this.grid.filterBar._enableFilterCondition(this.id, condition, toEnable);
			return this;
		}
	},

	//Public-----------------------------------------------------------
	
	// closeFilterBarButton: Boolean
	//		TRUE to show a small button on the filter bar for the user to close/hide the filter bar.
	closeFilterBarButton: true,

	// defineFilterButton: Boolean
	//		FALSE to hide the define filter button on the left side (right side for RTL) of the filter bar.
	defineFilterButton: true,
	
	// tooltipDelay: Number
	//		Time in mili-seconds of the delay to show the Filter Status Tooltip when mouse is hovering on the filter bar.
	tooltipDelay: 300,

	// maxRuleCount: Integer
	//		Maximum rule count that can be applied in the Filter Definition Dialog.
	//		If <= 0 or not number, then infinite rules are supported.
	maxRuleCount: 3,
	
	// ruleCountToConfirmClearFilter: Integer | Infinity | null
	//		If the filter rule count is larger than or equal to this value, then a confirm dialog will show when clearing filter.
	//		If set to less than 1 or null, then always show the confirm dialog.
	//		If set to Infinity, then never show the confirm dialog.
	//		Default value is 2.
	ruleCountToConfirmClearFilter: 2,

/*=====
	// itemsName: String
	//		The general name of the items listed in the grid.
	//		If not provided, then search the language bundle.
	itemsName: '',

	// condition:
	//		Name of all supported conditions.
	//		Hard coded here or dynamicly generated is up to the implementer. Anyway, users should be able to get this info.
	conditions: {
		string: [
			'equal',
			'contain'
			'startWith',
			'endWith',
			'notEqual',
			'notContain',
			'notStartWith',
			'notEndWith',
			'isEmpty'
		],
		number: [
			'equal',
			'greater',
			'less',
			'greaterEqual',
			'lessEqual',
			'notEqual',
			'isEmpty'
		],
		date: [
			'equal',
			'greater', //after
			'less',	//before
			'range',	//greaterEqual and lessEqual
			'isEmpty'
		],
		time: [
			'equal',
			'greater',
			'less',
			'range',
			'isEmpty'
		],
		'boolean': [
			'equal',
			'isEmpty'
		]
	},
=====*/

	refresh: function(){
		// summary:
		//		Re-draw the filter bar if necessary with the current attributes.
		// example:
		//		grid.filterBar.closeFilterBarButton = true;
		//		grid.filterBar.refresh();
	},

	show: function(){
		// summary:
		//		Show the filter bar. (May add animation later)
	},

	hide: function(){
		// summary:
		//		Hide the filter bar. (May add animation later)
	},
	showFilterDialog: function(){
		// summary:
		//		Show the filter define dialog.
		if(!this._filterDialog){
			this._filterDialog = new demos.gridx.src.modules.filter.FilterDialog({
				grid: this.grid
			});
		}
		this._filterDialog.show();
	},

	//Private---------------------------------------------------------------
	_getColumnConditions: function(colId){
		// summary:
		//		Get the available conditions for a specific column.
		// tag:
		//		private
		// colId: String|Number
		//		The ID of a column.
		// return: String[]
		//		An array of condition names.
	},

	_enableColumnCondition: function(colId, condition, toEnable){
		// summary:
		//		Enable/Disable a condition for a specific column. 
		//		The enabled/disabled info is not retained when column data type is changed.
		//		If arguments are invalid, this is a no-op.
		// tag:
		//		private
		// colId: String|Number
		//		The ID of a column.
		// condition: String
		//		A condition name.
		// toEnable: Boolean?
		//		TRUE to enable this condition; FALSE to disable this condition. Default is TRUE.
	},
	
	_initWidgets: function(){
		this.btnFilter = dijit.byNode(dojo.query('.dijitButton', this.domNode)[0]);
		this.statusNode = dojo.query('.dojoxGridxFilterBarStatus', this.domNode)[0].firstChild;
		this.connect(this.btnFilter, 'onClick', 'showFilterDialog');	
	},
	
	_buildFilterState: function(){
		//summary:
		//		Build the tooltip dialog to show all applied filters.
		console.debug('filter state start');
		if(!this.filterData || !this.filterData.conditions.length){
			this.statusNode.innerHTML = 'No filter applied.';
			if(this._tooltip){this._tooltip.removeTarget(this.domNode);}
			return;
		}
		console.debug('filter state');		
		this.statusNode.innerHTML = this._currentSize + ' of ' + this._totalSize 
			+ ' items shown. &nbsp; &nbsp; <a href="javascript:void(0);" action="clear" title="Clear filter">Clear Filter</a>';
		
		
		return;
		if(!this._tooltip){
			this._tooltip = new dijit.TooltipDialog({
				label: 'abc',
				position: ['below'],
				onShow: function(){
					this.domNode.style.left = '100px';
					console.debug(dojo.position(this.domNode));
				}
			});
			dojo.addClass(this._tooltip.domNode, 'dojoxGridxFilterTooltip');
		}
		
		var arr = ['<b>Filter: All Rules.</b><br/>',
			'<table><tr><th>Column</th><th>Rule</th></tr>',
		];
		dojo.forEach(this.filterData.conditions, function(d){
			arr.push('<tr><td>'+ (d.colId ? this.grid.column(d.colId).name() : 'Any column'), 
				'</td><td>', this._getRuleString(d.condition, d.value), '</td></tr>');
		}, this);
		arr.push('</table>')
		//this._tooltip.addTarget(this.domNode);
	},
	_getRuleString: function(condition, value){
		var k = condition.charAt(0).toUpperCase() + condition.substring(1);
		return '<span style="font-style:italic">' + k + '</span>&nbsp;' + value;
	},
	_initConditionStores: function(){
		//condition stores for selecting
		this._conditionStores = {};
		var conditionData = {
			string: ['equal', 'contain','startWith', 'endWith', 'notEqual','notContain', 'notStartWith', 'notEndWith',	'isEmpty'],
			number: ['equal','greater','less','greaterEqual','lessEqual','notEqual','isEmpty'],
			date: ['equal','before','after','range','isEmpty'],
			time: ['equal','before','after','range','isEmpty'],
			'boolean': ['equal','isEmpty']
		}
		var nls = this._nls;
		for(var p in conditionData){
			var data = {identifier: 'value', label: 'label', items: []};
			dojo.forEach(conditionData[p], function(s){
				var k = s.charAt(0).toUpperCase() + s.substring(1);
				data.items.push({label: nls['condition' + k], value: s});
			});
			this._conditionStores[p] = new dojo.data.ItemFileReadStore({data: data});
		}
	}
}));
});

