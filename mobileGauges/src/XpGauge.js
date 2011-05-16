dojo.provide("demos.mobileGauges.src.XpGauge");

dojo.require("dojox.gfx");
dojo.require("dojox.gfx.matrix");
dojo.require("dojox.gauges.AnalogGauge");

dojo.declare("demos.mobileGauges.src.XpGaugeNeedle",[dojox.gauges.AnalogIndicatorBase],{
    // summary:
	//		The needle for the demos.mobileGauges.src.XpGaugeNeedle.
	// description:
	//		This object defines the needle for demos.mobileGauges.src.XpGaugeNeedle.
	//		Since the needle is created by the gauges class, you do not have to use this class directly.

     interactionMode: "gauge",
	 
	_getShapes: function(group){
		if(!this._gauge){
			return null;
		}
		var shapes = [];
		shapes[0] = group.createGroup();
		var scale = Math.min((this._gauge.width / this._gauge._designWidth), (this._gauge.height / this._gauge._designHeight));
		shapes[0].createGroup().setTransform({
			xx: scale,
			xy: 0,
			yx: 0,
			yy: scale,
			dx: 0,
			dy: 0
		});
		var group = shapes[0].children[0].createGroup().setTransform({
			xx: 0.71507,
			xy: 0,
			yx: 0,
			yy: 0.71507,
			dx: 277.40354,
			dy: -72.83034
		});
		group.createPath({
			path: "M-396.8819 108.376 C-396.8819 108.376 -396.8819 146.4387 -396.8819 146.4387 C-396.8819 146.4387 -378.8819 146.4387 -378.8819 146.4387 L-378.8819 108.376 L-387.7366 -48 L-396.8819 108.376 L-396.8819 108.376"
		}).setFill([0,0,0,1]);
		group.createPath({
			path: "M-398 121.5498 C-391.2927 125.4647 -384.5854 124.8984 -377.8781 121.5498 L-377.8781 148 L-398 148 L-398 121.5498 Z"
		}).setFill([0,0,0,0.17255]);
		return shapes;
	}

});

