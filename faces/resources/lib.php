<?php

function getClanName($fullname){
	preg_match('/[a-zA-Z]([A-Z]{1}[a-zA-Z]*)/', $fullname, $matches);	
	$ret = empty($matches[1]) ? "_noclan_" : $matches[1];
	return $ret;
}

