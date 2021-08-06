![jQlipboard](https://user-images.githubusercontent.com/66105586/110230030-c00dce80-7edb-11eb-9d03-2d796745e606.png)

# jQlipboard
jQlipboard is a jQuery extension that makes accessing the clipboard much easier. This plugin also has features that make it usable across all modern browsers.

The following is a brief tutorial on how to use jQlipboard. Full documentation can be found [here](https://diriectordoc.github.io/jQlipboard).

## Installation
To install, simply add the following script tag below the tag where `jQuery.js` is called:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
<script src="https://diriectordoc.github.io/jQlipboard/src/v0.3/jQlipboard.js"></script>
```

Or, for a minified script:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://diriectordoc.github.io/jQlipboard/src/v0.3/jQlipboard.min.js"></script>
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

## Source
The source files are kept in the */src* directory. Files */src/\*.js* and */src/w/\*.js* are the files that get updated gradually. Once an edit is stable enough to release, the version number of each file is updated and then placed in their respective release folder, labled with the version number ("v" for base jQlipboard and "w" for jQlipboard withPaste).