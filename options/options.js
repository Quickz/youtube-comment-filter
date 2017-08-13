
var filteredWordsContainer = document.getElementById("filtered-words");
var addWordBtn = document.getElementById("add-word");

// loading saved data
load();
addWordBtn.addEventListener("click", addWord);

/*
 * creates an entry for the word
 * container, delete button, text field and stuff
 */
function addWord()
{
	var container = document.createElement("div");

	var input = document.createElement("input");
	input.type = "text";

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
	console.log(data);
	//filterText.value = data.filter;
}




