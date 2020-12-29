# jQlipboard NoPaste
This version of jQlipboard works exactly the same as the regular version, just without the pesky pasting attribute. Pasting with full support was hard to implement and I still don't think it's perfect. Istead of removing it altogether, I decided to offere the same file but without pasting. This files actually removes a bunch of elements that pertain to pasting only, so the file size a lot smaller in turn.

## Installation
To install, simply add the following script tag below the tag where `jQuery.js` is called:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
<script type="text/javascript" src="https://raw.githubusercontent.com/DiriectorDoc/jQlipboard/master/NoPaste/JQlipboard.js"></script>
```

Or, for a minified script:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="https://raw.githubusercontent.com/DiriectorDoc/jQlipboard/master/NoPaste/JQlipboard.min.js"></script>
```