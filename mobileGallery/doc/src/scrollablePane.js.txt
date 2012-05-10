define(["dijit/registry",
		"dojox/mobile/parser",
		"dojox/mobile",
		"dojox/mobile/compat",
		"dojox/mobile/FixedSplitter",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/SwapView",
		"dojox/mobile/PageIndicator",
		"dojox/mobile/ScrollablePane"], 
		function(registry){
	return {
		init: function(){
			setTimeout(function(){ registry.byId("scrollablePane").resize(); }, 100);
		}
	};
});
