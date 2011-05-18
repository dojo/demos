define(["dojo/_base/html", // dojo.byId
        "dojo/_base/connect", // dojo.connect
        "dijit/_base/manager", // dijit.byId
        "dojox/mobile/TextBox",
        "dojox/mobile/TextArea",
        "dojox/mobile/CheckBox",
        "dojox/mobile/RadioButton",
        "dojox/mobile/Slider"], function() {
	/*dojo.subscribe("viewsLoaded", function(){
		var dataList = new dijit.form.DataList({}, "titlelist");
		new dojox.mobile.ComboBox({list:dataList}, "titlecombo");
	});*/
	return {
		init: function(){
			dijit.byId("alertSlider").focus = function(){};
			dojo.connect(dijit.byId("resetBtn"), "onClick", function(){
				// roll back all form inputs
				dojo.byId("testForm").reset();
				dijit.byId("alertSwitch").set("value", "off");
				dijit.byId("alertSlider").set("value", 0);
				dijit.byId("alert-all").set("checked", false);
				dijit.byId("alert-urgent").set("checked", true);
			});
		}
	};
});
