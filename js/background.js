/*
Extension: Chromium Updater
Description: Check for, download and install the latest Chromium revisions
Author: Anatol Liebermann
Version: 0.1.0.3
*/


var $ = document.getElementById.bind(document);
var latestStable, latestFreesmug, downloadURL;
var updateStartup, updateHourly, officialStable, stableMismatch;
var currentVer = window.navigator.userAgent.match(/Chrome\/([\d.]+)/)[1];

chrome.storage.sync.get(['updateStartup', 'updateHourly', 'officialStable', 'stableMismatch'], function(items)
  {
       updateStartup = (items.updateStartup != undefined) ? items.updateStartup : true;
       updateHourly = (items.updateHourly != undefined) ? items.updateHourly : false;
       officialStable = (items.officialStable != undefined) ? items.officialStable : false;
       stableMismatch = (items.stableMismatch != undefined) ? items.stableMismatch : false;
       init();

  });

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
  if (request.method == "setLocalStorage") {
    localStorage[request.key] = request.content;
    sendResponse({});
  }
  else {
    sendResponse({}); // snub them.
  }
});


function init() {
  if (updateHourly) {
    hourlyUpdate();  
  }
  if (updateStartup) {
    getFreesmug(true);
  }
  if (officialStable && stableMismatch) {
    getStable(true);
  }
}

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
  setTimeout(function() {
        if (xhr.readyState < 4) {
            // Timeout !
            xhr.abort();
            callback(true)

        }
    }, 10000);
}

function getFreesmug(callback) {
  getXML("http://sourceforge.net/projects/osxportableapps/rss?path=/Chromium", function(error) {
    if(error) {
      console.log('Connection Timeout')
      chrome.runtime.sendMessage({
        freesmug: '<img width="8" height="8" src="images/problem.png"> <span style="color:red">Connection Timeout</span>',
        url: false
      });
    }
    else {
     try {
      var xml = this.responseXML;
      var link = xml.documentElement.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
      latestFreesmug = String(link.match("Chromium_OSX_(.+?)\.dmg")).split(",")[1];
      downloadURL = link;  
      if(callback) { 
        matchVersion('freesmug', latestFreesmug);
      }
      else {
        chrome.runtime.sendMessage({
        freesmug: latestFreesmug,
        url: downloadURL
      });
      }
    }
    catch(err) {
      console.log(err);
      chrome.runtime.sendMessage({
        freesmug: '<img width="8" height="8" src="images/problem.png"> <span style="color:red">Error parsing XML</span>',
        url: false
      });
    }
    }
  });
}

function getStable(background) {
  getXML("https://omahaproxy.appspot.com/all", function(error) {
      if (error) {
        chrome.runtime.sendMessage({
          stable: '<img width="8" height="8" src="images/problem.png"> <span style="color:red">Connection Timeout</span>',
        });
      }
      else {
        try {
          resp = this.responseText;
          resp = resp.match("mac,stable,([^,]+)");
          latestStable = String(resp).split(",")[2];
          if (background) {
            matchVersion('stable', latestStable);
          }
          else {
            chrome.runtime.sendMessage({
              stable: latestStable
            });
          }
        }
        catch(err) {
          console.log('stable_error: '+err);
        }
      }
  });
}


function hourlyUpdate() { 
  if(updateHourly) { 
    setTimeout(function() {
      getFreesmug(true); hourlyUpdate()
    }, 3600000);
    if(stableMismatch) {
      setTimeout(function() {
      getStable(true); hourlyUpdate()
    }, 3600000)
    }
  }
}; 

function matchVersion (channel, version) {
  var uuid, message, button, buttonIcon, url;
  var update = false;
  var current = currentVer.split('.');
  version = version.split('.');
  version.every(function(c,i,a) {
    if (parseFloat(current[i]) > parseFloat(version[i])) {
      return false; // Break loop when current > repo version (per segment)
    }
    else if (parseFloat(current[i]) < parseFloat(version[i])) {
      update = true;
      return false; // Break loop when repo > current version (per segment)
    }
  return true;  // continue loop
  });
  if (channel == 'freesmug' && update) {
    chrome.browserAction.setIcon({path: 'images/update.png'});    
    uuid = (String)(Date.now());
    icon = 'images/popup.png';
    title = 'A new version of Chromium is available.';
    message = '';
    // message = "Installed:          "+currentVer+"\nLatest Version:  "+latestFreesmug;
    button = 'Download Update';
    buttonIcon = "images/download.png";
    url = downloadURL;
    notify(uuid, icon, title, message, button, buttonIcon, url, true);
  }

  if (channel == 'stable' && update) {
    setTimeout(function() {
      uuid = (String)(Date.now());
      icon = 'images/stable.png';
      title = "Your Chromium version doesn't match the official stable";
      message = "Installed: "+currentVer+"\nLatest Stable: "+latestStable;
      button = "Go to Chromium Projects";
      buttonIcon = "images/arrow.png";
      url = 'https://www.chromium.org/developers/calendar';
      notify(uuid, icon, title, message, button, buttonIcon, url);
    }, 2000);
  }
}

function notify(uuid, icon, title, message, button, buttonIcon, url, button2) {
  richNote = { type: 'basic', iconUrl: icon, title: title, message: message, buttons: [{ title: button, iconUrl: buttonIcon}], isClickable: true } 
  if (button2) { 
    richNote.buttons.push({title: "Go to FreeSMUG", iconUrl: "images/arrow.png"});
  }
  var link = function (notificationId, buttonIndex) {
    url = (buttonIndex > 0) ? 'http://www.freesmug.org/chromium' : url;
    window.open(url);
  };
  chrome.notifications.create(uuid, richNote);
  chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if(uuid == notificationId) {
      url = (buttonIndex > 0) ? 'http://www.freesmug.org/chromium' : url;
      window.open(url);
    }
  });
}