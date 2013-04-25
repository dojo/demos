#!/bin/sh

# this file makes a tarball of an entire built dojo+demos tree to deploy somewhere
# pass only a version as an argument (required)

cd ../../util/buildscripts
./build.sh action=clean,release \
	profile=demos-all \
	releaseName=demos \
	optimize=shrinksafe \
	cssOptimize=comments.keepLines \
	cssImportIgnore=../dijit.css,../resources/demos.css \
	version=$1 
	
./clean_release.sh ../../release demos

cd ../../release/demos
tar -czvf ../deploy-$1.tar.gz .
