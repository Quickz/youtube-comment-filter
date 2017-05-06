(function() {

	var interval;
	var currStrToFilter;

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
	function processComments(comments, index, strToFilter)
	{
		for (let i = 0; i < comments.length; i++)
		{
			let comment = comments[i].getElementsByClassName("comment-renderer-text-content")[0];
			let text = getText(comment);

			let alreadyChecked;

			// if current filter's changed
			// every comment has to be rechecked
			if (currStrToFilter != strToFilter)
			{
				comment.classList.remove("hidden-comment-yt");
				alreadyChecked = false;
			}
			else
				alreadyChecked = comment.hasAttribute("checked-by-filter-yt");

			if (!alreadyChecked)
			{
				let regx = new RegExp(strToFilter, "i");

				if (text.match(regx))
				{
					comment.classList.add("hidden-comment-yt");
				}
				comment.setAttribute("checked-by-filter-yt", "");
			}
		}

		currStrToFilter = strToFilter;
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


})();
