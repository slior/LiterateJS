
LitJS.extendWith({
  inputChange : function(inp)
  {
    if (!inp) return;
	var value = inp.type == 'checkbox' || inp.type == 'radio' ?
				  inp.checked
				  : inp.value
    localStorage[inp.id] = value
  }

  , inputEval : function(inp,value)
  {
    var key = inp && inp.id;
    return localStorage[key] || value;
  }
})
