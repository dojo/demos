require([
	"dojo/ready", 
	"dojo/_base/lang", 
	"dojo/_base/fx", 
	"dojo/dom", 
	"demos/calendar/utils", 
	"demos/calendar/ExtendedCalendar",
	"dijit/layout/BorderContainer", 
	"dijit/layout/AccordionContainer", 
	"dijit/layout/ContentPane",
	"demos/calendar/MainProperties", 
	"demos/calendar/ColumnViewProperties", 
	"demos/calendar/MatrixViewProperties", 
	"demos/calendar/MonthColumnViewProperties"],

	function(
		ready, 
		lang, 
		fx,    
		dom, 
		utils, 
		Calendar){
	
		ready(function(){
		
			utils.initHints(dom.byId("hint"));
								
			calendar.set("cssClassFunc", function(item){
				// Use custom css class on renderers depending of a parameter (calendar).							
				return item.calendar == "cal1" ? "Calendar1" : "Calendar2";
			});
			
			calendar.set("store", utils.createDefaultStore(calendar));
			
			calendar.set("date", utils.getStartOfCurrentWeek(calendar));
			utils.configureInteractiveItemCreation(calendar);
							
			mainProperties.set("calendar", calendar);
			columnViewProperties.set("view", calendar.columnView);
			matrixViewProperties.set("view", calendar.matrixView);
			monthColumnViewProperties.set("view", calendar.monthColumnView);
									
			// Hide loading panel when application is ready
			fx.fadeOut({
				node:"loadingPanel", 
				onEnd: function(node){
					node.parentNode.removeChild(node)
				}}).play(500);
			});
	});