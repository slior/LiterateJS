

LitJS.extendWith({
  preEval : function() {
    if (!marked) throw new ("Missing marked library")

    function setupMDRenderer()
    {

      var litjsMDRenderer = new marked.Renderer()

      litjsMDRenderer.codespan = function(code) {
        var h = []
        h.push("<code class='inline'>") //TODO: should support more classes somehow
          h.push(code)
        h.push("</code>")
        return h.join("")
      }


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

      return litjsMDRenderer;
    }

    //Do the actual markdown processing
    var divs = $(".md_content")
    var texts = divs.toArray()
                    .map(function (d) {
                      return $(d).html().replace(/&gt;/g,'>')
                                        .replace(/&lt;/g,'<')
                    })
    var htmls = texts.map(function(text) { return marked(text,{ renderer : setupMDRenderer()})})

    divs.each(function(index) { $(this).html(htmls[index]); return true; })
  }
})
