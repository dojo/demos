dojo.provide("demos.survey.src.chart");
dojo.require("dojox.charting.Chart2D");
dojo.require("dojox.charting.themes.PlotKit.blue");
dojo.require("dojox.charting.themes.PlotKit.cyan");
dojo.require("dojox.charting.themes.PlotKit.green");

var masterChart = null;
var initChart = function(){
	masterChart = new dojox.charting.Chart2D("chart");	
	masterChart.addPlot("default", {type: "Bars"});    
};

var getResults = function(){
	// summary: poll the results server, and generate the chart
	dojo.xhrGet({
		url:"src/results.php",
		handleAs:"json",
		load:function(data,ioArgs){
			makeChart(data);
		}
	});	
};

var makeChartData = function(/* Object */args){
	// summary: parse an object and create Arrays of labels and percentages
	// returns: object with toolkits[] and data[] params
	var i = 0;	
	//
	var toolkits = [{value:0,text:""}];
	var seriesData = [];

	// the data comes like data:{ "dojo":42,"jquery":30 }	
	for(var toolkit in args.data){
		// the value is a percentage of people polled
		seriesData.push((args.data[toolkit]/args.total)*100);
		// push the label along with the data
		toolkits.push({ value: ++i, text: toolkit });
	}
	toolkits.push({ value:++i, text:""});

	// send back our two arrays
	return {
		toolkits: toolkits,
		usage: seriesData
	};
}

var windowSizer = null;
var makeChart = function(args){

	var data = makeChartData(args);

	var pages = Math.floor(data.toolkits.length / 10) || 1;
	if(pages==1){ pages++ };
	dojo.style("chart","height",pages*180+"px");

	if(!masterChart){ initChart(); }
	var c = masterChart;
	
    c.addAxis("x", {
	    fixLower: "major", fixUpper: "major", includeZero: true, major:50, minor:25,
	    labels: [{value: 0, text: "< 1%"},{ value:50, text:"50%" },{value:100, text: "100%"}]
    });
	
    c.addAxis("y", {
	    vertical: true, fixLower: "major", major: 1, minor:1, fixUpper: "major", natural: false,
	    labels: data.toolkits
    });

    c.addSeries("Toolkits", data.usage ,{stroke: {color: "green"}, fill: "lightgreen"});

	c.render();

    dojo.query(".chartHolder").style("visibility","visible");

	// if the window resizes, redraw the chart
	if(!windowSizer){
		windowSizer = dojo.connect(window,"onresize",function(){
			c.resize();	
		});
	}
};
    
var updateChart = function(args){
	var data = makeChartData(args);
	c = masterChart;
	c.updateSeries("Toolkits",data.usage,{ stroke: {color: "green"}, fill: "lightgreen" });
	c.render();
};