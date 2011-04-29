define(["dojo", "dijit"], function(dojo, dijit) {
	/*dojo.subscribe("viewsLoaded", function(){
		var dataList = new dijit.form.DataList({}, "titlelist");
		new dojox.mobile.ComboBox({list:dataList}, "titlecombo");
	});*/
	
	dojo.subscribe("viewsRendered", function(){
		dijit.byId("alertSlider").focus = function(){};
		dojo.connect(dijit.byId("resetBtn"), "onClick", function(){
			dojo.byId("testForm").reset();
			dijit.byId("alertSwitch").set("value", "off");
			dijit.byId("alertSlider").set("value", 0);
			dijit.byId("alert-all").set("checked", false);
			dijit.byId("alert-urgent").set("checked", true);
		});
	});
});
