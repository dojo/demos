var testResourceRe = /\/tests\//,
	copyOnly = function(mid){
		var list = {
			"demos/demos.profile":1,
			"demos/package.json":1,
			"demos/README":1
		};
		return (mid in list) || /^demos\/resources\//.test(mid);
	},
	usesDojoProvideEtAl = function(mid){
		return /^demos\/(babelChat|beer|castle|cropper|css3|demail|doGeo|faces|fisheye|flashCards|fonts|form|i18n|mail|mojo|nihao|skew|survey|uploader|video)\//.test(mid);
	};

var profile = {
	resourceTags:{
		test: function(filename, mid){
			return testResourceRe.test(mid);
		},

		copyOnly: function(filename, mid){
			return copyOnly(mid);
		},

		amd: function(filename, mid){
			return !testResourceRe.test(mid) && !copyOnly(mid) && !usesDojoProvideEtAl(mid) && /\.js$/.test(filename);
		},

		miniExclude: function(filename, mid){
			return 0;
		}
	},

	trees:[
		[".", ".", /(\/\.)|(~$)/]
	]
};
