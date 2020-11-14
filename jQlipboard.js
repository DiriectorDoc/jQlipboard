/**
 *	jQlipboard v0.1.7
 *	A jQuery plugin that makes handling clipboard processes easier
 *
 *
 *	Author:        Diriector_Doc
 *	Licence:       MIT
 *	repository:    https://github.com/DiriectorDoc/jQlipboard
 *
 *
 *	Copyright (c) 2020 Diriector_Doc (DiriectorDoc on github)
 **/
(function($) {

	if(!$) return;

	let pasteOn,
		selec = window.getSelection();

	function setQlipboard($this){
		if(pasteOn){
			$.jQlipboard.qlipboard.jqobj = $this instanceof $ ? $this.clone() : null;
			$.jQlipboard.qlipboard.text = "";

			navigator.clipboard.readText()
				.then(text => {
					$.jQlipboard.qlipboard.text = text
				})
				.catch(warning)
			if($.jQlipboard.qlipboard.jqobj){
				$.jQlipboard.qlipboard.text = $this[0] && "IMG" == $this[0].tagName ? "image" : $this.val() || $this.html() || ""
			}
		}
	}

	function warning(err){
		console.error(err)
		console.warn("Browser does not have permission to access clipboard. Some features may not work until permission is granted.")
		console.info('To grant permission, go into your browser setting and allow "Clipboard"')
		warning = nothing
	}

	function nothing(){
		return
	}
	
	function select(nodeB, offB, nodeE, offE){
		let range = new Range();
		$.deselect()
		if(offB){
			range.setStart(nodeB, offB)
			range.setEnd(nodeE, offE)
		} else {
			range.selectNode(nodeB)
		}
		selec.addRange(range)
	}

	/*
	* @returns {jQuery} this
	*/
	$.fn.copy = function(){
		if(this.parent().length){
			if(this[0].tagName == "TABLE"){
				$.copy(this[0].outerHTML)
			} else {
				let nodeB = selec.baseNode,
					offB = selec.baseOffset,
					nodeE = selec.extentNode,
					offE = selec.extentOffset;
				this.select()
				$.copy()
				select(nodeB, offB, nodeE, offE)
				setQlipboard(this)
				if(this.css("user-select") === "none"){
					$.copy(this.val() || this.html())
				}
			}
			return this
		} else {
			return this
				.css({
					position: "absolute",   // Ensures that appending the object does not mess up the existing document

					opacity: 0,
					color: "rgba(0,0,0,0)", // Makes the object invisible. `display:none` will not work since it supresses selecting

					"-webkit-user-select": "auto",
					"-khtml-user-select": "auto",
					"-moz-user-select": "auto",
					"-ms-user-select": "auto",
					"user-select": "auto" // Ensures that the appended object can be selected, just in case it was disabled in the stylesheet
				})
				.appendTo("body")
				.copy()
				.remove()
		}
	};

	/*
	* @returns {jQuery} this
	*/
	$.fn.paste = function(){
		if(pasteOn){
			let tag = this[0].tagName;
			if("INPUT" == tag || "TEXTAREA" == tag){
				if(this.is(":focus") || this[0] === document.activeElement){
					return $.paste() ? this:this.val($.jQlipboard.qlipboard.text)
				}
				let nodeB = selec.baseNode,
					offB = selec.baseOffset,
					nodeE = selec.extentNode,
					offE = selec.extentOffset;
				this.focus()
				if(!$.paste()){
					let text = this.val(),
						e = this[0];
					this.val(text.slice(0, e.selectionStart) + $.jQlipboard.qlipboard.text + text.slice(e.selectionEnd))
				}
				select(nodeB, offB, nodeE, offE)
				return this
			} else {
				return this.append($.jQlipboard.qlipboard.jqobj.clone())
			}
		}
		console.warn("Pasting is truned off by default. You need to enable it upon intitalization.")
		return this
	};

	/*
	* @returns {jQuery} this
	*/
	$.fn.cut = function(){
		return this
			.copy()
			.remove()
	};

	/*
	* @returns {jQuery} this
	*/
	const $select = $.fn.select;
	$.fn.select = function(elem, name, value, pass){
		if("INPUT" == this[0].tagName || "TEXTAREA" == this[0].tagName){
			return $select(elem, name, value, pass)
		} else {
			select(this[0])
		}
		return this
	};

	/*
	* @returns {undefined}
	*/
	$.deselect = function(){
		selec.removeAllRanges()
	};

	/*
	* @returns {boolean}
	*/
	$.cut = function(){
		try {
			if(!document.execCommand("cut")){
				throw false
			}
			return true
		} catch(err){
			if(err){
				console.error(err)
				console.info("Trying $.copy() instead")
			}
			if($.copy()){
				let $focus = $(document.activeElement),
					e = $focus[0],
					text = $focus.val();
				text = text.slice(0, e.selectionStart) + text.slice(e.selectionEnd);
				$focus.val(text)
				return true
			}
			return false
		}
	};

	/*
	* @param {string} text
	* @returns {boolean}
	*/
	$.copy = function(text){
		if(text !== undefined){
			$("<a>")
				.html(text)
				.copy()
		} else {
			try {
				if(!document.execCommand("copy")){
					throw false
				}
				return true
			} catch(err){
				if(err){
					console.error(err)
				}
				if(navigator.clipboard){
					console.info("Trying navigator.clipboard.writeText() instead")
					let success = true;
					navigator.clipboard.writeText(selec.toString())
						.then(setQlipboard)
						.catch(function(){
							console.error("Cannot copy text to clipboard")
							success = false
						})
					return success
				}
				console.error("Cannot copy text to clipboard")
				return false
			}
		}
	};

	/*
	* @returns {boolean}
	*/
	$.paste = function(){
		if(pasteOn){
			try {
				if(!document.execCommand("paste")){
					throw false
				}
				return true
			} catch(err){
				if(err){
					console.warn(err)
				}
				let success = true;
				navigator.clipboard.readText()
					.then(clipText => {
						let $focus = $(document.activeElement),
							e = $focus[0],
							text = $focus.val();
						text = text.slice(0, e.selectionStart) + clipText + text.slice(e.selectionEnd);
						$focus.val(text)
					})
					.catch(err => {
						console.error("Could not execute paste", err)
						success = false
					})
				return success
			}
		}
		console.warn("Pasting is truned off by default. You need to enable it upon intitalization.")
		return false
	};

	$.jQlipboard = function(config){
		if(!config){
			config = {}
		}
		config = {
			permissionPrompt: config.permissionPrompt || "when needed",
			copyListener: config.copyListener || config.copyListener === undefined,
			...config
		}
		pasteOn = config.pasting;
		if(pasteOn){
			$.jQlipboard.qlipboard = {}
		} else {
			delete $.jQlipboard.qlipboard
		}
		if(config.permissionPrompt == "immediate" && config.pasting){
			navigator.clipboard.readText()
				.then(nothing)
				.catch(warning)
		}
		if(config.copyListener && config.pasting){
			if($.fn.on){
				$(document).on("copy", setQlipboard)
			} else {
				$(document).bind("copy", setQlipboard)
			}
		}
	};

	$.jQlipboard()
	
	$.jQlipboard.version = "0.1.7";
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));