# LiterateJS
Implementing literate programming in Javascript, for the browser.

This is an attempt at implementing the idea of (Literate Programming)[https://en.wikipedia.org/wiki/Literate_programming] in a simple Javascript and HTML setting.

The goal is to enable a simple literate programming model, which is immediately rendered and executable by a modern browser.
HTML combined with Javascript is actually a great fit: all the presentation is already there, and the execution engine is readily available in the browser.
Adding available style sheet and other available frameworks, namely [JQuery](https://jquery.com/) and [Highlight.JS](https://highlightjs.org/), allows us to reach nice results fairly quickly.

The initial implementation is extremely simple (some would say simplistic), but it already provides a good starting point.
With a good stylesheet, and accompanied syntax highlighting, this provides, in my opinion, a convincing proof of concept.

The example provided here shows the usage of the code, combined with the usage of [bootstrap](http://getbootstrap.com/css/) for formatting and highlight.js for syntax highlighting.

## Usage

In order to use this in your file, simply reference the literate.js in your HTML file.
In your HTML, in order to use a code block, just put your javascript code in <pre> <code> tags:
```
<pre>
<code>
var power = 5;
var upperBound = 355000;
</code>
</pre>
```
Combined with Highlight.JS this should also take care of syntax highlighting.
If you want to embed a Javascript expression inline, simply enclose the expression in `<code>` tag, with an `inline` class.

Upon loading the page, simply invoke the `evalLitJS()` function, this should take care of the rest.

See the attached [example](https://github.com/slior/LiterateJS/blob/master/euler30.html) to get a better idea.

## Dependencies

The code depends on JQuery, though this dependency can be easily removed at this time.
Other than that, the example uses Bootstrap and Highlight.JS, but the literate programming doesn't rely on that.

## TODO/Further Enhancements

- Support markdown
- Reusing/referencing code blocks from other code blocks.
- Other languages?
- Expanding/Collapsing code blocks.