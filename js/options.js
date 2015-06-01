var $ = function(sel){return document.getElementById(sel)}; //jquery id selector


$("mismatch_disabled").addEventListener("click", function(event){
    event.preventDefault()
});

$("officialStable").addEventListener("click", mismatch_enable);


function mismatch_enable () {
	if ($("stableMismatch").disabled) {
		$("stableMismatch").disabled = false;
		$("mismatch_disabled").innerText = "";
		$("mismatch_label").innerText = " Notify on Version mismatch";
	}
	else {
		$("stableMismatch").checked = false;
		$("stableMismatch").disabled = true;
		$("mismatch_disabled").innerText = " Notify on Version mismatch";
		$("mismatch_label").innerText = "";
	}
}

// Saves options to chrome.storage
function save_options() {
  	var updateStartup = ($('updateStartup').checked)? true : false;
  	var updateHourly = ($('updateHourly').checked)? true : false;
	var officialStable = ($('officialStable').checked)? true : false;
  	var stableMismatch = ($('stableMismatch').checked)? true : false;
	chrome.storage.sync.set({
		updateStartup: updateStartup,
		updateHourly: updateHourly,
		officialStable: officialStable,
		stableMismatch: stableMismatch
  }, function() {
  	if (updateHourly) { 
  		chrome.extension.getBackgroundPage().updateHourly = true;
  		chrome.extension.getBackgroundPage().hourly();
  	}
  	else {
  		chrome.extension.getBackgroundPage().updateHourly = false;
  	}
    // Update status to let user know options were saved.
    // 	var status = $('status');
    // 	status.style.fontSize = "10pt";
    // 	status.style.color = "#99ccff";
    // 	status.textContent = 'saved';
    // 	setTimeout(function() {
    //   	status.textContent = '';
    // }, 1000);
  });
}



// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
		updateStartup: true,
		updateHourly: false,
		officialStable: false,
		stableMismatch: false
  }, function(items) {
    $('updateStartup').checked = items.updateStartup;
	$('updateHourly').checked = items.updateHourly;
	$('officialStable').checked = items.officialStable;
    if($('officialStable').checked) { mismatch_enable() ;}
    $('stableMismatch').checked = items.stableMismatch;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
options = document.getElementsByTagName('input');
for (i=0;i<options.length;i++) {
	options[i].addEventListener('click', save_options);
}

