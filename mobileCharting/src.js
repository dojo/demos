dojo.require("dojox.mobile");
dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile.Button");
dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");
dojo.require("dojox.charting.widget.Chart");
dojo.require("dojox.charting.Theme");
dojo.require("dojox.charting.axis2d.Default");
dojo.require("dojox.charting.plot2d.Columns");
dojo.require("dojox.charting.plot2d.Areas");
dojo.require("dojox.charting.plot2d.Grid");
dojo.require("dojox.data.CsvStore");
dojo.require("dojox.charting.action2d.TouchZoomAndPan");
dojo.require("dojox.charting.action2d.TouchIndicator");

var has = require.has;

dojo.requireIf(!has("touch"), "dojox.charting.action2d.MouseIndicator");
dojo.requireIf(!has("touch"), "dojox.charting.action2d.MouseZoomAndPan");

var pHeight = 0;

var resize = function(){
	if(dojo.byId("view2").style.display == "none"){
		return;
	}
	var wsize = dojox.mobile.getScreenSize();
	// on Android, the window size is changing a bit when scrolling! 
	// ignore those resize
	if(wsize.h > pHeight - 64 && wsize.h < pHeight + 64){
		return;
	}
	pHeight = wsize.h;
	var box = { h: wsize.w > wsize.h ? wsize.h - 92 : wsize.h - 196 };
	dijit.byId("stockChart").resize(box);
};

var googStore = new dojox.data.CsvStore({url: "resources/data/goog_prices.csv"});

var yahooStore = new dojox.data.CsvStore({url: "resources/data/yahoo_prices.csv"});

var msftStore = new dojox.data.CsvStore({url: "resources/data/msft_prices.csv"});

var selectedStore = googStore;

var currentData;

var dataFreq = 4;

var showChartView = function(){
	selectedStore.fetch({onComplete: processData});
};

var hideChartView = function(){
	var chart1 = dijit.byId("stockChart").chart;
	chart1.removeSeries("PriceSeries");
	chart1.removeSeries("VolumeSeries");
	chart1.render();
};

var processData = function(items, arg){
	items.reverse();
	currentData = [];
	var prices = [];  
	var volumes = [];
	var maxVolume = 0;
	var vol;
	var item;
	for(var i = 0; i < items.length; i++){
		// Reduce data size
		if((i % dataFreq) == 0){
			item = {};
			var value = selectedStore.getValue(items[i], "Open");
			item.price = parseFloat(value);
			value = selectedStore.getValue(items[i], "Volume");
			vol = parseFloat(value)/100000;
			if(vol > maxVolume){
				maxVolume = vol;
			}
			item.volume = vol;
			value = selectedStore.getValue(items[i], "Date");
			item.date = value;
			currentData.push(item);
			volumes.push(item.volume);
			prices.push(item.price);
		}
	}
	var chart1 = dijit.byId("stockChart").chart;
	var axis = chart1.getAxis("y2");
	axis.opt.max = maxVolume * 2;

	chart1.addSeries("VolumeSeries", volumes, {plot: "volumePlot"});
	chart1.addSeries("PriceSeries", prices, {plot: "default"});
	resize();
	chart1.render();
};

var onCompanyClick = function(event){
	var view2title;
	switch (event.currentTarget.id){
	case "googLink": view2title="Google Inc."; selectedStore=googStore; break;
	case "yahooLink": view2title="Yahoo! Inc."; selectedStore=yahooStore; break;
	case "msftLink": view2title="Microsoft Corp."; selectedStore=msftStore; break;
	}
	var chartHeader = dijit.byId("view2head1");
	chartHeader.set("label", view2title);
};

var timeLabelFunction = function(v){
	if(currentData == null){
		return "";
	}
	var idx = parseInt(v);

	var dtime;
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	if(idx < currentData.length){
		dtime = currentData[idx].date;
	}

	if(dtime){
		dtime = new Date(dtime.substr(0, 4), dtime.substr(5, 2), dtime.substr(8, 2));
		dtime = months[dtime.getMonth()] + " " + dtime.getFullYear().toString().substring(2);
	}else{
		dtime = "Mar 08";
	}
	return dtime;
};

var showRange = function(r){
	r = r / (dataFreq+1);
	var chart1 = dijit.byId("stockChart").chart;
	if(r > 0){
		var middle = currentData.length/2;
		chart1.zoomIn("x", [middle-(r/2), middle+(r/2)]);
	}else{
		chart1.zoomIn("x", []);
	}
};

