define([
'dojo',
'dijit',
"dojo/text!../../templates/FilterDialog.html",
'dijit/Dialog',
'dijit/layout/AccordionContainer',
'dojo/data/ItemFileReadStore',
'./FilterPane',
'./Filter'
], function(dojo, dijit, template){

return dojo.declare('demos.gridx.src.modules.filter.FilterDialog', dijit.Dialog, {
	title: 'Filter',
	cssClass: 'dojoxGridxFilterDialog',
	grid: null,
	autofocus: false,
	filterState: null,
	postCreate: function(){
		this.inherited(arguments);
		this.set('content', template);
		this._initWidgets();
		this._initColumnOptions();
		this.filterState = {type: 'all', conditions: []};
		dojo.addClass(this.domNode, 'dojoxGridxFilterDialog')
	},
	done: function(){
		this.filterState.conditions.length = 0;
		var panes = this._accordionContainer.getChildren();
		dojo.forEach(panes, function(p){
			this.filterState.conditions.push(p.getResult());
		}, this);
		this.filterState.type = this._sltMatch.get('value');	
		this.hide();
		this.grid.filterBar.applyFilter(this.getResult());
	},
	getResult: function(){
		return this.filterState;
	},
	setState: function(state){
		this.filterState = state;
	},
	clear: function(){
		dojo.forEach(this._accordionContainer.getChildren(), dojo.hitch(this._accordionContainer, 'removeChild'));
		this.addRule();
	},
	clearFilter: function(){
		this.grid.filterBar.clearFilter();
	},
	cancel: function(){
		this.hide();
	},
	
	show: function(){
		this.inherited(arguments);
		if(!this._accordionContainer.hasChildren()){
			this.addRule();
		}
	},
	
	addRule: function(){
		var ac = this._accordionContainer;
		var fp = new demos.gridx.src.modules.filter.FilterPane({
			title: 'Rule',
			grid: this.grid,
			columnOptions: this._columnOptions,
			conditionStores: this._conditionStores
		});
		ac.addChild(fp);
		ac.selectChild(fp);
		fp.tbSingle.focus();
		fp._initCloseButton();
		fp._onColumnChange();
		try{
			fp.tbSingle.focus();
		}catch(e){}
		fp._updateTitle();
		dojo.toggleClass(ac.domNode, 'dojoxGridxFilterSingleRule', ac.getChildren().length === 1);
		
		this.connect(fp, 'onChange', '_updateButtons');
		this._updateButtons();
	},
	
	_initWidgets: function(){
		this._accordionContainer = dijit.byNode(dojo.query('.dijitAccordionContainer', this.domNode)[0]);
		this._sltMatch = dijit.byNode(dojo.query('.dijitSelect', this.domNode)[0]);
		var btns = dojo.query('.dijitButton', this.domNode);
		this._btnAdd = dijit.byNode(btns[0]);
		this._btnFilter = dijit.byNode(btns[1]);
		this._btnClear = dijit.byNode(btns[2]);
		this._btnCancel = dijit.byNode(btns[3]);
		this.connect(this._btnAdd, 'onClick', 'addRule');
		this.connect(this._btnFilter, 'onClick', 'done');
		this.connect(this._btnClear, 'onClick', 'clearFilter');
		this.connect(this._btnCancel, 'onClick', 'cancel');
		this.connect(this._accordionContainer, 'removeChild', '_updateButtons');
		this.connect(this._accordionContainer, 'removeChild', '_updatePaneTitle');
	},
	
	_initColumnOptions: function(){
		this._columnOptions = [{label: 'Any Column', value: ''}];
		dojo.forEach(this.grid.columns(), function(col){
			this._columnOptions.push({value: col.id, label: col.name()});
		}, this);
	},
	_updatePaneTitle: function(){
		// summary:
		//		Update each pane title. Only called after remove a RULE pane.
		dojo.forEach(this._accordionContainer.getChildren(), function(pane){
			pane._updateTitle();
		});
	},
	_updateButtons: function(){
		//toggle filter button disable
		var btnFilterDisabled = false;
		var children = this._accordionContainer.getChildren();
		for(var i = 0; i < children.length; i++){
			if(children[i].getResult().value === null){
				btnFilterDisabled = true;
				break;
			}
		}
		this._btnFilter.set('disabled', btnFilterDisabled);
		//toggle add rull button disable
		var c = this.grid.filterBar.maxRuleCount;
		this._btnAdd.set('disabled', children.length >= c && c > 0);
	}
});
});