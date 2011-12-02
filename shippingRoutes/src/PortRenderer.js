define(["dojo/_base/kernel",
				"dojo/_base/declare",
				"./EcrRenderer",
				"dojox/geo/openlayers/GeometryFeature",
				"dojox/geo/openlayers/Point"], function(dojo, declare, EcrRenderer, GeometryFeature, Point){

	return declare(EcrRenderer, {

		constructor: function(opts, context){},

		_renderItem: function(o, item){
			var gf = null;
			if (o.type == "circle") {
				var coords = this.getCoordinates(item);
				var g = new Point({
					x: coords[0],
					y: coords[1]
				});
				gf = new GeometryFeature(g);
				gf.setShapeProperties({
					r: o.radius
				});
			}
			return gf;
		}
	});
});
