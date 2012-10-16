var profile = {
	releaseDir: "./parserAutoRequire/release",
	releaseName: "build",
	basePath: "..",
	action: "release",
	mini: true,
	selectorEngine: "lite",

	packages:[{
		name: "dojo",
		location: "../dojo"
	},{
		name: "dijit",
		location: "../dijit"
	},{
		name: "dojox",
		location: "../dojox"
	},{
		name: "parserAutoRequire",
		location: "./parserAutoRequire"
	}],
	
	layers: {
		"dojo/dojo": {
			include: [ "dojo/dojo" ],
			customBase: true,
			boot: true
		},
		"parserAutoRequire/src": {
			include: [ "parserAutoRequire/ap1.html", "parserAutoRequire/ap2.html", "parserAutoRequire/ap3.html",
				"parserAutoRequire/basicForm.html", "parserAutoRequire/demo.html", "parserAutoRequire/dialogLogin.html",
				"parserAutoRequire/editor.html", "parserAutoRequire/fileGrid.html", "parserAutoRequire/menuBar.html",
				"parserAutoRequire/miscDijits.html", "parserAutoRequire/moreForm.html",
				"parserAutoRequire/sliders.html", "parserAutoRequire/stackContainer.html",
				"parserAutoRequire/tabBuild.html", "parserAutoRequire/tabWelcome.html",
				"parserAutoRequire/titlePane.html", "parserAutoRequire/tp1.html" ]
		}
	},

	resourceTags: {
		declarative: function(filename){
			return /\.htm(l)?$/.test(filename);
		},
		amd: function(filename, mid){
			return /\.js$/.test(filename);
		}
	}
};