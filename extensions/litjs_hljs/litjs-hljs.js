LitJS.extendWith({
  preEval : function() {
    if (hljs)
      $('pre code').each(function(i, block) { hljs.highlightBlock(block); });

  }
})
