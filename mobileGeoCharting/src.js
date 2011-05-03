dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile");
dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");
dojo.require("dojox.geo.charting.widget.Map");
dojo.require("dojox.geo.charting.widget.Legend");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.geo.charting.TouchInteractionSupport");
dojo.require("dojox.geo.charting.MouseInteractionSupport");
dojo.require("dojox.data.CsvStore");
dojo.require("dojox.mobile.SpinWheel");


dojo.addOnLoad(function() {

	configureUI();
	
	// init widget
	var mapWidget = dijit.byId("mapWidget");				
	mapWidget.startup();
	
	
	var changeYear = function() {
		var newYear = dijit.byId("yearSlot").getValue();
		var map = dijit.byId("mapWidget").getInnerMap();
		map.setDataBindingAttribute(newYear);
	};

	dojo.connect(dijit.byId("yearSlot"), "onFlickAnimationEnd",this, changeYear);
	dijit.byId("yearSlot").setInitialValue();
	
	dojo.connect(dojo.doc,"touchmove",this,function(event){
		console.log("length "+ dojo.NodeList(event.target).parents("#mapLegend").length);
		if (dojo.NodeList(event.target).parents("#mapLegend").length == 1) {
			console.log("stop event on legend");
			dojo.stopEvent(event);
		}
			
	});
	
	dojo.connect(dojo.global,"onresize",this, function(){
		//console.log(" pageX " + dojo.doc.pageX);
		configureUI();
		dojo.global.scrollTo(0,0);
	});
	
	dojo.connect(dojo.global,"onorientationchange",this, function(){
		configureUI();
		dojo.global.scrollTo(0,0);
	});

});


onFeatureClick = function(feature) {
	console.log("Feature click " + feature);
	var map = dijit.byId("mapWidget").getInnerMap();
	var year = dijit.byId("yearSlot").getValue();
	var text = map.mapObj.marker.markerData[feature.id] + "\nYear "+  year + " population : " + (feature.value / 1000000) + "M";
	alert(text);
};

getPopulationForYear = function(data) {
	var pop = dojo.number.parse(data,{locale:"en-us"});
	return pop * 1000; // population is expressed in thousands
};

configureUI = function() {
	// configure graphic elements sizes
	
	var innerW = dojo.global.innerWidth,
		innerH = dojo.global.innerHeight,
		spinnerScale = 0.75,
		vertical = true;
	
	//console.log("innerW " + innerW + " innerH " + innerH);
	
	
	if (innerH < innerW) {
		vertical = false;
	}
	
	
	var spinStyle = dojo.byId("yearSpinner").style,
		mapWidget = dijit.byId("mapWidget"),
		mapWidgetStyle = mapWidget.domNode.style,
		height2 = dojo.marginBox(dojo.byId("mapHeader")).h,
		height3 = dojo.marginBox(dojo.byId("yearSpinner")).h,
		legendStyle = dojo.byId("mapLegend")?dojo.byId("mapLegend").style:{};
	
	if (vertical) {
		mapWidgetStyle.position = "relative";
		mapWidgetStyle.height = (innerH-height2-height3 * spinnerScale)+"px";
		mapWidgetStyle.width = innerW+"px";
		mapWidgetStyle.top = 0;
		mapWidgetStyle.left = 0;
		var spinW = 150;
		spinStyle.width = spinW - 6 + "px"; // (spinner has 2 * 3px borders..)
		spinStyle.position = "relative";
//					spinStyle.top = -(height3 * (1-spinnerScale)/2) + "px";
//					spinStyle.left = - (spinW * (1-spinnerScale)/2) + "px";
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
//					spinStyle.top = (height2 - height3 * (1 - spinnerScale) / 2) + "px";
//					spinStyle.left = - (spinW * (1-spinnerScale)/2) + "px";
		legendStyle.height = height3 * spinnerScale + "px";
		legendStyle.width = spinW*spinnerScale + "px";
		
		//console.log(innerH-height2 - 2 * (height3  * spinnerScale));
		
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
};