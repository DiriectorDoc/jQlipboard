# jQlipboard
jQlipboard is a jQuery extention that makes accessing the clipboard much easier. This plugin also has features that make it usible across most if not all browsers.

## Installation
To install, simply add the following script tag below the tag where `jQuery.js` is called:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
<script type="text/javascript" src="<link>"></script>
```

Or, for a minified script:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="<link.min>"></script>
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