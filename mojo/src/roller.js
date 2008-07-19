dojo.provide("demos.mojo.src.roller");
// summary: takes a <ul id="whyList"> and turns the <li>'s into items to rotate
// 			in a fade sequence. you can set mojo.roller.delay at any time, or
// 			modify mojo.roller.items array using any native Array techniques
//			at any time.
(function(){
	
	dojo.mixin(mojo.roller,{
		
		// the time to wait before rolling to next item
		delay: 2000,
		
		// the items in the roller are just an strings in an array:
		items: [],
		
		// these are "private", and don't need to be accessed by a user:
		_roller: null, // the pointer to the roller node (a <p>) element)
		_idx: 0, // the current index of the visible roller item
		_anim: {}, // a placeholder for our transition animations
		
		start: function(){
			// summary: start the rollout sequent, and create a roller if one
			// 			doesn't already exist.
			if(!mojo.roller._roller){ mojo.roller.init(); }
			mojo.roller._anim.fadeOut.gotoPercent(0,true);
		},
		
		stop: function(){
			// summary: stop (potentially) both animations
			var m = mojo.roller._anim;
			m.fadeIn.stop();
			m.fadeOut.stop();
		},
		
		_set: function(/* Int */n){
			// summary: set the roller to a specified offset
			if(n<0){ n = mojo.roller.items.length - 1; }
			if(n>mojo.roller.items.length-1){ n = 0; }
			mojo.roller._roller.innerHTML = mojo.roller.items[n] || "error ...";
			mojo.roller._idx = n;
		},

		init: function(){
			// summary: create and setup our roller and connections
			
			var r = mojo.roller._roller = dojo.byId("whyDojoRoll");
			
			// static animations:
			dojo.mixin(mojo.roller._anim,{
				fadeOut: dojo.fadeOut({ duration:400, node: r }),
				fadeIn: dojo.fadeIn({ duration:275, node: r })
			});
			
			// after fadeOut, set to next roller item
			dojo.connect(mojo.roller._anim.fadeOut,"onEnd",function(){
				mojo.roller._set(mojo.roller._idx + 1);
				mojo.roller._anim.fadeIn.play(15); // and fade back in
			});
			
			// after fadeIn, recycle animation, and do it again after a delay
			dojo.connect(mojo.roller._anim.fadeIn,"onEnd",function(){
				setTimeout(dojo.hitch(mojo.roller,"start"), mojo.roller.delay);
			});
			
			// turn each LI element in #whyList into a roller item, and destroy
			// the element:
			dojo.query("li","whyList").forEach(function(item){
				mojo.roller.items.push(item.innerHTML);
				dojo._destroyElement(item);
			});

		}

	});
	
})();