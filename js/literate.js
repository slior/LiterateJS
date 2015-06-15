
function evalScriptBlocks() {
	
  var codeBlocks = $('pre code') //relies on jquery, but can be done without it as well.
  for (var i = 0; i < codeBlocks.length; i++) {
    var js = document.createElement('script');
	js.innerText = codeBlocks[i].innerText;
	document.head.appendChild(js);
  }
}

function evalInline() {
	
	var inlines = $('code.inline')
	
	for (var i = 0, l = inlines.length; i < l; i++)
		inlines[i].innerText = eval(inlines[i].innerText)
	
}