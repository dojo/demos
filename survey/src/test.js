define([
	"dojo",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/on",
	"dojo/request",
	"dojo/topic",
	"dojox/cometd"
], function (dojo, windowModule, domModule, domStyle, on, request, topic, cometd) {

	(function(){
	    
	
	    var handleForm = function(e){
		// summary:
		//		handle the submit data
		e.preventDefault();
		request("submit.php", {method: "POST", form: "survey"}).then(function(data,ioArgs){
			// when loaded, fadeReplace the content
			domModule.byId("postSurvey").disabled = true;
			dojo.fadeOut({
			    node:"container",
			    onEnd: function(){
				var _d = data;
				domModule.byId("responseText").innerHTML = data;
				domStyle.set("formNode", "display", "none");
				dojo.fadeIn({ node: "container",
				    onEnd: function(){
					cometd.publish("/demo/survey/redraw",_d);
				    }
				}).play(5);
			    }
			}).play();
		    });
	    };
	    
	    var addChoice = function(e){
		// add elemts to the selectable list
		var choice = domModule.byId("other").value;
		var lc = choice.toLowerCase();
	
		// stop event and return if choice exists or empty
	    	e.preventDefault(), e.stopPropagation();
		if(!choice || domModule.byId(lc)){ return; }
	
		// make the input
		var cb = windowModule.doc.createElement('input');
		cb["type"] = "checkbox";
		cb["name"] = lc;
		cb.id = lc;
	
		// and label
		var lab = windowModule.doc.createElement('label');
		lab.setAttribute("for",lc); // must set 'for' this way
		lab.innerHTML = " "+choice; // added space to match markup
	
		// and line break, and append them all to the node
		// with the other checkboxes
		var br = windowModule.doc.createElement('br');
		var node = domModule.byId("choices");
		node.appendChild(cb);
		node.appendChild(lab);
		node.appendChild(br);
		
	    };
	    
	    dojo.addOnLoad(function(){
		cometd.init("http://comet.sitepen.com:9000/cometd");
	        on(domModule.byId("survey"), "submit", handleForm);
		on(dom.byId("addChoice"), "click", addChoice);
	    });
	    
	    
	})();
});