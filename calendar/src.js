require(["dojo/ready", "dojo/_base/lang", "dojo/_base/sniff", "dojo/_base/array", "dojo/_base/fx", "dojo/on",
         "dojo/date/locale", "dojo/parser",	"dojo/dom", "dojo/dom-construct",	"dojo/store/Memory",
         "dojo/store/Observable",	"dojox/calendar/Calendar", "dijit/Calendar",  "dijit/TitlePane",
         "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/form/CheckBox",
         "dijit/form/TextBox", "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
         "dijit/form/Button", "dijit/form/ComboBox", "dijit/Menu", "dijit/MenuItem"],

	function(ready, lang, has, arr, fx, on, locale, parser, dom, domConstruct,
		Memory, Observable, Calendar){

		ready(function(){

			// Display different hint every 10 seconds
			var hints = [
				"Hint: Create an event by clicking and dragging on the grid while maintaining the control key",
				"Hint: Move an event by clicking on it and dragging it",
				"Hint: Resize an event by clicking on one of its ends and dragging it"
			];

			hintIdx = 0;
			dom.byId("hint").innerHTML = hints[0];

			setInterval(function(){
				fx.fadeOut({node: "hint",
					onEnd: function(){
						hintIdx = hintIdx+1>hints.length-1 ? 0 : hintIdx+1;
						dom.byId("hint").innerHTML = hints[hintIdx];
						fx.fadeIn({node: "hint"}).play(500);
					}
				}).play(500);
			}, 10000);


			calendar.set("cssClassFunc", function(item){
				// Use custom css class on renderers depending of a parameter (calendar).
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

				newObj.startTime = calendar.dateModule.add(newObj.startTime, "day", modelBase[id].day);
				newObj.startTime.setHours(modelBase[id].start[0]);
				newObj.startTime.setMinutes(modelBase[id].start[1]);

				newObj.endTime = calendar.dateModule.add(newObj.startTime, "minute", modelBase[id].duration);

				someData.push(newObj);
			}

			calendar.set("store", new Observable(new Memory({data: someData})));
			calendar.set("date", startOfWeek);

			// Enable creation of event interactively by ctrl clicking grid.
			var createItem = function(view, d, e){

				var cal1 = calendar1CB.get("checked");
				var cal2 = calendar2CB.get("checked");

				// create item by maintaining control key
				if(!e.ctrlKey || e.shiftKey || e.altKey || (!cal1 && !cal2)){
					return null;
				}

				// create a new event
				var start, end;
				var colView = calendar.columnView;
				var cal = calendar.dateModule;

				if(view == colView){
					start = calendar.floorDate(d, "minute", colView.timeSlotDuration);
					end = cal.add(start, "minute", colView.timeSlotDuration);
				}else{
					start = calendar.floorToDay(d);
					end = cal.add(start, "day", 1);
				}

				var item = {
					id: id,
					summary: "New event " + id,
					startTime: start,
					endTime: end,
					calendar: cal1 ? "cal1" : "cal2",
					allDay: view.viewKind == "matrix"
				};

				id++;

				return item;
			}

			calendar.set("createOnGridClick", true);
			calendar.set("createItemFunc", createItem);

			// filter out event according to their calendar
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

			// show context menu on right clicking an event
			calendar.on("itemContextMenu", function(e){
				dojo.stopEvent(e.triggerEvent);
				calendarContextMenu._openMyself({
					target: e.renderer.domNode,
					coords: {x: e.triggerEvent.pageX, y: e.triggerEvent.pageY}
				});
			});

			contextMenuDelete.on("click", function(){
				arr.forEach(calendar.selectedItems, function(item){
					calendar.store.remove(item.id);
				});
			});

			// refresh item panel on event selection.
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

			calendar.on("itemEditEnd", function(e){
				selectionChanged(e.item);
			});

			// configure item properties panel
			calendar.on("timeIntervalChange", function(e){
				dateChooser.set("value", e.startTime);
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
						d = calendar.dateModule.add(d, "day", 1);
						itemEndDateEditor.set("value", d);
					}

				}else{
					editedItem.startTime.setHours(8);
					editedItem.endTime.setHours(9);
					itemStartTimeEditor.set("value", editedItem.startTime);
					itemEndTimeEditor.set("value", editedItem.endTime);
					d = itemEndDateEditor.get("value");
					calendar.floorToDay(d, true);
					d = calendar.dateModule.add(d, "day", -1);
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

			// Synchronize date picker.
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

			// Hide loading panel when application is ready
			fx.fadeOut({
				node:"loadingPanel",
				onEnd: function(node){
					node.parentNode.removeChild(node)
				}}).play(500);


		});
});