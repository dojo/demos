define(["dojo/on","dojo/dom", "dojo/_base/array", "dojo/string", 
		"dojox/mobile/sniff",
		"dojox/mobile/iconUtils", 
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/ToggleButton"],
  function(on, dom, array, string, has, iconUtils, ToolBarButton){
	var template = "User clicked \"${label}\" button.";
	
	function registerClickHandler(id, label) {
		on(dom.byId(id), "click", function() {
			dom.byId("headingPane").innerHTML = string.substitute(
				template, {"label" : label});
		});
	};
	
	var config = [{
			id: "tbDefaultBtn",
			label: "Default"
		},{
			id: "tbRoundBtn",
			label: "Round"
		},{
			id: "tbToggleBtn",
			label: "Toggle"
		},{
			id: "tbNewBtn",
			label: "New"
		},{
			id: "tbHotBtn",
			label: "What\'s Hot"
		},{
			id: "tbGeniusBtn",
			label: "Genius"
		},{
			id: "tbRoundBtn",
			label: "Round"
		},{
			id: "tbBackBtn",
			label: "Back"
		},{
			id: "tbIconBtn1",
			label: "Icon 1"
		},{
			id: "tbIconBtn2",
			label: "Icon 2"
		},{
			id: "tbDomBtn",
			label: "Dom"
		}];
	
	return {
		init: function(){
			var button = new ToolBarButton({
				icon : (has("android") ? "images/tab-icons-25.png"
						: "images/tab-icons.png"),
						iconPos : (has("android") ? "24,0,24,24" : "29,0,29,29")
			}, "tbIconBtn2");
			button.startup();
			
			iconUtils.createDomButton(dom.byId("tbDomBtn"));
			array.forEach(config, function(conf){
				registerClickHandler(conf.id, conf.label);
			})
		}
	};
});
