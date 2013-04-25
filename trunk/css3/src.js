dojo.provide("demos.css3.src");

dojo.require("dojox.css3.fx");

dojo.declare("CSS3Demo", null, {
	menuNode: null,
	increment: 360,
	angle: 0,
	constructor: function(){
		var effects = ["puff", "bounce", "shrink", "expand", "rotate", "flip"];
		var ribbon = dojo.create("div", {
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
		}, dojo.body());
		dojo.style(ribbon,{
				transform: "rotate(-45deg)"
		});
		var resetBtn = dojo.create("button", {
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
		}, dojo.body());
		dojo.connect(resetBtn, "onclick", function(){
			dojo.query(".box").forEach(function(node){
				dojo.style(node, {
					transform: "scale(1)",
					opacity: "1"
				});
			});
		});
		this.increment = 360 / effects.length;
		this.menuNode = dojo.create("div", {
			className: "menu"
		}, dojo.body());
		for(var i = 0, l = effects.length; i < l; i++){
			var box = dojo.create("div", {
				innerHTML: "<span>" + effects[i] + "</span>",
				className: "box",
				style: {
					left: (i % 3) * 200 + "px",
					top: Math.floor(i / 3)*200 + "px"
				}
			}, this.menuNode);
			dojo.connect(box, "onclick", (function(b, x){
				return function(){
					dojox.css3.fx[effects[x]]({
						node: b
					}).play();
				}
			})(box, i));
		}
	}
});

dojo.ready(function(){
	new CSS3Demo;
});
