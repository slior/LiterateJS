
# Code Tooltip Extension

The code tooltip extension is used with collapsible code blocks to display the code inside blocks when the panel is collapsed.
The tooltip displays a clone of the code block itself.

## Importing the Extension
The extension uses  the [Tipped](http://www.tippedjs.com/) js library for tooltips.
In order to use it, import the extension, along with the tipped library and css files (taken from the attached example):

``` html
<script type="text/javascript" src="../extensions/litjs_codetooltip/litjs-codetip.js"></script>
<script type="text/javascript" src="../extensions/litjs_codetooltip/tipped.js"></script>
<link rel="stylesheet" href="../extensions/litjs_codetooltip/tipped.css">
```

*Note:* Tipped is free for non-commercial use. If this is not the case, consult Tipped website for [licensing options](http://www.tippedjs.com/download).

## Using the Extension
Nothing extra is needed in order to use the extension. The extension extends the `panelWrap` extension point to add the tooltip every time a code block is wrapped with a header panel.
