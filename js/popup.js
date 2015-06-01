/*
Extension: FreeSMUG Chromium Updater
Description: Check for, download and install the latest FreeSMUG Chromium revisions
Author: Anatol Liebermann
Version: 0.1
*/

var $ = document.getElementById.bind(document);
var bg = chrome.extension.getBackgroundPage();
var latestStable, latestFreesmug, downloadURL = false;
var updateStartup, updateHourly, officialStable, stableMismatch;
var currentVer = window.navigator.userAgent.match(/Chrome\/([\d.]+)/)[1];
// Test Value
currentVer = "42.0.2357.81";

chrome.storage.sync.get(['updateStartup', 'updateHourly', 'officialStable', 'stableMismatch'], function(items)
  {
       updateStartup = (items.updateStartup) ? items.updateStartup : true;
       updateHourly = (items.updateHourly) ? items.updateHourly : false;
       officialStable = (items.officialStable) ? items.officialStable : false;
       stableMismatch = (items.stableMismatch) ? items.stableMismatch : false;
  });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  latestFreesmug = (request.freesmug || latestFreesmug) ? request.freesmug : false;
  downloadURL = (request.url || downloadURL) ? request.url : false;
  latestStable = (request.stable || latestStable) ? request.stable : false;
  if (latestFreesmug) {
    $('loadingFreesmug').style.display = "none";
    $('freesmugLabel').innerText = latestFreesmug;
  }
  if (latestFreesmug && downloadURL) {
    matchVersion(latestFreesmug, downloadURL)
  }
  if (latestStable) {
    $('loadingStable').style.display = "none";
    $('stableLabel').innerText = latestStable;
    $('calendar').addEventListener('click', function() {window.open("https://www.chromium.org/developers/calendar")});
  }
  });

setTimeout(function(){
  bg.getFreesmug(false);
    setTimeout(function() {
        $('installedLabel').innerText = currentVer;
      }, 400);
    if(officialStable) {
        $('stable').style.visibility = "visible";
        bg.getStable(false);
    }
}, 100);

function matchVersion (version, link) {
  if (currentVer < latestFreesmug) {    
    $('installedLabel').setAttribute("style", "color: Crimson; font-weight: bold");
    $('freesmugLabel').setAttribute("style", "color: MediumSeaGreen; font-weight: bold");
    $('updateMsg').setAttribute("style", "color: Crimson; font-weight: bold");
    $('downloadBtn').addEventListener('click', function() { window.open(downloadURL) });
    $('options').addEventListener('click', function() { chrome.runtime.openOptionsPage();});
    setTimeout(function() {
      $('updateMsg').innerHTML = 'Your Chromium is out of date';
      $('download').style.visibility = "visible";
    }, 400);    
    }

  else if (currentVer >= latestFreesmug) {
    ['updateMsg', 'installedLabel', 'freesmugLabel'].forEach(function (s) {
        $(s).setAttribute('style', 'color:Green ;'); 
    });
    setTimeout(function() {
    $('updateMsg').innerText = "You're up to date!";
    }, 400);
	}
}

