dojo.require("dojox.cometd");
(function(){
    

    var handleForm = function(e){
	// summary: handle the submit data
	e.preventDefault();
	dojo.xhrPost({
	    url: "submit.php",
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
				dojox.cometd.publish("/demo/survey/redraw",_d);
			    }
			}).play(5);
		    }
		}).play();
	    }
	});
    };
    
    var addChoice = function(e){
	// add elemts to the selectable list
	var choice = dojo.byId("other").value;
	var lc = choice.toLowerCase();

	// stop event and return if choice exists or empty
    	dojo.stopEvent(e);	
	if(!choice || dojo.byId(lc)){ return; }

	// make the input
	var cb = dojo.doc.createElement('input');
	cb["type"] = "checkbox";
	cb["name"] = lc;
	cb.id = lc;

	// and label
	var lab = dojo.doc.createElement('label');
	lab.setAttribute("for",lc); // must set 'for' this way
	lab.innerHTML = " "+choice; // added space to match markup

	// and line break, and append them all to the node
	// with the other checkboxes
	var br = dojo.doc.createElement('br');	
	var node = dojo.byId("choices");
	node.appendChild(cb);
	node.appendChild(lab);
	node.appendChild(br);
	
    };
    
    dojo.addOnLoad(function(){
	dojox.cometd.init("http://comet.sitepen.com:9000/cometd");
        dojo.connect(dojo.byId("survey"),"onsubmit",handleForm);
	dojo.connect(dojo.byId("addChoice"),"onclick",addChoice);
    });
    
    
})();