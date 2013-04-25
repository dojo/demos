<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html class="dj_webkit dj_chrome dj_contentbox" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title>The Dojo Toolkit - Demos Index</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="keywords" content="Demo for The Dojo Toolkit, dojo, JavaScript Framework" />
	<meta name="description" content="The Dojo Toolkit Demo Index" />
	<meta name="author" content="Dojo Foundation" />
	<meta name="copyright" content="Copyright 2006-2011 by the Dojo Foundation" />
	<meta name="company" content="Dojo Foundation" />
	
	<link rel="shortcut icon" href="http://dojotoolkit.org/images/favicon.ico" type="image/x-icon" />
	<link rel="stylesheet" href="resources/demos.css" type="text/css" media="all" />
<![if gte IE 9]>
	<link rel="stylesheet" href="resources/desktop.css" type="text/css"/>
	<link rel="stylesheet" href="resources/phone.css" type="text/css" media="only screen and (min-device-width: 320px) and (max-device-width: 480px)"/>
	<link rel="stylesheet" href="resources/phone.css" type="text/css" media="only screen and (-webkit-device-pixel-ratio:1.5)"/>
	<link rel="stylesheet" href="resources/vtablet.css" type="text/css" media="only screen and (min-device-width: 481px) and (max-device-width: 799px) and (orientation: portrait)"/>
	<link rel="stylesheet" href="resources/htablet.css" type="text/css" media="only screen and (min-device-width: 481px) and (max-device-width: 799px) and (orientation: landscape)"/>
	<link rel="stylesheet" href="resources/desktop.css" type="text/css" media="(min-device-width: 800px) and (-webkit-device-pixel-ratio:1)" />
<![endif]>
<!--[if lte IE 8]>
	<link rel="stylesheet" href="resources/ie.css" type="text/css" media="all" />
