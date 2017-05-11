(function() {

	var filterData;
	load();	

	chrome.runtime.onMessage.addListener(respondToMessage);

	function respondToMessage(request, sender, sendResponse)
	{
		if (request.action == "get-filter-data")
		{
			sendResponse({ "data": filterData });
		}
		else if (request.action == "reload-data")
		{
			load();
		}
	}


	function load()
	{
		chrome.storage.sync.get("filter", assignData);
	}


	function assignData(data)
	{
		filterData = data.filter;
	}


})();
