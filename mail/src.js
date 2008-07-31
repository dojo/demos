dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("dijit.dijit");
dojo.require("dijit.Declaration");
dojo.require("dijit.form.Button");
dojo.require("dijit.Menu");
dojo.require("dijit.Tree");
dojo.require("dijit.Tooltip");
dojo.require("dijit.Dialog");
dojo.require("dijit.Toolbar");
dojo.require("dijit._Calendar");
dojo.require("dijit.ColorPalette");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.LinkDialog");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dijit.ProgressBar");

dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Textarea");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");

dojo.addOnLoad(function(){

	dojo.parser.parse();
	dijit.setWaiRole(dojo.body(), "application");

	var n = dojo.byId("preLoader");
	dojo.fadeOut({
		node:n,
		duration:720,
		onEnd:function(){
			// dojo._destroyElement(n); 
			dojo.style(n,"display","none");
		}
	}).play();
		
});

var paneId = 1;

// for "new message" tab closing
function testClose(pane,tab){
  return confirm("Are you sure you want to leave your changes?");
}

// fake mail download code:
var numMails;
var updateFetchStatus = function(x){
	if(x == 0){
		dijit.byId('fakeFetch').update({ indeterminate: false });
		return;
	}
	dijit.byId('fakeFetch').update({ progress: x + 1 });
	if(x == numMails){
		dojo.fadeOut({ node: 'fetchMail', duration:800,
			// set progress back to indeterminate. we're cheating, because this
			// doesn't actually have any data to "progress"
			onEnd: function(){ 
				dijit.byId('fakeFetch').update({ indeterminate: true });
				dojo.byId('fetchMail').style.visibility='hidden'; // remove progress bar from tab order
			}
		}).play();
	}
}
var fakeReport = function(percent){
	// FIXME: can't set a label on an indeterminate progress bar
	// like if(this.indeterminate) { return " connecting."; }
	return dojo.string.substitute("Fetching: ${0} of ${1} messages.", [percent * this.maximum, this.maximum]);
}

var fakeDownload = function(){
	dojo.byId('fetchMail').style.visibility='visible';
	numMails = Math.floor(Math.random()*10) + 1;
	dijit.byId('fakeFetch').update({ maximum: numMails, progress:0 });
	dojo.fadeIn({ node: 'fetchMail', duration:300 }).play();
	for(var ii = 0; ii < numMails + 1; ++ii){
		var func = dojo.partial(updateFetchStatus, ii);
		setTimeout(func,  ((ii + 1) * (Math.floor(Math.random()*100) + 400)));
	}
}

// fake sending dialog progress bar 
var stopSendBar = function(){
	dijit.byId('fakeSend').update({ indeterminate: false });
	dijit.byId('sendDialog').hide();
	tabs.selectedChildWidget.onClose = function(){return true;};  // don't want confirm message 
	tabs.closeChild(tabs.selectedChildWidget);
}
	 
var showSendBar = function(){
	dijit.byId('fakeSend').update({ indeterminate: true });
	dijit.byId('sendDialog').show();
	setTimeout(function(){stopSendBar();}, 3000);
}

