define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/text!demos/flashCards/src/Teacher.html",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetBase",
	"dojox/timing/Sequence"
], function (declare, lang, domClass, template, _TemplatedMixin, _WidgetBase, timingSequence) {

	declare("demo._TeacherBehavior", null, {
		
		constructor: function(){
			this._batEyes = [
				{ func: [lang.hitch(this,"angry",true), this], pauseAfter:200 },
				{ func: [lang.hitch(this,"blink",45), this], repeat: 3, pauseAfter: 100 },
				{ func: [lang.hitch(this,"angry",false), this], pauseBefore:200 }
			];
			
		},
		
		bat: function(){
			this.actions.go(this._batEyes);
		}
			
	});
	
	declare("demo.Teacher", [_WidgetBase, _TemplatedMixin, demo._TeacherBehavior], {
	
		templateString: template,
	
		constructor: function(args, node){
			lang.mixin(this, args);
			this.actions = new timingSequence({});
		},
		
		frown: function(/* Boolean */on){
			var n = this.innerNode;
			domClass[(on ? "add" : "remove")](n,"teacherBeingAngry");
		},
		
		blink: function(closeDuration, forced){
			if(this._blinking && !forced){ clearTimeout(this._blinking); }
			domClass.add(this.innerNode, "teacherBlinking");
			this._blinking = setTimeout(lang.hitch(this,function(){
				domClass.remove(this.innerNode,"teacherBlinking");
			}), closeDuration || 275);
		},
		
		speak: function(speach, timeout){
			if (!timeout) { timeout = 5000; }
			
			this.teacherBubble.innerHTML = speach;
			domClass.add(this.teacherBubbleOuter, "teacherSpeaking");
			
			if (this._timeout) { clearTimeout(this._timeout); }
			this._timeout = setTimeout(lang.hitch(this, function(){
				domClass.remove(this.teacherBubbleOuter, "teacherSpeaking")
			}), timeout);
		}
		
	});
	
	return demo._TeacherBehavior;
});