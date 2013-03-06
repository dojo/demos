var profile = (function(){
	var testResourceRe = /\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"demos/demos.profile":1,
				"demos/package.json":1,
				"demos/README":1
			};
			return (mid in list) || (/^demos\/resources\//.test(mid) && !/\.css$/.test(filename)) || /(png|jpg|jpeg|gif|tiff)$/.test(filename)
				|| /demos\/todoApp\/configuration\//.test(filename) 
				|| /demos\/todoApp\/details\//.test(filename)
				|| /demos\/todoApp\/items\//.test(filename)
				|| /demos\/todoApp\/tablet\//.test(filename)
				|| /demos\/todoApp\/todoApp.js/.test(filename);
		},

		usesDojoProvideEtAl = function(mid){
			return /^demos\/(babelChat|beer|castle|cropper|css3|demail|doGeo|faces|fisheye|flashCards|fonts|form|i18n|mail|mojo|nihao|skew|survey|uploader|video)\//.test(mid);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && !usesDojoProvideEtAl(mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return 0;
			}
		}
	};
})();
