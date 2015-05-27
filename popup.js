/*
Extension: FreeSMUG Chromium Updater
Description: Check for, download and install the latest FreeSMUG Chromium revisions
Author: Anatol Liebermann
Version: 0.1
*/


// Init
var xid = function(sel){return document.getElementById(sel)};
var latest_stable, latest_freesmug, downloadURL;
var versionNumber = window.navigator.userAgent.match(/Chrome\/([\d.]+)/)[1];


// setTimeout workaround
setTimeout(function(){
  xid('installed_label').innerText += versionNumber;
  xid('releaseCalendar').addEventListener('click', function () {window.open("https://omahaproxy.appspot.com/")});
  latestFreesmug();
  setTimeout(latestStable, 500);
}, 100);

// Async XMLHttpRequest with callback
function getXML(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open ("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (typeof callback == "function") {
        callback.apply(xhr);
      }
    }
  }
  xhr.send();
}

function latestStable () {
	getXML("https://omahaproxy.appspot.com/all", function () {
	    resp = this.responseText;
      resp = resp.match("mac,stable,([^,]+)");
      latest_stable = String(resp).split(",")[2];
		xid('stable_label').innerText += latest_stable;
  	});
}

function latestFreesmug () {
  getXML("http://sourceforge.net/projects/osxportableapps/rss?path=/Chromium", function () {
    var xml = this.responseXML;
    var link = xml.documentElement.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
    latest_freesmug = String(link.match("Chromium_OSX_(.+?)\.dmg")).split(",")[1];
    downloadURL = link;  
    xid('freesmug_label').innerText += latest_freesmug;
    setTimeout("matchVersion()", 400);
	});

}

function matchVersion () {
    if (versionNumber < latest_freesmug) {
    	xid('updateMsg').style.color = "red";
      xid('installed_label').style.color = "red";
      xid('installed_label').style.fontWeight = "bold";
      xid('freesmug_label').style.color = "green";
      xid('freesmug_label').style.fontWeight = "bold";
        xid('updateMsg').innerHTML = 'Your Chromium is out of date. Please update!!';
        downloadBtn.addEventListener('click', function () {window.open(downloadURL)});
        downloadBtn.disabled = false;
	}
    else if (versionNumber >= latest_freesmug) {
    	xid('updateMsg').style.color = "green";
      xid('updateMsg').style.fontWeight = "bold";
    	xid('installed_label').style.color = "green";
    	xid('installed_label').style.fontWeight = "bold";
    	xid('freesmug_label').style.color = "green";
    	xid('freesmug_label').style.fontWeight = "bold";
        xid('updateMsg').innerText = "You're up to date!";
	}
}



