require([
	"dojo/_base/lang",
	"dojo/ready",
	"dojo/dom",
	"dojo/_base/connect",
	"dojox/gauges/AnalogGauge",
	"dojox/gauges/AnalogArcIndicator",
	"dojox/gauges/AnalogNeedleIndicator",
	"dojox/gauges/AnalogCircleIndicator",
	"dojox/gauges/TextIndicator",
	"dojox/gauges/GlossyCircularGauge", 
	"dojox/gauges/GlossySemiCircularGauge", 
	"dojox/gauges/GlossyHorizontalGauge", 
	"dojo/parser"], 
	function(lang, ready, dom, connect, AnalogGauge, AnalogArcIndicator, 
			AnalogNeedleIndicator, AnalogCircleIndicator, TextIndicator){

		ready(function(){
			var gauge = new AnalogGauge({
				background: [200, 200, 200, 0],
				id: "gauge",
				width: 250,
				height: 200,
				cx: 125,
				cy: 150,
				radius: 125,
				useTooltip:false,
				ranges: [{
					low: 0,
					high: 100,
					color: "black"
				}],
				majorTicks: {
					offset: 90,
					interval: 10,
					length: 3,
					color: "white"
				},
				indicators: [new AnalogArcIndicator({
					value: 100,
					width: 30,
					offset: 60,
					color: "white",
					noChange: true,
					title: "value",
					hideValue: true
				}), new AnalogArcIndicator({
					interactionMode: "gauge",
					value: 20,
					width: 20,
					offset: 65,
					color: "gray",
					noChange: false,
					title: "value",
					hideValue: true
				}), new TextIndicator({
					value: 20,
					align: "middle",
					x: 125,
					y: 135,
					font: {
						family: "Arial",
						style: "normal",
						variant: "small-caps",
						weight: "bold",
						size: "30px"
					},
					hideValue: false,
					color: "gray"
				})]
			}, dom.byId("g1"));
			gauge.startup();
			connect.connect(gauge.indicators[1], "valueChanged", lang.hitch(gauge, function(){
				this.indicators[2].update(this.indicators[1].value);
			}));
			
			gauge = new AnalogGauge({
				id: "gauge3",
				startAngle: -30,
				endAngle: 30,
				background: [0, 0, 0, 0],
				width: 200,
				height: 180,
				cx: 100,
				cy: 150,
				radius: 130,
				ranges: [{
					low: -30,
					high: 30,
					color: [0, 0, 0, 0]
				}],
				useTooltip:false,
				majorTicks: {
					offset: 100,
					interval: 10,
					length: 3,
					color: "white",
					labelPlacement: "outside"
				},
				indicators: [new AnalogNeedleIndicator({
					interactionMode: "gauge",
					value: 0,
					width: 10,
					length: 100,
					strokeColor: [100, 100, 100],
					color: [200, 200, 200]
				})]
			}, dom.byId("g3"));
			gauge.startup();
		});
	}
)
