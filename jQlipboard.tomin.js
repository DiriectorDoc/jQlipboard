/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	let exec=a=>document.execCommand(a)||(b=>{throw 0})(),
		focused=a=>$(document.activeElement),
		c=console,
		error = c.error,
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
				/*
				if (this.css("user-select") == "none") {
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
				c.info("Trying $.copy() instead")
			}
			return $.copy() && ($this => $this.val($this.val().slice(0, $this[0].selectionStart) + "" + $this.val().slice($this[0].selectionEnd)))(focused())
		}
	};

	$.copy = info=>{
		switch(typeof info){
			case "object":
				if(info == null){
					$("<img>").copy()
					return
				}
				info = info instanceof Date ? info.toISOString() : (info instanceof HTMLElement ? info.outerHTML : (info.toString() != "[object Object]" ? info.toString() : JSON.stringify(info)))
			case "number":
			case "string":
				$('<script type="text/plain">')
					.html(info)
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
				break;
			default:
				try {
					return $.copy(info.toString())
				} catch(err){
					error("Could not convert item to a copiable string.\n",info,err)
				}
		}
	};

	$.jQlipboard = {version: "v0.3"};
})(window.jQuery || console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin."));