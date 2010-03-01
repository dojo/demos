<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	
	<title>The Dojo Toolkit - Demos Index</title>

	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="keywords" content="Demo for The Dojo Toolkit, dojo, JavaScript Framework" />
	<meta name="description" content="The Dojo Toolkit Demo Index" />
	<meta name="author" content="Dojo Foundation" />
	<meta name="copyright" content="Copyright 2006-2010 by the Dojo Foundation" />
	<meta name="company" content="Dojo Foundation" />
	
	<link rel="shortcut icon" href="http://dojotoolkit.org/dojango/dojo-media/release/1.4.0-20100212/dtk/images/favicon.ico" type="image/x-icon" />
	<link rel="stylesheet" href="resources/demos.css" type="text/css" media="all" />
	
</head>
<body class="tundra no-js">
		
	<div class="accessibility">
		<a href="#intro">Skip to Content</a>
		|
		<a href="#nav">Skip to Navigation</a>
	</div>
	<hr class="hide" />
	<div id="page" class="homePage">
		<div id="header">
			<div class="container">
				<span id="logo"><a href="http://dojotoolkit.org/" title="Dojo Homepage"><img src="http://dojotoolkit.org/dojango/dojo-media/release/1.4.0-20100212/dtk/images/logo.png" alt="Dojo Toolkit" /></a></span>
				<ul id="navigation">
					<li class="download"><a href="/download/">Download</a></li>
					<li class="docs"><a href="/documentation/">Documentation</a></li>
					<li class="community"><a href="/community/">Community</a></li>
					<li class="blog"><a href="/blog/">Blog</a></li>
				</ul>
			</div>
		</div>
		<hr class="hide" />
		<div id="intro">
			<div class="innerBox">
			<!-- end content header -->
					<?php

					// holder for all the items
					$out = array();

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
								"header" => $e->header
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
							$link = $base;

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
								preg_match_all("/@(\w+):([\-a-zA-Z0-9]+)\ ?/", $tagline, $matches);
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
								$thumb_img = false;

							}

							// push this item
							$out[] = array(
								"demo" => $demo,
								"header" => $title,
								"link" => $link,
								"rank" => $rank,
								"img" => $thumb_img
							);

						}

					}

					// sort the out array by the ranks key
					foreach ($out as $key => $row) {
						$ranks[$key]  = $row['rank'];
						$d[$key] = $row;
					}
					array_multisort($ranks, SORT_DESC, $d, SORT_ASC, $out);

					// generate the list:
					print "<ul id='mainlist'>";
					$in_experimental = false;
					foreach($out as $ranked){

						if($ranked['rank'] === 0 && !$in_experimental){
							// we're done with top demos, close list and make a new one
							$in_experimental = true;
							print "</ul><br class='clear'>";
							print "<h2>Incomplete / Partial Demos:</h2>";
							print "<ul id='explist'>";
						}

						// generate the demo item
						print "\n\t<li><a href='".$ranked['link']."'>";
						if($ranked['img']){
							print "<img src='". $ranked['img'] . "' />";
						}

						// split the title in two parts around the first hyphen
						list($anchor, $desc) = explode("-", $ranked['header'], 2);
						print $anchor;
						if($desc){
							print "<span>" .$desc. "</span>";
						}
						print "</a></li>";

					}
					print "</ul>";

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

	<script src="../dojo/dojo.js"></script>
	<script>
		window.dojo && dojo.addOnLoad(function(){

			dojo.query("body").removeClass("no-js");

			var list = dojo.query("#mainlist li");
			var props = {
				i: { width:96, height:96, top:-16, left:-102 },
				o: { width:64, height:64, top:0, left:-80 }
			};

			list.forEach(function(n){

				var img = dojo.query("img", n)[0], a;
				dojo.connect(n, "onmouseenter", function(e){
					a && a.stop();
					a = dojo.anim(img, props.i, 175)
				});

				dojo.connect(n, "onmouseleave", function(e){
					a && a.stop();
					a = dojo.anim(img, props.o, 175, null, null, 75)
				});

			});
		});
	</script>
	</body>
</html>

