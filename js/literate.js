
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
						this.wrapInPanel(b.parent,b.title,b.isCollapsible,b.id,b.isCollapsed)
					},LitJS)
	},
	evalInputs : function(jq,_doc)
	{
		var $ = jq || jQuery
		var doc = _doc || document
		var litJSInputsScriptID = "litjs-inputs"
		
		function _decorated(inputs)
		{
			inputs.forEach(function(inp){
				inp.title = inp.id || ""
			})
			
			return inputs;
		}
		
		function _evalInputs(inputs)
		{
			var snippets = inputs
								.filter(function(inp) { return inp.id ? true : false})
								.map(function(inp) {
									var value = inp.value;
									if (inp.type == 'checkbox')
										value = inp.checked
									return "var " + inp.id + " = " + value + ";"
								})
			
			if (snippets.length > 0)
				this.createAndInsertJS(snippets.join("\n"),doc,litJSInputsScriptID)
		}
		
		var inputs = $('input.lit-value').toArray();
		
		_evalInputs.call(this,_decorated(inputs))

		$('input.lit-value').change(function(inp) { //naive implementation - for every change reevaluate all inputs
			$("#" + litJSInputsScriptID).remove();
			_evalInputs.call(LitJS,_decorated(inputs))
			
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
		var relevantPreNodes = $('pre').not('[litjs-ignore]')
		var codeBlocks = relevantPreNodes.children('code');
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
	wrapInPanel : function (preElement,title,collapsible,_id,collapsed)
	{
		if (!_id) throw "Can't wrap in panel: missing block ID";
		var id = _id

		var panelExtension = this.extensions.singleForHook("panelWrap");
		panelExtension.call(this,preElement,title,collapsible,id,collapsed)
		
	},
	toggleCollapseSymbol : function(el)
	{
		el.text(el.text() == '[-]' ? '[+]' : '[-]')
	},
	generateBlockID : function() { return "block_" + (LitJS.lastID++); },
	lastID : 0,
	
	extendWith : function(extension)
	{
		if (!extension) throw "Invalid extension"
		this.extensions.add(extension)
	},
	
	// Object handling all extensions to LitJS
	extensions : {
		exts : [], //the set of extension objects registered
		//Add the given extension object.
		add : function(extension)
		{
			this.exts.push(extension)
		},
		
		/*
			Given a hook ID, return the last extension registered that is registered to this hook.
			If no such extension is found an error is thrown.
		*/
		singleForHook : function(hookID)
		{
			var matched = this.exts.filter(function(ext) { return typeof(ext[hookID]) != "undefined"})
			if (matched.length == 0)
				throw "No extension found for " + hookID;
			else
				return (matched.pop())[hookID] || null
		}
		
	}
	
}

//// Default Behavior (extension)
LitJS.extendWith({
	panelWrap : function(preElement,title,collapsible,id,collapsed)
	{
		preElement.wrap("<div class='panel panel-info'><div class='panel-body' id='" + id + "'></div></div>")
		var bodyDiv = preElement.parent()
		var toggleSymbol = collapsed ? '+' : '-';
		var collapseLink = collapsible ? " <a href=\"javascript:$('#" + id + "').toggle(); LitJS.toggleCollapseSymbol($('#" + id + "').parent().children('.panel-heading').children())\">[" + toggleSymbol + "]</a>" : ""
		bodyDiv.before("<div class='panel-heading'>" + (title||"Code") + collapseLink + "</div>")
		if (collapsed)
			$("#" + id).toggle();
	},
	blockErrorHandler : function(blockID) {
		return "alert('Error in block " + blockID + ": ' + exn);"
	}
	
})

//// Definition of LitCodeBlock

function LitCodeBlock(htmlCodeNode)
{
	this.title = htmlCodeNode.parentElement.title
	this.isCollapsed = typeof (htmlCodeNode.parentElement.attributes["collapsed"]) != "undefined"
	this.isCollapsible = this.isCollapsed || (typeof (htmlCodeNode.parentElement.attributes["collapsible"]) != "undefined")
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
		
		function resolveErrorHandlingCode(_id)
		{
			return LitJS.extensions.singleForHook("blockErrorHandler").call(this,_id)
		}
		
		var ret = []
		ret.push("try {")
			ret.push(this.code)
		ret.push("}")
		ret.push("catch (exn) {")
			ret.push(resolveErrorHandlingCode(this.id))
		ret.push("}")
		
		return ret.join("\n")
	}
	return this;
}



