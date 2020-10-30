# jQlipboard
jQlipboard is a jQuery extension that makes accessing the clipboard much easier. This plugin also has features that make it usable across most if not all browsers.

## Installation
To install, simply add the following script tag below the tag where `jQuery.js` is called:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
<script type="text/javascript" src="https://raw.githubusercontent.com/DiriectorDoc/jQlipboard/master/JQlipboard.js"></script>
```

Or, for a minified script:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="https://raw.githubusercontent.com/DiriectorDoc/jQlipboard/master/JQlipboard.min.js"></script>
```

## Copying
There are a few ways to add text to the clipboard. To simply copy a string to the clipboard use `$.copy(str)`:

```javascript
$.copy("This string will be copied")
```

To copy the text in an `<input>` or `<textarea>`, simply use `$(...).copy()`:

```javascript
let element = $('<input type="text" />').val("This text will bo copied").appendTo("body")

/* The value of the textarea is copied */
element.copy()
```

Using `$(...).copy()` on any other type of element will instead copy the inside text.

```html
<body>
	<div id="copy-text">This text will be coppied</div>

	<script>
		$("#copy-text").copy()
	</script>
</body>
```

## Pasting
Using `$.paste()` is identical to pasting using regular means, such as <kbd>Ctrl</kbd> + <kbd>V</kbd>.

> **Note:** By default, pasting is not enabled. Having it off by default saves RAM and avoids unnecessary permission prompts. To enable it, use `{pasting: true}` in your [initialization](#initilization) config.

```javascript
/* May throw an error if used while the document is not focused */
$.paste()
```

To paste text into a textarea of some sort, use `$(...).paste()`:

```javascript
let element = $('<input type="text" />').appendTo("body")

/* This will put whatever text is in your clipboard into the textarea */
element.paste()
```

Using `$(...).paste()` on any other type of element will instead paste the text as innerHTML.

```html
<body>
	<div id="copy-text">This text will be replaced</div>

	<script>
		$.copy("This text will replae the existing text")

		$("#copy-text").paste()
	</script>
</body>
```

## Selecting
Using `$(...).select()` will highlight the target element. This will work on almost any element. This function extends the use of the existing jQuery function [`.select()`](https://api.jquery.com/select/), which will trigger instead if used on an `<input>` or `<textarea>` element.

```html
<body>
	<div id="select-text">This text will be selected</div>

	<script>
		$("#select-text").select()
	</script>
</body>
```

Calling the function `$.deselect()` will nullify any selection there may be on the page.

## Initilization
Initialization is not mandatory. If jQlipboard is not initialized, it will simply use the default config. Only initialize if you plan on using the paste feature somewhere on your page.

```javascript
$.jQlipboard({
	/*
	 * Enables the paste command. Off by default to save ram
	 * and avoid unnecessary permission prompts.
	 * All other config options are reliant on this one. If
	 * this is set to false or not at all, any other config
	 * option will be ignored.
	 */
	pasting: /* true, false (default) */,
			  
	// Determines when the page will request permession to use the clipboard; on load or when needed
	permissionPrompt: /* "immediate", "when needed" (default) */,

	// Detects when you modify the clipboard on your own and adjusts the functions accordingly
	copyListener: /* true, false (default) */
})
```