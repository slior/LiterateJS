
var LitJS = {
	eval : function()
	{
		this.evalInputs();
		var scriptBlocks = this.evalScriptBlocks();
		this.createHeadersFor(scriptBlocks)
		this.evalInline();
	},
	createHeadersFor : function(scriptBlocks)
	{
		scriptBlocks.filter(function(b) { return b.title ? true : false })
					.forEach(function (b) {
						this.wrapInPanel(b.parent,b.title,b.isCollapsible,b.id)
					},LitJS)
	},
	evalInputs : function(jq,_doc)
	{
		var $ = jq || jQuery
		var doc = _doc || document
		var litJSInputsScriptID = "litjs-inputs"
		
		function _evalInputs()
		{
			var snippets = []
			$('input.lit-value').toArray().forEach(function(inp) {
				if (inp.id)
					snippets.push("var " + inp.id + " = " + inp.value + ";")
			})
			
			if (snippets.length > 0)
				this.createAndInsertJS(snippets.join("\n"),doc,litJSInputsScriptID)
		}
		
		_evalInputs.apply(this)

		$('input.lit-value').change(function(inp) { //naive implementation - for every change reevaluate all inputs
			$("#" + litJSInputsScriptID).remove();
			_evalInputs.apply(LitJS)
			
			$("#" + LitJS.BlocksScriptID).remove();
			LitJS.evalScriptBlocks();
			LitJS.evalInline();
			
		})
	},
	createAndInsertJS : function(code,doc,id)
	{
			var js = doc.createElement('script')
			js.type = "text/javascript"
			js.text = code
			if (id) js.id = id;
			doc.head.appendChild(js)	
	},
	locateScriptBlocks : function(jq)
	{
		var $ = jq || jQuery
		var codeBlocks = $('pre code')
		return codeBlocks.toArray().map(function(cb) { return new LitCodeBlock(cb); } )
	},
	evalScriptBlocks : function(jq,_doc)
	{
		var $ = jq || jQuery
		var doc = _doc || document
		
		var scriptBlocks = this.locateScriptBlocks($);
		var snippets = scriptBlocks.map(function(b) { return b.wrappedCode(); })
		
		if (snippets.length > 0) //actually create and insert the JS element. This also executes the script
			this.createAndInsertJS(snippets.join("\n"),doc,this.BlocksScriptID)
		
		return scriptBlocks;
	},
	codeBlockFooter : function()
	{
		return "}\n" + this.BlocksFunctionName + "();"
	},
	codeBlockHeader : function()
	{
		return "function " + this.BlocksFunctionName + "() {"
	},
	BlocksFunctionName : "LIT_CODE",
	BlocksScriptID : "litjs-block",
	evalInline : function(jq)
	{
		var $ = jq || jQuery
		var inlines = $('code.inline')
		
		for (var i = 0, l = inlines.length; i < l; i++)
		{
			var inlineBlock = inlines[i]
			var codeToEval = inlineBlock.code || inlineBlock.innerText
			inlineBlock.innerText = eval(codeToEval)
			inlineBlock.code = codeToEval;
		}
		
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



