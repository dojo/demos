define(["dojo/_base/connect", // dojo.connect
		"dojo/_base/html", // dojo.byId
		"dojo/_base/array", // dojo.array
		"dojo/string", "dojox/mobile", "dojox/mobile/ToolBarButton", "./_base"],
		function(){
	var template = "User clicked \"${label}\" button.";
	
	function registerClickHandler(id, label) {
		dojo.connect(dojo.byId(id), "click", this, function() {
			dojo.byId("headingPane").innerHTML = dojo.string.substitute(
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
			new dojox.mobile.ToolBarButton({
				icon : (demos.mobileGallery.src._base.isAndroid ? "images/tab-icons-25.png"
						: "images/tab-icons.png"),
						iconPos : (demos.mobileGallery.src._base.isAndroid ? "24,0,24,24" : "29,0,29,29")
			}, "tbIconBtn2");
			
			dojox.mobile.createDomButton(dojo.byId("tbDomBtn"));
			dojo.forEach(config, function(conf){
				registerClickHandler(conf.id, conf.label);
			})
		}
	};
});
