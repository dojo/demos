
var circularGauge = null;
var scircularGauge = null;
var horizontalGauge = null;
	
require([
	"dojo/ready","dojox/mobile","dojox/mobile/parser","dojo/_base/connect","dojo/dom",
	"dojox/mobile/compat","dojox/mobile/deviceTheme","dojox/mobile/Button",
	"dojox/gauges/AnalogGauge","dojox/gauges/AnalogArcIndicator","dojox/gauges/AnalogNeedleIndicator",
	"dojox/gauges/AnalogCircleIndicator","dojox/gauges/TextIndicator","dojox/gauges/GlossyCircularGauge",
	"dojox/gauges/GlossyHorizontalGauge","dojox/gauges/GlossySemiCircularGauge",
	"demos/mobileGauges/src/VistaGauge","demos/mobileGauges/src/PlasticGauge",
	"demos/mobileGauges/src/XpGauge","dojo/domReady!"
], function(ready, mobile, parser, connect, dom, compat, deviceTheme, Button, AnalogGauge,
	AnalogArcIndicator, AnalogNeedleIndicator, AnalogCircleIndicator, TextIndicator,
	GlossyCircularGauge, GlossyHorizontalGauge, GlossySemiCircularGauge,
	VistaGauge, PlasticGauge, XpGauge){



	function initBarGauges(){
		horizontalGauge = new GlossyHorizontalGauge({
			background: 'white',
			id: "defaultBarGauge",
			width: 300,
			height: 55,
			useTooltip:false
		}, dom.byId("defaultBarGauge"));
		horizontalGauge.startup();
	}

	function init(){
		// create a Circular Gauge
		circularGauge = GlossyCircularGauge({
			background: [255, 255, 255, 0],
			id: "cGauge",
			min: 0,
			max: 100,
			width: 250,
			height: 250,
			useTooltip:false
		}, dom.byId("cGauge"));
		circularGauge.startup();

		// creates a Semi Circular Gauge
		scircularGauge = new GlossySemiCircularGauge({
			background: [255, 255, 255, 0],
			id: "scGauge",
			min: 0,
			max: 100,
			width: 250,
			height: 150,
			useTooltip:false
		}, dom.byId("scGauge"));
		scircularGauge.startup();

		//----------------
		var gauge = new AnalogGauge({

			background: 'white',
			id: "gauge",
			width: 250,
			height: 200,
			cx: 125,
			cy: 150,
			useTooltip:false,
			radius: 125,
			ranges: [{
				low: 0,
				high: 100,
				color: 'black'
			}],

			majorTicks: {
				offset: 90,
				interval: 10,
				length: 3,
				color: 'white'
			},

			indicators: [new AnalogArcIndicator({
				value: 100,
				width: 30,
				offset: 60,
				color: 'white',
				noChange: true,
				title: 'value',
				hideValue: true
			}), new AnalogArcIndicator({
				interactionMode: "gauge",
				value: 20,
				width: 20,
				offset: 65,
				color: 'gray',
				noChange: false,
				title: 'value',
				hideValue: true
			}), new TextIndicator({
				value: 20,
				align: 'middle',
				x: 125,
				y: 135,
				font: {
					family: "Arial",
					style: "normal",
					variant: 'small-caps',
					weight: 'bold',
					size: "30px"
				},
				hideValue: false,
				color: 'gray'
			})]
		}, dom.byId("gauge"));

		gauge.startup();

		connect.connect(gauge.indicators[1], "valueChanged", dojo.hitch(gauge, function(){
			this.indicators[2].update(this.indicators[1].value);
		}));


		gauge = new AnalogGauge({
			id: "gauge2",
			startAngle: 0,
			endAngle: 270,
			background: 'white',
			id: "defaultGauge",
			width: 250,
			height: 250,
			useTooltip:false,
			cx: 127,
			cy: 125,
			radius: 125,
			ranges: [{
				low: 0,
				high: 100,
				color: 'white'
			}],

			majorTicks: {
				offset: 95,
				interval: 20,
				length: 3,
				color: 'black',
				labelPlacement: 'outside'
			},

			indicators: [new AnalogArcIndicator({
				value: 1000,
				width: 30,
				offset: 65,
				strokeColor: 'black',
				color: 'white',
				noChange: true,
				title: 'value',
				hideValue: true
			}), new AnalogArcIndicator({
				value: 20,
				width: 20,
				offset: 70,
				interactionMode: "gauge",
				color: [122, 103, 140],
				noChange: false,
				title: 'value',
				hideValue: true
			}), new TextIndicator({
				value: 20,
				align: 'middle',
				x: 125,
				y: 140,
				font: {
					family: "Arial",
					style: "normal",
					variant: 'small-caps',
					weight: 'bold',
					size: "40px"
				},
				hideValue: false,
				color: 'gray'
			})]
		}, dom.byId("gauge2"));

		gauge.startup();

		connect.connect(gauge.indicators[1], "valueChanged", dojo.hitch(gauge, function(){
			this.indicators[2].update(this.indicators[1].value);
		}));


		gauge = new AnalogGauge({
			id: "gauge3",
			startAngle: -30,
			endAngle: 30,
			background: 'white',
			width: 200,
			height: 180,
			useTooltip:false,
			cx: 100,
			cy: 150,
			radius: 130,
			ranges: [{
				low: -30,
				high: 30,
				color: 'white'
			}],

			majorTicks: {
				offset: 100,
				interval: 10,
				length: 3,
				color: 'black',
				labelPlacement: 'outside'
			},

			indicators: [new AnalogNeedleIndicator({
				interactionMode: "gauge",
				value: 0,
				width: 10,
				length: 100,
				strokeColor: [100, 100, 100],
				color: [200, 200, 200]

			})]
		}, dom.byId("gauge3"));

		gauge.startup();


		gauge = new AnalogGauge({
			id: "gauge4",
			startAngle: 20,
			endAngle: 20,
			background: 'white',
			width: 200,
			height: 200,
			useTooltip:false,
			cx: 100,
			cy: 100,
			radius: 95,
			ranges: [{
				low: 0,
				high: 8,
				color: [50, 90, 102]
			}],

			majorTicks: {
				offset: 70,
				interval: 1,
				length: 3,
				color: 'white',
				labelPlacement: 'outside'
			},

			indicators: [new AnalogCircleIndicator({
				interactionMode: "gauge",
				offset: 45,
				value: 5,
				length: 10,
				strokeColor: [163, 43, 38],
				color: [222, 161, 64]

			}), new AnalogArcIndicator({
				value: 7,
				width: 10,
				offset: 60,

				color: [255, 248, 178],
				noChange: true,
				title: 'value',
				hideValue: true
			})]
		}, dom.byId("gauge4"));

		gauge.startup();

		var vista = new VistaGauge({
			id: "vista",
			color: 'white',
			background: 'white',
			min: 0,
			max: 1000,
			width: 200,
			height: 200,
			useTooltip:false
		}, dom.byId("vista"));
		vista.startup();

		var plastic = new PlasticGauge({
			id: "plastic",
			color: 'white',
			background: 'white',
			min: 0,
			max: 1000,
			width: 200,
			height: 200,
			useTooltip:false
		}, dom.byId("plastic"));
		plastic.startup();

		var xp = new XpGauge({
			id: "xp",
			color: [109, 183, 19],
			background: 'white',
			min: 0,
			max: 1000,
			width: 200,
			height: 200,
			useTooltip:false
		}, dom.byId("xp"));
		xp.startup();


		initBarGauges();

	}

	ready(init);
});





