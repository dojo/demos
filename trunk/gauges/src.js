require([
	"dojo/_base/lang",
	"dojo/ready",
	"dojo/dom",
	"dojo/_base/connect",
	"dojo/_base/Color", 
	"dojox/dgauges/CircularGauge",
	"dojox/dgauges/LinearScaler",
	"dojox/dgauges/CircularScale",
	"dojox/dgauges/CircularValueIndicator",
	"dojox/dgauges/CircularRangeIndicator",
	"dojox/dgauges/TextIndicator",	
	"dojox/dgauges/components/utils",
	"dojox/dgauges/components/black/CircularLinearGauge",	
	"dojox/dgauges/components/black/SemiCircularLinearGauge",	
	"dojox/dgauges/components/black/HorizontalLinearGauge",
	"dojo/parser"], 
	function(lang, ready, dom, connect, Color, 
			CircularGauge, LinearScaler, CircularScale, CircularValueIndicator, CircularRangeIndicator, TextIndicator, utils){

		ready(function(){
			
			var gauge = new CircularGauge({
				value: 20,
				font: {
					family: "Arial",
					style: "normal",
					size: "14pt",
					color: "white"
				}
			},dom.byId("g1"));
			// Draw background
			gauge.addElement("background", function(g){
				g.createPath({path: "M372.8838 205.5688 C372.9125 204.4538 372.93 194.135 372.94 185.6062 C372.4475 83.0063 289.1138 -0 186.4063 0.035 C83.7 0.0713 0.4225 83.1325 0 185.7325 C0.01 194.2175 0.0275 204.4638 0.0563 205.5763 C0.235 212.3488 5.7763 217.7462 12.5525 217.7462 L360.3888 217.7462 C367.1663 217.7462 372.71 212.3438 372.8838 205.5688"
				}).setFill("black");
			});
			// Scale
			var scale = new CircularScale({
				originX: 186.46999,
				originY: 184.74814,			
				radius: 140,
				startAngle: -180,
				endAngle:0,
				labelPosition:"outside",
				orientation:"clockwise",
				scaler:new LinearScaler(),
				labelGap: 8,
				tickShapeFunc: function(group, scale, tickItem){
					return group.createLine({
						x1: 0,
						y1: 0,
						x2: tickItem.isMinor ? 0 : 5,
						y2: 0
					}).setStroke({
						color: "white",
						width: 1
					});
				}				
			});
			gauge.addElement("scale", scale);
			// A range indicator that goes from 0 to 100
			indicator = new CircularRangeIndicator({
				value: 100,
				radius: 135,
				startThickness:50,
				endThickness:50,
				fill:"white"
			});
			scale.addIndicator("indicatorBg", indicator);
			// An interactive range indicator that shows the current value
			indicator = new CircularRangeIndicator({
				value: gauge.value,
				radius: 125,
				startThickness:30,
				endThickness:30,
				fill:"gray",
				interactionArea:"gauge",
				interactionMode:"mouse"
			});
			scale.addIndicator("indicator", indicator);
			// Indicator Text
			var indicatorText = new TextIndicator({
				indicator: indicator,
				x: 186,
				y: 184,
				font: {
					family: "Arial",
					style: "normal",
					variant: "small-caps",
					weight: "bold",
					size: "36pt"
				},
				color: "gray"
			});
			gauge.addElement("indicatorText", indicatorText);
			gauge.startup();			
			gauge.resize(250,200);

			// 2nd custom gauge		
			gauge = new CircularGauge({
				value: 0,
				font: {
					family: "Arial",
					style: "normal",
					size: "8pt",
					color: "white"
				}
			},dom.byId("g3"));
			// an ghost shape just to set the global size of the gauge
			gauge.addElement("background", function(g){
				g.createRect({width:200, height:180});
			});
			// Scale
			scale = new CircularScale({
				originX: 100,
				originY: 150,
				radius: 130,
				startAngle: -120,
				endAngle: -60,
				labelPosition: "outside",
				orientation: "clockwise",
				scaler: new LinearScaler({
					minimum: -30, 
					maximum: 30,
					majorTickInterval: 10
				}),
				labelGap: 8,
				tickShapeFunc: function(group, scale, tickItem){
					return group.createLine({
						x1: 0,
						y1: 0,
						x2: tickItem.isMinor ? 0 : 5,
						y2: 0
					}).setStroke({
						color: "white",
						width: 1
					});
				}				
			});
			gauge.addElement("scale", scale);
			// the needle
			indicator = new CircularValueIndicator({
				interactionArea: "gauge",
				value: 0,
				indicatorShapeFunc: function(group, indicator){
					var g = group.createGroup();
					g.createPolyline([0, -12, indicator.scale.radius - 2, 0, 0, 12, 0, -12]).setStroke({
						color: [70, 70, 70],
						width: 1
					}).setFill("white");
					g.createEllipse({rx:15, ry:15}).setFill("rgb(200,200,200)").setStroke("rgb(70, 70, 70)");
					return g;
				}
			});
			scale.addIndicator("indicator", indicator);
			gauge.startup();
			gauge.resize(200,180);
		});
	}
)
