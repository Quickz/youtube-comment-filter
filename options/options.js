
var filteredWordsContainer = document.getElementById("filtered-words");
var addWordBtn = document.getElementById("add-word");
var newWord = document.getElementById("new-word");
var loadedData = [""];

// loading saved data
load();
addWordBtn.addEventListener("click", addSpecifiedWord);
document.onkeydown = processKeys;


/**
 * adds a new word
 * specified in the input field
 */
function addSpecifiedWord()
{
	var text = newWord.value;
	if (text == "")
	{
		alert("Cannot add an empty value!");
		return;
	}
	addWord(text, loadedData.length);
	loadedData.push(text);
	save(text);
	newWord.value = "";
}

/**
 * saves the filtered word list content
 * and reloads the word list on the other files
 */
function save()
{
	chrome.storage.sync.set({
		"filter": loadedData
	});

	// background.js
	chrome.runtime.sendMessage({
		"action": "reload-data"
	});
}

/**
 * deletes the specified word form
 * the list
 */
function deleteWord()
{
	var entryContainer = this.parentElement;
	var index = getIndexInParent(entryContainer);

	// deleting data entry
	loadedData.splice(index, 1);
	
	// deleting the visual element for the entry
	entryContainer.remove();

	save();
}

/**
 * takes the element's parent
 * and finds at which index it is located inside it
 */
function getIndexInParent(element)
{
	var parent = element.parentElement;
	for (let i = 0; i < parent.childNodes.length; i++)
	{
		if (parent.childNodes[i] == element)
			return i;
	}
	return -1;
}

/*
 * creates an entry for the word
 * container, delete button, text field and stuff
 */
function addWord(text, index)
{
	var container = document.createElement("div");
	container.dataset.index = index;

	var input = document.createElement("input");
	input.type = "text";
	input.readOnly = true;
	input.value = text;

	var deleteBtn = document.createElement("button");
	var textNode = document.createTextNode("Delete");
	deleteBtn.appendChild(textNode);
	deleteBtn.className = "opt-btn";
	deleteBtn.addEventListener("click", deleteWord);

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
		addWord(loadedData[i], i);
}

function processKeys(e)
{
	if (e.keyCode == 13)
		addSpecifiedWord();
}



