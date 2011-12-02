require(["dojo/ready", "dijit/registry", 
         "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/ComboBox",
         "dojox/charting/Chart", "dojox/charting/axis2d/Default",
         "dojox/charting/plot2d/Columns", "dojox/charting/plot2d/ClusteredColumns",
         "dojox/charting/plot2d/StackedColumns", "dojox/charting/plot2d/Bars",
         "dojox/charting/plot2d/ClusteredBars", "dojox/charting/plot2d/StackedBars",
         "dojox/charting/plot2d/Areas", "dojox/charting/plot2d/StackedAreas",
         "dojox/charting/plot2d/Pie", "dojox/charting/plot2d/Grid",
         "dojox/charting/themes/CubanShirts", "dojox/charting/widget/Legend",
         "dojox/lang/functional/sequence", "dojo/parser"],
         function(ready, registry, Button, CheckBox, ComboBox,
        		 Chart, Default, Columns, ClusteredColumns, StackedColumns,
        		 Bars, ClusteredBars, StackedBars, Areas, StackedAreas,
        		 Pie, Grid, CubanShirts, Legend, sequence){

	var chart, legend, size = 10, magnitude = 30;

	var getData = function(){
		var data = new Array(size);
		for(var i = 0; i < size; ++i){
			data[i] = Math.random() * magnitude;
		}
		return data;
	};

	var getZeroes = function(){
		return sequence.repeat(size, "-> 0", 0);
	};
	
	var makeObjects = function(){
		chart = new Chart("test");
		chart.setTheme(CubanShirts);
	
		if(dijit.byId("hAxis").get("checked")){
			chart.addAxis("x", {natural: true, includeZero: true, fixUpper: "minor"});
		}
	
		if(dijit.byId("vAxis").get("checked")){
			chart.addAxis("y", {vertical: true, natural: true, includeZero: true, fixUpper: "minor"});
		}
	
		chart.addPlot("default", {type: dijit.byId("plot").get("value"), gap: 2});
	
		if(dijit.byId("grid").get("checked")){
			chart.addPlot("grid", {type: "Grid", hMinorLines: true, vMinorLines: true});
		}
	
		for(var i = 1; i <= 5; ++i){
			if(dijit.byId("s" + i).get("checked")){
				chart.addSeries("Series " + i, getData(), {stroke: {color: "black", width: 1}});
			}
		}
		if(dijit.byId("s6").get("checked")){
			chart.addSeries("Series 6", getZeroes(), {stroke: {color: "black", width: 1}});
		}
	
		chart.render();
		
		legend = new Legend({chart: chart}, "legend");
	};
	
	ready(makeObjects);
	
	changePlot = function(){
		var type = dijit.byId("plot").get("value");
		chart.addPlot("default", {type: type, gap: 2});
		chart.render();
		legend.refresh();
	};
	
	changeGrid = function(){
		if(dijit.byId("grid").get("checked")){
			chart.addPlot("grid", {type: "Grid", hMinorLines: true, vMinorLines: true});
		}else{
			chart.removePlot("grid");
		}
		chart.render();
	};
	
	changeX = function(){
		if(dijit.byId("hAxis").get("checked")){
			chart.addAxis("x", {natural: true, includeZero: true, fixUpper: "minor"});
		}else{
			chart.removeAxis("x");
		}
		chart.render();
	};
	
	changeY = function(){
		if(dijit.byId("vAxis").get("checked")){
			chart.addAxis("y", {vertical: true, natural: true, includeZero: true, fixUpper: "minor"});
		}else{
			chart.removeAxis("y");
		}
		chart.render();
	};
	
	changeSeries = function(n){
		if(n == 6){
			// special case
			if(dijit.byId("s6").get("checked")){
				chart.addSeries("Series 6", getZeroes(), {stroke: {color: "black", width: 1}});
			}else{
				chart.removeSeries("Series 6");
			}
		}else{
			if(dijit.byId("s" + n).get("checked")){
				chart.addSeries("Series " + n, getData(), {stroke: {color: "black", width: 1}});
				dijit.byId("sb" + n).get("disabled", false);
			}else{
				chart.removeSeries("Series " + n);
				dijit.byId("sb" + n).get("disabled", true);
			}
		}
		chart.render();
		legend.refresh();
	};
	
	addSeries = function(n){
		chart.addSeries("Series " + n, getData(), {stroke: {color: "black", width: 1}});
		chart.render();
		legend.refresh();
	};
});