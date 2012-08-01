require([
	"dojo/data/ItemFileWriteStore",
	"dojox/grid/EnhancedGrid",
	"dojox/grid/enhanced/plugins/Filter",
	"dojox/grid/enhanced/plugins/exporter/CSVWriter",
	"dojox/grid/enhanced/plugins/Printer",
	"dojox/grid/enhanced/plugins/Cookie",
	"dojox/grid/enhanced/plugins/IndirectSelection",
	"dojox/grid/enhanced/plugins/NestedSorting",
	"dojox/grid/enhanced/plugins/Selector",
	"dojox/grid/enhanced/plugins/Menu",
	"dojox/grid/enhanced/plugins/DnD",
	"dojox/grid/enhanced/plugins/Search",
	"dojox/grid/enhanced/plugins/CellMerge",
	"dojox/grid/enhanced/plugins/Pagination"
], function(){
	var gridAttrs = {
		rowsPerPage: 5,
		keepSelection: true,
		plugins: {}
	};
		
	var plugins = {
		"nestedSorting": {},
		"indirectSelection": {
			headerSelector: true
		},
		"menus": {
			headerMenu: "headerMenu", 
			rowMenu: "rowMenu", 
			cellMenu: "cellMenu", 
			selectedRegionMenu: "selectedRegionMenu"
		},
		"exporter": {},
		"printer": {},
		"filter": {
			closeFilterbarButton: true,
			ruleCount: 0
		},
		"selector": {},
		"dnd": {
			copyOnly: true
		},
		"cellMerge": {
			"mergedCells": [
				{row: "3", start: 1, end: 10, major: 3}
			]
		},
		"search": {},
		"pagination":
		{
			pageSizes: ["5", "10", "20", "50", "All"],	// Array, custom the items per page button
			description: true,	// boolean, custom weather or not the discription will be displayed
			sizeSwitch: true,	// boolean, custom weather or not the page size switch will be displayed
			pageStepper: true,	// boolean, custom weather or not the page step will be displayed
			gotoButton: true,
			maxPageStep: 10,		// Integer, custom how many page step will be displayed
			position: "bottom"		// String, custom the position of the paginator bar
									// there're three options: top, bottom, both
		}
	};
	var gridFeatures = {
		"canSort": {
			label: "disable canSort",
			value: function(colIndex){
				return false;
			}
		},
		"rowSelector": {
			value: "20px"
		},
		"autoWidth": {
			value: true
		},
		"singleClickEdit": {
			value: true
		},
		"selectionMode": {
			label: "single selectionMode",
			value: "single"
		}
	};
	
	function getTableString(){
		var sb = ["<table><tbody>"];
		for(var featureName in gridFeatures){
			sb.push("<tr>");
			sb.push("<td><input id='cbid", featureName, 
				"' dojoType='dijit.form.CheckBox' dojoAttachPoint='cb", featureName, 
				"'><label id='lbl", featureName, "' for='cbid", featureName, "'>",
				gridFeatures[featureName].label || featureName, "</label></input></td>"
			);
			sb.push("</tr>");
		}
		sb.push("<tr><td><hr/></td></tr>",
			"<tr><td><button id='selectAllOptions' >Select All</button>",
			"<button id='deselectAllOptions'>Deselect All</button></td></tr>"
		);
		for(var pluginName in plugins){
			sb.push("<tr>");
			sb.push("<td><input id='cbid", pluginName, 
				"' dojoType='dijit.form.CheckBox' dojoAttachPoint='cb", pluginName, 
				"'><label id='lbl", pluginName, "' for='cbid", pluginName, "'>",
				pluginName, "</label></input></td>"
			);
			sb.push("</tr>");
		}
		sb.push("</tbody></table>");
		return sb.join('');
	}
	dojo.declare("PluginTable", [dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin], {
		templateString: getTableString(),
		widgetsInTemplate: true,
		_onChangePlugin:  function(pluginName, cb, e){
			var checked = cb.get("checked");
			gridAttrs.plugins[pluginName] = checked ? plugins[pluginName] : false;
			var nd = dojo.byId(pluginName + "Support");
			if(nd){
				dojo.style(nd, "display", checked ? "" : "none");
			}
		},
		_onChangeFeature: function(featureName, cb, e){
			var checked = cb.get("checked");
			if(checked){
				gridAttrs[featureName] = gridFeatures[featureName].value;
			}else{
				delete gridAttrs[featureName];
			}
		},
		postCreate: function(){
			var cb;
			for(var featureName in gridFeatures){
				cb = this["cb" + featureName];
				this.connect(cb, "onChange", dojo.hitch(this, "_onChangeFeature", featureName, cb));
			}
			for(var pluginName in plugins){
				cb = this["cb" + pluginName];
				this.connect(cb, "onChange", dojo.hitch(this, "_onChangePlugin", pluginName, cb));
			}
		}
	});
	function selectAll(){
		for(var pluginName in plugins){
			dijit.byId("cbid" + pluginName).set("checked", true);
		}
	}
	function deselectAll(){
		for(var pluginName in plugins){
			dijit.byId("cbid" + pluginName).set("checked", false);
		}
	}
	function exportCSV(){
		var g = dijit.byId("grid");
		g && g.exportGrid("csv", {
			writerArgs: {
				separator: dojo.byId('sep').value
			}
		}, function(str){
			dojo.byId("csvResults").value = str;
		});
	}
	function exportSelected(){
		var g = dijit.byId("grid");
		if(g){
			dojo.byId("csvResults").value = g.exportSelected("csv", {
				separator: dojo.byId('sep').value
			});	
		}
	}
	function printGrid(){
		var g = dijit.byId("grid");
		if(g){
			g.printGrid({
				title: dojo.byId('print_title').value,
				cssFiles: ["support/print_style1.css","support/print_style2.css"]
			});
		}
	}
	function printSelected(){
		var g = dijit.byId("grid");
		g && g.printSelected({
			title: dojo.byId('print_title').value,
			cssFiles: ["support/print_style1.css", "support/print_style2.css"]
		});
	}
	function printPreview(){
		var g = dijit.byId("grid");
		g && g.exportToHTML({
			title: dojo.byId('print_title').value,
			cssFiles: ["support/print_style1.css", "support/print_style2.css"]
		}, function(str){
			var win = window.open();
			win.document.open();
			win.document.write(str);
			g.normalizePrintedGrid(win.document);
			win.document.close();
		});
	}
	function mergeCells(){
		var rowIndex = parseInt(dojo.byId("inputRow").value, 10) - 1;
		var start = parseInt(dojo.byId("inputStart").value, 10);
		var end = parseInt(dojo.byId("inputEnd").value, 10);
		var major = parseInt(dojo.byId("inputMajor").value, 10);
		var grid = dijit.byId("grid");
		grid.mergeCells(rowIndex, start, end, major);
	}		
	function enableCookie(key, toEnable){
		console.log(key,toEnable);
		try{
			var g = dijit.byId("grid");
			if(g){
				if(key){
					g.setCookieEnabled(key, toEnable);
				}else{
					g.setCookieEnabled(toEnable);
				}
			}
		}catch(e){
			console.log(e);
		}
	}
	function scrollToRow(){
		var g = dijit.byId("grid");
		if(g){
			var idx = parseInt(dojo.byId("inputScrollToRowIdx").value, 10);
			console.log("scroll to ", idx);
			g.scrollToRow(idx);
		}
	}
	dojo.ready(function(){
		dojo.connect(dojo.byId('selectAllOptions'), 'click', selectAll);
		dojo.connect(dojo.byId('deselectAllOptions'), 'click', deselectAll);
		dojo.connect(dojo.byId('exportAllCSV'), 'click', exportCSV);
		dojo.connect(dojo.byId('exportSelectedCSV'), 'click', exportSelected);
		dojo.connect(dojo.byId('mergeCell'), 'click', mergeCells);
		dojo.connect(dojo.byId('scrollToRow'), 'click', scrollToRow);
		
		var btns = dojo.byId("ctrlBtns2");
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Refresh",
			"onclick": function(){
				var g = dijit.byId("grid");
				g && g._refresh();
			}
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Delete Selected",
			"onclick": function(){
				var g = dijit.byId("grid");
				g && g.removeSelectedRows();
			}
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "resize",
			"onclick": function(){
				var g = dijit.byId("grid");
				if(g){
					var cc = dojo.byId("gridContainer");
					dojo.style(cc, "height", (dojo.contentBox(cc).h + 10) + "px");
					dojo.style(cc, "width", (dojo.contentBox(cc).w - 10) + "px");
					g.resize(dojo.contentBox(cc));
				}
			}
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Select All",
			"onclick": function(){
				var g = dijit.byId("grid");
				if(g){
					var t1 = (new Date()).getTime();
					g.selection.selectRange(0, g.rowCount - 1);
					console.log((new Date()).getTime() - t1);
				}
			}
		}));
		var toDisable = true;
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Disable 4th row selector",
			"onclick": function(){
				var g = dijit.byId("grid");
				if(g){
					var cell = g.layout.cells[0];
					if(cell.setDisabled){
						cell.setDisabled(3, toDisable);
						toDisable = !toDisable;
					}
				}
			}
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "clear sort",
			"onclick": function(){
				var g = dijit.byId("grid");
				if(g){
					g.setSortIndex([]);
				}
			}
		}));
	});
	
	//data store
	var data = {
		identifier: 'id',
		label: 'id',
		items: []
	};
	var data_list = [
		{"Heard": true, "Checked": "True", "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"Hey There",	"Length":"03:31",	"Track":4,	"Composer":"Ross, Jerry 1926-1956 -w Adler, Richard 1921-",	"Download Date":"1923/4/9",	"Last Played":"04:32:49"},
		{"Heard": true, "Checked": "True", "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1993,	"Album":"Are You Experienced",	"Name":"Love Or Confusion",	"Length":"03:15",	"Track":4,	"Composer":"Jimi Hendrix",	"Download Date":"1947/12/6",	"Last Played":"03:47:49"},
		{"Heard": true, "Checked": "True", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1992,	"Album":"Down the Road",	"Name":"Sugar Street",	"Length":"07:00",	"Track":8,	"Composer":"Andy Narell",	"Download Date":"1906/3/22",	"Last Played":"21:56:15"},
		{"Heard": true, "Checked": "True", "Genre":"Progressive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":1992,	"Album":"The Atlantic Years",	"Name":"Tarkus",	"Length":"20:40",	"Track":5,	"Composer":"Greg Lake/Keith Emerson",	"Download Date":"1994/11/29",	"Last Played":"03:25:19"},
		{"Heard": true, "Checked": "True", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears",	"Year":1968,	"Album":"Child Is Father To The Man",	"Name":"Somethin' Goin' On",	"Length":"08:00",	"Track":9,	"Composer":"",	"Download Date":"1973/9/11",	"Last Played":"19:49:41"},
		{"Heard": true, "Checked": "True", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Armchair Psychology",	"Length":"08:20",	"Track":5,	"Composer":"Andy Narell",	"Download Date":"2010/4/15",	"Last Played":"01:13:08"},
		{"Heard": true, "Checked": "True", "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise: The Very Good Years",	"Name":"Luck Be A Lady",	"Length":"05:16",	"Track":4,	"Composer":"F. Loesser",	"Download Date":"2035/4/12",	"Last Played":"06:16:53"},
		{"Heard": true, "Checked": "True", "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1977,	"Album":"Free Fall",	"Name":"Sleep",	"Length":"01:58",	"Track":6,	"Composer":"Steve Morse",	"Download Date":"2032/11/21",	"Last Played":"08:23:26"}
	];
	var len = data_list.length;
	var rounds = 25;
	for(var i=0; i < rounds * len ; ++i){
		data.items.push(dojo.mixin({'id': i+1 }, data_list[i%len]));
	}			
	var store = new dojo.data.ItemFileWriteStore({data: data});
	
	//layout
	var formatDate = function(inDatum){
		var dtb = new dijit.form.DateTextBox({});
		var res = dojo.date.locale.parse(inDatum,{
			selector: "date",
			datePattern: "yyyy/MM/dd"
		});
		dtb.set("value",res);
		return dtb;
	};
	var layout = [
		[{//--------------------------------------------------------------------------0
			defaultCell: {editable: true, autoComplete:true, type: dojox.grid.cells._Widget},
			cells:
			[
				{ field: "id", name:"Index", datatype:"number", width: 4},
				{ field: "Genre", name:"Genre", datatype:"string", width: 10},
				{ field: "Artist", name:"Artist", datatype:"string", width: 10},
				{ field: "Year", name:"Year", datatype:"string", width: 6},
				{ field: "Album", name:"Album", datatype:"string", width: 10},
				{ field: "Name", name:"Name", datatype:"string", width: 8, disabledConditions: [
					"contains", "notcontains"
				]},
				{ field: "Length", name:"Length", datatype:"string", width: 6},
				{ field: "Track", name:"Track", datatype:"number", width: 5},
				{ field: "Composer", name:"Composer", datatype:"string", width: 12},
				{ field: "Download Date", name:"Download Date", datatype:"date", width: 12,
					navigatable: true, editable: false,
					dataTypeArgs: {
						datePattern: "yyyy/M/d"
					}
				},
				{ field: "Last Played", name:"Last Played", datatype:"time", width: 6,
					dataTypeArgs: {
						timePattern: "HH:mm:ss"
					}
				},
				{ field: "Heard", name: "Checked", datatype:"boolean", width: 6/*, type: dojox.grid.cells.CheckBox*/},
				{ field: "Checked", name:"Checked (Customized Label)", editable: false, datatype:"boolean", width: 15, dataTypeArgs: {
					trueLabel: "This sounds like a very old song.",
					falseLabel: "Never heard of this song."
				}}
			]
		}],
		[{//--------------------------------------------------------------------------1
			defaultCell: {},
			rows:
			[[
				{ field: "id", name:"Index(1)", hidden: false},
				{ field: "Genre", name:"Genre(2)", hidden: false},
				{ field: "Artist", name:"Artist(3)", hidden: false},
				{ field: "Year", name:"Year(4)", hidden: false},
				{ field: "Album", name:"Album(5)", hidden: false},
				{ field: "Name", name:"Name(6)", hidden: false},
				{ field: "Length", name:"Length(7)", hidden: false},
				{ field: "Track", name:"Track(8)", hidden: false},
				{ field: "Composer", name:"Composer(9)", hidden: false},
				{ field: "Download Date", name:"Download Date(10)", cellFormatter: {
					selector: "date",
					parse: {datePattern: "yyyy/M/d"},
					format:{datePattern: "MMMM d, yyyy"}
				}, hidden: false},
				{ field: "Last Played", name:"Last Played(11)", hidden: false}
			]]
		}],
		[//--------------------------------------------------------------------------2
			{//first view
				width: "300px",
				rows:
				[
					{ field: "Genre", width: '6'},
					{ field: "Artist", width: '5'},
					{ field: "Year", width: '6'},
					{ field: "Album", width: '10'}
				]
			},
			{//second view
				rows:
				[
					{ field: "Name", width: '17'},
					{ field: "Length", width: '6'},
					{ field: "Track", width: '6'},
					{ field: "Composer", width: '15'}
				]
			}
		],
		[//--------------------------------------------------------------------------3
			{//first view
				rows:
				[
					{ field: "Genre", width: '8'},
					{ field: "Artist", width: '6'},
					{ field: "Year", width: '6'},
					{ field: "Album", width: '10'},
					{ field: "Name", width: '10'},
					{ field: "Length", width: '6'},
					{ field: "Track", width: '6'},
					{ field: "Composer", width: '13'},
					{ field: "Download Date", width: '10'},
					{ field: "Last Played", width: '10'}
				]
			}
		],
		[{//--------------------------------------------------------------------------4
			rows:
			[
				[
					{ field: "Genre"},
					{ field: "Artist"},
					{ field: "Year"},
					{ field: "Album"},
					{ field: "Name"}
				],[
					{ field: "Length"},
					{ field: "Track"},
					{ field: "Composer"},
					{ field: "Download Date"},
					{ field: "Last Played"}
				]
			]}
		],
		[//--------------------------------------------------------------------------5
			{//first view
				rows:
				[
					[
						{ field: "Genre", width: '10', rowSpan: 2},
						{ field: "Artist", width: '15'},
						{ field: "Year", width: '15'}
					],[
						{ field: "Album", colSpan: 2}
					]
				]
			},
			{//second view
				rows:
				[
					[
						{ field: "Name", width: '20', rowSpan: 2},
						{ field: "Length", width: '20'},
						{ field: "Track"}
					],[
						{ field: "Composer", colSpan: 2}
						
					],[
						{ field: "Download Date"},
						{ field: "Last Played"},
						{ field: "Checked"}
					]
				]
			}
		]
	];
	
	var gridIndex = 0;
	var totalCount = 1000;
	var timeInterval = 500;
	function createGrid(step){
		try{
			var g = dijit.byId("grid");
			g && g.destroyRecursive();
			for(gridIndex += step; gridIndex < 0; gridIndex += layout.length){}
			gridIndex %= layout.length;
			var t1 = (new Date()).getTime();
			g = new dojox.grid.EnhancedGrid(dojo.mixin({
				"id": "grid",
				"store": store,
				"structure": layout[gridIndex]
			}, gridAttrs || {}));
			g.placeAt(dojo.byId("gridContainer"));
			g.startup();
			dojo.byId("num").value = gridIndex;
			return g;
		}catch(e){
			console.log("createGrid:",e);
		}
	}
	var cnt = totalCount;
	function start(){
		if(cnt > 0){
			--cnt;
			createGrid(1);
			setTimeout(start, timeInterval);
		}else{
			var g = dijit.byId("grid");
			g && g.destroyRecursive();
			cnt = totalCount;
		}
	}
	function stop(){
		cnt = 0;
	}
	function gotoGrid(){
		var id = parseInt(dojo.byId('num').value) % layout.length;
		gridIndex = isNaN(id) ? gridIndex : id;
		createGrid(0);
	}
	function destroy(){
		var g = dijit.byId("grid");
		g && g.destroyRecursive();
	}
	dojo.addOnLoad(function(){
		var btns = dojo.byId("ctrlBtns");
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Play",
			"onclick": start
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Stop",
			"onclick": stop
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Prev",
			"onclick": dojo.partial(createGrid, -1)
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Next",
			"onclick": dojo.partial(createGrid, 1)
		}));
		btns.appendChild(dojo.create("input",{
			"id": "num",
			"value": gridIndex,
			"type": "text"
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Create",
			"onclick": gotoGrid
		}));
		btns.appendChild(dojo.create("button",{
			"innerHTML": "Destroy",
			"onclick": destroy
		}));
		gotoGrid();
	});
});