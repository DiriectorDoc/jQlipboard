/**
 *	jQlipboard (v0.1.1)
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

	const isFF = typeof InstallTrigger !== "undefined"; // Firefox browser exclusive. Checks if using Forefox

	function setQlipboard($this){
		window.qlipboard.jqobj = $this instanceof $ ? $this.clone() : null;

		warning()
		navigator.clipboard.readText()
			.then(text => {
				window.qlipboard.text = window.qlipboard.clipboard = text
			})
		if(window.qlipboard.jqobj){
			window.qlipboard.text = $this[0] && "IMG" == $this[0].tagName ? "image" : $this.val() || $this.html() || window.qlipboard.clipboard
		}
	}

	function warning(){
		let message = "Browser has been denied access clipboard. Some features may not work until permission is granted.\n" +
			'To grant permission, go into your browser setting and allow "Clipboard"';
		if(isFF){
			browser.permissions.request({
					permissions: ["clipboardWrite"]
				})
				.then(responce => { // Will be either true or false
					if(!responce){
						alert(message)
					}
				})
		} else {
			navigator.permissions.query({name: "clipboard-read"}).then(result => {
				if(result.state == "denied"){
					alert(message)
				}
			})
		}
		warning = nothing
	}

	function nothing(){
		return
	}

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

	//needs an overhaul
	$.fn.paste = function(selector, method){
		if(!method){
			if(
				"element" == selector &&
				"text" == selector &&
				!$("body").find("element").length &&
				!$("body").find("text").length
			){
				method = selector;
				selector = 0
			}
			method = "text"
		}
		if(this.attr("qlip-cut") || selector){ // If `this` is a cut element, there needs to be a selector so it can be pasted somewhere
			if($("body").find(selector).length){
				let sel = $(selector),
					tag = sel[0].tagName;
				if("INPUT" == tag || "TEXTAREA" == tag){
					return sel.val(window.qlipboard.text)
				} else if("IMG" == tag){
					return sel.append(window.qlipboard.jqobj.clone())
				} else {
					return method == "element" ? sel.append(window.qlipboard.jqobj.clone().removeAttr("qlip-cut")) : method == "text" ? sel.html(window.qlipboard.text) : sel
				}
			} else {
				console.warn('Could not paste item\nUnable to find element that matched selector "' + selector + '"')
				return this
			}
		}
		let tag = this[0].tagName;
		if("INPUT" == tag || "TEXTAREA" == tag){
			return this.val(window.qlipboard.text)
		} else if("IMG" == tag){
			return this.append(window.qlipboard.jqobj.clone())
		} else {
			return method == "element" ? this.append(window.qlipboard.jqobj.clone().removeAttr("qlip-cut")) : method == "text" ? this.html(window.qlipboard.text) : this
		}
	};

	$.fn.cut = function(){
		return this
			.attr("qlip-cut", true)
			.copy()
			.remove()
	};

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
			selec.removeAllRanges()
			selec.addRange(range)
		} else {
			console.warn("Could not select element")
		}
		return this
	};

	$.cut = function(){
		try {
			if(isFF){
				warning()
			}
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
				let focus = $(":focus"),
					e = focus[0],
					text = focus.val();
				text = text.slice(0, e.selectionStart) + text.slice(e.selectionEnd);
				focus.val(text)
				return true
			} else {
				return false
			}
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
				if(isFF){
					warning()
				}
				if(!document.execCommand("copy")){
					throw false
				}
				return true
			} catch(err){
				if(err){
					console.error(err)
				}
				if(isFF){
					return false
				}
				let success = true;
				if(navigator.clipboard){
					console.info("Trying navigator.clipboard.writeText() instead")
					let text = "";
					if(window.getSelection){
						text = window.getSelection().toString()
					} else if(document.selection && document.selection.type != "Control"){
						text = document.selection.createRange().text
					}
					warning()
					navigator.clipboard.writeText(text)
					setQlipboard()
				} else {
					console.error("Cannot copy text to clipboard")
					success = false
				}
				return success
			}
		}
	};

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
			warning()
			navigator.clipboard.readText()
				.then(clipText => {
					let focus = $(":focus"),
						e = focus[0],
						text = focus.val();
					text = text.slice(0, e.selectionStart) + clipText + text.slice(e.selectionEnd);
					focus.val(text)
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
			permissionAlert: config.permissionAlert || "when needed",
			copyListener: config.copyListener || config.copyListener === undefined
		}
		if(!config.clipboardVar){
			delete window.qlipboard.clipboard;
			setQlipboard = function($this){
				window.qlipboard.jqobj = $this == undefined ? null : $this.clone();

				window.qlipboard.text = null;
				if(window.qlipboard.jqobj){
					window.qlipboard.text = $this[0] && "IMG" == $this[0].tagName ? "image" : $this.val() || $this.html() || ""
				}
			}
		}
		if(config.permissionPrompt == "immediate"){
			navigator.clipboard.readText().then(nothing)
		}
		switch(config.permissionAlert){
			case "immediate":
				warning()
				break;
			case "never":
				warning = nothing
				break;
		}
		navigator.permissions.query({name: "clipboard-read"}).then(result => {
			switch(result.state){
				case "denied":
				case "prompt":
					console.warn("Browser does not have permission to access clipboard. Some features may not work until permission is granted.")
					console.info('To agrant permission, go into your browser setting and allow "Clipboard"')
					if(config.permissionAlert == "never"){
						warning = nothing
					}
					break;
				case "granted":
					warning = nothing
					break;
			}
		})
		if(config.copyListener){
			if($().bind){
				$(document).bind("copy", setQlipboard)
			} else {
				$(document).on("copy", setQlipboard)
			}
		}
	};
	
	$.jQlipboardVersion = "0.1.1"
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));