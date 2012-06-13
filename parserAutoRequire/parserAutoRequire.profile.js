var profile = {    
    releaseDir: "./parserAutoRequire/release",
	releaseName: "build",
    basePath: "..",
    action: "release",
    mini: true,
    selectorEngine: "acme",

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
			include: [],
			declarativeIncludes: true
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