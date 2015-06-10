/*
Extension: FreeSMUG Chromium Updater
Description: Check for, download and install the latest FreeSMUG Chromium revisions
Author: Anatol Liebermann
Version: 0.1
*/

var $ = document.getElementById.bind(document);
// var $$ = function(sel) { return document.getElementsByTagName(sel);}
var backend = chrome.extension.getBackgroundPage();
var latestStable, latestFreesmug, downloadURL = false;
var updateStartup, updateHourly, officialStable, stableMismatch;
var currentVer = window.navigator.userAgent.match(/Chrome\/([\d.]+)/)[1];
// Test Value
// currentVer = "43.0.2357.81";

function init() {
  backend.getFreesmug(false);
  if(officialStable) {
    // $('stable').style.visibility = "visible";
    $('stable').style.display  = 'block';
    backend.getStable(false);
  } 
  setTimeout(function() {
    $('installedLabel').innerText = currentVer;
  }, 400);
}


function matchVersion (version, link) {
  if(link) {
      var update;
      current = currentVer.split('.');
      version = version.split('.');
      version.every(function(c,i,a) {
      if (parseFloat(current[i]) > parseFloat(version[i])) {
        console.log(current[i]+" "+version[i]);
        update = false;
        return false;
      }
      else {
        console.log(true);
        update = true;
        return true;
      }
    });
    if (update) {
      chrome.browserAction.setIcon({path: 'images/update.png'});    
      $('installedLabel').setAttribute("style", "color: #ed1d0b; font-weight: none");
      $('freesmugVersion').setAttribute("style", "color: #4f9906; font-weight: none");
      $('updateMsg').setAttribute("style", "color: #ed1d0b; font-weight: none");
      $('downloadBtn').addEventListener('click', function() { window.open(downloadURL) });
      document.body.style.height = "150px";
      resize = function() {
          var limit = (officialStable) ? 170 : 160;
          console.log(limit);
          setTimeout(function(){
            document.body.style.height = (parseFloat(document.body.style.height)+5)+"px";
            if(parseFloat(document.body.style.height) < limit) {
                  resize();
            }
            else {
              $('updateMsg').innerHTML = 'Your Chromium is out of date';
              $('download').style.display = "block";
            }
          }, 50);
      }
      resize();
    }
    else {
      chrome.browserAction.setIcon({path: 'images/popup.png'});
      ['updateMsg', 'installedLabel', 'freesmugVersion'].forEach(function (s) {
          $(s).setAttribute('style', 'color:#4f9906 ;'); 
      });
      setTimeout(function() {
      $('updateMsg').innerText = "You're up to date!";
      }, 400);
  	}
  }
}

chrome.storage.sync.get(['updateStartup', 'updateHourly', 'officialStable', 'stableMismatch'], function(items)
  {
       updateStartup = (items.updateStartup) ? items.updateStartup : true;
       updateHourly = (items.updateHourly) ? items.updateHourly : false;
       officialStable = (items.officialStable) ? items.officialStable : false;
       stableMismatch = (items.stableMismatch) ? items.stableMismatch : false;
       init()
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    latestFreesmug = (request.freesmug || latestFreesmug) ? request.freesmug : false;
    downloadURL = (request.url || downloadURL) ? request.url : false;
    latestStable = (request.stable || latestStable) ? request.stable : false;
    if (latestFreesmug) {
      $('loadingFreesmug').style.display = "none";
      $('freesmugVersion').innerHTML = latestFreesmug;
    }
    if (latestFreesmug && downloadURL) {
      matchVersion(latestFreesmug, downloadURL)
    }
    if (latestStable) {
      $('loadingStable').style.display = "none";
      $('stableVersion').innerHTML = latestStable;
      $('calendar').addEventListener('click', function() {window.open("https://www.chromium.org/developers/calendar")});
    }
  }
);

document.addEventListener('DOMContentLoaded', function() {
  $('banner').addEventListener('click', function() { window.open("http://www.freesmug.org/chromium") });
  $('options').addEventListener('click', function() { chrome.runtime.openOptionsPage();});
});
