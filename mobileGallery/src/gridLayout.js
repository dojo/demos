define(["dojo/_base/connect",
		"dojo/dom",
		"dojo/ready",
		"dijit/registry",
		"dojox/mobile/TransitionEvent",
		"dojox/mobile/iconUtils",
		"dojox/mobile/parser",
		"dojox/mobile",
		"dojox/mobile/compat",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/GridLayout",
		"dojox/mobile/Pane",
		"dojox/mobile/Button",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/TextBox"], 
		function(connect, dom, ready, registry, TransitionEvent, iconUtils) {
	return {
		init: function(){
			ready(function(){
				iconUtils.createDomButton(dom.byId("MinusGridLayout"));
				iconUtils.createDomButton(dom.byId("PlusGridLayout"));
			});

			goToSubMenu = function(id){
				var widget = registry.byId("pane1GridLayout");
				var opts = {moveTo: "view2GridLayout", transition: "slide", transitionDir: 1};
				var ev = new TransitionEvent(widget.domNode, opts);
				ev.dispatch();
			};

			goToOrder = function(id){
				var widget = registry.byId("pane2-1GridLayout");
				var opts = {moveTo: "view3GridLayout", transition: "slide", transitionDir: 1};
				var ev = new TransitionEvent(widget.domNode, opts);
				ev.dispatch();
			};


			plus = function(){
				var widget = registry.byId("numGridLayout");
				valueInt = parseInt(widget.textbox.value);
				valueInt = isNaN(valueInt) ? 0 : valueInt + 1;
				widget.textbox.value = valueInt.toString();
			};

			minus = function(){
				var widget = registry.byId("numGridLayout");
				valueInt = parseInt(widget.textbox.value);
				valueInt = isNaN(valueInt) || valueInt <= 0 ? 0 : valueInt - 1;
				widget.textbox.value = valueInt.toString();
			};
			
			cancel = function(){
				var widget = registry.byId("cancelGridLayout");
				var opts = {moveTo: "view2GridLayout", transition: "slide", transitionDir: -1};
				var ev = new TransitionEvent(widget.domNode, opts);
				ev.dispatch();
			};

			ok = function(){
				var widget = registry.byId("okGridLayout");
				var opts = {moveTo: "view1GridLayout", transition: "fade", transitionDir: -1};
				var ev = new TransitionEvent(widget.domNode, opts);
				ev.dispatch();
			};
		}
	};
});
