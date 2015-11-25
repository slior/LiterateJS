
# Markdown Support in LiterateJS

This extension provides [Markdown](https://en.wikipedia.org/wiki/Markdown) support for writing literate programs.
Markdown support is done using the [marked](https://github.com/chjj/marked) library.

A complete example is available [here](https://github.com/slior/LiterateJS/blob/master/examples/markdown_example.html).
We continue with describing the basic functionality and usage.

## Importing the Extension

In order to import the extension, simply include the `litjs-md.js` file in your document:
``` html
<script type="text/javascript" src="path/to/extensions/litjs_md/litjs-md.js"></script>
```

The extension code assumes that LiterateJS is loaded and available.
The [marked](https://github.com/chjj/marked) library should also be loaded and available.

## Using the Extension

In order to use the extension, you can write your HTML as always - regular functionality is not altered. Markdown code can should be written inside `div` elements with the `md_content` class:

```
<div class="md_content">
  All markdown content goes here.
</div>
```

You should write your text as any markdown document (using [Github Flavored Markdown](https://help.github.com/articles/markdown-basics/)). LiterateJS will take care to render the markdown as HTML.

A code block inside the markdown content (using a single or 3 backticks) will be interpreted as a LiterateJS code block by default - it will be evaluated. Single backtick blocks are considered inline blocks.

In order to specify specific attributes, e.g. `collapsible`, you can add the HTML attributes as a comment in the first line of code.
For example:

````

```
//litjs: collapsed title="Preprocessing"
var digitsPowered = [];
for (i = 0; i < 10; i++)
  digitsPowered.push(Math.pow(i,power))
```

`````

The `//litjs: ` prefix is mandatory (note the space after the colon - there must be at least one), after that, any attribute can follow.

After doing this, just call `LitJS.eval()` as usual, this will take care of rendering the markdown first, and then the HTML markup and Javascript code, as any regular LiterateJS document.
