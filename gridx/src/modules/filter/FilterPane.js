define([
	"dojo/_base/kernel",
	"dijit",
	"dojo/text!../../templates/FilterPane.html",
	"dijit/layout/ContentPane",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/RadioButton",
	"./Filter",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/query"
], function(dojo, dijit, template){

	return dojo.declare('demos.gridx.src.modules.filter.FilterPane', dijit.layout.ContentPane, {
		content: template,
		sltColumn: null,
		sltCondition: null,
		columnOptions: null,
		conditionStores: null,
		grid: null,
		postCreate: function(){
			this.inherited(arguments);
			this._initFields();
			this.sltColumn.addOption(dojo.clone(this.columnOptions));
			this.connect(this.sltColumn, 'onChange', '_onColumnChange');
			this.connect(this.sltCondition, 'onChange', '_onConditionChange');
		},
		getExpression: function(){
			var F = demos.gridx.src.modules.filter.Filter;
			var condition = this.sltCondition.get('value');
			return F[condition](this.grid.column(this.sltCondition.get('value'), this._getDataType()));
		},
		getResult: function(){
			// summary:
			//	Get the state of the pane for storage.
			return {
				colId: this.sltColumn.get('value'),
				condition: this.sltCondition.get('value'),
				value: this._getValue()
			};
		},
		setState: function(){
			// summary:
			//	Set the state of the pane to restore UI.
		},
		close: function(){
			var container = this._getContainer();
			container.removeChild(this);
			if(container.getChildren().length === 1){
				dojo.addClass(container.domNode, 'dojoxGridxFilterSingleRule');
			}
		},
		onChange: function(){
			//event:
		},
		
		_getContainer: function(){
			return dijit.byNode(this.domNode.parentNode.parentNode.parentNode);
		},
		_initFields: function(){
			this.sltColumn = dijit.byNode(dojo.query('li>table', this.domNode)[0]);
			this.sltCondition = dijit.byNode(dojo.query('li>table', this.domNode)[1]);
			var fields = this._fields = [
				this.tbSingle = dijit.byNode(dojo.query('.dojoxGridxFilterPaneTextWrapper > .dijitTextBox', this.domNode)[0]),
				this.sltSingle = dijit.byNode(dojo.query('.dojoxGridxFilterPaneSelectWrapper > .dijitSelect', this.domNode)[0]),
				this.dtbSingle = dijit.byNode(dojo.query('.dojoxGridxFilterPaneDateWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbStart = dijit.byNode(dojo.query('.dojoxGridxFilterPaneDateRangeWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbEnd = dijit.byNode(dojo.query('.dojoxGridxFilterPaneDateRangeWrapper > .dijitDateTextBox', this.domNode)[1]),
				this.ttbStart = dijit.byNode(dojo.query('.dojoxGridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox', this.domNode)[0]),
				this.ttbEnd = dijit.byNode(dojo.query('.dojoxGridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox', this.domNode)[1]),
				this.rbTrue = dijit.byNode(dojo.query('.dojoxGridxFilterPaneRadioWrapper > .dijitRadio', this.domNode)[0]),
				this.rbFalse = dijit.byNode(dojo.query('.dojoxGridxFilterPaneRadioWrapper > .dijitRadio', this.domNode)[1])
			];
			
			this.rbTrue.domNode.nextSibling.htmlFor = this.rbTrue.id;
			this.rbFalse.domNode.nextSibling.htmlFor = this.rbFalse.id;
			var name = 'rb_name_' + Math.random();
			this.rbTrue.set('name', name);
			this.rbFalse.set('name', name);
			
			dojo.forEach(fields, function(field){
				this.connect(field, 'onChange', '_onValueChange');
			}, this);
		},
		_initCloseButton: function(){
			//summary:
			//	Add a close button for the accordion pane.
			//  Must be called after adding to an accordion container.
			
	        var btnWidget = this._buttonWidget;
	        var closeButton = dojo.create('span', {
	            className: 'dojoxGridxFilterPaneCloseButton'
	            ,innerHTML: '<img src="' + this._blankGif + '"/>'
	            ,title: 'Close'
	        }, btnWidget.domNode, 'first');
	        this.connect(closeButton, 'onclick', 'close');
	    },
	    
	    _onColumnChange: function(){
	    	var conditionStores = this.grid.filterBar._conditionStores;
	    	var store = conditionStores[this._getDataType()];
	    	if(!store){store = conditionStores['string'];}
	    	this.sltCondition.setStore(store);
	    	this._updateTitle();
	    	this.onChange();
	    },
	    _onConditionChange: function(){
	    	this._updateValueField();
	    	this._updateTitle();
	    	this.onChange();
	    },
	    _onValueChange: function(){
	    	this._updateTitle();
	    	this.onChange();
	    },
	    _getDataType: function(){
	    	//summary:
	    	//		Get current column data type
	    	var colid = this.sltColumn.get('value');
	    	var dataType = 'string';
	    	if(colid !== ''){
	    		dataType = this.grid.column(colid).dataType();
	    	}
	    	return dataType;
	    },
	    _getType: function(){
	    	//summary:
	    	//	Get current filter type, determined by data type and condition.
	    	var mapping = {'string': 'Text', number: 'Text', date: 'Date', time: 'Time', 'boolean': 'Radio'};
	    	var type = mapping[this._getDataType()];
	    	if('range' == this.sltCondition.get('value')){type += 'Range';} ;
	    	return type;
	    },
	    _updateTitle: function(){
	    	var title;
	    	if(this._getValue() !== null){
				title = this.sltColumn.get('displayedValue') + this._getValueString();
	    	}else{
	    		title = 'Rule ' + (dojo.indexOf(this._getContainer().getChildren(), this) + 1);
	    	}
	    	this._buttonWidget.titleTextNode.innerHTML = title;
		},
		_getValueString: function(){
			
			var condition = this.sltCondition.get('displayedValue') ;
			return '&nbsp; <span style="font-style:italic">' + condition + '</span>&nbsp;' + this._getValue();
		},
	    _updateValueField: function(){
	    	// summary:
	    	//	Update the UI for field to show/hide fields.
	    	dojo.forEach(['Text','Date', 'DateRange', 'Time', 'TimeRange', 'Select', 'Radio'], function(cls){
	    		dojo.removeClass(this.domNode, 'dojoxGridxFilterPane' + cls);
	    	}, this);
			dojo.addClass(this.domNode, 'dojoxGridxFilterPane' + this._getType());
			var disabled = this.sltCondition.get('value') === 'isEmpty';
			dojo.forEach(this._fields, function(f){f.set('disabled', disabled)});
	    },
	    _getValue: function(){
	    	// summary:
	    	//		Get current filter value
	    	var type = this._getType();
	    	switch(type){
	    		case 'Text':
	    			return this.tbSingle.get('value') || null;
	    		case 'Select':
	    			return this.sltSingle.get('value') || null;
	    		case 'Date':
	    			return this.dtbSingle.get('value') || null;
	    		case 'DateRange':
	    			return {start: this.dtbStart.get('value'), end: this.dtbEnd.get('value')};
	    		case 'Time':
	    			return this.dtbSingle.get('value') || null;
	    		case 'TimeRange':
	    			return {start: this.ttbStart.get('value'), end: this.ttbEnd.get('value')};
	    		case 'Radio':
	    			return !!this.rbTrue.get('checked');
	    		default:
	    			return null;
	    	}
	    }
	});
});