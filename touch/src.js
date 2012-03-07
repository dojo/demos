require([
	"dojox/charting/Theme",
	"dojo/parser",
	"dijit/_base",
	"dijit/form/HorizontalSlider",
	"dijit/form/HorizontalRuleLabels",
	"dojox/charting/Chart2D",
	"dojox/charting/widget/Legend",
	"dojox/gesture/tap",
	"demos/touch/rotate"
], function(Theme){

	(function(){
		var g = Theme.generateGradient, themes = dojo.getObject("dojox.charting.themes", true);
		defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};
		
		themes.Lily = new Theme({
			series: {
				stroke:  {width: 2.5, color: "#eaf2cb"},
				outline: null,
				font: "normal normal normal 8pt Helvetica, Arial, sans-serif",
			},
			seriesThemes: [
				{fill: g(defaultFill, "#F59908", "#FAD838")},
				{fill: g(defaultFill, "#DD0000", "#F05853")},	
				{fill: g(defaultFill, "#7FB0DB", "#B5D2F0")},	
				{fill: g(defaultFill, "#5082BD", "#74AEED")},	
				{fill: g(defaultFill, "#54A201", "#78D000")}	
			]
		});
		
		themes.Lily.next = function(elementType, mixin, doPost){
			var isLine = elementType == "line";
			if(isLine || elementType == "area"){
				// cusLily processing for lines: substitute colors
				var s = this.seriesThemes[this._current % this.seriesThemes.length];
				s.fill.space = "plot";
				if(isLine){
					s.stroke  = { width: 4, color: s.fill.colors[0].color};
				}
				var theme = Theme.prototype.next.apply(this, arguments);
				// cleanup
				delete s.outline;
				delete s.stroke;
				s.fill.space = "shape";
				return theme;
			}
			return Theme.prototype.next.apply(this, arguments);
		};
		
		themes.Lily.post = function(theme, elementType){
			theme = Theme.prototype.post.apply(this, arguments);
			if((elementType == "slice" || elementType == "circle") && theme.series.fill && theme.series.fill.type == "radial"){
				theme.series.fill = dojox.gfx.gradutils.reverse(theme.series.fill);
			}
			return theme;
		};
	})();
	
	var rotation = 0;
	var pieChart;
	var seriesData = [];
	var degrees = [];
	var percentages = [];
	var colors = ["#FF9701", "#E70000", "#94C0E9", "#427BB8", "#5BA800"];
	var texts = ["Music", "Sports", "Arts", "Environment", "Entertainment"];
	var currentRotation = 0;
	var currentIndex = 0;
	var locked = false;
	var rotateEnd;
	var rotate;
	var pieChartDiv;
	
	function changeSlice(fromIndex, toIndex){
		setTimeout(function(){
			dojo.animateProperty({
				node: dojo.byId("log"),
				duration: 500,
				properties: {
					backgroundColor: {
						start: colors[fromIndex],
						end: colors[toIndex]
					}
				}
			}).play();
		}, 0);
		setTimeout(function(){
			dojo.animateProperty({
				node: dojo.byId("tooltip"),
				duration: 500,
				properties: {
					backgroundColor: {
						start: colors[fromIndex],
						end: colors[toIndex]
					}
				}
			}).play();
		}, 0);
		
		setTimeout(function(){
			dojo.fadeOut({
				node: dojo.byId("text"),
				duration: 250,
				onEnd: function(){
					dojo.byId("text").innerHTML = texts[toIndex] + ":" + percentages[toIndex] + "%";
					dojo.fadeIn({
						node: dojo.byId("text"),
						duration: 250
					}).play();
				}
			}).play();
		}, 0);
		
	}
	
	function addRotate(){
		rotateEnd = dojo.connect(dojo.byId("actionArea"), demos.touch.rotate.end, function(event){
			rotation += (event.rotation % 360);
		});
		
		rotate = dojo.connect(dojo.byId("actionArea"), demos.touch.rotate, function(event){
			currentRotation = (rotation + event.rotation) % 360;
			var transform = "rotate(" + currentRotation + "deg)";
			pieChartDiv.style.webkitTransform = transform;
			pieChartDiv.style.MozTransform = transform;
			updateLog((360 - currentRotation) % 360);
		});
	}
	
	function removeRotate(){
		dojo.disconnect(rotateEnd);
		dojo.disconnect(rotate);
	}
	
	function buildUI(){
		addRotate();
		pieChart = new dojox.charting.Chart2D("pieChart1");
		pieChart.setTheme(dojox.charting.themes.Lily);
		pieChart.theme.plotarea = {
			fill: "#fff",
			stroke: "#fff"
		};
		pieChart.addPlot("default", {
			type: "Pie",
			font: "normal normal bold 12pt Tahoma",
			fontColor: "white",
			startAngle: 270,
			labels: false
		});
		pieChart.addSeries("Series A", [1, 2, 3, 4, 5]);
		
		//pieChart.setSeries();
		pieChart.render();
		legend = new dojox.charting.widget.Legend({
			chart: pieChart,
			horizontal: true
		}, "legend");
		calculateDeg();
		dojo.byId("text").innerHTML = texts[0] + ":" + percentages[0] + "%";
	}
	
	function rotate(val){
		var div = dojo.byId("pieChart1");
		currentRotation = (rotation + val) % 360;
		var transform = "rotate(" + currentRotation + "deg)";
		div.style.webkitTransform = transform;
		div.style.MozTransform = transform;
		updateLog(360 - currentRotation);
	}
	
	function calculateDeg(){
		degrees = [];
		percentages = [];
		var data = pieChart.series[0].data;
		var totalVal = 0, i;
		for(i = 0; i < data.length; i++){
			totalVal += data[i];
		}
		for(i = 0; i < data.length; i++){
			var currentVal = 0;
			for(var j = 0; j <= i; j++){
				currentVal += data[j];
			}
			degrees.push((currentVal / totalVal) * 360);
			percentages.push(((data[i] / totalVal) * 100).toFixed(2));
		}
	}
	
	function getDataIndex(degree){
		for (var i = 0; i < degrees.length; i++){
			if (degree < degrees[i]){
				return i;
			}
		}
		return 0;
	}
	
	function updatePieChart(val){
		pieChart.updateSeries("Series A", [val, 2, 3, 4, 5]);
		pieChart.render();
		calculateDeg();
		updateLog(360 - currentRotation);
		dojo.byId("text").innerHTML = texts[currentIndex] + ":" + percentages[currentIndex] + "%";
	}
	
	function updateLog(rotation){
		rotation = rotation % 360;
		var index = getDataIndex(rotation);
		var logNode = dojo.byId("log")
		if(index != currentIndex){
			changeSlice(currentIndex, index);
			currentIndex = index;
		}
	}
	
	function toggleLock(){
		locked = !locked;
		setTimeout(function(){
			dojo.fadeOut({
				node: dojo.byId("lockButton"),
				duration: 500,
				onEnd: function(){
					if(!locked){
						dojo.byId("actionArea").style.opacity = 1;
						dijit.byId("slider1").set("disabled", false);
						dojo.byId("lockButton").style.backgroundImage = 'url("images/bt-lock.png")';
						addRotate();
						dojo.removeClass(dojo.byId("layout"), "locked");
					}else{
						dojo.byId("actionArea").style.opacity = 0;
						dijit.byId("slider1").set("disabled", true);
						dojo.byId("lockButton").style.backgroundImage = 'url("images/bt-unlock.png")';
						removeRotate();
						dojo.addClass(dojo.byId("layout"), "locked");
					}
					dojo.fadeIn({
						node: dojo.byId("lockButton"),
						duration: 500
					}).play();
				}
			}).play();
		}, 0);
	}
	
	dojo.ready(function(){
		dojo.connect(dojo.byId("lockButton"), dojox.gesture.tap.hold, function(){
			toggleLock();
		});
		dojo.connect(dojo.byId("actionArea"), dojo.touch.press, function(){
			if(!locked){
				dojo.byId("actionArea").style.opacity = 0.4;
			}
		});
		dojo.connect(dojo.byId("actionArea"), dojo.touch.release, function(e){
			if(e.touches && e.touches.length <= 0){
				if(!locked){
					dojo.byId("actionArea").style.opacity = 1;
				}
			}
		});
		dojo.connect(dojo.doc, dojo.touch.release, function(){
			dojo.byId("lockButton").focus();
		});
		
		var slider = dijit.byId('slider1');
		dojo.connect(slider, 'onChange', updatePieChart);
		
		buildUI();
		pieChartDiv = dojo.byId("pieChart1");
	});
});