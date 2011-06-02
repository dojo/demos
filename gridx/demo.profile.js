dependencies = {
	layers: [
		{
			name: "../demos/gridx/MiniGrid.js",
			resourceName: "demos.gridx.MiniGrid",
			dependencies: [
				"demos.gridx.MiniGrid"
			]
		},
		{
			name: "../demos/gridx/AdvancedGrid.js",
			resourceName: "demos.gridx.AdvancedGrid",
			dependencies: [
				"demos.gridx.AdvancedGrid"
			]
		}
	],
	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "demos", "../demos" ]
	]
}