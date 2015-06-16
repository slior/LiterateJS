
function evalScriptBlocks(jq,_doc)
{
	var $ = jq || jQuery
	var doc = _doc || document
	
	var codeBlocks = $('pre code')
	for (var i = 0; i < codeBlocks.length; i++) 
	{
		var js = doc.createElement('script');
		js.innerText = codeBlocks[i].innerText;
		doc.head.appendChild(js);
	}
}

function evalInline(jq)
{
	var $ = jq || jQuery
	var inlines = $('code.inline')
	
	for (var i = 0, l = inlines.length; i < l; i++)
		inlines[i].innerText = eval(inlines[i].innerText)
	
}

function evalLitJS()
{
	evalScriptBlocks();
	evalInline();
}