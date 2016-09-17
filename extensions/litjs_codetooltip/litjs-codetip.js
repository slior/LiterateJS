
LitJS.extendWith({
  panelWrap : function(elements,title,collapsible,id,collapsed)
  {
    if (collapsible || collapsed) //if the element is not collapsible/collapsed, there's nowhere to display the tooltip, and no reason to display one
    {
      var headingEl = elements.headingEl
      if (!headingEl) throw new Error("Heading element must be specified for tooltip")
      var codeEl = elements.codeEl
      if (!codeEl) throw new Error("Code element (pre) must be specified for tooltip extension")

      Tipped.create(headingEl,$(codeEl).clone()) //create the tooltip, anc cloning the code element to display the code in the tooltip
    }
  }
})
