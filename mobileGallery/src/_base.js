define(["dojo/_base/array",
		"dojo/_base/kernel",
		"dojo/_base/sniff", 
		"dojo/_base/window"], 
		function(array, lang, has, win){
	
	var _base = lang.getObject("demos.mobileGallery.src._base", true);
	_base.isIPhone = has("iphone");
	_base.isIPad = has("ipad");
	_base.isWebOS = has("webos");
	_base.isAndroid = has("android");
	
	/*
	 * parse url parameter to get the device parameter if any. Temporarily use hard
	 * coded values. We can change to use dojo.hash in the future.
	 */
	var search = win.global.location.search;
	if (search && search.length > 1) {
		var queryPairs = search.substr(1).split("&");
		array.forEach(queryPairs, function(pairStr) {
			var query = pairStr.split("=");
			if (query[0] === "theme" && query[1]) {
				// overwrite the agent detection result
				switch (query[1].toLowerCase()) {
				case "iphone":
					_base.isIPhone = true;
					_base.isWebOS = false;
					_base.isAndroid = false;
					break;
				case "android":
					_base.isIPhone = false;
					_base.isWebOS = false;
					_base.isAndroid = true;
					break;
				case "webos":
					_base.isIPhone = false;
					_base.isWebOS = true;
					_base.isAndroid = false;
					break;
				};
			};
		});
	}
	return _base;
});