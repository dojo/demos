require(["dojox/charting/Chart", "dojox/charting/plot2d/Pie",
         "dojox/charting/action2d/Tooltip", 
         "dojox/charting/themes/Tom",
         "dojox/charting/widget/Legend", "dojo/ready"], 
    function(Chart, Pie, Tooltip, Tom, Legend, ready){

	var pieChart = null;
	var legend = null;
    ready(function(){
    	pieChart = new Chart("pieChart");
        pieChart.setTheme(Tom).addPlot("default", {
        	type: "Pie",
            font: "normal normal 10pt Tahoma",
			fontColor: "#ccc",
			labelWiring: "#ccc",
            radius: 100,
			labelStyle: "columns",
			htmlLabels: true,
			startAngle: -10
        }).addSeries("Series A", [{
        	y: 12.1,
            text: "China",
            tooltip: "1,210 million"
        },{
        	y: 9.52,
            text: "India",
            tooltip: "952 million"
        }, {
        	y: 2.66,
            text: "USA",
            tooltip: "266 million"
        }, {
        	y: 2.06,
            text: "Indonisia",
            tooltip: "206 million"
        }, {
        	y: 1.63,
            text: "Brazil",
            tooltip: "163 million"
        },{
        	y: 1.48,
            text: "Russian",
            tooltip: "148 million"
        },{
        	y: 1.29,
            text: "Pakistan",
            tooltip: "129 million"
        },{
        	y: 1.25,
            text: "Japan",
            tooltip: "125 million"
        },{
        	y: 1.23,
            text: "Bangladesh",
            tooltip: "123 million"
        },{
        	y: 1.04,
            text: "Nigeria",
            tooltip: "104 million"
        },{
        	y: 0.96,
            text: "Mexico",
            tooltip: "96 million"
        },{
        	y: 0.84,
            text: "Germany",
            tooltip: "84 million"
        },{
        	y: 0.74,
            text: "Phillippines",
            tooltip: "74 million"
        },{
        	y: 0.74,
            text: "Viet Nam",
            tooltip: "74 million"
        },{
        	y: 0.66,
            text: "Iran",
            tooltip: "66 million"
        },{
        	y: 0.64,
            text: "Egypt",
            tooltip: "64 million"
        }]);
        var anim_c = new Tooltip(pieChart, "default");
        pieChart.render();
        legend = new Legend({
        	chart: pieChart,
			horizontal:false}, "legend");
    });
});	