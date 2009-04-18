dojo.provide("demos.babelChat.src");

dojo.require("dojox.cometd");
dojo.require("dojox.rpc.Service");
dojo.require("dojox.io.scriptFrame");
dojo.require("dojox.widget.Dialog");
dojo.require("dojo.fx");
dojo.require("dijit._base.place");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.analytics.Urchin");

(function(d){

	var user, good, comet = dojox.cometd,
		chatroom = "/babelchat/messages";

	d.declare("chat.Message", [dijit._Widget, dijit._Templated],{

		messageLang:"",
		message:"",
		lang:"",
		user:"",
		
		templateString:
			'<li class="chatMessage">'+
				'<div class="chatMessageTitle">${user}:</div>' +
				'<div class="chatMessageWrapper">' +
					'<div dojoAttachPoint="messageNode">${message}</div>' +
				'</div>'+
			'</li>',
			
		postCreate: function(){
			this.inherited(arguments);
			this._origMessage = this.message;
			if(this.lang !== this.messageLang){
				this.connect(this.domNode, "ondblclick", "_toggle");
				// doing this because google API says not to bombard them:
				setTimeout(d.hitch(this,"_translate"), 700);
			}else{
				this._localMessage = this.message;
			}
		},
		
		_toggle: function(e){
			this.messageNode.innerHTML = this._translated ? this._origMessage : this._localMessage;
			this._translated = !this._translated;
		},
		
		_translate: function(){
			var pair = this.messageLang + "|" + this.lang;
			goog.translate({ q: this._origMessage, langpair: pair })
				.addBoth(d.hitch(this,"_tcallback"));
		},
		
		_tcallback: function(response){
			if(response && response.responseData){
				this._localMessage = response.responseData.translatedText;
				this.messageNode.innerHTML = this._localMessage;
				this._translated = true;
			}
		}
		
	});

	d.declare("chat.User", null, {
	
		constructor: function(args){
			d.mixin(this, args);
			this.subscriptions = [];
			this.subscriptions.push(comet.subscribe(chatroom, this, "incomingMessage"));
		},

		setLang: function(lang){
			this.lang = lang;
		},
		
		sendMessage: function(message){
			comet.publish(chatroom, {
				lang: this.lang,
				message: message,
				user: this.name
			});
		},
		 
		incomingMessage: function(message){

			var data = message.data;
			var msg = new chat.Message({
				lang: this.lang,
				messageLang: data.lang,
				message: data.message.replace(/</g, "&lt;"),
				user: data.user
			}).placeAt("messages","first");

		},

		leave: function(message){
			comet.publish("/babelchat/leaving", { bye: message || "leaving!" });
			d.forEach(this.subscriptions, function(s){
				comet.unsubscribe(s);
			});
			d.fadeOut({ node: "chatRoom" }).play();
		}
		
	});

	var postLogin = function(){
		
		var val = d.byId("user").value.replace(/</g, "&lt;"),
			lang = d.query("#langpicker option").filter(function(n){ return n.selected; })[0].value
		;
		
		if(val && lang){

			comet.init("http://cometd.sitepen.com/cometd");

			user = new chat.User({ name:val, lang:lang });

			d.connect(dojo.byId("quitChat"), "onclick", user, function(){
				this.leave("bye!");
			});

			var msg = d.byId("message"),
				snd = d.hitch(user,function(){
				if(msg.value){
					this.sendMessage(msg.value);
					msg.value = "";
				}
			});
			
			d.connect(d.byId("sendMessage"), "onclick", snd);
			d.connect(msg, "onkeypress", function(e){
				if(e.charOrCode == d.keys.ENTER && msg.value){
					snd();
				}
			});
			return true;
			
		}else{
			return false;
		}

	};
	
	d.addOnLoad(function(){
		
		goog = new dojox.rpc.Service(
			d.moduleUrl("dojox.rpc", "SMDLibrary/google.smd"),
			{ frameDoc: "funkyTransport" }
		);
				
		d.query("#starter").onclick(function(e){
			if(postLogin()){
				d.fadeOut({ 
					node: "loginstuff", 
					onEnd: function(){
						d.style("chatRoom", { opacity:0, visibility:"visible" });
						d.fx.combine([
							d.animateProperty({ 
								node: "loginstuff", 
								properties: { height: 1 }, 
								onEnd: function(){
									d.style("loginstuff","display","none");
								}
							}),
							d.fadeIn({ node:"chatRoom" })
						]).play(25);
					} 
				}).play();
			}
		});
		
		new dojox.analytics.Urchin({ 
			acct: "UA-3572741-1", 
			GAonLoad: function(){
				this.trackPageView("/demos/babelChat");
			}
		});	
		
		
	});
	
})(dojo);