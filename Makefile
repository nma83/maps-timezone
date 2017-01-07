# Bundle dependencies into bundle.js

bundle.js: popup.js
	browserify -x googlemaps popup.js > bundle.js
