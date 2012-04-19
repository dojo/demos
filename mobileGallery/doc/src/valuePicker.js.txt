define([
	"dijit/registry",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojo/dom", 
	"dojo/ready", 
	"dojox/mobile/compat",
	"dojox/mobile/DatePicker",
	"dojox/mobile/TimePicker"
	], function(registry) {

	gotoToday = function(){
		registry.byId("picker1").reset();
	}
	showSelectedValue = function(){
		var w = registry.byId("picker1");
		document.getElementById("msg").innerHTML = w.slots[0].get("value") + ":" + w.slots[1].get("value") + ":" + w.slots[2].get("value");
	}
	gotoNow = function(){
		registry.byId("picker2").reset();
	}
	showSelectedTime = function(){
		var w = registry.byId("picker2");
		document.getElementById("msg2").innerHTML = w.slots[0].get("value") + ":" + w.slots[1].get("value");
	}

});
