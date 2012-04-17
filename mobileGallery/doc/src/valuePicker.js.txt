define(["dojo/date/locale", "dojo/dom", "dojo/ready", "dijit/registry", "dojox/mobile/ProgressIndicator", "dojox/mobile/parser", "dojox/mobile", "dojox/mobile/compat", "dojox/mobile/SimpleDialog", "dojox/mobile/Button", "dojox/mobile/ValuePickerDatePicker", "dojox/mobile/ValuePickerTimePicker"], function(locale, dom, ready, registry, ProgressIndicator) {
	var date;
	show = function(dlg){
		if(dlg == "dlg1"){
			date = registry.byId("picker1").get("values");
		} else if(dlg == "dlg2"){
			date = registry.byId("picker2").get("values");
		}
		registry.byId(dlg).show();
	};
	hide = function(dlg){
		registry.byId(dlg).hide();
	};
	cancel = function(dlg){
		if(dlg == "dlg1"){
			registry.byId("picker1").set("values", date);
		} else if(dlg == "dlg2"){
			registry.byId("picker2").set("values", date);
		}
		registry.byId(dlg).show();
		hide(dlg);
	};
	// Dialog Box
	updateDateDialog = function(){
		var d = registry.byId("picker1").get("date");
		if(d){
			dom.byId("msg1").innerHTML = locale.format(d, {
				formatLength : "full",
				selector : "date"
			});
		}
	};
	updateTimeDialog = function(){
		var d = registry.byId("picker2").get("date");
		if(d){
			dom.byId("msg2").innerHTML = locale.format(d, {
				timePattern : is24h ? "H:mm" : "h:mm a",
				selector : "time"
			});
		}
	};
	onValueChanged1 = function(){
		updateDateDialog();
	};
	onValueChanged2 = function(){
		updateTimeDialog();
	};
	// ListItem
	updateDateListItem = function(){
		var d = registry.byId("picker1").get("date");
		if(d){
			dom.byId("dateMsg").innerHTML = locale.format(d, {
				formatLength : "short",
				selector : "date"
			});
		}
	};
	updateTimeListItem = function(){
		var d = registry.byId("picker2").get("date");
		if(d){
			dom.byId("timeMsg").innerHTML = locale.format(d, {
				timePattern : is24h ? "H:mm" : "h:mm a",
				selector : "time"
			});
		}
	};
	setDate = function(){
		updateDateListItem();
		hide('dlg1');
	};
	setTime = function(){
		updateTimeListItem();
		hide('dlg2');
	};
	is24h = true;
	use24h = function(){
		var listItem = registry.byId("item1")
		if(is24h){
			listItem.set("rightIcon", "mblDomButtonCheckboxOff");
			dom.byId("use24hMsg").innerHTML = "1:00 pm";
			registry.byId("picker2").set("is24h", false);
		} else {
			listItem.set("rightIcon", "mblDomButtonCheckboxOn");
			dom.byId("use24hMsg").innerHTML = "13:00";
			registry.byId("picker2").set("is24h", true);
		}
		is24h = !is24h;
		updateTimeDialog();
		updateTimeListItem();
	};
	ready(function(){
		updateDateListItem();
		updateTimeListItem();
		//				show("dlg1");
	})
});
