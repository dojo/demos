define([
	"dojo",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/text!demos/beer/src/templates/Lady.html",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetBase",
	"dojox/timing/Sequence"
], function (dojo, declare, lang, domClass, template, _TemplatedMixin, _WidgetBase, timingSequence) {

	declare("beer._LadyBehavior", null, {
		
		constructor: function(){
	
			console.log(this, arguments);
			this._batEyes = [
				{ func: [lang.hitch(this,"smile",true), this], pauseAfter:200 },
				{ func: [lang.hitch(this,"blink",45), this], repeat: 3, pauseAfter: 100 },
				{ func: [lang.hitch(this,"smile",false), this], pauseBefore:200 }
			];
			
		},
		
		bat: function(){
			this.actions.go(this._batEyes);
		}
			
	});
	
	declare("beer.Lady", [_WidgetBase, _TemplatedMixin, beer._LadyBehavior], {
	
		templateString: template,
	
		constructor: function(args, node){
			lang.mixin(this, args);
			this.actions = new timingSequence({});
		},
	
		smile: function(/* Boolean */on){
			// summary:
			//		make her happy
			var n = this.innerNode;
			domClass.remove(n,"beerLadyAngry");
			domClass[(on ? "add" : "remove")](n, "beerLadySmiling");
		},
		
		frown: function(/* Boolean */on){
			var n = this.innerNode;
			domClass.remove(n,"beerLadySmiling");
			dojo[(on ? "addClass" : "removeClass")](n,"beerLadyAngry");
		},
		
		blink: function(closeDuration, forced){
			if(this._blinking && !forced){ clearTimeout(this._blinking); }
			domClass.add(this.innerNode, "beerLadyBlinking");
			this._blinking = setTimeout(lang.hitch(this,function(){
				domClass.remove(this.innerNode,"beerLadyBlinking");
			}), closeDuration || 275);
		},
		
		say: function(dialog){
			
			
		}
			
	});
	
	return beer.Lady;
});