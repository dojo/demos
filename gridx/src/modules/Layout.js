define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/DeferredList",
	"dojo/_base/html"
], function(dojo, _Module){

	return _Module.registerModule(
	dojo.declare('demos.gridx.src.modules.Layout', _Module, {
		name: 'layout',
		getAPIPath: function(){
			return {
				layout: this
			};
		},
	
		load: function(args, startup){
			var _this = this;
			startup.then(function(){
				if(_this._defs && _this._mods){
					(new dojo.DeferredList(_this._defs)).then(function(){
						_this._layout();
						_this.loaded.callback();
					});	
				}else{
					_this.loaded.callback();
				}	
			});
		},
	
		//Public ---------------------------------------------------------------------
		register: function(mod, nodeName, hookPoint, priority, deferReady){
			// summary:
			//		When the 'mod' is loaded or "ready", hook 'mod'['nodeName'] to grid['hookPoint'] with priority 'priority'
			// mod: Object
			//		The module object
			// nodeName: String
			//		The name of the node to be hooked. Must be able to be accessed by mod[nodeName]
			// hookPoint: String
			//		The name of a hook point in grid.
			// priority: Number?
			//		The priority of the hook node. If less than 0, then it's above the base node, larger than 0, below the base node.
			this._defs = this._defs || [];
			this._mods = this._mods || {};
			this._mods[hookPoint] = this._mods[hookPoint] || [];
			this._defs.push(deferReady || mod.loaded);
			this._mods[hookPoint].push({
				p: priority || 0,
				mod: mod,
				nodeName: nodeName
			});
		},
		
		reLayout: function(){
			var hookPoint, freeHeight = 0, node, g = this.grid;
			for(hookPoint in this._mods){
				node = g[hookPoint];
				if(node){
					freeHeight += dojo.marginBox(node).h;	
				}
			}
			var h = dojo.contentBox(g.domNode).h - freeHeight;
			dojo.style(g.mainNode, "height", h + "px");
		},
		
		_layout: function(){
			var hookPoint, freeHeight = 0, node, i, mod, nodeName, g = this.grid;
			for(hookPoint in this._mods){
				node = g[hookPoint];
				if(node){
					this._mods[hookPoint].sort(function(a, b){
						return a.p - b.p;
					});
					for(i = 0; i < this._mods[hookPoint].length; ++i){
						mod = this._mods[hookPoint][i].mod;
						nodeName = this._mods[hookPoint][i].nodeName;
						if(mod && mod[nodeName]){
							node.appendChild(mod[nodeName]);
						}
					}
					freeHeight += dojo.marginBox(node).h;	
				}
			}
			var h = dojo.contentBox(g.domNode).h - freeHeight;
			dojo.style(g.mainNode, "height", h + "px");
		}
	}));
});