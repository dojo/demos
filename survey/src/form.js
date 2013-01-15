require(["dojox/cometd", "dojo/request", "dojo/dom", "dojo/_base/fx", "dojo/dom-style", "dojo/_base/window", "dojo/on", "dojo/ready"], function (cometd, request, dom, fx, domStyle, win, on, ready) {
    
    var handleForm = function(e){
		// summary:
		//		handle the submit data
		e.preventDefault();
		request("src/submit.php", {
			method: "POST",
		    form: "survey"
		}).then(function (data) {
			// when loaded, fadeReplace the content
			dom.byId("postSurvey").disabled = true;
			fx.fadeOut({
			    node:"container",
			    onEnd: function(){
					var _d = data;
					dom.byId("responseText").innerHTML = data;
					domStyle("formNode","display","none");
					fx.fadeIn({ node: "container",
					    onEnd: function(){
							// publish a redraw command, setup listener first:
							getResults();
							cometd.publish("/demo/survey/redraw",{ content: _d });
			    				cometd.subscribe("/demo/survey/redraw",function(){
							    getResults();
							});
					    }
					}).play(5);
			    }
			}).play();
		});
    };
    
    // add elemts to the selectable list
    var addChoice = function(e){
	var choice, lc, isE;

	// now, if it comes as a string instead of an event, we can
	// use that label (coming from cometd)
	if(!(e.type && e.type == "click")){
	    choice = e;
	}else{
	    var n = dom.byId("other");
	    choice = n.value;
	    n.value = "";
	    n.focus();
	    isE = true; // it's an event
	    dojo.stopEvent(e); // e submits the form in this context
	}
	
	// return if choice exists or empty
	lc = choice.toLowerCase();
	if(!choice || dom.byId(lc)){ return; }

	// make the input
	var cb = win.doc.createElement('input');
	cb["type"] = "checkbox";
	cb["name"] = lc;
	cb.id = lc;
	if(isE){ cb.checked = "checked"; }

	// and label
	var lab = win.doc.createElement('label');
	lab.setAttribute("for",lc); // must set 'for' this way
	lab.innerHTML = " "+ choice.replace(/</g, "&lt;"); // added space to match markup

	// and line break, and append them all to the node
	// with the other checkboxes
	var br = win.doc.createElement('br');
	var node = dom.byId("choices");
	node.appendChild(cb);
	node.appendChild(lab);
	node.appendChild(br);
	
	if(isE){ // only relay our newOptions
	    cometd.publish("/demo/survey/newoption", { option:choice });
	}
    };
    
    ready(function(){
	
		// populate available choices with currently known choices from datafile
		request("src/results.php", {
			method: "GET",
		   	handleAs:"json"
		}).then(function (data) {
			for(var t in data.data){
			    addChoice(t);
			}
		});
	});
	
	cometd.init("http://cometd.sitepen.com/cometd");
	cometd.subscribe("/demo/survey/newoption",function(o){
	    // just double check this isn't ours or a duplicate someone
	    // has sent already
	    var opt = o.data.option;
	    var lc = opt.toLowerCase();
	    if(!dojo.byId(lc)){
			addChoice(opt);
	    }
	});
	on(dom.byId("survey"),"submit",handleForm);
	on(dom.byId("addChoice"),"click",addChoice);
});
    