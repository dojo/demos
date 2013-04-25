define(["dojo/dom","dojo/on","dijit/registry",
		"dojox/mobile/TextBox",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextArea",
		"dojox/mobile/CheckBox",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Slider",
		"dojox/mobile/FormLayout"], function(dom, on, registry) {
	return {
		init: function(){
			registry.byId("alertSlider").focus = function(){};
			on(registry.byId("resetBtn"), "click", function(){
				// roll back all form inputs
				dom.byId("testForm").reset();
				registry.byId("alertSwitch").set("value", "off");
				registry.byId("alertSlider").set("value", 0);
				registry.byId("alert-all").set("checked", false);
				registry.byId("alert-urgent").set("checked", true);
			});
		}
	};
});
