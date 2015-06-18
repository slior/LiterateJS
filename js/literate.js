
var LitJS = {
	eval : function()
	{
		evalScriptBlocks();
		evalInline();
	}
}

function evalScriptBlocks(jq,_doc)
{
	var $ = jq || jQuery
	var doc = _doc || document
	
	var codeBlocks = $('pre code')
	for (var i = 0; i < codeBlocks.length; i++) 
	{
		var codeBlock = codeBlocks[i]
		createAndInsertJS(codeBlock,doc)
		if (codeBlock.parentElement.title)
			wrapInPanel($(codeBlock.parentElement),codeBlock.parentElement.title);
	}
}

function wrapInPanel(preElement,title)
{
	preElement.wrap("<div class='panel panel-info'><div class='panel-body'></div></div>")
	var bodyDiv = preElement.parent()
	
	bodyDiv.before("<div class='panel-heading'>" + (title||"Code") + "</div>")
	
}

function createAndInsertJS(codeBlock,doc)
{
	var js = doc.createElement('script');
	js.innerHTML = codeBlock.innerText;
	doc.head.appendChild(js);
}

function evalInline(jq)
{
	var $ = jq || jQuery
	var inlines = $('code.inline')
	
	for (var i = 0, l = inlines.length; i < l; i++)
		inlines[i].innerText = eval(inlines[i].innerText)
	
}



