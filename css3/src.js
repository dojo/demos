define([
	"dojo",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/on",
	"dojo/query",
	"dojox/css3/fx"
], function (dojo, declare, windowModule, domConstruct, domStyle, on, query, css3Fx) {

	return declare("CSS3Demo", null, {
		menuNode: null,
		increment: 360,
		angle: 0,
		constructor: function(){
			var effects = ["puff", "bounce", "shrink", "expand", "rotate", "flip"];
			var ribbon = domConstruct.create("div", {
				innerHTML: "dojox.css3",
				style: {
					position: "absolute",
					left: "-45px",
					top: "30px",
					background: "#000",
					color: "#faa",
					fontSize: "1em",
					height: "1.4em",
					lineHeight: "1.4em",
					borderTop: "3px solid #777",
					borderBottom: "3px solid #777",
					width: "200px",
					textAlign: "center"
				}
			}, windowModule.body());
			domStyle.set(ribbon, {
					transform: "rotate(-45deg)"
			});
			var resetBtn = domConstruct.create("button", {
				innerHTML: "reset",
				style: {
					position: "absolute",
					right: "10px",
					top: "30px",
					background: "#ccc",
					color: "#222",
					fontSize: "1em",
					lineHeight: "1.4em",
					width: "200px",
					textAlign: "center"
				}
			}, windowModule.body());
			on(resetBtn, "click", function(){
				query(".box").forEach(function(node){
					domStyle.set(node, {
						transform: "scale(1)",
						opacity: "1"
					});
				});
			});
			this.increment = 360 / effects.length;
			this.menuNode = domConstruct.create("div", {
				className: "menu"
			}, windowModule.body());
			for(var i = 0, l = effects.length; i < l; i++){
				var box = domConstruct.create("div", {
					innerHTML: "<span>" + effects[i] + "</span>",
					className: "box",
					style: {
						left: (i % 3) * 200 + "px",
						top: Math.floor(i / 3)*200 + "px"
					}
				}, this.menuNode);
				on(box, "click", (function(b, x){
					return function(){
						css3Fx[effects[x]]({
							node: b
						}).play();
					};
				})(box, i));
			}
		}
	});
});