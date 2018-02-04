var i18n = window.navigator.language;

function setI18n(){
	if (i18n == 'da-DK') {
		downloadBtn.value = 'Download & Opdater';
		hint_message_text0.innerText = 'INSTALLERET VERSION: ';
		hint_message_text2.innerText = 'INSTALLERET BUILD: ';
		hint_message_text1.innerText = 'NYESTE BUILD：';
	}
	if (i18n == 'de-DE') {
		downloadBtn.value = 'Download & Opdater';
		hint_message_text0.innerText = 'INSTALLIERTE VERSION: ';
		hint_message_text2.innerText = 'INSTALLIERTE BUILD: ';
		hint_message_text1.innerText = 'NEUESTE BUILD：';
	}
	if (i18n == 'no') {
		downloadBtn.value = 'Download & Opdater';
		hint_message_text0.innerText = 'INSTALLERT VERSION: ';
		hint_message_text2.innerText = 'INSTALLERT BUILD: ';
		hint_message_text1.innerText = 'NYESTE BUILD：';
	}
	if (i18n == 'se-SV') {
		downloadBtn.value = 'Download & Opdater';
		hint_message_text0.innerText = 'INSTALLERAD VERSION: ';
		hint_message_text2.innerText = 'INSTALLERAD BUILD: ';
		hint_message_text1.innerText = 'SENASTE BUILD：';
	}
}

setTimeout(setI18n,0);
setTimeout(function(){document.getElementById('hint_message_text0').innerText += window.navigator.userAgent.match(/Chrome\/([\d.]+)/)[1];}, 500);
setTimeout("currentBuild()", 1000);
setTimeout("checkVer()", 2000);
setTimeout("matchVersion()", 3000);

var currentBuild, latestVer, downloadURL;
var versionNumber = navigator.appVersion.match(/Chrome\/[0-9]{2}[.][0-9]+[.]([0-9]+)[.][0-9]+/)[1];

/*function currentBuild(){
	var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
			currentBuild = ajax.response.match(/"cl":"([\d.]+)"/)[1];
			document.getElementById('hint_message_text2').innerText += currentBuild;
			}
		}
    ajax.open('GET', 'chrome://version/strings.js', true);
    ajax.send();
}*/

function currentBuild(){
	var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            currentBuild = ajax.response.match(/"><strong>([0-9]+)<\/strong>/)[1];
			document.getElementById('hint_message_text2').innerText += currentBuild;
			}
		}
    ajax.open('GET', 'http://src.chromium.org/viewvc/chrome/branches/' + versionNumber, true);
    ajax.send();
}

function checkVer(){
	var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
			latestVer = ajax.response;
			document.getElementById('hint_message_text1').innerText += latestVer;
			downloadURL = 'http://commondatastorage.googleapis.com/chromium-browser-snapshots/Win_x64/' + latestVer + '/mini_installer.exe';
			}
		}
    ajax.open('GET', 'http://commondatastorage.googleapis.com/chromium-browser-snapshots/Win_x64/LAST_CHANGE', true);
    ajax.send();
}

function download(){
	window.open(downloadURL);
}

function matchVersion(){
    if (currentBuild < latestVer) {
        document.getElementById('hint_message_text3').innerText = 'Your Chromium is out of date. Please update!';
        downloadBtn.addEventListener('click', download);
        downloadBtn.disabled = false;
	}
    else if (currentBuild >= latestVer) {
        document.getElementById('hint_message_text3').innerText = 'You are using current version of Chromium!';
	}
}