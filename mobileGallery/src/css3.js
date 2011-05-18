define(["dojo/_base/kernel","dojo/_base/declare", "dojo/_base/html", "dojo/_base/connect","dojo/fx","dojox/css3/fx"], function(dojo) {

demos.mobileGallery.src.css3 = function() {
 
 dojo.declare("CSS3Demo", null, {
        menuNode: null,
        increment: 360,
        angle: 0,
        constructor: function(){
        	dojo.style("css3ribbon", {
        		transform: "rotate(-45deg)"
        	});

            var effects = ["flip", "bounce", "shrink", "expand", "rotate", "puff"];
            this.increment = 360 / effects.length;
            var css3Body = dojo.byId('css3Boxes');
            for(var i = 0, l = effects.length; i < l; i++){
                var boxwrapper = dojo.create("div", {className: 'css3Boxwrapper'});
                var box = dojo.create("div", {
                    innerHTML: "<span>" + effects[i] + "</span>",
                    className : 'css3Box'
                }, boxwrapper);
                dojo.place(boxwrapper, css3Body, 'last');
                dojo.connect(box, "onclick", (function(b, x){
                    return function(){
                        var anim = dojo.fx.chain([ dojox.css3.fx[effects[x]]({ node: b }) ]);
                        dojo.connect(anim, "onEnd", function(){
                            dojo.style(b, {
                                transform: "scale(1)",
                                opacity: "1"
                            });
                        });
                        anim.play();
                    };
                })(box, i));
            }
        }
    });
}();

	return {
		init: function(){
			new CSS3Demo();
		}
	};
});