<![endif]-->
</head>
<body>
	<div class="accessibility">
		<a href="#intro">Skip to Content</a>
		|
		<a href="#nav">Skip to Navigation</a>
	</div>
	<hr class="hide" />
	<div id="page" class="homePage">
		<div id="header">
			<div class="container">
		        <span id="logo"><a href="http://dojotoolkit.org/" title="Home"><img src="http://dojotoolkit.org/images/logo.png" alt="Dojo Toolkit" /></a></span>
     			<ul id="navigation">
					<li class="home"><a href="http://dojotoolkit.org/"><span class="homeIcon"></span></a></li>
        			<li class="download"><a href="http://dojotoolkit.org/download">Download</a></li>
					<li class="features"><a href="http://dojotoolkit.org/features/">Features</a></li>
        			<li class="docs"><a href="http://dojotoolkit.org/documentation">Documentation</a></li>
        			<li class="community"><a href="http://dojotoolkit.org/community">Community</a></li>
        			<li class="blog"><a href="http://dojotoolkit.org/blog">Blog</a></li>
				</ul>
			</div>
		</div>
		<hr class="hide" />
		<div id="intro">
			<div class="innerBox">
			<h1>Demo Index</h1>
			<!-- end content header -->
					<?php

					// holder for all the items
					$out = array();
					if(!empty($_GET["cat"])){
						$show = explode(",", $_GET["cat"]);
					}

					// load the demos described in the resources/ folder that we link but don't ship
					if(file_exists("resources/ext_demos.json")){
						$ext = json_decode(file_get_contents("resources/ext_demos.json"));
						// is there no better obj->array thing I can do here?
						foreach($ext->external as $e){
							$out[] = array(
								"demo" => $e->demo,
								"link" => $e->link,
								"img" => $e->img,
								"rank" => $e->rank,
								"header" => $e->header,
								"categories" => explode(',', $e->categories)
							);
						}
					}

					$exclude = array("resources", ".", "..", ".svn");
					$files = scandir("./");

					foreach($files as $demo){

						if(is_dir($demo) && !in_array($demo, $exclude)){

							// setup some item information
							$title = $demo;
							$rank = 500;
							$base = $demo . "/";
							$link = $base . "demo.html";
							$categories = array("rich");

							$readme = $base . "README";
							if(file_exists($readme)){

								// the second line of the README is the title
								$l = file($readme);
								$title = $l[1];

								// demos with README's are better than those without.
								$rank++;

								// the last line of the README is supposed to be tags etc
								// 
								// so far only @rank:### is used, but can be any @key:value pair on one line
								// to be used here for organization etc
								$tagline = $l[count($l)-1];
								preg_match_all("/@(\w+):([\-a-zA-Z0-9,]+)\ ?/", $tagline, $matches);
								if(is_array($matches[1]) && is_array($matches[2])){
									$tags = array_combine($matches[1], $matches[2]);
								}else{
									$tags = array();
								}

								switch($tags['rank']){
									// marked experimental
									case -999 : $rank = 0; break;
									// add the README rank to the overall score
									default: $rank += $tags['rank']; break;
								}

								if(array_key_exists('categories', $tags)){
									$categories = explode(',', $tags['categories']);
								}

								// with a thumbnail, they are higher ranked too
								$thumb_img = "resources/images/" . $demo . ".png";
								if(file_exists($thumb_img)){
									$rank += 20;
								}else{
									$thumb_img = "resources/images/no_thumb.gif"; // generic dojo img
								}

							}else{

								// experimental demos:
								$rank = 0;
								$categories = array("rich");
								$thumb_img = false;

							}

							// push this item
							$out[] = array(
								"demo" => $demo,
								"header" => $title,
								"link" => $link,
								"rank" => $rank,
								"img" => $thumb_img,
								"categories" => $categories
							);

						}

					}

					// sort the out array by the ranks key
					foreach ($out as $key => $row) {
						$ranks[$key]  = $row['rank'];
						$d[$key] = $row;
					}
					array_multisort($ranks, SORT_DESC, $d, SORT_ASC, $out);

					if(empty($show) || in_array("graphics", $show)){
						print "<h2>Graphics & Charting</h2>";
						// generate the 1st category list:
						print "<ul id='mainlist'>";
						foreach($out as $ranked){
							if(in_array("graphics", $ranked['categories'])){
								// generate the demo item
								print "\n\t<li><a href='".$ranked['link']."'>";
								print "<span>";
								// split the title in two parts around the first hyphen
								list($anchor, $desc) = explode("-", $ranked['header'], 2);
								print $anchor;
								if($desc){
									print "<span>" .$desc. "</span>";
								}
								print "</span>";
								if($ranked['img']){
									print "<img src='". $ranked['img'] . "' />";
								}

								print "</a></li>";
							}
						}
						print "</ul>";
					}
					if(empty($show) || in_array("mobile", $show)){
						print "<h2>Mobile</h2>";
						// generate the 2nd category list:
						print "<ul id='mainlist'>";
						foreach($out as $ranked){
							if(in_array("mobile", $ranked['categories'])){
								// generate the demo item
								print "\n\t<li><a href='".$ranked['link']."'>";
								print "<span>";
								// split the title in two parts around the first hyphen
								list($anchor, $desc) = explode("-", $ranked['header'], 2);
								print $anchor;
								if($desc){
									print "<span>" .$desc. "</span>";
								}
								print "</span>";
								if($ranked['img']){
									print "<img src='". $ranked['img'] . "' />";
								}
								print "</a></li>";
							}
						}
						print "</ul>";
					}
					if(empty($show) || in_array("rich", $show)){
						print "<h2>Rich WebApps</h2>";
						// generate the list:
						print "<ul id='mainlist'>";
						$in_experimental = false;
						foreach($out as $ranked){
							if($ranked['rank'] === 0 && !$in_experimental && (empty($show) || in_array("exp", $show))){
								// we're done with top demos, close list and make a new one
								$in_experimental = true;
								print "</ul><br class='clear'>";
								print "<h2>Incomplete / Partial Demos:</h2>";
								print "<ul id='explist'>";
							}

							if(in_array("rich", $ranked['categories']) || $in_experimental){
								// generate the demo item
								print "\n\t<li><a href='".$ranked['link']."'>";
								print "<span>";
								// split the title in two parts around the first hyphen
								// some experimental demos do not have header
								if(strpos($ranked['header'], "-")){
									list($anchor, $desc) = explode("-", $ranked['header'], 2);
									print $anchor;
									if($desc){
										print "<span>" .$desc. "</span>";
									}
								}else{
									print $ranked['header'];
								}
								print "</span>";
								if($ranked['img']){
									print "<img src='". $ranked['img'] . "' />";
								}
								print "</a></li>";
							}
						}
						print "</ul>";
					}
				?>
			<!-- 
				basic page onload script after dojo.js [if available] - degrades gracefullly 
				though none of the demos will "work" without JavaScript enabled / dojo.js
			-->
			<!-- begin footer -->
			</div>
		</div>
		<div id="main">
			<div id="content" class="innerBox">
				<div id="foot">
					<div class="innerBox">
							<span class="redundant">&copy;</span> <a href="http://www.dojofoundation.org">The Dojo Foundation</a>, All Rights Reserved.
					</div>
				</div>
			</div>
		</div>
		<hr class="hide" />
	</div>
	</body>
</html>

