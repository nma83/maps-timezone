// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// NPM requires
const url = require('url');
var xhr = new XMLHttpRequest();

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function renderResult(tzName, tzOffset) {
    document.getElementById('tzName').textContent = tzName;
    document.getElementById('tzOffset').textContent = tzOffset;
}

function resultVisibility(vis) {
    var disp = 'none';
    if (vis)
        disp = 'block';
    else
        disp = 'none';
    document.getElementById('tzName').style.display = disp;
    document.getElementById('tzOffset').style.display = disp;
}

function isValidMapPath(path) {
    pathArr = pathname.split('/');
    console.log('p' + pathArr[0] + ',' + pathArr[1] + ':' + pathArr.length);
    if (pathArr[1] === 'maps' && pathArr.length > 2)
        return true;
    else
        return false;
}

function latLongFromPath(path) {
    pathArr = pathname.split('/');
    // Potential path components that specify lat/long
    if (pathArr[2].startsWith('@'))
        latlonStr = pathArr[2];
    else if (pathArr[4].startsWith('@'))
        latlonStr = pathArr[4];
    latlon = latlonStr.split(',');
    return { 'lat': parseFloat(latlon[0].slice(1)), 'lng': parseFloat(latlon[1]),
             'zoom': parseFloat(latlon[2].slice(0, -1))};
}

function latLongToTzOffset(latlng) {
    fetch = "http://tzwhere-nma83.rhcloud.com/q?lat=" +
        latlng['lat'] + "&lng=" + latlng['lng'];
    xhr.open("GET", fetch, true);
    xhr.onreadystatechange = function() {
        console.log('state ' + xhr.readyState);
        if (xhr.readyState == 4) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            if (res.hasOwnProperty('error')) {
                resultVisibility(false);
                renderStatus('Error!');
            } else {
                if (res['name']) {
                    var offset = new Date().toLocaleString("en-US", {timeZone: res['name'],
                                                                     timeZoneName: "long"});
                    renderResult(res['name'], offset); //res['offset']);
                    resultVisibility(true);
                    // Warn on high zoom levels
                    var stat = 'Success!';
                    if (latlng['zoom'] < 5)
                        stat += ' (zoom in for a better result)';
                    renderStatus(stat);
                } else {
                    resultVisibility(false);
                    renderStatus('No timezone in current location');
                }
            }
        }
    };
    xhr.send();
}

function init() {
    getCurrentTabUrl(function(taburl) {
        // Put the image URL in Google search.
        urlObj = url.parse(taburl);
        pathname = urlObj.pathname;
        if (isValidMapPath(pathname)) {
            var latlng = latLongFromPath(pathname);
            latLongToTzOffset(latlng);
            renderStatus('Fetching data...');
        } else {
            resultVisibility(false);
            renderStatus('Not a Maps page');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    //document.getElementById('refresh').addEventListener("click", init());
    init();
});