dojo.declare("demos.mobileGauges.src.XpGauge",[dojox.gauges.AnalogGauge],{

	// value: Number
	// The value of the gauge.
    value:0,
	
  	// color: String
	// The main color of the gauge.
    color:'white',
	
	constructor: function(){
		this._designWidth = 271.9999;
		this._designHeight = 278.21621;
		this._designCx = 134.04445;
		this._designCy = 139.46543;
	},

	startup: function(){
		this.inherited(arguments);
		
		if (!this.started) {
			this.started = true;
			
			var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
			this.cx = scale * this._designCx + (this.width - scale * this._designWidth) / 2;
			this.cy = scale * this._designCy + (this.height - scale * this._designHeight) / 2;
			this.startAngle = -150, this.endAngle = 150, this.addRange({
				low: this.min ? this.min : 0,
				high: this.max ? this.max : 100,
				color: [0, 0, 0, 0]
			});
			this.addIndicator(new demos.mobileGauges.src.XpGaugeNeedle({
				value: this.min ? this.min : 0
			}));
		}
	},

	drawBackground: function(group){
		var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
		var transform = {
				xx: scale,
				xy: 0,
				yx: 0,
				yy: scale,
				dx: -19.00001 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -8.69379 * scale + (this.height - scale * this._designHeight) / 2
		};
		if (this._gaugeBackground) {
			this._gaugeBackground.setTransform(transform);
			return this._gaugeBackground;
		}
		this._gaugeBackground = group.createGroup();
		this._gaugeBackground.setTransform(transform);
		this._gaugeBackground.createPath({
			path: "M-173.0061 124.4931 C-173.0061 201.013 -232.7403 263.0446 -306.4261 263.0446 C-380.1119 263.0446 -439.8461 201.013 -439.8461 124.4931 C-439.8461 47.9732 -380.1119 -14.0584 -306.4261 -14.0584 C-232.7403 -14.0584 -173.0061 47.9732 -173.0061 124.4931 Z"
		}).setTransform({
			xx: 1.01934,
			xy: 0,
			yx: 0,
			yy: 0.97465,
			dx: 467.35144,
			dy: 29.38342
		}).setFill({
			type: "linear",
			x1: -173.0061,
			y1: 263.0446,
			x2: -439.8461,
			y2: -14.0584,
			colors: [
			         {offset: 0, color: [255,255,255,1]},
			         {offset: 1, color: [255,255,255,0]}
			         ]
		});
		this._gaugeBackground.createPath({
			path: "M-205.5619 101.3509 C-205.5431 166.5002 -240.2889 226.7086 -296.7067 259.2886 C-353.1244 291.8687 -422.6394 291.8687 -479.0571 259.2886 C-535.4749 226.7086 -570.2208 166.5002 -570.2019 101.3509 C-570.2208 36.2017 -535.4749 -24.0067 -479.0571 -56.5868 C-422.6394 -89.1668 -353.1244 -89.1668 -296.7067 -56.5868 C-240.2889 -24.0067 -205.5431 36.2017 -205.5619 101.3509 Z"
		}).setTransform({
			xx: 0.71507,
			xy: 0,
			yx: 0,
			yy: 0.71507,
			dx: 430.448,
			dy: 75.32888
		}).setFill({
			type: "linear",
			x1: -570.22083,
			y1: -89.1668,
			x2: -314.94641,
			y2: 291.86872,
			colors: [
			         {offset: 0, color: [226,226,221,1]},
			         {offset: 0.5, color: [239,239,236,1]},
			         {offset: 1, color: [255,255,255,1]}
			         ]
		}).setStroke({
			color: [50,50,50,1],
			width: 7.7,
			style: "Solid",
			cap: "butt",
			join: 4.0
		});
		this._gaugeBackground.createPath({
			path: "M153.4913 19.8239 C82.6972 19.8239 25.2556 77.1279 25.2556 147.7285 C25.2556 218.3291 82.6972 275.6331 153.4913 275.6331 C224.2853 275.6331 281.7612 218.3291 281.7612 147.7285 C281.7612 77.1279 224.2853 19.8239 153.4913 19.8239 ZM153.4913 43.6926 C210.4205 43.6926 256.6418 90.3015 256.6418 147.7285 C256.6418 205.1556 210.4205 251.7645 153.4913 251.7645 C96.562 251.7645 50.375 205.1556 50.375 147.7285 C50.375 90.3015 96.562 43.6926 153.4913 43.6926 Z"
		}).setFill({
			type: "linear",
			x1: 25.2556,
			y1: 19.8239,
			x2: 25.2556,
			y2: 275.63309,
			colors: [
			         {offset: 0, color: [229,231,236,1]},
			         {offset: 0.25, color: this.color},
			         {offset: 0.5, color: this.color},
			         {offset: 0.75, color: this.color},
			         {offset: 1, color: [229,231,236,1]}
			         ]
		});
	    this._gaugeBackground.createPath({
			path: "M152.3307 58.049 C133.0812 58.4087 113.7945 64.9977 97.737 78.1115 C66.5728 103.5625 57.1373 145.7786 71.7995 181.1427 C57.6682 145.8503 67.176 103.9678 97.987 78.6427 C135.9081 47.4734 191.8301 53.1329 222.7994 91.299 C242.6392 115.7491 247.4339 147.6288 238.362 175.5802 C247.8192 147.5173 243.1198 115.3504 223.0182 90.7365 C205.0474 68.7317 178.7096 57.556 152.3307 58.049 Z"
		}).setFill({
			type: "linear",
			x1: 57.1373,
			y1: 47.4734,
			x2: 57.1373,
			y2: 181.1427,
			colors: [
			         {offset: 0, color: [55,98,6,1]},
			         {offset: 1, color: [55,98,6,0]}
			         ]
		});
		this._gaugeBackground.createPath({
			path: "M-389.2685 91.1524 C-389.2685 194.5704 -473.1053 278.4072 -576.5233 278.4072 C-679.9412 278.4072 -763.778 194.5704 -763.778 91.1524 C-763.778 -12.2655 -679.9412 -96.1024 -576.5233 -96.1024 C-473.1053 -96.1024 -389.2685 -12.2655 -389.2685 91.1524 Z"
		}).setTransform({
			xx: 0.09854,
			xy: 0.45725,
			yx: -0.45905,
			yy: 0.09892,
			dx: 169.20416,
			dy: -126.83276
		}).setFill(null).setStroke({
			color: [255,255,255,1],
			width: 3.04506,
			style: "Solid",
			cap: "butt",
			join: 4.0
		});
		this._gaugeBackground.createPath({
			path: "M242.6169 148.7242 L237.2635 150.4927 C233.7739 173.1482 214.2777 198.8404 190.9431 208.7428 C190.9431 208.7428 196.3818 213.7739 204.0144 220.4023 C228.2705 204.9185 243.0555 177.7063 242.6169 148.7242 Z"
		}).setFill({
			type: "linear",
			x1: 190.9431,
			y1: 220.4023,
			x2: 190.9431,
			y2: 148.7242,
			colors: [
			         {offset: 0, color: [255,6,6,1]},
			         {offset: 1, color: [255,6,6,0]}
			         ]
		});
		this._gaugeBackground.createPath({
			path: "M-857.7244 123.4918 C-857.7244 179.5434 -903.1633 224.9823 -959.2148 224.9823 C-1015.2665 224.9823 -1060.7053 179.5434 -1060.7053 123.4918 C-1060.7053 67.4402 -1015.2665 22.0014 -959.2148 22.0014 C-903.1633 22.0014 -857.7244 67.4402 -857.7244 123.4918 Z"
		}).setTransform({
			xx: 0.04025,
			xy: 0,
			yx: 0,
			yy: 0.04025,
			dx: 151.24274,
			dy: 214.22984
		}).setFill([0,0,0,1]);
		return this._gaugeBackground;
	},

	drawForeground: function(group){
		var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
		var transform = {
				xx: scale,
				xy: 0,
				yx: 0,
				yy: scale,
				dx: -19.00001 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -8.69379 * scale + (this.height - scale * this._designHeight) / 2
		};
		if (this._foreground) {
			this._foreground.setTransform(transform);
			return this._foreground;
		}
		this._foreground = group.createGroup();
		this._foreground.setTransform(transform);
		var group = this._foreground.createGroup().setTransform({
			xx: 0.71507,
			xy: 0,
			yx: 0,
			yy: 0.71507,
			dx: 430.448,
			dy: 75.32888
		});
		group.createPath({
			path: "M-4.7084 99.7372 C-4.708 100.4807 -5.0836 101.1679 -5.6936 101.5398 C-6.3035 101.9116 -7.0551 101.9116 -7.6651 101.5398 C-8.275 101.1679 -8.6506 100.4807 -8.6503 99.7372 C-8.6506 98.9937 -8.275 98.3065 -7.6651 97.9346 C-7.0551 97.5628 -6.3035 97.5628 -5.6936 97.9346 C-5.0836 98.3065 -4.708 98.9937 -4.7084 99.7372 Z"
		}).setTransform({
			xx: 12.68481,
			xy: 0,
			yx: 0,
			yy: 11.40371,
			dx: -303.27289,
			dy: -1034.099
		}).setFill([0,0,0,0.17255]);
		group.createPath({
			path: "M-4.7084 99.7372 C-4.708 100.4807 -5.0836 101.1679 -5.6936 101.5398 C-6.3035 101.9116 -7.0551 101.9116 -7.6651 101.5398 C-8.275 101.1679 -8.6506 100.4807 -8.6503 99.7372 C-8.6506 98.9937 -8.275 98.3065 -7.6651 97.9346 C-7.0551 97.5628 -6.3035 97.5628 -5.6936 97.9346 C-5.0836 98.3065 -4.708 98.9937 -4.7084 99.7372 Z"
		}).setTransform({
			xx: 11.66952,
			xy: 0,
			yx: 0,
			yy: 10.95128,
			dx: -310.05551,
			dy: -990.78137
		}).setFill({
			type: "radial",
			cx: -7.66495,
			cy: 99.7372,
			r: 2.07285,
			colors: [
			         {offset: 0, color: [58,215,58,1]},
			         {offset: 1, color: [33,161,33,1]}
			         ]
		});
		group.createPath({
			path: "M-4.7084 99.7372 C-4.708 100.4807 -5.0836 101.1679 -5.6936 101.5398 C-6.3035 101.9116 -7.0551 101.9116 -7.6651 101.5398 C-8.275 101.1679 -8.6506 100.4807 -8.6503 99.7372 C-8.6506 98.9937 -8.275 98.3065 -7.6651 97.9346 C-7.0551 97.5628 -6.3035 97.5628 -5.6936 97.9346 C-5.0836 98.3065 -4.708 98.9937 -4.7084 99.7372 Z"
		}).setTransform({
			xx: 11.1657,
			xy: 0,
			yx: 0,
			yy: 10.47848,
			dx: -313.30249,
			dy: -943.7442
		}).setFill({
			type: "linear",
			x1: -8.6506,
			y1: 97.5628,
			x2: -8.6506,
			y2: 101.9116,
			colors: [
			         {offset: 0, color: [255,255,246,1]},
			         {offset: 0.17857, color: [252,251,236,1]},
			         {offset: 0.25755, color: [250,247,230,1]},
			         {offset: 0.77747, color: [246,243,224,1]},
			         {offset: 1, color: [227,209,184,1]}
			         ]
		});
		this._foreground.createPath({
			path: "M256.7496 77.8699 C256.7496 101.5357 210.5274 65.772 153.5749 65.772 C96.6225 65.772 50.4002 101.5357 50.4002 77.8699 C50.4002 54.2042 96.6225 16.6425 153.5749 16.6425 C210.5274 16.6425 256.7496 54.2042 256.7496 77.8699 Z"
		}).setFill({
			type: "linear",
			x1: 50.4002,
			y1: 16.6425,
			x2: 50.4002,
			y2: 101.5357,
			colors: [
			         {offset: 0, color: [255,255,255,0.79216]},
			         {offset: 1, color: [255,255,255,0]}
			         ]
		});
		return this._foreground;
	}

});

