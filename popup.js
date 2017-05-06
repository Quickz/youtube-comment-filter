	
var filterText = document.getElementById("filter-txt");
var saveBtn = document.getElementById("save");

saveBtn.addEventListener("click", save);
filterText.addEventListener("keydown", enterKey);

load();


function save()
{
	chrome.storage.sync.set({
		"filter": filterText.value
	});

	// background.js
	chrome.runtime.sendMessage({
		"action": "reload-data"
	});

	// content.js
	chrome.tabs.query({
		"active": true,
		"currentWindow": true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"action": "reload-script"
		});
	});
}


function load()
{
	chrome.storage.sync.get("filter", update);
}


function update(data)
{
	filterText.value = data.filter;
}


function enterKey(e)
{
	if (e.keyCode == 13)
		save();
}
