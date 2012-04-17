define(["dojo/_base/connect",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/ready",
		"dojo/_base/array",
		"dijit/registry",
		"dojo/on",
		"dojox/mobile/parser",
		"dojox/mobile/compat",
		"dojox/mobile/View",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/ProgressBar",
		"dojox/mobile/ProgressIndicator",
		"dojox/mobile/TabBar",
		"dojox/mobile/TabBarButton",
		"dojox/mobile/Button"], 
	function(connect, dom, domClass, ready, array, registry, on) {
	return {
		init: function(){
			ready(function(){
				var progressBar1 = registry.byId("progressBar1");
				var v = 0;
				var timer = setInterval(function(){
					progressBar1.set("value", v);
					progressBar1.set("label", v);
					if(v >= 200){ clearTimeout(timer); }
					v += 40;
				}, 1000);
			});

			update = function(v){
				var progB1 = registry.byId("progressBar1");
				progB1.set("value", v);
				progB1.set("label", v);
			};
			
			on(registry.byId("progressBar1"), "change", function(value, max, percent){
				var msg = percent + "% " + value + "/" + max;
				dom.byId("progressBarStatusMsg").innerHTML = msg;
			});
			
			progressIndicatorStateImpl = function(v){
				var progressIndicatorArray = [];
				var elem = registry.byId("progressIndicator1");
				progressIndicatorArray.push(elem);
				elem = registry.byId("progressIndicator2");
				progressIndicatorArray.push(elem);
				elem = registry.byId("progressIndicator3");
				progressIndicatorArray.push(elem);
				elem = registry.byId("progressIndicator4");
				progressIndicatorArray.push(elem);
				array.forEach(progressIndicatorArray, function(elem) {
					if(v){
						elem.stop(); // Would be if start would handle multiple starts gracefully
						elem.start();
					}else{
			    		elem.stop();
			    	}
				});
			};
			
			startProgressIndicator = function(){
				progressIndicatorStateImpl(true/*start*/);
			};
			stopProgressIndicator = function(){
				progressIndicatorStateImpl(false/*start*/);
			};
		}
	};
});
