# jQlipboard
jQlipboard is a jQuery extention that makes accessing the clipboard much easier. This plugin also has features that make it usible across most if not all browsers.

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
There are a few ways to add text to clipboard. To simply copy a string to the clipboard use `$.copy(str)`:

```javascript
$.copy("This string will be coppied")
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
Using `$.paste()` is identical to pasting using regular means, such as <kbd>Ctrl</kbd> + <kbd>V</kbd>:

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

## Initilization
Initialization is not manditory. If jQlipboard is not initilized, it will simply use the default config:

```javascript
$.jQlipboard({
	// Determines when the page will request permession to use the clipboard; on load or when needed
	permissionPrompt: /* "immediate", "when needed" (default) */,

	// Determins when the page will alert the user that they have not given their permission to access the clipboard
	permissionAlert: /* "immediate", "when needed" (default), "never" */,

	// Detects when you modify the clipboard on your own and adjusts the functions accordingly
	copyListener: /* true, false (default) */
})
```