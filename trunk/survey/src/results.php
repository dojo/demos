<?php 
/*
	simple voting backend, php. 
	read CSV-format datafile.txt and update results
	each line is a person's results, each item
	is a checked item from the survey. 	
*/

if($data = file("../datafile.txt")){
	$total = count($data);
	$output = array();	
	foreach($data as $line){
		$results = explode(",",$line);
		foreach($results as $tk){
			$tk = trim($tk);
			if(!empty($tk)){ $output[$tk]++; }	
		}
	}
	
	
	$response = array("total"=>$total,"data"=>$output);
	print json_encode($response);
	
	//print "<h2>Results:</h2>";
	//print "<ul>";
	// foreach($output as $kit => $count){
	//	$percent = number_format((($count/$total)*100),2);		
	//	print "<li>".$kit." (".$percent."%)</li>";
	//}
	//print "</ul>";
	
	//print "<h2>Totals:</h2>";
	//print $total . " votes. <br>";
	
}else{
	// there was an error...	
}

?>
