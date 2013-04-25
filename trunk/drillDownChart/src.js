var setStyle;
		
require(["dojo/_base/declare", "dojo/dom-style", "dojo/ready", "dojox/charting/Chart",
	"dojo/store/Memory", "dojox/charting/StoreSeries",
	"dojox/charting/Theme", "dojox/charting/action2d/PlotAction",
	"dojox/charting/axis2d/Default", "dojox/charting/plot2d/Columns", "dojox/charting/plot2d/Lines",
	"dojox/charting/plot2d/Pie", "dojox/charting/plot2d/Grid",
	"dojox/charting/action2d/Tooltip", "dojox/charting/action2d/Highlight"],
	function(declare, domStyle, ready, Chart, Memory, StoreSeries, Theme, PlotAction, Default, Columns, Lines, Pie, Grid,
		Tooltip, Highlight){
			
	setStyle = domStyle.set;
		
	/* JSON information */
	var sales = [
		{ month: "Jan",  revenues: 12435, profit: 53, America:40, Europe:35, Asia:25},
		{ month: "Feb",  revenues: 11425, profit: 67, America:35, Europe:35, Asia:30},
		{ month: "Mar",  revenues: 13534, profit: 130, America:45, Europe:25, Asia:30},
		{ month: "Apr",  revenues: 12001, profit: 54, America:60, Europe:20, Asia:20},
		{ month: "May",  revenues: 14334, profit: 140, America:40, Europe:30, Asia:30},
		{ month: "Jun",  revenues: 12400, profit: 121, America:60, Europe:20, Asia:20},
		{ month: "Jul",  revenues: 12212, profit: 50, America:40, Europe:30, Asia:30},
		{ month: "Aug",  revenues: 14424, profit: 101, America:40, Europe:35, Asia:25},
		{ month: "Nov",  revenues: 14134, profit: 72, America:35, Europe:35, Asia:30},
		{ month: "Oct",  revenues: 13242, profit: 85, America:45, Europe:25, Asia:30},
		{ month: "Nov",  revenues: 16312, profit: 264, America:60, Europe:20, Asia:20},
		{ month: "Dec",  revenues: 19132, profit: 124, America:50, Europe:25, Asia:25}
	];
			
	var PieAction = declare(PlotAction, {
		constructor: function(chart, plot, callback){
			this.callback = callback;
			this.connect();
		},
		process: function(o){
			if(o.shape && o.type == "onclick" || o.type == "onmouseover"){
				this.callback(o.index, o.type == "onclick");
			}
		}
	});
			
	ready(function() {
		var store = new Memory({ data: sales });
		var monthLabel = function(index){
			if(index>12 || index<1){
				return "";
			}
			return sales[index-1].month;
		};
		var theme1 = new Theme({
			chart: {
				fill: { type: "linear", x1: 0, y1: 0, x2: 0, y2: 240, colors: [
					{ offset: 0, color: "#ececec" },
					{ offset: 0.5, color: "#cecece" },
					{ offset: 1, color: "#ececec" }
					]
				}
			},
			plotarea: {
				fill: { type: "linear", x1: 0, y1: 0, x2: 0, y2: 240, colors: [
					{ offset: 0, color: "#ececec" },
					{ offset: 0.5, color: "#cecece" },
					{ offset: 1, color: "#ececec" }
					]
				}
			},
			marker: {
				symbol: Theme.defaultMarkers.CIRCLE
			}
		});
		var chart1 = new Chart("chart1").
			setTheme(theme1).
			addAxis("x", { majorTickStep: 1, minorTicks: false, labelFunc: monthLabel, minorLabels: false}).
			addAxis("ry", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, majorTickStep: 10000, max: 30000, title: "Revenues"  }).
			addAxis("py", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, leftBottom: false, majorTickStep: 100, max: 300, title: "Profit" }).
			addPlot("profit", {type: "Default", vAxis: "py", tension: "X", markers: true, stroke: {color:"yellow"}, fill: "yellow", animate: true}).
			addPlot("revenues", {type: "Columns", gap: 5, vAxis: "ry", stroke: {color:"white"}, fill: "#2a6ead", animate: true}).
			addPlot("grid", { type: "Grid", vMajorLines: false, vAxis: "ry"}).
			addSeries("data1", new StoreSeries(store, {}, function(item){
				return item.revenues;
			}), { plot: "revenues"}).
			addSeries("data2", new StoreSeries(store, {}, function(item){
				return item.profit;
			}), {plot: "profit"});
		var theme2 = new Theme({
			plotarea: {
				fill: null
			},
			colors: [
				"#57808f",
				"#506885",
				"#4f7878",
				"#558f7f",
				"#508567"
			]
		});
		var chart2 = new Chart("chart2", { fill: null, margins: {t:0, l:0, b:0, r:0} }).
			setTheme(theme2).
			addPlot("regions", {type: "Pie", radius: 112, stroke: "white"}).
			addSeries("data", [], {plot: "regions"});
		new Tooltip(chart1, "revenues");
		new Highlight(chart1, "revenues");
		new PieAction(chart1, "revenues", function(index, visible){
			// show up a PieChart with the month split by world region
			chart2.updateSeries("data", [
				{ y: sales[index].America, text: "America" },
				{ y: sales[index].Europe, text: "Europe" },
				{ y: sales[index].Asia, text: "Asia" }
			]);
			// in case it was hidden and we clicked
			if(visible){
				domStyle.set("overlay", "visibility", "visible");
			}
			chart2.render();
		});
		chart1.render();
	});
});
