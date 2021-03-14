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
					$.jQlipboard.qlipboard.text = a[0] && isTag(a, "IMG") ? "image" : a.val() || a.html() || "";
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
		c=console,
		warn = c.warn,
		error = c.error,
		info = c.info,
		warnPaste = a=>warn("Pasting is truned off by default. You need to enable it upon intitalization."),
		w=window.getSelection(),
		select=(nodeB, offB, nodeE, offE)=>{
			let range = new Range();
			$.deselect()
			if(offB){
				range.setStart(nodeB, offB)
				range.setEnd(nodeE, offE)
			} else {
				range.selectNode(nodeB)
			}
			w.addRange(range)
		},
		isTag=function(elem){return [...arguments].some(a=>a==elem[0].tagName)};

	$.fn.copy = function() {
		if (this.parent().length) {
			if(isTag(this, "TABLE")){
				$.copy(this[0].outerHTML)
			} else {
				let nodeB = w.baseNode,
					offB = w.baseOffset,
					nodeE = w.extentNode,
					offE = w.extentOffset;
				this.select()
				$.copy()
				select(nodeB, offB, nodeE, offE)
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
			if(isTag(this, "INPUT", "TEXTAREA")){
				if(this.is(":focus") || this[0] === document.activeElement){
					return $.paste() ? this:this.val($.jQlipboard.qlipboard.text)
				}
				let nodeB = w.baseNode,
					offB = w.baseOffset,
					nodeE = w.extentNode,
					offE = w.extentOffset;
				this.focus()
				if(!$.paste()){
					quotePASTEquote(this, $.jQlipboard.qlipboard.text)
				}
				select(nodeB, offB, nodeE, offE)
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

	$.fn.select = function(data, fn) {
		if(arguments.length > 0)
			return this.on("select", null, data, fn);
		if(isTag(this, "INPUT", "TEXTAREA"))
			return this.trigger("select");
		select(this[0]);
		return this
	};

	$.deselect = function(){
		w.removeAllRanges()
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
					navigator.clipboard.writeText(w.toString())
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
	$.jQlipboard.version = "w0.2";
})(window.jQuery || console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin."));