var interactionMode = null;

var interactor1;
var interactor2;

var indicatorFillFunc = function(v1, v2){
	if(v2){
		return v2.y>v1.y?"green":"red";
	}else{
		return "#ff9000";
	}
};

var switchMode = function(){
	var label = dojo.byId("touchLabel");
	label.style.display = "";
	dojo.style("touchLabel", "opacity", "0");
	dojo.fadeIn({node:"touchLabel", duration:1500}).play();

	setTimeout(function(){label.style.display = "none";}, 2000);
	var chart = dijit.byId("stockChart").chart;

	if(interactionMode == null){
		// we were in no interaction let's go to indicator mode
		interactionMode = "indicator";
		interactor1 = has("touch")?new dojox.charting.action2d.TouchZoomAndPan(chart, "default", { axis: "x",
				enableScroll: false, enableZoom: false}):
				new dojox.charting.action2d.MouseZoomAndPan(chart, "default", { axis: "x",
					enableScroll: false});
		interactor2 = has("touch")?new dojox.charting.action2d.TouchIndicator(chart, "default",
				{ series: "PriceSeries", dualIndicator: true, font: "normal normal bold 12pt Helvetica", 
			lineOutline: null, outline: null, markerOutline: null,
			fillFunc: indicatorFillFunc			
		}):new dojox.charting.action2d.MouseIndicator(chart, "default",
				{ series: "PriceSeries", font: "normal normal bold 12pt Helvetica", 
			lineOutline: null, outline: null, markerOutline: null,
			fillFunc: indicatorFillFunc
		});
		label.innerHTML = "Data Indicator";
	}else if (interactionMode == "indicator"){
		// we were in indicator mode let's go to zoom mode
		interactionMode = "zoom";
		interactor1.disconnect();
		interactor2.disconnect();
		interactor1 = has("touch")?new dojox.charting.action2d.TouchZoomAndPan(chart, "default", {axis: "x", scaleFactor:2}):
			new dojox.charting.action2d.MouseZoomAndPan(chart, "default", {axis: "x", scaleFactor:2});
		label.innerHTML = "Zoom & Pan";
	}else {
		// we were in zoom mode let's go to null
		interactionMode = null;
		interactor1.disconnect();
		label.innerHTML = "No Interaction";
	}
	chart.render();
};


var init = function(){
	var view2 = dijit.byId("view2");
	dojo.connect(view2, "onBeforeTransitionOut", hideChartView);
	dojo.connect(view2, "onAfterTransitionIn", showChartView);

	dojo.connect(dojo.byId("googLink"), "click", onCompanyClick);
	dojo.connect(dojo.byId("yahooLink"), "click", onCompanyClick);
	dojo.connect(dojo.byId("msftLink"), "click", onCompanyClick);
	dojo.connect(dojo.byId("indicatorMode"), "click", switchMode);

	dojo.connect(dijit.byId("zoomButton1").domNode, "click", function(){showRange(90);});
	dojo.connect(dijit.byId("zoomButton2").domNode, "click", function(){showRange(180);});
	dojo.connect(dijit.byId("zoomButton3").domNode, "click", function(){showRange(365);});
	dojo.connect(dijit.byId("zoomButton4").domNode, "click", function(){showRange(0);});
	switchMode();
	
	dojo.subscribe("/dojox/mobile/resizeAll", resize);
};

var customClaroTheme = new dojox.charting.Theme({
	axis:{
		stroke:	{ // the axis itself
			color: "rgba(0, 0, 0, 0.5)"
		},
		tick: {	// used as a foundation for all ticks
			color: "rgba(0, 0, 0, 0.5)",
			fontColor: "rgba(0, 0, 0, 0.5)"								
		}
	},
	series: {
		outline: null
	},
	indicator: {
		lineStroke:  {width: 1.5, color: "#ff9000"},		
		lineOutline: {width: 0.5, color: "white"},		
		stroke: null,		
		outline: null,		
		fontColor: "#ffffff",							
		markerFill: dojox.charting.Theme.generateGradient({type: "radial", space: "shape", r: 100}, "white", "#ff9000"),							
		markerStroke: {width: 1.5, color: "#ff9000"},		
		markerOutline:{width: 0.5, color: "white"}		
	},
	seriesThemes: [ {stroke: "#1a80a8", fill: "#c7e0e9" }, {stroke: "#6d66b9", fill: "#c9c6e4" } ]
});

dojo.addOnLoad(init);
