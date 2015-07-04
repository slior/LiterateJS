
var LitJS = {
	eval : function()
	{
		this.evalScriptBlocks();
		this.evalInline();
	},
	evalScriptBlocks : function(jq,_doc)
	{
		var $ = jq || jQuery
		var doc = _doc || document
		
		var codeBlocks = $('pre code')
		var snippets = []
		for (var i = 0; i < codeBlocks.length; i++) 
		{
			var lcb = new LitCodeBlock(codeBlocks[i])
			//lcb.insertJSTo(doc)
			snippets.push(lcb.code)
			if (lcb.title)
				this.wrapInPanel($(codeBlocks[i].parentElement),lcb.title,lcb.isCollapsible)
		}
		
		if (snippets.length > 0) //actually create and insert the JS element. This also executes the script
		{
			var js = doc.createElement('script')
			js.type = "text/javascript"
			js.text = snippets.join("\n")
			doc.head.appendChild(js)	
		}	
	},
	evalInline : function(jq)
	{
		var $ = jq || jQuery
		var inlines = $('code.inline')
		
		for (var i = 0, l = inlines.length; i < l; i++)
			inlines[i].innerText = eval(inlines[i].innerText)
		
	},
	wrapInPanel : function (preElement,title,collapsible,_id)
	{
		var id = _id || this.generateBlockID()

		preElement.wrap("<div class='panel panel-info'><div class='panel-body' id='" + id + "'></div></div>")
		var bodyDiv = preElement.parent()
		var collapseLink = collapsible ? " <a href=\"javascript:$('#" + id + "').toggle(); LitJS.toggleCollapseSymbol($('#" + id + "').parent().children('.panel-heading').children())\">[-]</a>" : ""
		bodyDiv.before("<div class='panel-heading'>" + (title||"Code") + collapseLink + "</div>")
	},
	toggleCollapseSymbol : function(el)
	{
		el.text(el.text() == '[-]' ? '[+]' : '[-]')
	},
	generateBlockID : function() { return "block_" + (LitJS.lastID++); },
	lastID : 0
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
		js.type = "text/javascript"
		
		js.text = this.code
		doc.head.appendChild(js);
	}
	
	return this;
}



