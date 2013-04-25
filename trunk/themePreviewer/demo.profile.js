var profile = (function(){
	return {
		releaseDir:"../../release",

		packages:[{
			name:"dojo",
			location:"../../dojo"
		},{
			name:"dijit",
			location:"../../dijit"
		},{
			name:"dojox",
			location:"../../dojox"
		},{
			name:"demos",
			location:"../../demos"
		}],

		layers:{
			"demos/themePreviewer/src":{
				noref:1
			}
		}
	};
})();
