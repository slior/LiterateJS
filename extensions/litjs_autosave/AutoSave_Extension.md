
# Auto Save Extension

This extension provides the capability to auto-save inputs, into the browser's local store (in supported browsers).
This allows literate documents to maintain values, and resume work on them when a page is reloaded in the browser.

Any value change is kept in the local storage, and reloaded when the page loads.

## Importing the Extension

In order to import the extension, simply include the `litjs-autosave.js` file in your document:
``` html
<script type="text/javascript" src="path/to/extensions/litjs_autosave/litjs-autosave.js"></script>
```

The extension code assumes that LiterateJS is loaded and available; and support of local storage in the rendering browser.

## Using the Extension

Using this extension requires no special coding other than importing it.
It will automatically extend LiterateJS with the necessary functionality.
