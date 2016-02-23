
LitJS.extendWith({
  inputChange : function(inp)
  {
    if (!inp) return;
    localStorage[inp.id] = inp.value
  }

  , inputEval : function(inp,value)
  {
    var key = inp && inp.id;
    return localStorage[key] || value;
  }
})
