/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	let exec=a=>document.execCommand(a)||(b=>{throw 0})(),
		focused=a=>$(document.activeElement),
		$select = $.fn.select,
		c=console,
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

	$.fn.cut = function() {
		return this
			.copy()
			.remove()
	};

	$.fn.select = function(elem, name, value, pass) {
		if (isTag(this, "INPUT", "TEXTAREA"))
			return $select(elem, name, value, pass);
		else select(this[0]);
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
			return $.copy() && ($this => $this.val($this.val().slice(0, $this[0].selectionStart) + "" + $this.val().slice($this[0].selectionEnd)))(focused())
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
						.then(a=>0)
						.catch(y=>{
							success = error(y)
						})
					return success;
				}
				return error()
			}
		}
	};

	$.jQlipboard.version = "0.1.8";
})(typeof jQuery != "undefined" ? jQuery:console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin."));