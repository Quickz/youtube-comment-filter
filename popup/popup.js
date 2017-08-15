	
var filterText = document.getElementById("filter-txt");
var saveBtn = document.getElementById("save");
var options = document.getElementById("options");

saveBtn.addEventListener("click", save);
filterText.addEventListener("keydown", enterKey);
options.addEventListener("click", openOptions);

load();


function save()
{
	chrome.storage.sync.set({
		"filter": [filterText.value]
	});

	// reloads background.js
	chrome.runtime.sendMessage({
		"action": "reload-data"
	});

	// reloads content.js
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
	filterText.value = data.filter[0];
}


function enterKey(e)
{
	if (e.keyCode == 13)
		save();
}


function openOptions()
{
	chrome.runtime.openOptionsPage(function() {
		alert("done");
	});
}
