/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	let setQlipboard = ($this) => {
			let a = $this instanceof $ ? $this.clone() : null;
			$.jQlipboard.qlipboard.jqobj = a;
			$.jQlipboard.qlipboard.text = "";

			navigator.clipboard.readText()
				.then(text => {
					$.jQlipboard.qlipboard.text = text;
				})
				.catch(warning)
			if(a){
				$.jQlipboard.qlipboard.text = a[0] && $(a).is("img") ? "image" : a.val() || a.html() || "";
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
		};

	$.fn.copy = function() {
		if (this.parent().length) {
			if($(this).is("table")){
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
				/*if (this.css("user-select") === "none") {
					$.copy(this.val() || this.html())
				}*/
			}
			return this
		} else {
			return this
				.css({
					display: "block",
					position: "absolute", // Ensures that appending the object does not mess up the existing document
					left: "-9999in", // Makes the object display out of sight. `display:none` will not work since it supresses selecting
					"-webkit-user-select": "text",
					"-khtml-user-select": "text",
					"-moz-user-select": "text", // Ensures that the appended object can be selected, just in case it was disabled in the stylesheet
					"-ms-user-select": "text",
					"user-select": "text"
				})
				.appendTo("body")
				.copy()
				.remove()
		}
	};

	$.fn.paste = function(){
		if($(this).is("input,textarea")){
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
	};

	$.fn.cut = function() {
		return this
			.copy()
			.remove()
	};

	$.fn.select = function(data, fn) {
		if(arguments.length > 0)
			return this.on("select", null, data, fn);
		if($(this).is("input,textarea"))
			return this.trigger("select");
		select(this[0]);
		return this
	};

	$.deselect = a => w.removeAllRanges();

	$.cut = a=>{
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

	$.copy = data=>{
		switch(typeof data){
			case "object":
				if(data == null){
					$("<img>").copy()
					break
				}
				data = data instanceof Date ? data.toISOString() : (data instanceof HTMLElement ? data.outerHTML : (data.toString() != "[object Object]" ? data.toString() : JSON.stringify(data)))
			case "number":
			case "string":
				$('<script type="text/plain">')
					.html(data)
					.copy()
				break;
			case "undefined":
				try {
					return exec("copy")
				} catch(err){
					if(err){
						error(err)
					}
					let error = a=>!!error("Cannot copy text to clipboard");
					if(navigator.clipboard){
						let success = !info("Trying navigator.clipboard.writeText() instead");
						navigator.clipboard.writeText(w)
							.then(a=>0)
							.catch(y=>{
								success = error()
							})
						return success;
					}
					return error()
				}
			default:
				try {
					return $.copy(data.toString())
				} catch(err){
					error("Could not convert item to a copiable string.\n",data,err)
				}
		}
	};

	$.paste = a=>{
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
	};

	($.jQlipboard = function(config){
		config = config||0;
		$.jQlipboard.qlipboard = {}
		if(config.permissionPrompt == "immediate"){
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
	})()
	$.jQlipboard.version = "w0.3";
})(window.jQuery || console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin."));