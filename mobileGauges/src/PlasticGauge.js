dojo.provide("demos.mobileGauges.src.PlasticGauge");

dojo.require("dojox.gfx");
dojo.require("dojox.gfx.matrix");
dojo.require("dojox.gauges.AnalogGauge");

dojo.declare("demos.mobileGauges.src.PlasticGaugeNeedle", [dojox.gauges.AnalogIndicatorBase], {
    // summary:
	//		The needle for the demos.mobileGauges.src.PlasticGauge.
	// description:
	//		This object defines the needle for demos.mobileGauges.src.PlasticGauge.
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
		shapes[0].children[0].createPath({
			path: "M110.7111 240.7052 L40.2413 243.5956 L35.7179 240.2207 L35.7208 239.7787 L40.287 236.5255 L110.714 240.2633 L110.7111 240.7052 Z"
		}).setTransform({
			xx: -0,
			xy: 1,
			yx: -1,
			yy: 0,
			dx: -240.06055,
			dy: 35.7179
		}).setFill([0,0,0,1]).setStroke({
			color: [0,0,0,1],
			width: 0.5,
			style: "Solid",
			cap: "round",
			join: "round"
		});
		return shapes;
	}

});

dojo.declare("demos.mobileGauges.src.PlasticGauge", [dojox.gauges.AnalogGauge], {
  
  	// value: Number
	// The value of the gauge.
    value:'0',
	
  	// color: String
	// The main color of the gauge.
    color:'white',

	constructor: function(){
		this._designWidth = 114.31541;
		this._designHeight = 89.43156;
		this._designCx = 22.58446;
		this._designCy = 75.24691;
	},

	startup: function(){
		this.inherited(arguments);

		if (!this.started) {
			this.started = true;
			
			var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
			this.cx = scale * this._designCx + (this.width - scale * this._designWidth) / 2;
			this.cy = scale * this._designCy + (this.height - scale * this._designHeight) / 2;
			this.startAngle = 30, this.endAngle = 90, this.addRange({
				low: this.min ? this.min : 0,
				high: this.max ? this.max : 100,
				color: [0, 0, 0, 0]
			});
			this.addIndicator(new demos.mobileGauges.src.PlasticGaugeNeedle({
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
				dx: -13.13344 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -164.81363 * scale + (this.height - scale * this._designHeight) / 2
		};
		if (this._gaugeBackground) {
			this._gaugeBackground.setTransform(transform);
			return this._gaugeBackground;
		}
		this._gaugeBackground = group.createGroup();
		this._gaugeBackground.setTransform(transform);
		this._gaugeBackground.createPath({
			path: "M70.2911 166.9391 C38.8858 166.9391 13.3973 192.4276 13.3973 223.833 C13.3973 232.6658 15.4485 241.0258 19.0454 248.487 C46.2291 253.2247 89.9945 253.3063 121.5781 248.487 C125.175 241.0258 127.185 232.6658 127.185 223.833 C127.185 192.4276 101.6965 166.9391 70.2911 166.9391 Z"
		}).setFill({
			type: "linear",
			x1: 13.3973,
			y1: 253.3063,
			x2: 13.3973,
			y2: 166.9391,
			colors: [
			         {offset: 0, color: [210,211,217,1]},
			         {offset: 1, color: this.color}
			         ]
		}).setStroke({
			color: [140,141,144,1],
			width: 0.52771,
			style: "Solid",
			cap: "round",
			join: "round"
		});
		this._gaugeBackground.createPath({
			path: "M69.9794 174.9785 C43.0091 174.9785 21.1249 196.8627 21.1249 223.833 C21.1249 229.7463 22.1659 235.4062 24.0932 240.6538 C52.0999 246.5452 88.1002 246.188 115.9068 240.6538 C117.834 235.4063 118.8751 229.7462 118.8751 223.833 C118.8751 196.8627 96.9497 174.9785 69.9794 174.9785 Z"
		}).setFill({
			type: "linear",
			x1: -89.86258,
			y1: 26.90753,
			x2: -54.28724,
			y2: -71.1935,
			colors: [
			         {offset: 0, color: [237,237,237,1]},
			         {offset: 1, color: [255,255,255,1]}
			         ]
		}).setStroke({
			color: [140,141,144,1],
			width: 0.65964,
			style: "Solid",
			cap: "round",
			join: "round"
		});
	    this._gaugeBackground.createPath({
			path: "M-63.7258 21.8693 C-63.7244 23.417 -64.5492 24.8477 -65.8893 25.6219 C-67.2293 26.3961 -68.8808 26.3961 -70.2208 25.6219 C-71.5609 24.8477 -72.3857 23.417 -72.3842 21.8693 C-72.3857 20.3217 -71.5609 18.891 -70.2208 18.1167 C-68.8808 17.3425 -67.2293 17.3425 -65.8893 18.1167 C-64.5492 18.891 -63.7244 20.3217 -63.7258 21.8693 Z"
		}).setTransform({
			xx: 2.02006,
			xy: 0,
			yx: 0,
			yy: 2.02006,
			dx: 173.12596,
			dy: 195.29124
		}).setFill([0,0,0,1]).setStroke({
			color: [0,0,0,1],
			width: 0.5,
			style: "Solid",
			cap: "round",
			join: "round"
		});
		this._gaugeBackground.createPath({
			path: "M70.2898 167.2219 C38.9871 167.2219 13.5695 192.7227 13.5695 224.1281 C13.5695 230.1028 14.5333 235.8429 16.2482 241.2531 C14.9011 236.3357 14.1613 231.1697 14.1613 225.8156 C14.1613 194.0786 39.2778 168.3156 70.2275 168.3156 C101.1773 168.3156 126.2937 194.0786 126.2937 225.8156 C126.2937 232.3017 125.2354 238.5305 123.3035 244.3469 C125.6912 238.0586 126.979 231.2559 126.979 224.1281 C126.979 192.7227 101.5926 167.2219 70.2898 167.2219 Z"
		}).setFill({
			type: "linear",
			x1: 13.5695,
			y1: 244.34689,
			x2: 13.5695,
			y2: 167.22189,
			colors: [
			         {offset: 0, color: [255,255,255,0]},
			         {offset: 1, color: [255,255,255,1]}
			         ]
		});

		this._gaugeBackground.createPath({
			path: "M68.6903 182.1335 C83.9812 190.6857 96.383 204.3913 102.6618 221.6294 L98.4978 223.196 C91.8473 204.8877 77.864 190.7697 60.8984 183.1229 C63.4252 182.5564 66.0178 182.2339 68.6903 182.1335 ZM98.4978 223.196 C98.9992 224.5763 99.442 225.9742 99.8583 227.4012 C101.3612 232.553 102.2253 237.7616 102.4968 242.944 C100.9988 243.142 99.485 243.3119 97.9618 243.4799 C97.7303 238.5659 96.9499 233.6058 95.5294 228.7205 C95.1432 227.3923 94.7163 226.0889 94.2514 224.8039 L98.4978 223.196 ZM94.2514 224.8039 L89.9225 226.4118 C83.0323 207.3091 67.0108 193.4131 48.2828 188.1527 C50.1488 187.038 52.1437 186.0932 54.1783 185.2668 C72.2584 191.7863 87.4132 205.9054 94.2514 224.8039 ZM89.9225 226.4118 C90.354 227.6082 90.7599 228.8032 91.1181 230.0398 C92.4532 234.6496 93.1796 239.3328 93.3856 243.9746 C91.8422 244.113 90.2874 244.2368 88.7269 244.3457 C88.5517 240.0316 87.8604 235.6887 86.6243 231.4003 C86.2942 230.2551 85.9506 229.1275 85.5524 228.0196 L89.9225 226.4118 ZM85.5524 228.0196 L81.0586 229.7099 C74.4323 211.1953 57.6326 198.438 38.8829 195.7798 C40.2295 194.3396 41.6805 192.9842 43.2118 191.7395 C62.1477 195.6954 78.7376 209.0591 85.5524 228.0196 ZM81.0586 229.7099 C81.4229 230.728 81.7465 231.7497 82.048 232.802 C83.1677 236.7096 83.7873 240.6629 83.9445 244.593 C82.2988 244.6758 80.6528 244.748 78.9972 244.7992 C78.8601 241.2883 78.3424 237.7415 77.3481 234.245 C77.078 233.2951 76.7677 232.3606 76.4411 231.4415 L81.0586 229.7099 ZM76.4411 231.4415 L71.7412 233.173 C65.8052 216.3436 49.4933 205.4037 32.1628 205.1796 C33.061 203.4697 34.1021 201.8385 35.2137 200.2736 C53.4218 201.6817 70.114 213.6381 76.4411 231.4415 ZM71.7412 233.173 C72.0318 233.9971 72.2847 234.8362 72.5245 235.6879 C73.3822 238.7342 73.8766 241.8196 74.0087 244.8816 C72.2636 244.9024 70.5186 244.9363 68.7728 244.9229 C68.6485 242.3525 68.2468 239.7729 67.536 237.2133 C67.3271 236.4612 67.0892 235.7147 66.8351 234.987 L71.7412 233.173 ZM66.8351 234.987 L61.8054 236.8835 C57.0222 222.9262 42.7054 214.2804 28.2874 215.8163 C28.7013 213.9473 29.2471 212.1435 29.8953 210.3743 C45.9378 209.6198 61.413 219.4615 66.8351 234.987 ZM61.8054 236.8835 C62.0162 237.4988 62.2095 238.1031 62.3825 238.7388 C62.9289 240.7459 63.2493 242.7796 63.372 244.7992 C61.4625 244.7463 59.5798 244.6862 57.6826 244.593 C57.5667 243.1933 57.3487 241.7803 56.9817 240.3878 C56.8455 239.8707 56.695 239.3634 56.5282 238.8624 L61.8054 236.8835 ZM56.5282 238.8624 L50.9213 240.965 C47.8223 231.1824 37.3318 225.4383 27.3392 227.6073 C27.2947 226.8057 27.2568 225.9877 27.2568 225.1749 C27.2568 223.9548 27.3633 222.7415 27.4629 221.5469 C39.8639 219.5312 52.5165 226.8145 56.5282 238.8624 ZM50.9213 240.965 C51.0434 241.3504 51.1525 241.7218 51.2511 242.1194 C51.4273 242.8295 51.5731 243.5493 51.6634 244.2632 C49.4214 244.1013 47.1875 243.9041 44.9846 243.686 C44.9441 243.5205 44.9066 243.3533 44.8609 243.1913 L50.9213 240.965 ZM44.8609 243.1913 L43.8714 243.5624 C41.3275 243.2987 38.7982 242.993 36.3268 242.6554 C34.9103 241.1733 32.6985 240.4104 30.5962 240.6764 C30.4576 240.694 30.3193 240.7341 30.1839 240.7589 C29.3285 238.56 28.651 236.2717 28.1638 233.9151 C28.2889 233.8834 28.408 233.82 28.5348 233.7915 C35.5015 232.2232 42.9117 236.291 44.8609 243.1913 ZM102.6618 221.6294 L106.7845 220.104 C107.3541 221.6637 107.8782 223.2323 108.3511 224.8451 C109.741 229.5843 110.6167 234.374 111.0722 239.151 C110.7714 240.0272 110.4336 240.8973 110.0827 241.7484 C109.0446 241.9281 108.0043 242.1203 106.9494 242.2843 C106.6436 236.8958 105.714 231.483 104.1459 226.1232 C103.7013 224.6035 103.1971 223.0992 102.6618 221.6294 ZM106.7845 220.104 C101.1287 204.6159 90.7811 191.8014 77.8841 182.7519 C81.9585 183.4721 85.8339 184.7643 89.4277 186.5448 C98.7964 195.2376 106.2499 206.0894 110.8248 218.6198 L106.7845 220.104 ZM110.8248 218.6198 L112.8037 217.8777 C113.2087 220.2488 113.4221 222.6889 113.4221 225.1749 C113.4221 225.7942 113.4068 226.4172 113.3809 227.0302 C113.0972 225.8798 112.8106 224.713 112.4739 223.567 C111.979 221.8831 111.4196 220.2488 110.8248 218.6198 Z"
		}).setFill([0,0,0,0.09412]).setStroke({
			color: [0,0,0,0.09412],
			width: 0.65964,
			style: "Solid",
			cap: "round",
			join: "round"
		});
	},

	drawForeground: function(group){
		var scale = Math.min((this.width / this._designWidth), (this.height / this._designHeight));
		var transform = {
				xx: scale,
				xy: 0,
				yx: 0,
				yy: scale,
				dx: -13.13344 * scale + (this.width - scale * this._designWidth) / 2,
				dy: -164.81363 * scale + (this.height - scale * this._designHeight) / 2
		};
		if (this._foreground) {
			this._foreground.setTransform(transform);
			return this._foreground;
		}
		this._foreground = group.createGroup();
		this._foreground.setTransform(transform);
		this._foreground.createPath({
			path: "M-63.3401 21.8693 C-63.3387 23.417 -64.1635 24.8477 -65.5036 25.6219 C-66.8436 26.3961 -68.4951 26.3961 -69.8351 25.6219 C-71.1752 24.8477 -72 23.417 -71.9985 21.8693 C-72 20.3217 -71.1752 18.891 -69.8351 18.1167 C-68.4951 17.3425 -66.8436 17.3425 -65.5036 18.1167 C-64.1635 18.891 -63.3387 20.3217 -63.3401 21.8693 Z"
		}).setTransform({
			xx: 2.02006,
			xy: 0,
			yx: 0,
			yy: 2.02006,
			dx: 172.72366,
			dy: 194.96706
		}).setFill({
			type: "linear",
			x1: -72,
			y1: 17.3425,
			x2: -69.40161,
			y2: 26.3961,
			colors: [
			         {offset: 0.1, color: [0,0,0,1]},
			         {offset: 0.5, color: [255,255,255,0.46275]},
			         {offset: 0.9, color: [0,0,0,1]}
			         ]
		});

	}

});