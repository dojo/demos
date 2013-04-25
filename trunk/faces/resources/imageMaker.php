<?php

	// fake a delay until actual backend processing is going on
	// sleep(3); 
	require_once "lib.php";
	
	// PHP4 and low 5 compatibility?:
	if(!function_exists('json_encode')){
		require("../../dojo/tests/resources/JSON.php");
		$jsonMaker = new Services_JSON;
		function json_encode($obj){
			return $jsonMaker->encode($obj);
		}
		function json_decode($str){
			return $jsonMaker->decode($str);
		}
	}
	
	// create $hair, $eyes, and $mouth variables
	foreach(array("hair","eyes","mouth") as $part){
		if(!empty($_POST[$part])){
			// FIXME: add [a-zA-Z] matching here: 
			$$part = $_POST[$part];
		}
	}

	if(isset($hair) && isset($eyes) && isset($mouth)){
		
		$result = array(); 
		
		$nick = createName($hair, $eyes, $mouth);
		$outfile = "cache/" . $nick . ".jpg";
		$thumbfile = "cache/." . $nick . "_thumb.jpg"; 

		if(!file_exists("../" . $outfile)){
			// TODO: create and cache this image in images/shame/ 
			
			$width = 230; $height = 326;
			
			$im = imageCreateTrueColor($width, $height);
			$bgColor = imagecolorallocate($im, 255,255,255);
			imagefill($im, 0, 0, $bgColor);
			
			$parts = array(
				"hair" => array(0, 0, 230, 120),
				"eyes" => array(0, 120, 230, 94),
				"mouth" => array(0, 214, 230, 113)
			);
			
			foreach($parts as $part => $dst){
				// copy each slice into the new image
				$tmpfile = "../images/" . $$part . ".jpg";
				if(file_exists($tmpfile)){
					$tmp = imageCreateFromJpeg($tmpfile);
					imagecopy($im, $tmp, $dst[0], $dst[1], $dst[0], $dst[1], $dst[2], $dst[3]);
					imagedestroy($tmp);
				}
			}
			
			imagejpeg($im, "../" . $outfile);
			
			if(!file_exists("../" . $thumbfile)){
				$thumb = createThumb($im, 55);
				imagejpeg($thumb, "../" . $thumbfile);
			}
			
			$result['addToList'] = true; 
			$result['thumb'] = $thumbfile;
			
		}else{
			// duplicate!
			$result["duplicate"] = true;
		}

		$result["name"] = $nick;
		$result["clan"] = getClanName($nick);
		$result["file"] = $outfile;

		// send the final data back as a success!
		print json_encode($result);
	}else{
		print json_encode(array("error" => "error, someone didn't flip enough!"));
	}

	function createName($first, $middle, $last){

		if($first == $middle && $middle == $last){
			// edge case where longer names are more interesting, but 
			// we want to show the real name when all three pieces are
			// one person: 
			$str = $first;
		}else{	
			// break each name into thirds, then return the mashup name 
			// from the appropriate slice:
			$first_len = ceil(strlen($first) / 3);
			$mid_len = ceil(strlen($middle) / 3);
			$last_len = ceil(strlen($last) / 3);
		
			$first_seg = substr($first, 0, $first_len);
			$mid_seg = substr($middle, $mid_len, ($mid_len * 2) - 1);
			$last_seg = substr($last, $last_len * -1, $last_len);
			$str = $first_seg . $mid_seg . $last_seg; 
		}
		return $str;
		
	}

	function createThumb($src, $maxd){
		
	  	$srcw = imagesx($src);
	  	$srch = imagesy($src);
	  	if($srcw<$srch){
			$height = $maxd;
			$width=floor($srcw * $height / $srch);
		}else{
			$width = $maxd;
			$height = floor($srch * $width / $srcw);
		}
	  	if($width > $srcw && $height > $srch){
			$width = $srcw;
			$height=$srch;
		}  //if image is actually smaller than you want, leave small (remove this line to resize anyway)

		$dest = imagecreatetruecolor($width, $height); 
		if($height < 100){
			imagecopyresized($dest, $src, 0, 0, 0, 0, $width, $height, imagesx($src), imagesy($src));
		}else{
			imagecopyresampled($dest, $src, 0, 0, 0, 0, $width, $height, imagesx($src), imagesy($src));
		}
	 
	 	return $dest;

	 }

?>