(function() {

	var interval;
	var currStrToFilter = [];

	/**
	 * triggers runScript after progress bar has transitioned
	 * prevents runScript from not getting run after
	 * going from one video page to another
	 */
	(document.body || document.documentElement).addEventListener('transitionend', function(e) {
		if (e.propertyName === 'width' && e.target.id === 'progress')
	    	runScript();
	}, true);

	// runs after the page loads
	runScript();


	chrome.runtime.onMessage.addListener(respondToMessage);

	function respondToMessage(request, sender, sendResponse)
	{
		if (request.action == "reload-script")
		{
			runScript();
		}
	}


	/**
	 * runs the extension
	 *
	 */
	function runScript() {
	    if ('/watch' === location.pathname)
	    {
	    	clearInterval(interval);
	    	checkComments();
	    }
	}


	/**
	 * checks if there are
	 * any new comments loaded
	 */
	function checkComments()
	{
		var container = document.getElementById("watch-discussion");

		if (!container)
		{
			interval = setTimeout(checkComments, 100);
			return;
		}

		var comments = container.getElementsByClassName("comment-renderer-content");
		var processing = false;
		var prevLength = 0;	

		interval = setInterval(function() {

			// change detected
			if (prevLength < comments.length)
			{
				processing = true;
				chrome.runtime.sendMessage({
					"action": "get-filter-data"
				}, function(response) {
					processComments(comments, prevLength, response.data);
					prevLength = comments.length;
					processing = false;
				});
				
			}

		}, 100);

	}


	/**
	 * index parameter contains the index
	 * at which the new comments begin
	 */
	function processComments(comments, index, strsToFilter)
	{
		// if current filter's changed
		// every comment will have to be unfiltered and rechecked
		var filterListChanged = !equalArrays(currStrToFilter, strsToFilter);
		
		for (let i = 0; i < comments.length; i++)
		{
			let comment = comments[i].getElementsByClassName("comment-renderer-text")[0];
			let text = getText(comment);
			let alreadyChecked;

			if (filterListChanged)
			{
				comment.classList.remove("hidden-comment-yt");
				commentToggleBtn = comments[i].getElementsByClassName("filter-toggle-btn-yt")[0];

				// if there's a button to delete				
				if (commentToggleBtn)
				{
					comment.hidden = false;	
					commentToggleBtn.parentNode.removeChild(commentToggleBtn);
				}
			}
			else
				alreadyChecked = comment.hasAttribute("checked-by-filter-yt");
			
			if (!alreadyChecked)
			{
				for (let j = 0; j < strsToFilter.length; j++)
				{
					let regx = new RegExp(strsToFilter[j], "i");

					if (text.match(regx))
					{
						createCommentToggleBtn(comments[i]);
						break;
					}
				}
				comment.setAttribute("checked-by-filter-yt", "");
			}
		}//forend
		currStrToFilter = strsToFilter;
	}

	/**
	 * removes any elements/classes created
	 * from filtering the comments
	 */
	function unfilterComments(comments)
	{
		for (let i = 0; i < comments.length; i++)
		{
			
		}

	}

	function equalArrays(arr1, arr2)
	{
		if (arr1 && arr2 && arr1.length != arr2.length)
			return false;
		for (let i = 0; i < arr1.length; i++)
		{
			if (arr1[i] != arr2[i])
				return false;
		}
		return true;
	}

	/**
	 * obtains the text the element contains
	 * by excluding the html tag content
	 */
	function getText(element)
	{
		var html = element.innerHTML;
		return html.replace(/<[^>]*>/g, "");
	}


	/**
	 * creates a button for hiding/showing
	 * the filtered comment
	 */
	function createCommentToggleBtn(commentContainer)
	{
		var comment = commentContainer.getElementsByClassName("comment-renderer-text")[0];
		var btn = document.createElement("button");
		var text = document.createTextNode("Show filtered comment");
		btn.appendChild(text);
		
		btn.classList.add("filter-toggle-btn-yt");
		btn.onclick = () => toggleComment(comment, btn);
		comment.hidden = true;

		// placing button after the comment
		commentContainer.insertBefore(btn, comment);
	}


	/**
	 * hides/shows a comment
	 *
	 */
	function toggleComment(comment, button)
	{
		comment.hidden = !comment.hidden;
		button.innerHTML = (comment.hidden ? "Show" : "Hide") + " filtered comment";
	}


})();
