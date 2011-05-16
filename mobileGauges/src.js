
require.ready(function(){

	require([
	 "dojox/mobile", 
	 "dojox/mobile/parser", 
	 "dojox/mobile/compat", 
	 "dojox/mobile/Button", 
	 "dojox/gauges/AnalogGauge", 
	 "dojox/gauges/AnalogArcIndicator", 
	 "dojox/gauges/AnalogNeedleIndicator", 
	 "dojox/gauges/AnalogCircleIndicator", 
	 "dojox/gauges/TextIndicator", 
	 "dojox/gauges/GlossyCircularGauge", 
	 "dojox/gauges/GlossyHorizontalGauge", 
	 "dojox/gauges/GlossySemiCircularGauge", 
	 "demos/mobileGauges/src/VistaGauge", 
	 "demos/mobileGauges/src/PlasticGauge", 
	 "demos/mobileGauges/src/XpGauge"], function(){
		
		circularGauge = null;
		scircularGauge = null;
		horizontalGauge = null;
		
		
		function initBarGauges(){
			horizontalGauge = new dojox.gauges.GlossyHorizontalGauge({
				background: 'white',
				id: "defaultBarGauge",
				width: 300,
				height: 55
			}, dojo.byId("defaultBarGauge"));
			horizontalGauge.startup();
		}
		
		
		/**
		 * Creates the gauges *
		 */
		function init(){
			// create a Circular Gauge
			circularGauge = dojox.gauges.GlossyCircularGauge({
				background: [255, 255, 255, 0],
				id: "cGauge",
				min: 0,
				max: 100,
				width: 250,
				height: 300
			}, dojo.byId("cGauge"));
			circularGauge.startup();
			
			// creates a Semi Circular Gauge
			scircularGauge = new dojox.gauges.GlossySemiCircularGauge({
				background: [255, 255, 255, 0],
				id: "scGauge",
				min: 0,
				max: 100,
				width: 250,
				height: 250
			}, dojo.byId("scGauge"));
			scircularGauge.startup();
			
			
			//----------------
			var gauge = new dojox.gauges.AnalogGauge({
			
				background: 'white',
				id: "gauge",
				width: 250,
				height: 200,
				cx: 125,
				cy: 150,
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
				
				indicators: [new dojox.gauges.AnalogArcIndicator({
					value: 100,
					width: 30,
					offset: 60,
					color: 'white',
					noChange: true,
					title: 'value',
					hideValue: true
				}), new dojox.gauges.AnalogArcIndicator({
					interactionMode: "gauge",
					value: 20,
					width: 20,
					offset: 65,
					color: 'gray',
					noChange: false,
					title: 'value',
					hideValue: true
				}), new dojox.gauges.TextIndicator({
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
			}, dojo.byId("gauge"));
			
			gauge.startup();
			
			dojo.connect(gauge.indicators[1], "valueChanged", dojo.hitch(gauge, function(){
				this.indicators[2].update(this.indicators[1].value);
			}));
			
			
			gauge = new dojox.gauges.AnalogGauge({
				id: "gauge2",
				startAngle: 0,
				endAngle: 270,
				background: 'white',
				id: "defaultGauge",
				width: 250,
				height: 250,
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
				
				indicators: [new dojox.gauges.AnalogArcIndicator({
					value: 1000,
					width: 30,
					offset: 65,
					strokeColor: 'black',
					color: 'white',
					noChange: true,
					title: 'value',
					hideValue: true
				}), new dojox.gauges.AnalogArcIndicator({
					value: 20,
					width: 20,
					offset: 70,
					interactionMode: "gauge",
					color: [122, 103, 140],
					noChange: false,
					title: 'value',
					hideValue: true
				}), new dojox.gauges.TextIndicator({
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
			}, dojo.byId("gauge2"));
			
			gauge.startup();
			
			dojo.connect(gauge.indicators[1], "valueChanged", dojo.hitch(gauge, function(){
				this.indicators[2].update(this.indicators[1].value);
			}));
			
			
			gauge = new dojox.gauges.AnalogGauge({
				id: "gauge3",
				startAngle: -30,
				endAngle: 30,
				background: 'white',
				width: 200,
				height: 180,
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
				
				indicators: [new dojox.gauges.AnalogNeedleIndicator({
					interactionMode: "gauge",
					value: 0,
					width: 10,
					length: 100,
					strokeColor: [100, 100, 100],
					color: [200, 200, 200]
				
				})]
			}, dojo.byId("gauge3"));
			
			gauge.startup();
			
			
			gauge = new dojox.gauges.AnalogGauge({
				id: "gauge4",
				startAngle: 20,
				endAngle: 20,
				background: 'white',
				width: 200,
				height: 200,
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
				
				indicators: [new dojox.gauges.AnalogCircleIndicator({
					interactionMode: "gauge",
					offset: 45,
					value: 5,
					length: 10,
					strokeColor: [163, 43, 38],
					color: [222, 161, 64]
				
				}), new dojox.gauges.AnalogArcIndicator({
					value: 7,
					width: 10,
					offset: 60,
					
					color: [255, 248, 178],
					noChange: true,
					title: 'value',
					hideValue: true
				})]
			}, dojo.byId("gauge4"));
			
			gauge.startup();
			
			var vista = new demos.mobileGauges.src.VistaGauge({
				id: "vista",
				color: 'white',
				background: 'white',
				min: 0,
				max: 1000,
				width: 200,
				height: 200
			}, dojo.byId("vista"));
			vista.startup();
			
			var plastic = new demos.mobileGauges.src.PlasticGauge({
				id: "plastic",
				color: 'white',
				background: 'white',
				min: 0,
				max: 1000,
				width: 200,
				height: 200
			}, dojo.byId("plastic"));
			plastic.startup();
			
			var xp = new demos.mobileGauges.src.XpGauge({
				id: "xp",
				color: [109, 183, 19],
				background: 'white',
				min: 0,
				max: 1000,
				width: 200,
				height: 200
			}, dojo.byId("xp"));
			xp.startup();
			
			
			initBarGauges();
			
		}
		
		init();
	});
});




