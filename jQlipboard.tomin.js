/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	let pasteOn,
		setQlipboard = ($this) => {
			if(pasteOn){
				let a = $this instanceof $ ? $this.clone() : null;
				$.jQlipboard.qlipboard.jqobj = a;
				$.jQlipboard.qlipboard.text = "";

				navigator.clipboard.readText()
					.then(text => {
						$.jQlipboard.qlipboard.text = text;
					})
					.catch(warning)
				if(a){
					$.jQlipboard.qlipboard.text = a[0] && "IMG" == a[0].tagName ? "image" : a.val() || a.html() || "";
				}
			}
		},
		quotePASTEquote = ($this, a) => $this.val($this.val().slice(0, $this[0].selectionStart) + a +$this.val().slice($this[0].selectionEnd)),
		warning= err=>{
			error(err)
			warn("Browser does not have permission to access clipboard. Some features may not work until permission is granted.")
			info('To grant permission, go into your browser setting and allow "Clipboard"')
			warning = nothing
		},
		nothing=a=>0,
		exec=a=>document.execCommand(a)||(b=>{throw 0})(),
		focused=a=>$(document.activeElement),
		$select = $.fn.select,
		c=console,
		warn = c.warn,
		error = c.error,
		info = c.info,
		warnPaste = a=>warn("Pasting is truned off by default. You need to enable it upon intitalization.");

	$.fn.copy = function() {
		if (this.parent().length) {
			if(this[0].tagName == "TABLE"){
				$.copy(this[0].outerHTML)
			} else {
				this.select()
				$.copy()
				setQlipboard(this)
				if (this.css("user-select") === "none") {
					$.copy(this.val() || this.html())
				}
			}
			return this
		} else {
			return this
				.css({
					position: "absolute", // Ensures that appending the object does not mess up the existing document
					opacity: 0, // ↴
					color: "rgba(0,0,0,0)", // Makes the object invisible. `display:none` will not work since it disables the avility to select it
					"-webkit-user-select": "auto",
					"-khtml-user-select": "auto",
					"-moz-user-select": "auto", // Ensures that the appended object can be selected, just in case it was disabled in the stylesheet
					"-ms-user-select": "auto",
					"user-select": "auto"
				})
				.appendTo("body")
				.copy()
				.remove()
		}
	};

	$.fn.paste = function(){
		if(pasteOn){
			let tag = this[0].tagName;
			if("INPUT" == tag || "TEXTAREA" == tag){
				if(this.is(":focus") || this[0] === document.activeElement){
					return $.paste() ? this:this.val($.jQlipboard.qlipboard.text)
				}
				let $focus = focused();
				this.focus()
				if(!$.paste()){
					quotePASTEquote(this, $.jQlipboard.qlipboard.text)
				}
				$focus.focus()
				return this
			} else {
				return this.append($.jQlipboard.qlipboard.jqobj.clone())
			}
		}
		warnPaste()
		return this
	};

	$.fn.cut = function() {
		return this
			.copy()
			.remove()
	};

	$.fn.select = function(elem, name, value, pass) {
		let t0 = this[0];
		if ("INPUT" == t0.tagName || "TEXTAREA" == t0.tagName)
			return $select(elem, name, value, pass);
		else if (document.selection) {
			let range = document.body.createTextRange();
			range.moveToElementText(t0)
			range.select().createTextRange()
		} else if (window.getSelection) {
			let range = document.createRange(),
				selec = window.getSelection();
			range.selectNode(t0)
			$.deselect()
			selec.addRange(range)
		} else {
			warn("Could not select element")
		}
		return this;
	};

	$.deselect = function(){
		if(document.selection){
			document.selection.empty()
		} else if(window.getSelection){
			window.getSelection().removeAllRanges()
		}
	};

	$.cut = function(){
		try {
			return exec("cut")
		} catch(err){
			if(err){
				error(err)
				info("Trying $.copy() instead")
			}
			return $.copy() && quotePASTEquote(focused(), "")
		}
	};

	$.copy = function(text){
		if(text !== undefined){
			$("<a>")
				.html(text)
				.copy()
		} else {
			try {
				return exec("copy")
			} catch(err){
				if(err){
					error(err)
				}
				let error = a=>!!error("Cannot copy text to clipboard",a);
				if(navigator.clipboard){
					let success = !info("Trying navigator.clipboard.writeText() instead");
					navigator.clipboard.writeText(
						window.getSelection?
						window.getSelection().toString():document.selection&&"Control"!=document.selection.type?
						document.selection.createRange().text:""
					)
						.then(setQlipboard)
						.catch(y=>{
							success = error(y)
						})
					return success;
				}
				return error()
			}
		}
	};

	$.paste = function() {
		if(pasteOn){
			try {
			   return exec("paste")
			} catch(e){
				if(e){
					warn(e)
				}
				let success = true;
				navigator.clipboard.readText()
					.then(clipText => {
						quotePASTEquote(focused(), clipText)
					})
					.catch(err => {
						success = !!error("Could not execute paste", err)
					})
				return success
			}
		}
		return !!warnPaste()
	};

	($.jQlipboard = function(config){
		config = config||0;
		if(pasteOn = config.pasting){
			$.jQlipboard.qlipboard = {}
		} else {
			delete $.jQlipboard.qlipboard
		}
		if(config.permissionPrompt == "immediate" && pasteOn){
			navigator.clipboard.readText()
				.then(nothing)
				.catch(warning)
		}
		if((config.copyListener || config.copyListener === undefined)&&pasteOn){
			if($().on){
				$(document).on("copy", setQlipboard)
			} else {
				$(document).bind("copy", setQlipboard)
			}
		}
	})()
	$.jQlipboard.version = "0.1.7";
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
	}
})()));
