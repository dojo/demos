define([
'dojo',
'../core/_Module',
'dojox/html/metrics'
], function(dojo, _Module){
	
return _Module.registerModule(
dojo.declare('demos.gridx.src.modules.VScroller', _Module, {
	name: 'vscroller',

	forced: ['body', 'layout'],

	getAPIPath: function(){
		return {
			vScroller: this
		};
	},

	load: function(args, deferStartup){
		var _this = this, g = this.grid;
		this.domNode = g.vScrollerNode;
		this.stubNode = this.domNode.firstChild;
		dojo.style(this.domNode, 'width', dojox.html.metrics.getScrollbar().w + 'px');

		this.batchConnect(
			[this.domNode, 'onscroll', '_doScroll'],
			[g.bodyNode, 'onmousewheel', '_onMouseWheel'], 
			[g.body, 'onChange', '_onBodyChange'],
			[g.body, 'onRangeChange', '_onBodyRangeChange']
		);
		if(dojo.isFF){
			this.connect(g.bodyNode, 'DOMMouseScroll', '_onMouseWheel');
		}
		deferStartup.then(function(){
			dojo.when(_this._init(args), function(){
				_this.loaded.callback();	
			});
		});
	},

	//Public ----------------------------------------------------
	scrollToPercentage: function(percent){
		this.domNode.scrollTop = this.stubNode.style.clientHeight * percent / 100;
	},

	scrollToRow: function(rowIndex){
		var node = dojo.query('[rowindex="' + rowIndex + '"]', this.grid.bodyNode)[0];
		if(node){
			this.domNode.scrollTop = node.offsetTop;
		}
	},

	//Protected -------------------------------------------------
	_init: function(){
		return this._onBodyRangeChange(this.grid.body.logicalStart, this.grid.body.logicalCount);
	},

	_doScroll: function(){
		this.grid.bodyNode.scrollTop = this.domNode.scrollTop;
	},

	_onMouseWheel: function(e){
		var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
		this.domNode.scrollTop -= rolled;
	},

	_onBodyChange: function(start, count){
		dojo.style(this.stubNode, 'height', this.grid.bodyNode.scrollHeight + 'px');
		this._doScroll();
	},

	_onBodyRangeChange: function(start, count){
		return this.model.when({start: start, count: count}, function(){
			count = count || this.model.size() - start;
			this.grid.body.renderRows(start, count);
		}, this);
	}
}));
});

