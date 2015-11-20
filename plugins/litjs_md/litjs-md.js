
if (!marked)
  throw new ("Missing marked library")

var litjsMDRenderer = new marked.Renderer()

function renderInlineCodeBlocksAsEvals(code)
{
  // console.log("code = " + code)

  var h = []
  h.push("<code class='inline'>") //TODO: should support more classes somehow
    h.push(code)
  h.push("</code>")
  return h.join("")
}

litjsMDRenderer.codespan = renderInlineCodeBlocksAsEvals


litjsMDRenderer.code = function(code,lang) {
  var h = []
  var re = /\/\/litjs:[\t ]+((.)*)[\s]*/ //should this be a more specific (safe?) regex
  var match = re.exec(code)
  code = match ? code.replace(re,"") : code
  h.push("<pre " + ((match && match[1]) || '') + "><code>")
    h.push(code)
  h.push("</code></pre>")

  return h.join("")

}

function renderMD()
{
  function prepareHTMLForMD(str) {
    return str.replace(/&gt;/g,'>')
              .replace(/&lt;/g,'<')
  }

  var divs = $(".md_content")
  var texts = divs.toArray()
                  .map(function (d) { return prepareHTMLForMD($(d).html())})
  var htmls = texts.map(function(text) { return marked(text,{ renderer : litjsMDRenderer})})

  divs.each(function(index) { $(this).html(htmls[index]); return true; })
}



marked.setOptions({
  renderer : litjsMDRenderer,
  smartypants: true
});
