dojo.provide("demos.survey.src.form");

dojo.require("dojox.cometd");
(function(){
    
    var handleForm = function(e){
	// summary: handle the submit data
	e.preventDefault();
	dojo.xhrPost({
	    url: "src/submit.php",
	    form: "survey",
	    load: function(data,ioArgs){
		// when loaded, fadeReplace the content
		dojo.byId("postSurvey").disabled = true;
		dojo.fadeOut({
		    node:"container",
		    onEnd: function(){
			var _d = data;
			dojo.byId("responseText").innerHTML = data;
			dojo.style("formNode","display","none");
			dojo.fadeIn({ node: "container",
			    onEnd: function(){
				// publish a redraw command, setup listener first:
				getResults();
				dojox.cometd.publish("/demo/survey/redraw",{ content: _d });
    				dojox.cometd.subscribe("/demo/survey/redraw",function(){
				    getResults(); 
				});
			    }
			}).play(5);
		    }
		}).play();
	    }
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
	    var n = dojo.byId("other");
	    choice = n.value;
	    n.value = "";
	    n.focus();
	    isE = true; // it's an event
	    dojo.stopEvent(e); // e submits the form in this context
	}
	
	// return if choice exists or empty
	lc = choice.toLowerCase();
	if(!choice || dojo.byId(lc)){ return; }

	// make the input
	var cb = dojo.doc.createElement('input');
	cb["type"] = "checkbox";
	cb["name"] = lc;
	cb.id = lc;
	if(isE){ cb.checked = "checked"; }

	// and label
	var lab = dojo.doc.createElement('label');
	lab.setAttribute("for",lc); // must set 'for' this way
	lab.innerHTML = " "+ choice.replace(/</g, "&lt;"); // added space to match markup

	// and line break, and append them all to the node
	// with the other checkboxes
	var br = dojo.doc.createElement('br');	
	var node = dojo.byId("choices");
	node.appendChild(cb);
	node.appendChild(lab);
	node.appendChild(br);
	
	if(isE){ // only relay our newOptions
	    dojox.cometd.publish("/demo/survey/newoption", { option:choice });
	}
    };
    
    dojo.addOnLoad(function(){
	
	// populate available choices with currently known choices from datafile
	dojo.xhrGet({
	   url:"src/results.php",
	   handleAs:"json",
	   load:function(data,ioargs){
		for(var t in data.data){
		    addChoice(t);
		}
	   }
	});
	
	dojox.cometd.init("http://cometd.sitepen.com/cometd");
	dojox.cometd.subscribe("/demo/survey/newoption",function(o){
	    // just double check this isn't ours or a duplicate someone
	    // has sent already
	    var opt = o.data.option;
	    var lc = opt.toLowerCase();
	    if(!dojo.byId(lc)){
		addChoice(opt);
	    }
	});
        dojo.connect(dojo.byId("survey"),"onsubmit",handleForm);
	dojo.connect(dojo.byId("addChoice"),"onclick",addChoice);
    });
    
    
})();