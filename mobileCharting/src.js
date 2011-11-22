var customClaroTheme, timeLabelFunction;

require([
	"dojo/ready",
	"dojo/has", 
	"dojo/_base/sniff", // ua sniffing
	"dojo/on",
	"dojo/_base/html", 
	"dojo/dom", // byId
	"dojo/_base/fx",
	"dojo/topic",
	"dojox/mobile",
	"dojox/mobile/compat",
	"dojox/mobile/deviceTheme", 
	"dojox/mobile/View", 
	"dojox/mobile/RoundRect", 
	"dojox/mobile/Button", 
	"dojox/mobile/parser",
	"dojox/charting/widget/Chart", 
	"dojox/charting/Theme", 
	"dojox/charting/axis2d/Default", 
	"dojox/charting/plot2d/Columns",
	"dojox/charting/plot2d/Areas", 
	"dojox/charting/plot2d/Grid", 
	"dojox/data/CsvStore",
	"dijit/registry",
	"dojo/has!touch?dojox/charting/action2d/TouchZoomAndPan:dojox/charting/action2d/MouseZoomAndPan",
	"dojo/has!touch?dojox/charting/action2d/TouchIndicator:dojox/charting/action2d/MouseIndicator"],
	function(ready, has, ua, on, html, dom, fx, topic, mobile, compat, deviceTheme, View, RoundRect, Button, parser,
			 Chart, Theme, Default, Columns, Areas, Grid, CsvStore, registry, ZoomAndPan, Indicator){

	var pHeight = 0;

	var resize = function(){
		var view2 = dom.byId("view2");
		if(view2.style.visibility == "hidden" || view2.style.display == "none"){
			return;
		}
		var wsize = mobile.getScreenSize();
		// needed for IE, because was overriden to 0 at some point
		if(ua("ie")){
			dom.byId("stockChart").style.width = "100%";
		}else{
			// on Android, the window size is changing a bit when scrolling!
			// ignore those resize
			if(wsize.h > pHeight - 64 && wsize.h < pHeight + 64){
				return;
			}
		}
		pHeight = wsize.h;
		var box = { h: wsize.w > wsize.h ? wsize.h - 92 : wsize.h - 196 };
		registry.byId("stockChart").resize(box);
	};

	var googStore = new CsvStore({url: "resources/data/goog_prices.csv"});

	var yahooStore = new CsvStore({url: "resources/data/yahoo_prices.csv"});

	var msftStore = new CsvStore({url: "resources/data/msft_prices.csv"});

	var selectedStore = googStore;

	var currentData;

	var dataFreq = 4;

	var showChartView = function(){
		selectedStore.fetch({onComplete: processData});
	};

	var hideChartView = function(){
		var chart1 = registry.byId("stockChart").chart;
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
		var chart1 = registry.byId("stockChart").chart;
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
		var chartHeader = registry.byId("view2head1");
		chartHeader.set("label", view2title);
	};

	timeLabelFunction = function(v){
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
		var chart1 = registry.byId("stockChart").chart;
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
		var label = dom.byId("touchLabel");
		label.style.display = "";
		html.style("touchLabel", "opacity", "0");
		fx.fadeIn({node:"touchLabel", duration:1500}).play();

		setTimeout(function(){label.style.display = "none";}, 2000);
		var chart = registry.byId("stockChart").chart;

		if(interactionMode == null){
			// we were in no interaction let's go to indicator mode
			interactionMode = "indicator";
			interactor1 = has("touch")?new ZoomAndPan(chart, "default", { axis: "x",
					enableScroll: false, enableZoom: false}):
					new ZoomAndPan(chart, "default", { axis: "x", enableScroll: false });
			interactor2 = has("touch")?new Indicator(chart, "default", {
						series: "PriceSeries", dualIndicator: true, font: "normal normal bold 12pt Helvetica",
						lineOutline: null, outline: null, markerOutline: null,
						fillFunc: indicatorFillFunc
					}):new Indicator(chart, "default", {
							series: "PriceSeries", font: "normal normal bold 12pt Helvetica",
							lineOutline: null, outline: null, markerOutline: null,
							fillFunc: indicatorFillFunc
						});
			label.innerHTML = "Data Indicator";
		}else if (interactionMode == "indicator"){
			// we were in indicator mode let's go to zoom mode
			interactionMode = "zoom";
			interactor1.disconnect();
			interactor2.disconnect();
			interactor1 = has("touch")?new ZoomAndPan(chart, "default", {axis: "x", scaleFactor:2}):
				new ZoomAndPan(chart, "default", {axis: "x", scaleFactor:2});
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
		var view2 = registry.byId("view2");
		view2.on("BeforeTransitionOut", hideChartView);
		view2.on("AfterTransitionIn", showChartView);

		on(dom.byId("googLink"), "click", onCompanyClick);
		on(dom.byId("yahooLink"), "click", onCompanyClick);
		on(dom.byId("msftLink"), "click", onCompanyClick);
		on(dom.byId("indicatorMode"), "click", switchMode);

		registry.byId("zoomButton1").on("click", function(){showRange(90);});
		registry.byId("zoomButton2").on("click", function(){showRange(180);});
		registry.byId("zoomButton3").on("click", function(){showRange(365);});
		registry.byId("zoomButton4").on("click", function(){showRange(0);});
		switchMode();

		topic.subscribe("/dojox/mobile/resizeAll", resize);
	};

	customClaroTheme = new Theme({
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
		grid: {
			majorLine: {
				color: "rgba(0, 0, 0, 0.2)"
			}
		},
		indicator: {
			lineStroke:  {width: 1.5, color: "#ff9000"},
			lineOutline: {width: 0.5, color: "white"},
			stroke: null,
			outline: null,
			fontColor: "#ffffff",
			markerFill: Theme.generateGradient({type: "radial", space: "shape", r: 100}, "white", "#ff9000"),
			markerStroke: {width: 1.5, color: "#ff9000"},
			markerOutline:{width: 0.5, color: "white"}
		},
		seriesThemes: [ {stroke: "#1a80a8", fill: "#c7e0e9" }, {stroke: "#6d66b9", fill: "#c9c6e4" } ]
	});

	ready(init);
});
