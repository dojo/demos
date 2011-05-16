define(["dojo/_base/kernel", "dojox/gfx", "dojox/gauges/AnalogGauge", "dojox/gauges/AnalogIndicatorBase"], function(dojo, gfx, AnalogGauge, AnalogIndicatorBase){
	dojo.declare("demos.mobileGauges.src.VistaNeedle", [AnalogIndicatorBase], {
		// summary:
		//		The needle for the demos.mobileGauges.src.VistaGauge.
		// description:
		//		This object defines the needle for demos.mobileGauges.src.VistaGauge.
		//		Since the needle is created by the gauges class, you do not have to use this class directly.
		
		
		interactionMode: "gauge",
		
		_getShapes: function(group){
		
			if (!this._gauge) {
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
				xx: 1,
				xy: 0,
				yx: 0,
				yy: 1,
				dx: -119.67852,
				dy: -176.22261
			});
			group.createPath({
				path: "M-568 67 L-568 514 L-587.0357 514 L-568 67 Z"
			}).setTransform({
				xx: 0.35927,
				xy: -0.00494,
				yx: 0.00494,
				yy: 0.35927,
				dx: 326.03697,
				dy: -4.41178
			}).setFill([63, 63, 63, 1]);
			group.createPath({
				path: "M-568.3186 67 L-568.3186 514 L-549.2829 514 L-568.3186 67 Z"
			}).setTransform({
				xx: 0.35927,
				xy: -0.00494,
				yx: 0.00494,
				yy: 0.35927,
				dx: 326.03697,
				dy: -4.41178
			}).setFill([148, 148, 148, 1]);
			group.createPath({
				path: "M-561.622 68.8092 L-561.622 515.8091 L-542.5863 515.8091 L-561.622 68.8092 Z"
			}).setTransform({
				xx: 0.35927,
				xy: -0.00494,
				yx: 0.00494,
				yy: 0.35927,
				dx: 326.03697,
				dy: -4.41178
			}).setFill([148, 148, 148, 0.41961]);
			return shapes;
		}
		
	});
	
	dojo.declare("demos.mobileGauges.src.VistaGauge", [AnalogGauge], {
	
		// value: Number
		// The value of the gauge.
		value: 0,
		
		// color: String
		// The main color of the gauge.
		color: 'white',
		
		constructor: function(){
			this._designWidth = 239.3438;
			this._designHeight = 193.33061;
			this._designCx = 119.67852;
			this._designCy = 173.92051;
		},
		
		startup: function(){
			this.inherited(arguments);
			
			if (!this.started) {
				this.started = true;
				var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
				this.cx = scale * this._designCx + (this.width - scale * this._designWidth) / 2;
				this.cy = scale * this._designCy + (this.height - scale * this._designHeight) / 2;
				this.startAngle = -38, this.endAngle = 36, this.addRange({
					low: this.min ? this.min : 0,
					high: this.max ? this.max : 100,
					color: [0, 0, 0, 0]
				});
				this.addIndicator(new demos.mobileGauges.src.VistaNeedle({
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
				dx: -0 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -2.3021 * scale + (this.height - scale * this._designHeight) / 2
			};
			if (this._gaugeBackground) {
				this._gaugeBackground.setTransform(transform);
				return this._gaugeBackground;
			}
			this._gaugeBackground = group.createGroup();
			this._gaugeBackground.setTransform(transform);
			var path2264 = this._gaugeBackground.createPath({
				path: "M117.1358 5.4444 C83.2128 5.4306 49.7681 12.661 16.8452 27.5845 C8.4241 30.6889 2.4118 38.7959 2.4118 48.2905 C2.4118 54.5757 5.0492 60.2429 9.2726 64.2611 L100.9176 183.7412 C100.9201 183.7452 100.9255 183.7475 100.928 183.7515 C104.8244 189.9912 111.7495 194.1406 119.6428 194.1406 C127.433 194.1406 134.2899 190.0928 138.2133 183.9888 C138.2173 183.9824 138.2195 183.9745 138.2236 183.9682 L230.3226 63.9722 C234.3692 59.9736 236.8738 54.4245 236.8738 48.2905 C236.8738 38.6378 230.6594 30.426 222.0175 27.44 C186.572 12.95 151.603 5.4584 117.1358 5.4444 Z"
			}).setFill({
				type: "linear",
				x1: 2.4118,
				y1: 5.4306,
				x2: 2.4118,
				y2: 194.14059,
				colors: [{
					offset: 0,
					color: [148, 152, 161, 1]
				}, {
					offset: 1,
					color: this.color
				}]
			});
			this._gaugeBackground.createPath({
				path: "M117.0938 2.3163 C82.4632 2.3021 48.3284 9.7286 14.7188 25.0165 C6.1221 28.1968 0 36.5032 0 46.2297 C0 52.6684 2.6886 58.471 7 62.5873 L100.5313 184.9806 C100.5338 184.9847 100.56 184.9765 100.5625 184.9806 C104.5402 191.3727 111.5982 195.6327 119.6563 195.6327 C127.6089 195.6327 134.6198 191.4764 138.625 185.2234 L232.6563 62.2838 C236.7872 58.1875 239.3438 52.5136 239.3438 46.2297 C239.3438 36.3412 232.9784 27.9237 224.1563 24.8648 C187.9715 10.0209 152.2799 2.3306 117.0938 2.3163 ZM116.625 5.8063 C150.4178 5.8201 184.6856 13.1883 219.4375 27.4444 C227.9103 30.3821 234 38.4626 234 47.9596 C234 53.9946 231.5612 59.4726 227.5938 63.4067 L137.2813 181.4602 C133.4347 187.4657 126.7002 191.4447 119.0625 191.4447 C111.3236 191.4447 104.5389 187.3868 100.7188 181.2478 C100.7163 181.2438 100.7212 181.2214 100.7188 181.2174 L10.875 63.6798 C6.7343 59.7265 4.125 54.1433 4.125 47.9596 C4.125 38.6182 10.025 30.6504 18.2813 27.5961 C50.56 12.9135 83.3658 5.7927 116.625 5.8063 Z"
			}).setFill({
				type: "linear",
				x1: 0,
				y1: 195.63271,
				x2: -71.80314,
				y2: 2.3021,
				colors: [{
					offset: 0,
					color: [148, 152, 161, 1]
				}, {
					offset: 1,
					color: [255, 255, 255, 1]
				}]
			});
			this._gaugeBackground.createPath({
				path: "M116.1351 7.0848 C81.6032 7.3766 40.5556 19.9001 14.6889 31.5152 C4.2441 36.4874 7.789 52.1101 16.6698 61.4239 C44.8371 90.9647 78.8228 94.1079 116.785 94.1079 C116.8303 94.1079 116.8739 94.1079 116.9192 94.1079 C117.0493 94.1079 117.1814 94.108 117.3112 94.1079 C117.3557 94.1079 117.4008 94.1079 117.4453 94.1079 C151.7962 94.1079 189.3933 90.9647 217.5606 61.4239 C226.4414 52.1101 229.9863 36.4874 219.5414 31.5152 C193.4912 19.8177 152.0454 7.2033 117.3628 7.0848 C117.3356 7.0848 117.3074 7.0848 117.2803 7.0848 C117.1714 7.0845 117.0588 7.0848 116.9501 7.0848 C116.9222 7.0849 116.8955 7.0847 116.8676 7.0848 C116.6233 7.0856 116.3801 7.0827 116.1351 7.0848 Z"
			}).setFill({
				type: "linear",
				x1: 4.2441,
				y1: 94.108,
				x2: 4.2441,
				y2: 7.0827,
				colors: [{
					offset: 0,
					color: [255, 255, 255, 0]
				}, {
					offset: 1,
					color: this.color
				}]
			});
			this._gaugeBackground.createPath({
				path: "M118.1262 17.6287 C87.685 17.9691 57.6622 24.6271 28.0906 37.953 C28.0778 37.9593 28.0622 37.957 28.0493 37.9633 C26.8242 38.565 25.6004 39.1832 24.3765 39.7997 C75.1994 26.1817 159.6654 18.156 210.4371 53.7432 L220.9033 39.2735 C219.9898 38.7913 219.0344 38.3875 218.0455 38.0458 C185.1411 24.5946 152.6811 17.6417 120.6848 17.6287 C120.1928 17.6285 119.7013 17.6256 119.2095 17.6287 C119.0885 17.6294 118.9695 17.6277 118.8484 17.6287 C118.6087 17.6306 118.3659 17.626 118.1262 17.6287 Z"
			}).setFill({
				type: "linear",
				x1: 220.90331,
				y1: 17.6256,
				x2: 24.3765,
				y2: 17.6256,
				colors: [{
					offset: 0,
					color: [255, 0, 0, 1]
				}, {
					offset: 1,
					color: [255, 255, 255, 0]
				}]
			});
			return this._gaugeBackground;
		},
		
		drawForeground: function(group){
			var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
			var transform = {
				xx: scale,
				xy: 0,
				yx: 0,
				yy: scale,
				dx: -0 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -2.3021 * scale + (this.height - scale * this._designHeight) / 2
			};
			if (this._foreground) {
				this._foreground.setTransform(transform);
				return this._foreground;
			}
			this._foreground = group.createGroup();
			this._foreground.setTransform(transform);
			var group1 = this._foreground.createGroup().setTransform({
				xx: 0.33014,
				xy: 0,
				yx: 0,
				yy: 0.33014,
				dx: 307.85431,
				dy: 3.64925
			});
			group1.createPath({
				path: "M156.6411 -104.8439 C156.6449 -100.6428 154.4058 -96.7591 150.7681 -94.6575 C147.1304 -92.5558 142.6475 -92.5558 139.0099 -94.6575 C135.3722 -96.7591 133.1331 -100.6428 133.1368 -104.8439 C133.1331 -109.0451 135.3722 -112.9287 139.0099 -115.0304 C142.6475 -117.1321 147.1304 -117.1321 150.7681 -115.0304 C154.4058 -112.9287 156.6449 -109.0451 156.6411 -104.8439 Z"
			}).setTransform({
				xx: 2.97816,
				xy: 0,
				yx: 0,
				yy: 2.89308,
				dx: -1002.50299,
				dy: 827.32251
			}).setFill({
				type: "radial",
				cx: 144.889,
				cy: -104.84395,
				r: 12.02202,
				colors: [{
					offset: 0,
					color: [27, 27, 27, 0]
				}, {
					offset: 0.65,
					color: [27, 27, 27, 0]
				}, {
					offset: 0.79396,
					color: [27, 27, 27, 0.52941]
				}, {
					offset: 1,
					color: [27, 27, 27, 0]
				}]
			});
			group1.createPath({
				path: "M154.0331 -104.8439 C154.0331 -99.7938 149.9391 -95.6998 144.889 -95.6998 C139.8388 -95.6998 135.7449 -99.7938 135.7449 -104.8439 C135.7449 -109.8941 139.8388 -113.9881 144.889 -113.9881 C149.9391 -113.9881 154.0331 -109.8941 154.0331 -104.8439 Z"
			}).setTransform({
				xx: 3.17144,
				xy: 0,
				yx: 0,
				yy: 3.17144,
				dx: -1030.50696,
				dy: 856.50671
			}).setFill({
				type: "radial",
				cx: 144.889,
				cy: -109.41602,
				r: 18.28825,
				colors: [{
					offset: 0,
					color: [149, 149, 149, 1]
				}, {
					offset: 0.5,
					color: [0, 0, 0, 1]
				}, {
					offset: 1,
					color: [0, 0, 0, 1]
				}]
			});
			group1.createPath({
				path: "M154.0331 -104.8439 C154.0331 -99.7938 149.9391 -95.6998 144.889 -95.6998 C139.8388 -95.6998 135.7449 -99.7938 135.7449 -104.8439 C135.7449 -109.8941 139.8388 -113.9881 144.889 -113.9881 C149.9391 -113.9881 154.0331 -109.8941 154.0331 -104.8439 Z"
			}).setTransform({
				xx: 2.36108,
				xy: 0,
				yx: 0,
				yy: 2.39968,
				dx: -913.0957,
				dy: 775.59149
			}).setFill([105, 105, 105, 0.27451]);
			
			group1.createPath({
				path: "M156.6411 -104.8439 C156.6449 -100.6428 154.4058 -96.7591 150.7681 -94.6575 C147.1304 -92.5558 142.6475 -92.5558 139.0099 -94.6575 C135.3722 -96.7591 133.1331 -100.6428 133.1368 -104.8439 C133.1331 -109.0451 135.3722 -112.9287 139.0099 -115.0304 C142.6475 -117.1321 147.1304 -117.1321 150.7681 -115.0304 C154.4058 -112.9287 156.6449 -109.0451 156.6411 -104.8439 Z"
			}).setTransform({
				xx: 2.97816,
				xy: 0,
				yx: 0,
				yy: 2.89308,
				dx: -1002.50299,
				dy: 827.32251
			}).setFill({
				type: "linear",
				x1: 133.1331,
				y1: -92.5558,
				x2: 133.1331,
				y2: -117.1321,
				colors: [{
					offset: 0,
					color: [27, 27, 27, 0.52941]
				}, {
					offset: 1,
					color: [27, 27, 27, 0]
				}]
			});
			this._foreground.createPath({
				path: "M-874.613 125.7473 C-874.6068 128.4592 -876.0499 130.9677 -878.3974 132.3254 C-880.7449 133.6831 -883.6389 133.6831 -885.9865 132.3254 C-888.3339 130.9677 -889.7771 128.4592 -889.7709 125.7473 C-889.7771 123.0355 -888.3339 120.5269 -885.9865 119.1692 C-883.6389 117.8115 -880.7449 117.8115 -878.3974 119.1692 C-876.0499 120.5269 -874.6068 123.0355 -874.613 125.7473 Z"
			}).setTransform({
				xx: 0.33014,
				xy: 0,
				yx: 0,
				yy: 0.33014,
				dx: 310.74991,
				dy: 2.60325
			}).setFill([0, 0, 0, 1]);
			
			this._foreground.createPath({
				path: "M116.1351 7.0848 C81.6032 7.3766 40.5556 19.9001 14.6889 31.5152 C4.2441 36.4874 7.789 52.1101 16.6698 61.4239 C44.8371 90.9647 78.8228 94.1079 116.785 94.1079 C116.8303 94.1079 116.8739 94.1079 116.9192 94.1079 C117.0493 94.1079 117.1814 94.108 117.3112 94.1079 C117.3557 94.1079 117.4008 94.1079 117.4453 94.1079 C151.7962 94.1079 189.3933 90.9647 217.5606 61.4239 C226.4414 52.1101 229.9863 36.4874 219.5414 31.5152 C193.4912 19.8177 152.0454 7.2033 117.3628 7.0848 C117.3356 7.0848 117.3074 7.0848 117.2803 7.0848 C117.1714 7.0845 117.0588 7.0848 116.9501 7.0848 C116.9222 7.0849 116.8955 7.0847 116.8676 7.0848 C116.6233 7.0856 116.3801 7.0827 116.1351 7.0848 Z"
			}).setFill({
				type: "linear",
				x1: 4.2441,
				y1: 94.108,
				x2: 229.9863,
				y2: 7.0827,
				colors: [{
					offset: 0,
					color: [255, 255, 255, 0]
				}, {
					offset: 1,
					color: [255, 255, 255, 1]
				}]
			});
			return this._foreground;
		}
		
	});
});

