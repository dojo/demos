dependencies = {
	layers: [
		{
			name: "../demos/touch/src.js",
			resourceName: "demos.touch.src",
			dependencies: [
				"dojo.parser",
				"dijit.form.HorizontalSlider",
				"dijit.form.HorizontalRuleLabels",
				"dojox.charting.Chart2D",
				"dojox.charting.widget.Legend",
				"dojo.gesture.tap"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "demos", "../demos" ]
	]
}
