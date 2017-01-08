# Bundle dependencies into bundle.js

.PHONY: bundle.js

bundle.js: popup.js
	browserify -t brfs -x googlemaps popup.js > bundle.js
