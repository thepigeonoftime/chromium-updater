chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
	if (request.method == "setLocalStorage") {
	  localStorage[request.key] = request.content;
	  sendResponse({});
    }
    else
      sendResponse({}); // snub them.
});
