define(["dojo", "dojo/string", "dojox/mobile", "dojox/mobile/ToolBarButton", "./_base"],
		function(dojo, string, mobile, ToolBarButton, _base){
	var template = "User clicked \"${label}\" button.";
	
	function registerClickHandler(id, label) {
		dojo.connect(dojo.byId(id), "click", this, function() {
			dojo.byId("headingPane").innerHTML = string.substitute(
				template, {"label" : label});
		});
	};

	dojo.subscribe("viewsRendered", function() {
		new ToolBarButton({
			icon : (_base.isAndroid ? "images/tab-icons-25.png"
					: "images/tab-icons.png"),
			iconPos : (_base.isAndroid ? "24,0,24,24" : "29,0,29,29")
		}, "tbIconBtn2");

		mobile.createDomButton(dojo.byId("tbDomBtn"));

		registerClickHandler("tbDefaultBtn", "Default");
		registerClickHandler("tbRoundBtn", "Round");
		registerClickHandler("tbToggleBtn", "Toggle");
		registerClickHandler("tbNewBtn", "New");
		registerClickHandler("tbHotBtn", "What\'s Hot");
		registerClickHandler("tbGeniusBtn", "Genius");
		registerClickHandler("tbBackBtn", "Back");
		registerClickHandler("tbIconBtn1", "Icon 1");
		registerClickHandler("tbIconBtn2", "Icon 2");
		registerClickHandler("tbDomBtn", "Dom");
	});
});
