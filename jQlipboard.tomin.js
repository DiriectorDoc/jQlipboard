/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	window.qlipboard = {};

	let setQlipboard = ($this) => {
			let a = $this instanceof $ ? $this.clone() : null;
			window.qlipboard.jqobj = a;
			window.qlipboard.text = "";

			navigator.clipboard.readText()
				.then(text => {
					window.qlipboard.text = text;
				})
				.catch(warning)
			if(a){
				window.qlipboard.text = a[0] && "IMG" == a[0].tagName ? "image" : a.val() || a.html() || "";
			}
		},
		quotePASTEquote = ($this, a) => $this.val($this.val().slice(0, $this[0].selectionStart) + a +$this.val().slice($this[0].selectionEnd)),
		warning= err=>{
			console.error(err)
			console.warn("Browser does not have permission to access clipboard. Some features may not work until permission is granted.")
			console.info('To grant permission, go into your browser setting and allow "Clipboard"')
			warning = nothing
		},
		nothing=a=>0,
		exec=a=>{return document.execCommand(a)||(b=>{throw 0})()},
		focused=a=>$(document.activeElement),
		$select = $.fn.select;

	$.fn.copy = function() {
		if (this.parent().length) {
			this.select()
			$.copy()
			setQlipboard(this)
			if (this.css("user-select") === "none") {
				$.copy(this.val() || this.html())
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
		let tag = this[0].tagName;
		if("INPUT" == tag || "TEXTAREA" == tag){
			if(this.is(":focus") || this[0] === document.activeElement){
				return $.paste() ? this:this.val(window.qlipboard.text)
			}
			let $focus = focused();
			this.focus()
			if(!$.paste){
				quotePASTEquote(this, window.qlipboard.text)
			}
			$focus.focus()
			return this
		} else {
			return this.append(window.qlipboard.jqobj.clone())
		}
	};

	$.fn.cut = function() {
		return this
			.copy()
			.remove()
	};

	$.fn.select = function(elem, name, value, pass) {
		if ("INPUT" == this[0].tagName || "TEXTAREA" == this[0].tagName)
			return $select(elem, name, value, pass);
		else if (document.selection) {
			let range = document.body.createTextRange();
			range.moveToElementText(this[0])
			range.select().createTextRange()
		} else if (window.getSelection) {
			let range = document.createRange(),
				selec = window.getSelection();
			range.selectNode(this[0])
			$.deselect()
			selec.addRange(range)
		} else {
			console.warn("Could not select element")
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
				console.error(err)
				console.info("Trying $.copy() instead")
			}
			return $.copy() && quotePASTEquote(focused(), "")
		}
	};

	$.copy = function(text){
		window.qlipboard = {};
		if(text !== undefined){
			$("<a>")
				.html(text)
				.copy()
		} else {
			try {
				return exec("copy")
			} catch(err){
				if(err){
					console.error(err)
				}
				let error = a=>!!console.error("Cannot copy text to clipboard");
				if(navigator.clipboard){
					console.info("Trying navigator.clipboard.writeText() instead")
					let text = "",
						success = true;
					if(window.getSelection){
						text = window.getSelection().toString();
					} else if(document.selection && document.selection.type != "Control"){
						text = document.selection.createRange().text;
					}
					navigator.clipboard.writeText(text)
						.then(x=>{
							setQlipboard()
						})
						.catch(y=>{
							success = error()
						})
					return success;
				}
				return error()
			}
		}
	};

	$.paste = function() {
		try {
		   return exec("paste")
		} catch(e){
			if(e){
				console.warn(e)
			}
			let success = true;
			navigator.clipboard.readText()
				.then(clipText => {
					quotePASTEquote(focused(), clipText)
				})
				.catch(err => {
					success = !!console.error("Could not execute paste", err)
				})
			return success
		}
	};

	$.jQlipboard = function(config){
		let a = !!config.pasting;
		if(!a){
			setQlipboard = nothing;
			delete $.paste;
			delete window.qlipboard
		}
		if(config.permissionPrompt == "immediate" && a){
			navigator.clipboard.readText()
				.then(nothing)
				.catch(warning)
		}
		if(config.copyListener || config.copyListener === undefined){
			if($().on){
				$(document).on("copy", setQlipboard)
			} else {
				$(document).bind("copy", setQlipboard)
			}
		}
	};

	$.jQlipboardVersion = "0.1.4"
}((function(){
	try{
		return jQuery
	} catch(e){
		return console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
	}
})()));
