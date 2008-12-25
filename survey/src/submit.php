<?php 
/*
	simple voting backend, php. 
	makes the datafile.txt	
*/

// look at all the checkboxes, and see if it's "on"
$list = "";
foreach($_REQUEST as $key => $var){
	if($var == "on"){
		$list .= ",".$key;	
	}
	$list{0} = "\n";
}

// save the results to the datafile
if($fp = fopen("../datafile.txt","a+")){
	fputs($fp,$list);
	fclose($fp);
	// return some text
	print "Thank you: your results have been saved. You chose:<br>";
	print "<pre>".$list."</pre>";	
}else{
	// there was an error...	
}

?>
