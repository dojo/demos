dependencies = {
	layers: [
		{
			name: "../demos/clock/src.js",
			resourceName: "demos.clock.src",
			dependencies: [
				"demos.clock.src"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "demos", "../demos" ]
	]
}
