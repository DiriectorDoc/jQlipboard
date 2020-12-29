# jQlipboard NoPaste
This version of jQlipboard works exactly the same as the regular version, just without the pesky pasting attribute. Pasting with full support was hard to implement and I still don't think it's perfect. Istead of removing it altogether, I decided to offere the same file but without pasting. This files actually removes a bunch of elements that pertain to pasting only, so the file size a lot smaller in turn.

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