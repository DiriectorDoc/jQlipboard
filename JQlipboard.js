/**
 *	jQlipboard (v0.1.2)
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

	window.qlipboard = {};

	function setQlipboard($this){
		window.qlipboard.jqobj = $this instanceof $ ? $this.clone() : null;
		window.qlipboard.text = "";

		navigator.clipboard.readText()
			.then(text => {
				window.qlipboard.text = text
			})
			.catch(warning)
		if(window.qlipboard.jqobj){
			window.qlipboard.text = $this[0] && "IMG" == $this[0].tagName ? "image" : $this.val() || $this.html() || ""
		}
	}

	function warning(err){
		console.error(err)
		console.warn("Browser does not have permission to access clipboard. Some features may not work until permission is granted.")
		console.info('To agrant permission, go into your browser setting and allow "Clipboard"')
		warning = nothing
	}

	function nothing(){
		return
	}

	/*
	* @returns {jQuery} this
	*/
	$.fn.copy = function(){
		if(this.parent().length){
			this.select()
			$.copy()
			setQlipboard(this)
			if(this.css("user-select") === "none"){
				$.copy(this.val() || this.html())
			}
			return this
		} else {
			return this
				.css({
					position: "absolute",   // Ensures that appending the object does not mess up the existing document

					opacity: 0,
					color: "rgba(0,0,0,0)", // Makes the object invisible. `display:none` will not work since it disables the avility to select it

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
		let tag = this[0].tagName;
		if("INPUT" == tag || "TEXTAREA" == tag){
			if(this.is(":focus") || (this[0] === document.activeElement && (this[0].type || this[0].href))){
				return $.paste() ? this:this.val(window.qlipboard.text)
			}
			let $focus = $(":focus").length ? $(":focus"):$(document.activeElement);
			this.focus()
			if(!$.paste){
				let text = this.val(),
					e = this[0];
				this.val(text.slice(0, e.selectionStart) + window.qlipboard.text + text.slice(e.selectionEnd))
			}
			$focus.focus()
			return this
		} else {
			return this.append(window.qlipboard.jqobj.clone())
		}
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
		} else if(document.selection){
			let range = document.body.createTextRange();
			range.moveToElementText(this[0])
			range.select().createTextRange()
		} else if(window.getSelection){
			let range = document.createRange(),
				selec = window.getSelection();
			range.selectNode(this[0])
			$.deselect()
			selec.addRange(range)
		} else {
			console.warn("Could not select element")
		}
		return this
	};

	/*
	* @returns {undefined}
	*/
	$.deselect = function(){
		if(document.selection){
			document.selection.empty()
		} else if(window.getSelection){
			window.getSelection().removeAllRanges()
		}
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
				let $focus = $(":focus").length ? $(":focus"):$(document.activeElement),
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
		window.qlipboard = {};
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
					let text = "",
						success = true;
					if(window.getSelection){
						text = window.getSelection().toString()
					} else if(document.selection && document.selection.type != "Control"){
						text = document.selection.createRange().text
					}
					navigator.clipboard.writeText(text)
						.then(function(){
							setQlipboard()
						})
						.catch(function(){
							console.error("Cannot copy text to clipboard")
							success = false
						})
					return success;
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
					let $focus = $(":focus").length ? $(":focus"):$(document.activeElement),
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
	};

	$.jQlipboard = function(config){
		config = {
			permissionPrompt: config.permissionPrompt || "when needed",
			copyListener: config.copyListener || config.copyListener === undefined
		}
		if(config.permissionPrompt == "immediate"){
			navigator.clipboard.readText()
				.then(nothing)
				.catch(warning)
		}
		if(config.copyListener){
			if($().bind){
				$(document).bind("copy", setQlipboard)
			} else {
				$(document).on("copy", setQlipboard)
			}
		}
	};

	$.jQlipboardVersion = "0.1.2"
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));