
var LitJS = {
	eval : function()
	{
		evalScriptBlocks();
		evalInline();
	},
	lastID : 0
}

function evalScriptBlocks(jq,_doc)
{
	var $ = jq || jQuery
	var doc = _doc || document
	
	var codeBlocks = $('pre code')
	for (var i = 0; i < codeBlocks.length; i++) 
	{
		var lcb = new LitCodeBlock(codeBlocks[i])
		lcb.insertJSTo(doc)
		if (lcb.title)
			wrapInPanel($(codeBlocks[i].parentElement),lcb.title,lcb.isCollapsible)
	}
}


function LitCodeBlock(htmlCodeNode)
{
	this.title = htmlCodeNode.parentElement.title
	this.isCollapsible = typeof (htmlCodeNode.parentElement.attributes["collapsible"]) != "undefined"
	this.code = htmlCodeNode.innerText
	this.parent = $(htmlCodeNode.parentElement)
	this.insertJSTo = function (doc)
	{
		var js = doc.createElement('script');
		js.innerHTML = this.code
		doc.head.appendChild(js);
	}
	
	return this;
}

function wrapInPanel(preElement,title,collapsible,_id)
{
	var id = _id || generateBlockID()
	preElement.wrap("<div class='panel panel-info'><div class='panel-body' id='" + id + "'></div></div>")
	var bodyDiv = preElement.parent()
	var collapseLink = collapsible ? " <a href=\"javascript:$('#" + id + "').toggle()\">&times;</a>" : ""
	bodyDiv.before("<div class='panel-heading'>" + (title||"Code") + collapseLink + "</div>")
	
}

function generateBlockID()
{
	return "block_" + (LitJS.lastID++)
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



