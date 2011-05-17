define(["dojo"], function(){
	dojo.provide("demos.mobileGallery.src._base");
	
	var _base = demos.mobileGallery.src._base;
	_base.isIPhone = (dojo.isSafari && (navigator.userAgent.indexOf("iPhone") > -1 || navigator.userAgent
			.indexOf("iPod") > -1));
	_base.isWebOS = (navigator.userAgent.indexOf("webOS") > -1);
	_base.isAndroid = (navigator.userAgent.toLowerCase().indexOf("android") > -1);
	
	/*
	 * parse url parameter to get the device parameter if any. Temporarily use hard
	 * coded values. We can change to use dojo.hash in the future.
	 */
	var search = dojo.global.location.search;
	if (search && search.length > 1) {
		var queryPairs = search.substr(1).split("&");
		dojo.forEach(queryPairs, function(pairStr) {
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