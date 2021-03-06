# LiterateJS
Implementing literate programming in Javascript, for the browser.

This is an attempt at implementing the idea of [Literate Programming](https://en.wikipedia.org/wiki/Literate_programming) in a simple Javascript and HTML setting.

The goal is to enable a simple literate programming model, which is immediately rendered and executable by a modern browser.
HTML combined with Javascript is actually a great fit: all the presentation is already there, and the execution engine is readily available in the browser.
Adding available style sheet and other available frameworks, namely [JQuery](https://jquery.com/) and [Highlight.JS](https://highlightjs.org/), allows us to reach nice results fairly quickly.

The initial implementation is extremely simple (some would say simplistic), but it already provides a good starting point.
With a good stylesheet, and accompanied syntax highlighting, this provides, in my opinion, a convincing proof of concept.

The example provided here shows the usage of the code, combined with the usage of [bootstrap](http://getbootstrap.com/css/) for formatting and highlight.js for syntax highlighting.

## Playing Well With Standards

As a general rule, the method used here tries to be minimalistic in its usage of other technologies and its proprietary way of doing things.
The main drive for this is to present a method for achieving literate programming, but still be open to other standards and tools.
To enable easy incorporation of other tools and frameworks. This is the reason we try to stick to HTML and plain Javascript. JQuery is used in the code mainly for its capabilities around DOM navigation and manipulation.
The example shows how to incoporate Highlight.JS and bootstrap. The default style sheet for generated code is bootstrap (with future plan to decouple this as well).


## Usage

In order to use this in your file, simply reference the `js/literate.js` and `css/LitJS.css` files in your HTML file.
In your HTML, in order to use a code block, just put your javascript code in `<pre> <code>` tags:

```
<pre>
<code>
var power = 5;
var upperBound = 355000;
</code>
</pre>
```
Combined with Highlight.JS this should also take care of syntax highlighting.
If you want to embed a Javascript expression inline, simply enclose the expression in `<code>` tag, with an `inline` class:

```
The upper bound is <code class="inline">upperBound</code>
```

Upon loading the page, simply invoke the `LitJS.eval()` function, this should take care of the rest.
See the attached [example](https://github.com/slior/LiterateJS/blob/master/examples/euler30.html) to get a better idea.

### Providing Titles
You can wrap a code block in a panel with a title simply by providing a title attribute to the `pre` tag.
For example:
```
<pre title="Solution">
<code> ... </code>
</pre>
```

This will result in a panel with a title, using the value of the `title` attribute provided.
This method uses bootstrap classes to render the resulting HTML.

You can of course use any other valid HTML to produce the title directly. The example shows both methods.

#### Collapsible Blocks

When providing a title, you also have the option to designate the block as a collapsible block.
If you do that, a small text "button" will appear near the title, allowing the user to collapse and expand the title at will.
For example:
```
<pre title="Solution" collapsible>
<code> ... </code>
</pre>
```

As previously, you have the option to do it yourself, with different styles/characters.

You also have the option to start the block as collapsed, when the page is loaded. Simply replace 'collapsible' with 'collapsed', like so:
```
<pre title="Solution" collapsed>
<code> ... </code>
</pre>
```
And the annotated block will be collapsed when the page loads. Otherwise, the behavior is like 'collapsible'.


### Error Handling
If an error is raised in one of the blocks, LiterateJS will raise an error, by default using `windows.alert`.
It will report the id of the code block. LiterateJS will provide a default id if none is provided by you.
For an example of this, refer to the [error example](https://github.com/slior/LiterateJS/blob/master/examples/error_example.html).

### Interactive Literate Blocks
Blocks can also reference values that are given by in-page input elements.
For example, given an input element:
```
<input type=number id=y class="lit-value" />
```
Another code block in the same page can now reference `y` as a variable, with the value given in the input.
For example:
```
var x = y + 2;
```
This is also bound to the inputs' change events, so code blocks will get re-evaluated, and inline code snippets will be updated.
See the [interactive example](https://github.com/slior/LiterateJS/blob/master/examples/interactive_example.html) for a more complete example.

Also, tooltips, with the given variable name will be added to the inputs marked as lit-value. So the user may hover over specific inputs, and learn their variable names as they appear in code.

### Ignoring Specific PRE CODE Element
As a rule, LitJS searches for `code` elements within `pre` elements, and evaluates them.
In case you want to have such an element, but not have it evaluated by LitJS, simply add the `litjs-ignore` class to the `pre` element.
For example:
```
<pre class="litjs-ignore">
<code> ... </code>
</pre>
```

This element will be simply ignored by LitJS - it won't be evaluated, nor any other treatment, e.g. adding headers, will be added to it.

### Embedding Code Blocks
It is possible to embed the content of one code block into another one, resulting in a larger code block.
This allows for breaking the code into more understandable pieces, separating concepts, etc. It allows to structure the document more freely, not being restricted by the embedded language (javascript) scope definition rules.
For a more complete overview and discussion, see the [cross reference example](https://github.com/slior/LiterateJS/blob/master/examples/cross_reference_example.html)

## Dependencies

The code depends on JQuery. Other than that, the example uses Bootstrap and Highlight.JS, but the literate programming doesn't rely on that.
Some examples use other libraries, the rights to those libraries the property of their respective owners, as designated by their respective licenses.

## Markdown Support in LiterateJS

It is possible to write LiterateJS documents using [Markdown](https://en.wikipedia.org/wiki/Markdown), specifically [Github Flavored Markdown](https://help.github.com/articles/markdown-basics/).

The functionality is available using a separate optional extension to LiterateJS - [litjs-md](https://github.com/slior/LiterateJS/tree/master/extensions/litjs_md). Using this extension allows one to write simple markup documents, with code blocks, and using these as regular text documents.
See the [extension's documentation](https://github.com/slior/LiterateJS/blob/master/extensions/litjs_md/Markdown_Support.md) for more details.

## Auto-Saving

Literate JS documents can be used as live documents. Meaning: changing values in them, and reloading at a later time.
Using the optional [Auto Save extension](https://github.com/slior/LiterateJS/tree/master/extensions/litjs_autosave), values can be saved in the browser's local storage (automatically), and reloaded when the page is loaded later, in the same browser.


