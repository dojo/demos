define([
	"dojo/_base/kernel",
	"../core/_Module",
	"./VScroller",
	"dojox/mobile/_ScrollableMixin",
	"dojo/_base/declare",
	"dojo/_base/html"
], function(dojo, _Module, VScroller){
	return _Module.registerModule(dojo.declare("demos.gridx.src.modules.TouchScroller", VScroller, {

		name: "touchScroller",

		getAPIPath: function(){
			return {touchScroller: this};
		},

		load: function(args, deferStartup){
			this.inherited(arguments);

			dojo.style(this.domNode, "display", "none");
			var grid = this.grid;
			dojo.style(grid.mainNode, "overflow", "hidden");
			dojo.style(grid.bodyNode, "height", "auto");
			dojo.style(grid.headerNode.firstChild.firstChild, "margin-right", "0px"); // FIXME: Header assumes VScroller

			var scrollable = new dojox.mobile.scrollable(dojo, dojox);
			scrollable.init({domNode: grid.mainNode, containerNode: grid.bodyNode, noResize: true});
		}

	}));
});