<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>

	<title>Demos: The Dojo Toolkit</title>
	
	<link rel="stylesheet" href="resources/demos.css" />	
		
</head>
<body class="no-js">
	<div id="header">
		<div id="nav" class="content">
			<p>Need help?</p>
			<ul id="menu">
				<li><a href="http://dojotoolkit.org" title="Visit official Website">Dojo Home</a></li>
				<li><a href="http://api.dojotoolkit.org" title="Information about the API">API Pages</a></li>
				<li><a href="http://dojotoolkit.org/docs" title="Read User Documentation">Documentation</a></li>
				<li><a href="http://dojocampus.org" title="Community Resources">DojoCampus</a></li>
			</ul>
		</div>
	</div>

	<div id="subheader">
		<div class="content">
			<h1 id="intro">Demos</h1>
		</div>
	</div>

	<div id="container">
		<div class="content">
			<p>Welcome to the Dojo Toolkit Demo Index</p><br>
			<?php
			
			$out = array();

			// feature explorer is manually included:
			$out[] = array(
				"demo" => "explorer",
				"link" => "http://dojocampus.org/explorer/",
				"img" => "resources/images/blank.png",
				"rank" => 900,
				"header" => "Feature Explorer"
			);

			$exclude = array("resources", ".", "..", ".svn");
			
			$files = scandir("./");
			foreach($files as $demo){
				
				if(is_dir($demo) && !in_array($demo, $exclude)){
					
					$title = $demo;
					$rank = 500;
					$base = $demo . "/";
										
					// sillyness
					if(!$is_index){
						$demobase = $base . "demo.";
						if(file_exists($demobase."html")){
							$link = $demobase."html";
						}elseif(file_exists($demobase."php")){
							$link = $demobase."php";
						}
					}else{
						$link = $base;
					}
					
					$readme = $base . "README";
					if(file_exists($readme)){
						
						$l = file($readme);
						$title = $l[1];
						$rank++;
						
						// the last line of the README is supposed to be tags etc
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
						
						$thumb_img = "resources/images/" . $demo . ".png";
						if(file_exists($thumb_img)){
							// with a thumbnail, they are higher ranked
							$rank += 20;
						}else{
							$thumb_img = "resources/images/blank.png";
						}
						
					}else{
						
						$rank = 0;
						$thumb_img = false;
					}
					
					$out[] = array(
						"demo" => $demo,
						"header" => $title,
						"link" => $link,
						"rank" => $rank,
						"img" => $thumb_img
					);

					// look for $demo/README and $demo/demo.[html|php]
				}
				
			}
			
			foreach ($out as $key => $row) {
			    $ranks[$key]  = $row['rank'];
				$d[$key] = $row;
			}
			array_multisort($ranks, SORT_DESC, $d, SORT_ASC, $out);
			
			print "<ul id='mainlist'>";
			$in_experimental = false;
			foreach($out as $ranked){

				if($ranked['rank'] === 0 && !$in_experimental){
					$in_experimental = true;
					print "</ul><br class='clear'>";
					print "<h2>Incomplete / Partial Demos:</h2>";
					print "<ul id='explist'>";
				}
				print "\n\t<li><a href='".$ranked['link']."'>";
				if($ranked['img']){
					print "<img src='". $ranked['img'] . "' />";
				}
				
				list($anchor, $desc) = explode("-", $ranked['header'], 2);
				print $anchor;
				if($desc){
					print "<span>" .$desc. "</span>";
				}
				print "</a></li>";
			}
			print "</ul>";
		
		?></div>
	</div>
	<div id="footer">
		<div class="content">
			&copy <a href="http://dojofoundation.org">The Dojo Foundation</a>, 2004-2009	
		</div>

	</div>

	<!-- load dojo, if available -->
	<script type="text/javascript" src="../dojo/dojo.js"></script>
	
	<!-- basic page onload script after dojo.js if available -->
	<script>
		dojo && dojo.addOnLoad(function(){
			
			dojo.removeClass(dojo.body(), "no-js");
			
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

