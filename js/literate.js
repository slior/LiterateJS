
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
		//snippets.push(this.codeBlockHeader())
		for (var i = 0; i < codeBlocks.length; i++) 
		{
			var lcb = new LitCodeBlock(codeBlocks[i])
			snippets.push(lcb.wrappedCode())
			if (lcb.title)
				this.wrapInPanel($(codeBlocks[i].parentElement),lcb.title,lcb.isCollapsible,lcb.id)
		}
		
		if (snippets.length > 0) //actually create and insert the JS element. This also executes the script
		{
			var js = doc.createElement('script')
			js.type = "text/javascript"
			js.text = snippets.join("\n")
			doc.head.appendChild(js)	
		}	
	},
	codeBlockHeader : function()
	{
		//ret.push()
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
	this.id = htmlCodeNode.parentElement.id || LitJS.generateBlockID()
	this.insertJSTo = function (doc)
	{
		var js = doc.createElement('script');
		js.type = "text/javascript"
		
		js.text = this.code
		doc.head.appendChild(js);
	}
	
	this.wrappedCode = function()
	{
		var ret = []
		ret.push("try {")
			ret.push(this.code)
		ret.push("}")
		ret.push("catch (exn) {")
			ret.push("alert('Error in block " + this.id + ": ' + exn);")
		ret.push("}")
		
		return ret.join("\n")
	}
	return this;
}



