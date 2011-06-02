define(['dojo', '../core/_Module'], function(dojo, _Module){

return _Module.registerModule(
dojo.declare('demos.gridx.src.modules.HScroller', _Module, {
	name: 'hscroller',

	required: ['layout'],

	getAPIPath: function(){
		return {
			hScroller: this,
			onHScroll: function(){}
		};
	},

	load: function(args){
		this.grid.layout.register(this, 'domNode', 'footerNode', 0);
		this.domNode = this.grid.hScrollerNode;
		this.stubNode = this.domNode.firstChild;
		this.connect(this.grid.body, 'onChange', 'update');
		this.connect(this.domNode, 'onscroll', '_doScroll');
		this.loaded.callback();
	},
	
	//Public API-----------------------------------------------------------
	update: function(){
		var cn = this.grid.bodyNode;
		dojo.style(this.domNode, 'width', cn.offsetWidth + 'px');
		dojo.style(this.stubNode, 'width', cn.scrollWidth + 'px');
		this._sync();
	},
	
	//Private-----------------------------------------------------------
	_doScroll: function(e){
		this._sync();
	},
	
	_sync: function(){
		var scrollLeft = this.domNode.scrollLeft;
		this.grid.bodyNode.scrollLeft = scrollLeft;
		this.grid.onHScroll(scrollLeft);
	}
}));
});
