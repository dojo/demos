define([
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/fx",
	"dojo/_base/fx",
	"dojo/_base/array",
	"dojo/on",
	"dojo/keys",
	"dojo/query",
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetBase",
	"dijit/_base/place",
	"dojox/analytics/Urchin",
	"dojox/cometd",
	"dojox/io/scriptFrame",
	"dojox/rpc/Service",
	"dojox/widget/Dialog",
	"dojo/domReady!"
], function (declare, dom, fx, arrayUtil, baseFx, on, keys, query, ready, lang, domStyle, _TemplatedMixin, _WidgetBase, _basePlace, analyticsUrchin, cometd, ioScriptFrame, rpcService, widgetDialog) {

	var user, good, comet = cometd,
		chatroom = "/babelchat/messages";

	declare("chat.Message", [_WidgetBase, _TemplatedMixin],{

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
				on(this.domNode, "dblclick", "_toggle");
				// doing this because google API says not to bombard them:
				setTimeout(lang.hitch(this,"_translate"), 700);
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
				.addBoth(lang.hitch(this,"_tcallback"));
		},
		
		_tcallback: function(response){
			if(response && response.responseData){
				// might ought to escape HTML entities?
				this._localMessage = response.responseData.translatedText;
				this.messageNode.innerHTML = this._localMessage;
				this._translated = true;
			}
		}
		
	});

	declare("chat.User", null, {
	
		constructor: function(args){
			lang.mixin(this, args);
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
				user: data.user.replace(/</g, "&lt;")
			}).placeAt("messages","first");

		},

		leave: function(message){
			comet.publish("/babelchat/leaving", { bye: message || "leaving!" });
			arrayUtil.forEach(this.subscriptions, function(s){
				comet.unsubscribe(s);
			});
			baseFx.fadeOut({ node: "chatRoom" }).play();
		}
		
	});

	var postLogin = function(){
		
		var val = dom.byId("user").value,
			language = dom.byId("langpicker").value;
		
		if(val && language){

			comet.init("http://cometd.sitepen.com/cometd");

			user = new chat.User({ name:val, lang:language });

			on(dom.byId("quitChat"), "onclick", user, function(){
				this.leave("bye!");
			});

			var msg = dom.byId("message"),
				snd = lang.hitch(user,function(){
				if(msg.value){
					this.sendMessage(msg.value);
					msg.value = "";
				}
			});
			
			on(dom.byId("sendMessage"), "click", snd);
			on(msg, "keypress", function(e){
				if(e.charOrCode == keys.ENTER && msg.value){
					snd();
				}
			});
			return true;
			
		}else{
			return false;
		}

	};

	goog = new rpcService(
		require.toUrl("dojox/rpc/SMDLibrary/google.smd"),
		{ frameDoc: "funkyTransport" }
	);
		
	on(dom.byId("starter"), "click", function(e){
		if(postLogin()){
			baseFx.fadeOut({
				node: "loginstuff",
				onEnd: function(){
					domStyle.set("chatRoom", { opacity:0, visibility:"visible" });
					fx.combine([
						baseFx.animateProperty({
							node: "loginstuff",
							properties: { height: 1 },
							onEnd: function(){
								domStyle.set("loginstuff","display","none");
							}
						}),
						baseFx.fadeIn({ node:"chatRoom" })
					]).play(25);
				}
			}).play();
		}
	});

	new analyticsUrchin({
		acct: "UA-3572741-1",
		GAonLoad: function(){
			this.trackPageView("/demos/babelChat");
		}
	});
});