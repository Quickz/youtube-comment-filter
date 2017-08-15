
var filteredWordsContainer = document.getElementById("filtered-words");
var addWordBtn = document.getElementById("add-word");
var newWord = document.getElementById("new-word");
var loadedData = [""];

// loading saved data
load();
addWordBtn.addEventListener("click", addSpecifiedWord);

/**
 * adds a new word
 * specified in the input field
 */
function addSpecifiedWord()
{
	var text = newWord.value;
	addWord(text);
	loadedData.push(text);
	save(text);
}

/**
 * saves the filtered word list content
 * and reloads the word list on the other files
 */
function save(content)
{
	chrome.storage.sync.set({
		"filter": loadedData
	});

	// background.js
	chrome.runtime.sendMessage({
		"action": "reload-data"
	});
}

/*
 * creates an entry for the word
 * container, delete button, text field and stuff
 */
function addWord(text)
{
	var container = document.createElement("div");

	var input = document.createElement("input");
	input.type = "text";
	input.readOnly = true;
	input.value = text;

	var deleteBtn = document.createElement("button");
	var textNode = document.createTextNode("Delete");
	deleteBtn.appendChild(textNode);
	deleteBtn.className = "opt-btn";

	container.appendChild(input);
	container.appendChild(deleteBtn);
	filteredWordsContainer.appendChild(container);

}


function load()
{
	chrome.storage.sync.get("filter", update);
}


function update(data)
{
	loadedData = data.filter;
	for (let i = 0; i < loadedData.length; i++)
		addWord(loadedData[i]);
}





