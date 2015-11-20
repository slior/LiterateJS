
var LitJS = {
	eval : function()
	{

		try {
			var preEvalFunc = this.extensions.singleForHook('preEval')
			preEvalFunc.call(this)
		} catch (e) {
			console.log('No preEval extensions')
		}

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
		var relevantPreNodes = $('pre').not('.litjs-ignore')
		var codeBlocks = relevantPreNodes.children('code');
		return codeBlocks.toArray().map(function(cb) { return new LitCodeBlock(cb); } )
	},
	evalScriptBlocks : function(jq,_doc)
	{
		var $ = jq || jQuery
		var doc = _doc || document

		var scriptBlocks = this.locateScriptBlocks($);
		scriptBlocks.forEach(function(block){
			block.resolveEmbeddedBlocks(scriptBlocks) //will also mark embedded blocks as such.
		})
		var snippets = scriptBlocks
						.filter(function(b) { return !b.embedded; })
						.map(function(b) { return b.wrappedCode(); })

		if (snippets.length > 0) //actually create and insert the JS element. This also executes the script
			this.createAndInsertJS(snippets.join("\n"),doc,this.BlocksScriptID)

		return scriptBlocks;
	},
	BlocksScriptID : "litjs-block",
	evalInline : function(jq)
	{
		var $ = jq || jQuery

		function evaluateAndRender(inlineClass,renderFunc,thiz)
		{
			var inlines = $('code.' + inlineClass)
			inlines.toArray().forEach(function(codeEl) {
				var __code = codeEl.code || codeEl.innerText;
				codeEl.title = __code;
				var __result = eval(__code)
				if (typeof __result == "undefined") throw "Undefined evaluation result ==> can't render"
				renderFunc.call(this,codeEl,__result)
				codeEl.code = __code;
			},thiz)
		}

		evaluateAndRender('inline',function(codeEl,result) {
			codeEl.innerText = result;
		},this)

		evaluateAndRender('litjs-inline-obj',function(codeEl,result) {
			codeEl.innerText = this.extensions.singleForHook("inlineObjRender",codeEl).call(this,result)
		}, this)

		evaluateAndRender('litjs-inline-table',function(codeEl,result) {
			if (typeof(result) != "object" || !(result.length))
				throw "Can't render a non-array as a table"
			var jqEl = $(codeEl)
			var TBL_WRAPPER_INDICATOR = "tbl_wrapper"
			//see if we have a table rendered for this code block, and if yes, remove it.
			jqEl.prev("div[" + TBL_WRAPPER_INDICATOR + "]").remove()

			//now create the new table, and insert it before the code element
			var h = []
			h.push("<div " + TBL_WRAPPER_INDICATOR + ">")
				h.push(this.extensions.singleForHook("inlineTblRender",codeEl).call(this,result,codeEl))
			h.push("</div>")

			jqEl.before(h.join(""))
			jqEl.addClass("hidden")
		}, this)

	},
	wrapInPanel : function (preElement,title,collapsible,_id,collapsed)
	{
		if (!_id) throw "Can't wrap in panel: missing block ID";
		var id = _id

		var panelExtension = this.extensions.singleForHook("panelWrap",preElement);
		panelExtension.call(this,preElement,title,collapsible,id,collapsed)

	},
	toggleCollapseSymbol : function(el)
	{
		el.text(el.text() == '[-]' ? '[+]' : '[-]')
	},
	generateBlockID : function() { return "block_" + (LitJS.lastID++); },
	lastID : 0,

	// extensions handling
	extendWith : function(extension)
	{
		if (typeof(extension) != "object") throw "Invalid extension type. Must be an object"
		if (!extension) throw "Invalid extension"

		this.extensions.add(extension)
	},

	extendConditionally : function(extension,condition)
	{
		if (!extension) throw "Invalid extension"
		condition = condition || function() { return true; }
		this.extensions.addConditionally(extension,condition);
	},

	hasAttribute : function(htmlNode,att)
	{
		if (!htmlNode || !att) return false;
		return typeof (htmlNode.attributes[att]) != "undefined"
	},

	// Object handling all extensions to LitJS
	extensions : {
		exts : [], //the set of extension objects registered
		//Add the given extension object.
		add : function(extension)
		{
			this.addConditionally(extension, function(hook,el) { return true; })
		},

		addConditionally : function(extension,condition)
		{
			this.exts.push({condition : condition, extension : extension})
		},

		/*
			Given a hook ID, return the last extension registered that is registered to this hook.
			If no such extension is found an error is thrown.
		*/
		singleForHook : function(hookID,el)
		{
			var matched = this.exts.filter(function(entry) {
				var ext = entry.extension;
				var cond = entry.condition;

				return cond.call(this,hookID,el) && typeof(ext[hookID]) != "undefined"
			})
			if (matched.length <= 0)
				throw "No extension found for " + hookID;
			else
				return (matched[matched.length-1]).extension[hookID] || null
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
	},
	inlineObjRender : function(obj) {
		return JSON.stringify(obj);
	},
	inlineTblRender : function(tbl,codeEl) {
		if (!tbl || !(typeof tbl != "array") || tbl.length == 0)
			return ""
		var keys = Object.keys(tbl[0])
		var h = []
		h.push('<table class="table" title="' + codeEl.innerText + '">')
			h.push('<thead>')
				h.push('<tr>')
					keys.forEach(function(k){ h.push ('<td>' + JSON.stringify(k) + '</td>')})
				h.push('</tr>')
			h.push('</thead>')
			h.push('<tbody>')
				tbl.forEach(function(row) {
					h.push('<tr>')
						keys.forEach(function(k){ h.push ('<td>' + row[k] + '</td>')})
					h.push('</tr>')
				})
			h.push('</tbody>')
		h.push('</table>')
		return h.join("");

	},
	preEval : function() { }

})

