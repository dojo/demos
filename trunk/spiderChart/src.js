var switchData, switchSpider, switchDivisions, switchAnimation;

require(["dojo/_base/lang", "dojo/ready",
         "dojo/dom", "dojo/dom-construct",
         "dojox/charting/Chart",
         "dojox/charting/plot2d/Spider",
         "dojox/charting/themes/PlotKit/blue",
         "dijit/Tooltip",
         "dijit/form/CheckBox",
         "dijit/form/RadioButton",
         "dijit/form/Form",
         "dojo/fx/easing",
         "dojox/gfx/fx",
         "dojox/charting/widget/SelectableLegend"], function(lang, ready, dom, domConstruct,
        		 											Chart, Spider,
        		 											blue,
        		 											Tooltip, CheckBox, RadioButton, Form,
        		 											easing, fx,
        		 											SelectableLegend){

	var divisions = 7,
		stype = "polygon";
	var empty = {};
    var populateSelect = function(from, select){
        var module = lang.getObject(from);
        for(var name in module){
            if(name in empty){ continue; }
            var fun = module[name];
            if(lang.isFunction(fun)){
                domConstruct.create("option", {
                    value:     from + "." + name,
                    selected:  name == "backOut",
                    innerHTML: from + "." + name
                }, select);
            }
        }
    };
	
	var chart1, legend1;
	makeObjects = function(){
		chart1 = new dojox.charting.Chart("spider");
		chart1.setTheme(dojox.charting.themes.PlotKit.blue);
		chart1.theme.plotarea.fill = null;
		chart1.theme.chart.fill = null;
		chart1.addPlot("default", {
			type: "Spider",
			labelOffset: -10,
			divisions: divisions,
			axisColor:      "lightgray",
			fill: null,
			spiderColor:    "silver",
            seriesFillAlpha: 0.2,
			spiderOrigin:	 0.16,
			markerSize:  	 3,
			precision:		 0,
			spiderType:	 	 stype
		});
		chart1.addSeries("China", {data: {"GDP": 2,"area": 6,"population": 2000,"inflation": 15,"growth": 12}}, { fill: "blue" });
		chart1.addSeries("France", {data: {"GDP": 6,"area": 15,"population": 500,"inflation": 5,"growth": 6}}, { fill: "red" });
		chart1.addSeries("USA", {data: {"GDP": 3,"area": 20,"population": 1500,"inflation": 10,"growth": 3}}, { fill: "green" });
		chart1.addSeries("Japan", {data: {"GDP": 4,"area": 2,"population": 1000,"inflation": 20,"growth": 2}}, { fill: "yellow" });
		chart1.addSeries("Korean", {data: {"GDP": 10,"area": 10,"population": 800,"inflation": 2,"growth": 18}}, { fill: "orange" });
		chart1.addSeries("Canada", {data: {"GDP": 1,"area": 18,"population": 300,"inflation": 3,"growth": 15}}, { fill: "purple" });
		chart1.render();
		
		legend1 = new SelectableLegend({chart: chart1, horizontal: true}, "legend1");
		
		// prepare and enable controls
        populateSelect("dojo.fx.easing", "easing");
	};
	
	ready(makeObjects);

	switchData = function(val){
		if(val == "b1"){
			chart1.updateSeries("China", {data: {"GDP": 2,"area": 6,"population": 2000,"inflation": 15,"growth": 12}}, { fill: "blue" });
			chart1.updateSeries("France", {data: {"GDP": 6,"area": 15,"population": 500,"inflation": 5,"growth": 6}}, { fill: "red" });
			chart1.updateSeries("USA", {data: {"GDP": 3,"area": 20,"population": 1500,"inflation": 10,"growth": 3}}, { fill: "green" });
			chart1.updateSeries("Japan", {data: {"GDP": 4,"area": 2,"population": 1000,"inflation": 20,"growth": 2}}, { fill: "yellow" });
			chart1.updateSeries("Korean", {data: {"GDP": 10,"area": 10,"population": 800,"inflation": 2,"growth": 18}}, { fill: "orange" });
			chart1.updateSeries("Canada", {data: {"GDP": 1,"area": 18,"population": 300,"inflation": 3,"growth": 15}}, { fill: "purple" });
		}else{
			chart1.updateSeries("China", {data: {"GDP": 8,"area": 2,"population": 500,"inflation": 2,"growth": 18}}, { fill: "blue" });
			chart1.updateSeries("France", {data: {"GDP": 10,"area": 6,"population": 1000,"inflation": 20,"growth": 12}}, { fill: "red" });
			chart1.updateSeries("USA", {data: {"GDP": 2,"area": 5,"population": 1500,"inflation": 12,"growth": 6}}, { fill: "green" });
			chart1.updateSeries("Japan", {data: {"GDP": 1,"area": 20,"population": 500,"inflation": 5,"growth": 11}}, { fill: "yellow" });
			chart1.updateSeries("Korean", {data: {"GDP": 4,"area": 2,"population": 2000,"inflation": 16,"growth": 8}}, { fill: "orange" });
			chart1.updateSeries("Canada", {data: {"GDP": 6,"area": 10,"population": 300,"inflation": 3,"growth": 2}}, { fill: "purple" });
		}
		chart1.render();
		legend1 && legend1.refresh && legend1.refresh();
	};

	switchSpider = function(val){
		stype = dom.byId("b11").checked ? "polygon" : "circle";
		if(val == "b11"){
			chart1.addPlot("default", {
				type: "Spider",
				divisions: 		divisions,
				spiderType: 	stype
			});
		}else{
			chart1.addPlot("default", {
				type: "Spider",
				divisions: 		divisions,
				spiderType: 	stype
			});
		}
		chart1.render();
		legend1 && legend1.refresh && legend1.refresh();
	};

	switchDivisions = function(val){
		if(val == "b111"){
			divisions = 7;
			chart1.addPlot("default", {
				type: "Spider",
				divisions: 		divisions,
				spiderType: 	stype
			});
		}else{
			divisions = 3;
			chart1.addPlot("default", {
				type: "Spider",
				divisions: 		divisions,
				spiderType: 	stype
			});
		}
		chart1.render();
		legend1 && legend1.refresh && legend1.refresh();
	};

	switchAnimation = function(val){
		easing = lang.getObject(dom.byId("easing").value);
		chart1.addPlot("default", {
			type: "Spider",
			divisions: 		divisions,
			spiderType: 	stype,
			animationType:	easing
		});
		chart1.render();
		legend1 && legend1.refresh && legend1.refresh();
	};
	
});
	

