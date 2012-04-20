define([
	"dijit/registry",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojo/dom", 
	"dojo/ready", 
	"dojox/mobile/compat",
	"dojox/mobile/TabBar",
	"dojox/mobile/TabBarButton",
	"dojox/mobile/Heading",
	"dojox/mobile/ToolBarButton",
	"dojox/mobile/SpinWheelDatePicker",
	"dojox/mobile/ValuePickerDatePicker",
	"dojox/mobile/SpinWheelTimePicker",
	"dojox/mobile/ValuePickerTimePicker"
	], function(registry){

	gotoToday = function(){
		registry.byId("picker1").reset();
	}
	showSelectedValue = function(){
		var w = registry.byId("picker1");
		document.getElementById("msg").innerHTML = w.slots[0].get("value") + ", " + w.slots[1].get("value") + " " + w.slots[2].get("value");
	}
	gotoNow = function(){
		registry.byId("picker2").reset();
	}
	showSelectedTime = function(){
		var w = registry.byId("picker2");
		document.getElementById("msg2").innerHTML = w.slots[0].get("value") + ":" + w.slots[1].get("value");
	}
	resetValuePickers = function(){
		registry.byId("picker3").reset();		
		registry.byId("picker4").reset();		
	}
	showPickedValues = function(){
		var dw = registry.byId("picker3");
		var tw = registry.byId("picker4");
		var values = tw.get("values");
		document.getElementById("msg3").innerHTML = dw.slots[0].get("value") + ", " + dw.slots[1].get("value") + " " + dw.slots[2].get("value") + ", "+ values[0] + ":" + values[1];		
	}
});
