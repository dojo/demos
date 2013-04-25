require([
	"dojo/ready","dojox/mobile","dojox/mobile/parser","dojox/mobile/compat","dojox/mobile/deviceTheme",
	"dojo/dom","dijit/registry","dojo/on", "dojo/topic", "dojo/_base/connect","dojo/_base/event","dojo/_base/NodeList",
	"dojo/_base/window","dojo/number","dojo/dom-geometry",
	"dojox/mobile/SpinWheel","dojo/data/ItemFileReadStore","dojox/data/CsvStore",
	"dojox/geo/charting/widget/Map","dojox/geo/charting/widget/Legend",
	"dojox/geo/charting/TouchInteractionSupport","dojox/geo/charting/MouseInteractionSupport"
],function(ready,mobile,parser,compat,deviceTheme,dom,widget,on,topic,connect,event,NodeList,window,number,
		domGeom,SpinWheel,ItemFileReadStore,CsvStore,Map,Legend,
		TouchInteractionSupport,MouseInteractionSupport){

	var startedInteraction = false;
	var selectedFeature;
	var mapWidget, yearSpinner, yearSlot, mapHeader, mapLegend;

	updateHeaderTitle = function(mapFeature){
		selectedFeature = mapFeature;
		var text = "US population from 1960 to 2009";
		if (selectedFeature) {
			var text = yearSlot.get("value") + 
				" "  + mapWidget.getInnerMap().mapObj.marker.markerData[mapFeature.id] +
				" pop. : " + (mapFeature.value / 1000000).toFixed(1) + "M";
		}
		mapHeader.innerHTML = text;
	};

	updateYear = function(e) {
		var newYear = yearSlot.get("value");
		mapWidget.getInnerMap().setDataBindingAttribute(newYear);
		if(selectedFeature){
			mapWidget.getInnerMap().onFeatureClick(selectedFeature); 
		}
	};

	getPopData = function(data){
			return number.parse(data,{locale:"en-us"}) * 1000; // population is expressed in thousands
	};


	layoutUI = function(){
		
		var screenSize = mobile.getScreenSize();
		
		var innerW = window.global.innerWidth, innerH = window.global.innerHeight,
			spinnerScale = 1.0, vertical = screenSize.h < screenSize.w ? false : true;

		var spinStyle = yearSpinner.style,
			mapWidgetStyle = mapWidget.domNode.style,
			height2 = domGeom.getMarginBox(mapHeader).h,
			height3 = domGeom.getMarginBox(yearSpinner).h,
			legendStyle = mapLegend ? mapLegend.style : {};
		
		if (vertical) {
			mapWidgetStyle.position = "relative";
			mapWidgetStyle.height = (innerH-height2-height3 * spinnerScale)+"px";
			mapWidgetStyle.width = innerW+"px";
			mapWidgetStyle.top = 0;
			mapWidgetStyle.left = 0;
			var spinW = 150;
			spinStyle.width = spinW - 6 + "px"; // (spinner has 2 * 3px borders..)
			spinStyle.position = "relative";
			legendStyle.top = (innerH-height3 * spinnerScale)+"px";
			legendStyle.left = spinW * spinnerScale + "px";
			legendStyle.height = height3 * spinnerScale + "px";
			legendStyle.width = innerW - (spinW * spinnerScale) + "px";
			legendStyle.margin = "0px 0px 0px 10px";
		} else {
			// horizontal layout
			var spinW = 120;
			spinStyle.width = spinW - 6 + "px"; // (spinner has 2 * 3px borders..)
			spinStyle.position = "absolute";
			legendStyle.height = height3 * spinnerScale + "px";
			legendStyle.width = spinW*spinnerScale + "px";
			
			if ((innerH-height2) > 2 * (height3  * spinnerScale)) {
				legendStyle.top = height3 * spinnerScale + height2 + "px";
				legendStyle.left = 0;
				legendStyle.borderSpacing="0px 0px";
				legendStyle.margin = "5px 0px 0px 5px";
				mapWidgetStyle.position = "absolute";
				mapWidgetStyle.height = (innerH - height2)+"px";
				mapWidgetStyle.width = (innerW -  spinW * spinnerScale) +"px";
				mapWidgetStyle.top = height2 +"px";
				mapWidgetStyle.left = spinW * spinnerScale +"px";
			} else {
				legendStyle.top = height2 +"px";
				legendStyle.left = spinW * spinnerScale +"px";
				legendStyle.margin = "0px 0px 0px 5px";
				mapWidgetStyle.position = "absolute";
				mapWidgetStyle.height = (innerH - height2)+"px";
				mapWidgetStyle.width = (innerW -  2 * spinW * spinnerScale) +"px";
				mapWidgetStyle.top = height2 +"px";
				mapWidgetStyle.left = 2 * spinW*spinnerScale +"px";
			}
		}	
		mapWidget.resize();
		if (!startedInteraction) {
			mapWidget.getInnerMap().fitToMapContents(3);
		}
	};	

	startDemo = function(){
		mapWidget = widget.byId("mapWidget");
		mapWidget.onFeatureClick = updateHeaderTitle;
		mapWidget.dataBindingValueFunction = getPopData;
		yearSlot = widget.byId("yearSlot");
		yearSpinner = dom.byId("yearSpinner");
		mapHeader = dom.byId("mapHeader");
		mapLegend = dom.byId("mapLegend");
		mapLegend.map = mapWidget.getInnerMap();

		layoutUI();

		var hYearSlotSpun = yearSlot.on("FlickAnimationEnd", updateYear);
		yearSlot.setInitialValue();
		
		on(window.doc,"touchmove",function(e){
			if (NodeList(e.target).parents("#mapLegend").length == 1) {
				event.stop(e);
			}
		});
		
		// prevent fitToMapContents once any interaction with map widget has occurred
		var surface = mapWidget.getInnerMap().surface;
		var callback1 = surface.connect("touchstart", this, function(e){
			startedInteraction = true;
			connect.disconnect(callback1);
		});
		var callback2 = surface.connect("onmousedown", this, function(e){
			startedInteraction = true;
			connect.disconnect(callback2);
		});
		topic.subscribe("/dojox/mobile/resizeAll", function(){
			layoutUI();
		//	window.global.scrollTo(0,0);
		});
		on(window.global, "resize", function(){
	//		layoutUI();
		//	window.global.scrollTo(0,0);
		});
		
		//on(window.global,"orientationchange", function(){
		//	layoutUI();
		//	window.global.scrollTo(0,0);
		//});
		
		mapWidget.startup();
	};

	ready(startDemo);

});
