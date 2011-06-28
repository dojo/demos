define([
	"dojo/_base/kernel",
	"./core/Core",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Grid.html",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(dojo, Core, _Widget, _TemplatedMixin, template){
	var dummyFunc = function(){};
	
	return dojo.declare('demos.gridx.src.Grid', [_Widget, _TemplatedMixin, Core], {
		templateString: template,
	
		postMixInProperties: function(){
			this.modules = [
				//Put default modules here!
			].concat(this.modules || []);
			this._initEvents();
			this.reset(this);
		},
	
		postCreate: function(){
			this.inherited(arguments);
			this._deferStartup = new dojo.Deferred();
			this._loadModules(this._deferStartup).then(dojo.hitch(this, this.onModulesLoaded));
		},
	
		startup: function(){
			this.inherited(arguments);
			this._deferStartup.callback();
		},
	
		destroy: function(){
			this._uninit();
			this.inherited(arguments);
		},
	
		onModulesLoaded: function(){},
		
		//event handling begin
		_compNames: ['Cell', 'HeaderCell', 'Row', 'Header'],
	
		_eventNames: ['Click', 'DblClick', 
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'],
	
		_initEvents: function(){
			dojo.forEach(this._compNames, function(comp){
				dojo.forEach(this._eventNames, function(event){
					var evtName = 'on' + comp + event;
					if(!this[evtName]){
						this[evtName] = dummyFunc;
					}
				}, this);
			}, this);
		},
	
		_connectEvents: function(node, connector, scope){
			dojo.forEach(this._eventNames, function(eventName){
				this.connect(node, 'on' + eventName.toLowerCase(), dojo.hitch(scope, connector, eventName));
			}, this);
		},
	
		_isConnected: function(eventName){
			return this[eventName] !== dummyFunc;
		}
		//event handling end
	});
});