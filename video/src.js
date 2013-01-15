define([
	"dojo/ready",
	"dojo/request",
	"dojo/_base/array",
	"dojo/dnd/Source",
	"dojo/parser",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/aspect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/Button",
	"dijit/form/HorizontalSlider",
	"dojox/analytics/Urchin",
	"dojox/av/FLVideo",
	"dojo/dnd/Target",
	"dijit/registry"
], function (ready, request, array, dndSource, parser, domAttr, domStyle, aspect, lang, win, dom, on, domClass, topic, formButton, formHorizontalSlider, analyticsUrchin, avFLVideo, Target, registry) {

	var player, controls, progress, lib, libNode;
	var dndItem = {};
	
	var extended = {
		onDropExternal: function(){
			console.warn("DROP --- check to copy, move, or none:", dndItem);
			var node = dom.byId(dndItem.dragNode.id);
			var target = dndItem.dropNode;
			if(target.id == "videoOverlay") return;
			arguments[2] = true;
			this.inherited("onDropExternal", arguments);
	
		}
	};
	//dojo.extend(dojo.dnd.Source, extended);
	lang.extend(Target, extended);
	//dojo.dnd.Target.prototype.onDropExternal = extended.onDropExternal;
	
	createRelated = function(items){
		var txt = '<span class="relText">Related Items:</span>';
		array.forEach(items, function(m){
			var id = m.title.replace(/\s/g,"");
			var path = "media/"+id+".flv";
			var thumb = "media/thumbs/"+id+".jpg";
			txt += 	'<div class="related" id="click_'+id+'"><div class="thumb" style="background-image:url(media/thumbs/'+id+'.jpg)"></div>'+
					'<div class="title">'+m.title+'</div>'+
					'<div class="desc">'+m.desc+'</div></div>';
		});
		txt +='';
		return txt;
	};
	
	
	ready(function(){
		libNode = dom.byId("library"); //dojo.dnd.Source; jsId="dnd_library" within "libContainer"
		lib = dnd_library;
	
		request("items.json", {method: "GET", handleAs:"json"}).then(function(items){
					controls.setItems(items);
					var txt = '';
					array.forEach(items, function(m){
						var id = m.id = m.title.replace(/\s/g,"");
						var path = m.path = "media/"+id+".flv";
						var thumb = m.thumb = "media/thumbs/"+id+".jpg";
						txt += ''+
						'<div class="dojoDndItem" id="dnd_'+id+'" path="'+path+'" dndType="blue">'+
							'<div id="'+id+'" class="thumb" style="background-image:url('+thumb+');"></div>'+
							'<div class="title">'+m.title+'</div>'+
							'<div class="desc">'+m.desc+'</div>'+
						'</div>';
					});
					libNode.innerHTML = txt;
					lib.sync();
	
					controls.load(items[0].path);
				});
	
	
		player = new avFLVideo({initialVolume:.2, isDebug:false}, "video");
	
		on(player, "Load", lang.hitch(controls, "init"));
		on(player, "Click", lang.hitch(controls, "toggle"));
		on(player, "MetaData", lang.hitch(controls.progress, "onMeta"));
		on(player, "End", lang.hitch(controls, "onEnd"));
		on(player, "Start", lang.hitch(controls, "onStart"));
		on(player, "Position", lang.hitch(controls.progress, "onPosition"));
	
		topic.subscribe("/dnd/source/over", function(evt){
			//console.log("onDndSourceOver", evt);
			if(evt){
				if(evt.node){
					dndItem.dropNode = evt.node
				}
				if(evt.anchor){
					dndItem.dragNode = evt.anchor
				}
			}
		});
		topic.subscribe("/dnd/start", function(evt){ console.log("onDndStart", evt)});
		topic.subscribe("/dnd/drop", function(evt){
			//console.log( "onDndDrop", evt);
			//console.log("dndItem:", dndItem)
			var node = dom.byId(dndItem.dragNode.id);
			var target = dndItem.dropNode;
			console.log("TARGET:", target)
			if(target.id=="videoOverlay"){
				var path = domAttr.get(node, "path");
				controls.load(path);
				controls.showPause();
			}
		});
		topic.subscribe("/dnd/cancel", function(evt){
			//console.log( "onDndCancel")
		});
	
		new analyticsUrchin({
			acct: "UA-3572741-1",
			GAonLoad: function(){
				this.trackPageView("/demos/video");
			}
		});
	
	});
	
	
	controls = {
		progress: {
			init: function(){
				this.duration = null;
				this.seeking = false;
				this.progressBar = registry.byId("progress");
				on(this.progressBar.sliderHandle, "mousedown", lang.hitch(this, "startDrag"));
				this.timeNode = dom.byId("timeNode");
				this.durNode = dom.byId("durNode");
				this.initialized = true;
			},
			onMeta: function(data){
				if(data && data.duration){
					this.duration = data.duration;
					this.durNode.innerHTML = this.timecode(this.duration);
					this.progressBar.set("disabled", false);
				}else{
					this.duration = null;
					this.durNode.innerHTML = "NA";
					this.progressBar.set("disabled", true);
					this.progressBar.set("value", 0);
				}
			},
			onDrag: function(val){
				//
				if(this.seeking){
					//console.log("DRAG:", val);
					var p = val*.01
					player.seek(this.duration*p);
				}
			},
			startDrag: function(){
				this.seeking = true;
				this.conChg = on(this.progressBar, "Change", lang.hitch(this, "onDrag"));
				this.conUp = on(win.doc, "mouseup", lang.hitch(this, "endDrag"))
			},
			endDrag: function(){
				this.seeking = false;
				this.conUp.remove();
				this.conChg.remove();
			},
			onPosition: function(time){
				if(this.initialized){
					this.timeNode.innerHTML = this.timecode(time);
	
					if(this.duration){
						if(!this.seeking){
							// IE freaks if the prgressBar's value goes over 1.0
							var p = Math.min(time/this.duration, 1);
							this.progressBar.set("value", p*100);
						}
					}
				}
			},
			timecode: function(time){
				ts = time.toString();
	
				if(ts.indexOf(".")<0){
					ts += ".00"
				}else if(ts.length - ts.indexOf(".")==2){
					ts+="0"
				}else if(ts.length - ts.indexOf(".")>2){
					ts = ts.substring(0, ts.indexOf(".")+3)
				}
				return ts;
			}
		},
		volume: {
	
			init:function(){
	
				this.volNode = dom.byId("volume");
				this.volBack = dom.byId("volBack");
				dom.setSelectable(this.volNode, false);
				dom.setSelectable(this.volBack, false);
				dom.setSelectable(dom.byId("volMask"), false);
	
				this.volDim = dojo.coords(this.volNode);
				var v = player.initialVolume; // returns 0 - 1
				domStyle.set(this.volBack, "backgroundPosition", "-"+(this.volDim.w-(this.volDim.w*v))+"px 0px");
	
				on(this.volNode, "mousedown", lang.hitch(this, "begDrag"));
				on(win.doc, "mouseup", lang.hitch(this, "endDrag"));
				on(this.volNode, "mouseover", lang.hitch(this, "over"));
				on(this.volNode, "mouseout", lang.hitch(this, "out"));
			},
			onDrag: function(evt){
				var x = evt.clientX - this.volDim.x;
				if(x<0) x = 0;
				if(x>this.volDim.w) x = this.volDim.w;
				var p = x/this.volDim.w;
				player.volume(p);
				var prex = x
				x = Math.ceil(x*.1)*10;
				domStyle.set(this.volBack, "backgroundPosition", "-"+(this.volDim.w-x)+"px 0px");
			},
			begDrag: function(){
				this.dragging = true;
				this.conMove = on(win.doc, "mousemove", lang.hitch(this, "onDrag"));
			},
			endDrag: function(){
				if(this.conMove) {
					this.conMove.remove();
				}
				this.dragging = false;
				this.out();
			},
			over: function(){
				domClass.add(this.volBack, "volBackHover");
			},
			out: function(){
				if(!this.dragging){
					domClass.remove(this.volBack, "volBackHover");
				}
			}
		},
	
	
		init: function(){
			this.progress.init();
			this.volume.init();
			this.initialized = true;
		},
		setItems:function(_items){
			this.items = _items;
		},
		onStart: function(){
			this.hideOverlay();
			this.showPause();
			if(this.conM1) this.conM1.remove();
			if(this.conM2) this.conM1.remove();
			if(this.conTog) this.conTog.remove();
			this.conTog = on(dom.byId("videoOverlay"), "click", lang.hitch(this, "toggle"));
		},
		toggle: function(){
			if(player.isPlaying){
				player.pause();
			}else{
				player.play();
			}
		},
		onEnd: function(){
			console.log("onEnd")
			this.conTog.remove();
			var rel, m1, m2;
			for(var i=0, len=this.items.length;i<len;i++){
				if(this.items[i].path==this.currentPath){
					m1 = i+1;
					m2 = i+2
					if(m1>len-1){
						m1=0;
						m2=1;
					}else if(m2>len-1){
						m2=0;
					}
					break;
				}
			}
			m1 = this.items[m1];
			m2 = this.items[m2];
			var txt = createRelated([ m1, m2 ]);
			dom.byId("relatedNode").innerHTML=txt;
			this.conM1 = on(dom.byId("click_"+m1.id), "click", lang.hitch(this, function(){
				this.load(m1.path);
			}));
			this.conM2 = on(dom.byId("click_"+m2.id), "click", lang.hitch(this, function(){
				this.load(m2.path);
			}));
			this.showOverlay();
			this.showPlay();
			console.log("onEnd done")
		},
		hideOverlay: function(){
			domStyle.set(dom.byId("relatedContainer"), "display", "none");
			domStyle.set(dom.byId("relatedBack"), "display", "none");
		},
		showOverlay: function(){
			domStyle.set(dom.byId("relatedContainer"), "display", "");
			domStyle.set(dom.byId("relatedBack"), "display", "");
			dojo.fadeIn({node:"relatedContainer", start:0, end:.9, duration:500}).play();
			dojo.fadeIn({node:"relatedBack", start:0, end:.5, duration:500}).play();
		},
		doSlider: function(val){
			console.log("VALUE:", val);
		},
		load: function(path){
	
			if(!this.initialized){
				var c = aspect.after(this, "init", lang.hitch(this, function(){
					this.load(path);
					c.remove();
				}), true);
				return;
			}
			console.log("Play:", path)
			this.currentPath = path;
			player.play(path);
			this.hideOverlay();
			this.showPause();
		},
		doPlay: function(){
			player.play();
			this.hideOverlay();
			this.showPause();
		},
		doPause: function(){
			player.pause();
			this.showPlay();
		},
		showPlay: function(){
			domStyle.set(registry.byId("pauseButton").domNode, "display", "none");
			domStyle.set(registry.byId("playButton").domNode, "display", "");
		},
		showPause: function(){
			domStyle.set(registry.byId("pauseButton").domNode, "display", "");
			domStyle.set(registry.byId("playButton").domNode, "display", "none");
		}
	};
	
});