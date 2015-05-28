xid = function (sel) {return document.getElementById(sel)}


xid("mismatch_disabled").addEventListener("click", function(event){
    event.preventDefault()
});
xid("official_stable").addEventListener("click", function () {
	if (xid("mismatch").disabled) {
		xid("mismatch").disabled = false;
		xid("mismatch_disabled").innerText = "";
		xid("mismatch_label").innerText = "Alert on Version mismatch";
	}
	else {
		xid("mismatch").disabled = true;
		xid("mismatch_disabled").innerText = "Alert on Version mismatch";
		xid("mismatch_label").innerText = "";
	}
});

function enableMismatch() {



}