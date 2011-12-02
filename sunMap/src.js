var sunDemo;

require(["dojo/ready",
		 "dojo/_base/connect",
		 "demos/sunMap/src/SunDemo",
		 "dijit/layout/ContentPane",
		 "dijit/form/HorizontalSlider",
		 "dijit/form/HorizontalRuleLabels",
		 "dijit/form/Textarea",
		 "dijit/form/CheckBox",
		 "dijit/Menu",
		 "dijit/MenuItem",
		 "dijit/CheckedMenuItem",
		 "dijit/PopupMenuItem",
		 "dojo/parser"], function(ready, connect, SunDemo){

	ready(function(){
		sunDemo = new SunDemo("map");
		updateSliders();
		connect.connect(sunDemo, "updateFeatures", this, updateText);
	});

	function updateSliders(){
		var dateSlider = dijit.byId("date");
		dateSlider.set("value", sunDemo.getDay());

		var bissextile = new Date(sunDemo.sun.getDate().getFullYear(), 2, 0).getDate() == 29;
		dateSlider.set("maximum", (bissextile ? 366 : 365));
		
		var timeSlider = dijit.byId("time");
		timeSlider.set("value", sunDemo.getHour());
	}

	function updateText(){
		var ta = dijit.byId("textArea");
		var s = sunDemo.sun.getDate().toString();
		ta.set('value', s);
	}
});
