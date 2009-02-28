dojo.require("dojox.widget.FisheyeList");
dojo.require("dojo.parser");
dojo.addOnLoad(function(){
	dojo.parser.parse();
})

function load_app(id){
	alert('icon '+id+' was clicked');
}
