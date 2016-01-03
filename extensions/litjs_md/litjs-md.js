

LitJS.extendWith({
  preEval : function() {
    if (!marked) throw new ("Missing marked library")

    function setupMDRenderer()
    {

      var litjsMDRenderer = new marked.Renderer()

      litjsMDRenderer.codespan = function(code) {
        var h = []
        var attRE = /\/\*litjs:[\t ]+((.)*)[\t ]+\*\//
        var classRE = /class=/
        var defaultClassAtt = !classRE.test(code) ? "class='inline'" : ""
        var match = attRE.exec(code)
        code = match ? code.replace(attRE,"") : code

        h.push("<code " + defaultClassAtt + " " +  ((match && match[1]) || '') + ">") //TODO: should support more classes somehow
          h.push(code)
        h.push("</code>")
        return h.join("")
      }


      litjsMDRenderer.code = function(code,lang) {
        var h = []
        var preRE = /\/\/litjs:[\t ]+((.)*)[\s]*/ //should this be a more specific (safe?) regex
        var match = preRE.exec(code)
        code = match ? code.replace(preRE,"") : code
        h.push("<pre " + ((match && match[1]) || '') + ">")

          var codeRE = /\/\/litjs-code:[\t ]+((.)*)[\s]*/
          match = codeRE.exec(code)
          code = match ? code.replace(codeRE,"") : code
          h.push("<code " + ((match && match[1] || '')) + ">")
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