//// Definition of LitCodeBlock

function LitCodeBlock(htmlCodeNode)
{
	this.title = htmlCodeNode.parentElement.title
	this.isCollapsed = LitJS.hasAttribute(htmlCodeNode.parentElement,"collapsed")
	this.isCollapsible = this.isCollapsed || LitJS.hasAttribute(htmlCodeNode.parentElement,"collapsible")
	this.code = htmlCodeNode.innerText
	this.parent = $(htmlCodeNode.parentElement)
	this.id = htmlCodeNode.parentElement.id || LitJS.generateBlockID()
	this.embedded = false;  //by default, a code block is not embedded.

	this.wrappedCode = function()
	{

		function resolveErrorHandlingCode(_id)
		{
			return LitJS.extensions.singleForHook("blockErrorHandler").call(this,_id)
		}

		var ret = []
		ret.push("try {")
			ret.push(this.processedCode || this.code)
		ret.push("}")
		ret.push("catch (exn) {")
			ret.push(resolveErrorHandlingCode(this.id))
		ret.push("}")

		return ret.join("\n")
	}

	//returns the code of this block, including any embeddings of other blocks.
	// it will possibly process its original code and embed any other necessary code, recursively.
	this.resolveEmbeddedBlocks = function(allBlocks)
	{
		function blockByID(_id)
		{
			var a = allBlocks.filter(function(b) { return b.id == _id})
			if (a.length <= 0) throw "Couldn't find script block with id: " + _id
			return a[0]
		}

		if (!this.processedCode)
		{
			var newCode = this.code.replace(/@@\("(\w+)"\)/g,function(complete,matchedID) {
				var blockToEmbed = blockByID(matchedID)
				blockToEmbed.embedded = true;
				return blockToEmbed.resolveEmbeddedBlocks(allBlocks); //call recursively in case the embedded code also has embeddings
			})
			this.processedCode = newCode;
		}
		return this.processedCode;
	}

	return this;
}
