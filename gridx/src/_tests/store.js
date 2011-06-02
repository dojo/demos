function getStore(rowNum){
	rowNum = !!rowNum ? rowNum : 1000;
	var data = {
		identifier: 'id',
		label: 'id',
		items: []
	};
//^(.*)\t(.*)\t(.*)\t(.*)\t(.*)\t(.*)\t(.*)\t(.*)\t(.*)\t(.*)$
//		{"Checked": "True", "Genre":"$1",	"Artist":"$2",	"Year":$3,	"Album":"$4",	"Name":"$5",	"Length":"$6",	"Track":$7,	"Composer":"$8",	"Download Date":"$9",	"Last Played":"$10"},
	var data_list = [
		{"Heard": true, "Checked": "True", "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler",	"Name":"Hey There",	"Length":"03:31",	"Track":4,	"Composer":"Ross, Jerry",	"Download Date":"1923/4/9",	"Last Played":"04:32:49"},
		{"Heard": true, "Checked": "True", "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1993,	"Album":"Are You Experienced",	"Name":"Love Or Confusion",	"Length":"03:15",	"Track":4,	"Composer":"Jimi Hendrix",	"Download Date":"1947/12/6",	"Last Played":"03:47:49"},
		{"Heard": true, "Checked": "True", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1992,	"Album":"Down the Road",	"Name":"Sugar Street",	"Length":"07:00",	"Track":8,	"Composer":"Andy Narell",	"Download Date":"1906/3/22",	"Last Played":"21:56:15"},
		{"Heard": true, "Checked": "True", "Genre":"Progressive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":1992,	"Album":"The Atlantic Years",	"Name":"Tarkus",	"Length":"20:40",	"Track":5,	"Composer":"Greg Lake",	"Download Date":"1994/11/29",	"Last Played":"03:25:19"},
		{"Heard": true, "Checked": "True", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears",	"Year":1968,	"Album":"Child Is Father",	"Name":"Somethin' Goin' On",	"Length":"08:00",	"Track":9,	"Composer":"",	"Download Date":"1973/9/11",	"Last Played":"19:49:41"},
		{"Heard": true, "Checked": "True", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Armchair Psychology",	"Length":"08:20",	"Track":5,	"Composer":"Andy Narell",	"Download Date":"2010/4/15",	"Last Played":"01:13:08"},
		{"Heard": true, "Checked": "True", "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise",	"Name":"Luck Be A Lady",	"Length":"05:16",	"Track":4,	"Composer":"F. Loesser",	"Download Date":"2035/4/12",	"Last Played":"06:16:53"},
		{"Heard": true, "Checked": "True", "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1977,	"Album":"Free Fall",	"Name":"Sleep",	"Length":"01:58",	"Track":6,	"Composer":"Steve Morse",	"Download Date":"2032/11/21",	"Last Played":"08:23:26"},
		{"Heard": true, "Checked": "True", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Don't Look Back",	"Length":"09:39",	"Track":6,	"Composer":"Andy Narell",	"Download Date":"1907/3/5",	"Last Played":"23:29:04"},
		{"Heard": true, "Checked": "True", "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1978,	"Album":"What if",	"Name":"What if",	"Length":"05:02",	"Track":3,	"Composer":"Steve Morse",	"Download Date":"1992/3/28",	"Last Played":"00:22:30"}
	];
	var len = data_list.length;
	
	for(var i=0; i < rowNum ; ++i){
		data.items.push(dojo.mixin({'id': i+1 }, data_list[i%len]));
	}
	
	return new dojo.data.ItemFileWriteStore({data: data});
}