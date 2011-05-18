dojo.require("dojox.mobile");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("dojox.mobile.TextBox");
dojo.require("dojox.mvc");
dojo.require("dojox.mvc.Generate");
dojo.require("dojox.mvc.Group");
dojo.require("dojox.mvc.Repeat");
dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile.FlippableView");
dojo.require("dojox.mobile.ViewController");
dojo.require("dojox.mobile.TextArea");
dojo.require("dojox.mobile.Button");
dojo.require("dojox.mobile.FixedSplitter");
dojo.require("dojox.mobile.EdgeToEdgeList");
dojo.require("dojox.mobile.EdgeToEdgeCategory");
dojo.require("dojox.mobile.Heading");
dojo.require("dojox.mobile.FixedSplitterPane");

dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");
dojo.requireIf(!dojo.isWebKit, "dojo.fx");
dojo.requireIf(!dojo.isWebKit, "dojo.fx.easing");
dojo.require("dojox.mobile.deviceTheme"); // used for device detection


;(function(){

	// Initial data for Ship to - Bill demo
	var names = {
		"Serial" : "360324",
		"First"  : "John",
		"Last"   : "Doe",
		"Email"  : "jdoe@us.ibm.com",
		"ShipTo" : {
			"Street" : "123 Valley Rd",
			"City"   : "Katonah",
			"State"  : "NY",
			"Zip"    : "10536"
		},
		"BillTo" : {
			"Street" : "17 Skyline Dr",
			"City"   : "Hawthorne",
			"State"  : "NY",
			"Zip"    : "10532"
		}
	};

	// Initial repeat data used in the Repeat Data binding demo
	var repeatData = [ 
		{
			"First"   : "Chad",
			"Last"    : "Chapman",
			"Location": "CA",
			"Office"  : "1278",
			"Email"   : "c.c@test.com",
			"Tel"     : "408-764-8237",
			"Fax"     : "408-764-8228"
		},
		{
			"First"   : "Irene",
			"Last"    : "Ira",
			"Location": "NJ",
			"Office"  : "F09",
			"Email"   : "i.i@test.com",
			"Tel"     : "514-764-6532",
			"Fax"     : "514-764-7300"
		},
		{
			"First"   : "John",
			"Last"    : "Jacklin",
			"Location": "CA",
			"Office"  : "6701",
			"Email"   : "j.j@test.com",
			"Tel"     : "408-764-1234",
			"Fax"     : "408-764-4321"
		}
	];

	selectedIndex = 0;

	model = dojox.mvc.newStatefulModel({ data : names });
	repeatmodel = dojox.mvc.newStatefulModel({ data : repeatData });
	nextIndexToAdd = repeatmodel.data.length;

	 // used in the Ship to - Bill to demo
	setRef = function(id, addrRef) {
		var widget = dijit.byId(id);
		widget.set("ref", addrRef);
	}

	// used in the Repeat Data binding demo
	setDetailsContext = function(index){
		selectedIndex = index;
		var groupRoot = dijit.byId("detailsGroup");
		groupRoot.set("ref", index);
	}

	// used in the Repeat Data binding demo
	insertResult = function(index){
		if (repeatmodel[index-1].First.value !== ""){ // TODO: figure out why we are getting called twice for each click
			var insert = dojox.mvc.newStatefulModel({ "data" : {
				"First"   : "",
				"Last"    : "",
				"Location": "CA",
				"Office"  : "",
				"Email"   : "",
				"Tel"     : "",
				"Fax"     : ""} 
			});
			repeatmodel.add(index, insert);
			setDetailsContext(index);
			nextIndexToAdd++;
		}else{
			setDetailsContext(index-1);                 
		}
	};

	// used in the Generate View demo
	var genmodel;
	updateView = function() {
		try {
			var modeldata = dojo.fromJson(dojo.byId("modelArea").value);
			genmodel = dojox.mvc.newStatefulModel({ data : modeldata });
			dijit.byId("view").set("ref", genmodel);
			dojo.byId("outerModelArea").style.display = "none";
			dojo.byId("viewArea").style.display = "";              		
		}catch(err){
			console.error("Error parsing json from model: "+err);
		}
	};

	// used in the Generate View demo
	updateModel = function() {
		dojo.byId("outerModelArea").style.display = "";
		try {
			dojo.byId("modelArea").focus(); // hack: do this to force focus off of the textbox, bug on mobile?
			dojo.byId("viewArea").style.display = "none";
			dijit.byId("modelArea").set("value",(dojo.toJson(genmodel.toPlainObject(), true)));
		} catch(e) {
			console.log(e);
		};
	};

	dojo.addOnLoad(function(){
		dojox.mobile.parser.parse();
	});

})();
