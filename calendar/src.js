
require(["dojo/ready", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/fx", "dojo/on", "dojo/date/locale", "dojo/parser",
			"dojo/dom", "dojo/dom-construct",
			"dojo/store/Memory", "dojo/store/Observable",
			"dojox/calendar/Calendar", "dijit/Calendar",  "dijit/TitlePane", "dijit/layout/BorderContainer",
			"dijit/layout/ContentPane", "dijit/form/CheckBox", "dijit/form/TextBox", "dijit/form/DateTextBox",
			"dijit/form/TimeTextBox", "dijit/form/Button", "dijit/form/ComboBox"
			],

		function(ready, declare, lang, arr, fx, on, locale, parser, dom, domConstruct,
			Memory, Observable, Calendar){

			ready(function(){

				calendar.set("cssClassFunc", function(item){
					// Use custom css classes on renderers depending of a parameter (calendar).
					return item.calendar == "cal1" ? "Calendar1" : "Calendar2"
				});

				// Calendar model creation

				var modelBase = [
					{day: 1, start: [10,00], duration: 1400},
					{day: 2, start: [10,30], duration: 120},
					{day: 2, start: [12,0], duration: 240},
					{day: 3, start: [6,0], duration: 180},
					{day: 3, start: [0,0], duration: 2880, allDay: true}
				];

				var someData = [];

				var startOfWeek = calendar.floorToWeek(new calendar.dateClassObj());

				for (var id=0; id<modelBase.length; id++) {
					var newObj = {
						id: id,
						summary: "New Event " + id,
						startTime: new calendar.dateClassObj(startOfWeek.getTime()),
						endTime: new calendar.dateClassObj(startOfWeek.getTime()),
						calendar: id%2 == 0 ? "cal1" : "cal2",
						allDay: modelBase[id].allDay
					}

					newObj.startTime = calendar.dateFuncObj.add(newObj.startTime, "day", modelBase[id].day);
					newObj.startTime.setHours(modelBase[id].start[0]);
					newObj.startTime.setMinutes(modelBase[id].start[1]);

					newObj.endTime = calendar.dateFuncObj.add(newObj.startTime, "minute", modelBase[id].duration);

					someData.push(newObj);
				}

				calendar.set("store", new Observable(new Memory({data: someData})));
				calendar.set("date", startOfWeek);

				calendar.on("gridDoubleClick", function(e){

					// create a event when double-clicking on grid.
					var start, end;
					var colView = calendar.columnView;
					var cal = calendar.dateFuncObj;

					if(e.source == colView){
						start = calendar.floorDate(e.date, "minute", colView.timeSlotDuration);
						end = cal.add(start, "hour", 1);
					}else{
						start = calendar.floorToDay(e.date);
						end = cal.add(start, "day", 1);
					}

					var item = {
						id: id,
						summary: "New event " + id,
						startTime: start,
						endTime: end,
						calendar: "cal1",
						allDay: e.source.viewKind == "matrix"
					};

					id++;
					calendar.store.add(item);

					calendar.set("selectedItem", item);
					calendar.get("currentView").set("focusedItem", item);

					selectionChanged(item);
				});


				var calendarVisibility = [true, true];

				var itemToRendererKindFunc = function(item){
					if(item.cssClass == "Calendar1" && calendarVisibility[0] ||
						item.cssClass == "Calendar2" && calendarVisibility[1]){
							return this._defaultItemToRendererKindFunc(item);
						}
					return null
				}

				calendar.columnView.set("itemToRendererKindFunc", itemToRendererKindFunc);
				calendar.columnView.secondarySheet.set("itemToRendererKindFunc", itemToRendererKindFunc);
				calendar.matrixView.set("itemToRendererKindFunc", itemToRendererKindFunc);

				var editedItem;

				selectionChanged = function(item){

					var itemNull = item == null;

					widgets = [itemSummaryEditor, itemStartDateEditor, itemStartTimeEditor, itemEndDateEditor,
						itemEndTimeEditor, calendarEditor, allDayCB, deleteItemButton, updateItemButton];

					arr.forEach(widgets, function(w){
						w.set("disabled", itemNull);
						w.set("value", null, false);
					});

					editedItem = itemNull ? null : lang.mixin({}, item);

					if(!itemNull){

						var allDay = item.allDay === true;

						itemStartTimeEditor.set("disabled", allDay);
						itemEndTimeEditor.set("disabled", allDay);

						itemSummaryEditor.set("value", item.summary);
						itemStartDateEditor.set("value", item.startTime);
						itemStartTimeEditor.set("value", item.startTime);
						itemEndDateEditor.set("value", item.endTime);
						itemEndTimeEditor.set("value", item.endTime);
						calendarEditor.set("value", item.calendar == "cal1" ? "Calendar 1" : "Calendar 2");
						allDayCB.set("checked", allDay, false);
					}
				}

				calendar.on("change", function(e){
					selectionChanged(e.newValue);
				});

				allDayCB.on("change", function(value){

					itemStartTimeEditor.set("disabled", value);
					itemEndTimeEditor.set("disabled", value);

					var d;
					if(value){
						d = itemStartTimeEditor.get("value");
						calendar.floorToDay(d, true);
						itemStartTimeEditor.set("value", d);
						d = itemEndTimeEditor.get("value");
						calendar.floorToDay(d, true);
						itemEndTimeEditor.set("value", d);

						if(!calendar.isStartOfDay(editedItem.endTime)){
							d = itemEndDateEditor.get("value");
							calendar.floorToDay(d, true);
							d = calendar.dateFuncObj.add(d, "day", 1);
							itemEndDateEditor.set("value", d);
						}

					}else{
						editedItem.startTime.setHours(8);
						editedItem.endTime.setHours(9);
						itemStartTimeEditor.set("value", editedItem.startTime);
						itemEndTimeEditor.set("value", editedItem.endTime);
						d = itemEndDateEditor.get("value");
						calendar.floorToDay(d, true);
						d = calendar.dateFuncObj.add(d, "day", -1);
						itemEndDateEditor.set("value", d);
					}

				});

				var mergeDateTime = function(isStart){
					var dateEditor = isStart ? itemStartDateEditor : itemEndDateEditor;
					var timeEditor = isStart ? itemStartTimeEditor : itemEndTimeEditor;
					var date = dateEditor.get("value");
					var time = timeEditor.get("value");
					date.setHours(time.getHours());
					date.setMinutes(time.getMinutes());
					return date;
				};

				updateItemButton.on("click", function(value){

					if (editedItem != null) {
						editedItem.summary = itemSummaryEditor.get("value");
						if(allDayCB.get("value")){
							if(!calendar.isStartOfDay(editedItem.startTime)){
								editedItem.startTime = calendar.floorToDay(itemStartDateEditor.get("value"), true);
							}
							if(!calendar.isStartOfDay(editedItem.endTime)){
								editedItem.endTime = calendar.floorToDay(itemEndDateEditor.get("value"), true);
							}
							editedItem.allDay = true;
						}else{
							editedItem.startTime = mergeDateTime(true);
							editedItem.endTime = mergeDateTime(false);
							delete editedItem.allDay;
						}

						var calValue = calendarEditor.get("value");
						editedItem.calendar = calValue == "Calendar 1" ? "cal1" : "cal2";
						calendar.store.put(editedItem);
					}

				});

				deleteItemButton.on("click", function(value){
					if (editedItem != null) {
						calendar.store.remove(editedItem.id);
					}
				});


				dateChooser.set("value", startOfWeek);
				dateChooser.on("change", function(e){
					var d = dateChooser.get("value");
					calendar.set("date", d);
				});

				calendar1CB.on("change", function(v){
					calendarVisibility[0] = v;
					calendar.currentView.invalidateLayout();
				});

				calendar2CB.on("change", function(v){
					calendarVisibility[1] = v;
					calendar.currentView.invalidateLayout();
				});

				fx.fadeOut({
					node:"loadingPanel",
					onEnd: function(node){
						node.parentNode.removeChild(node)
					}}).play(500);

			});
	});

/*
require(["dojo/i18n!dijit/nls/loading", "dojo/i18n!dijit/form/nls/validate"],
function(loading, validate){
  console.log(loading, validate);
});*/
