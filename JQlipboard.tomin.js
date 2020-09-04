/*
	This is the file that gets minified. It uses human-reduced code that an online minifier just can't reduce.
*/
(function($) {

	if(!$) return;

	window.qlipboard = {};

	let isFF = typeof InstallTrigger !== "undefined",
		z = a => a[0] && "IMG" == a[0].tagName ? "image" : a.val() || a.html(),
		setQlipboard = ($this) => {
			let a = $this instanceof $ ? $this.clone() : null;
			window.qlipboard.jqobj = a;

			navigator.clipboard.readText()
				.then(text => {
					window.qlipboard.text = window.qlipboard.clipboard = text;
				})
			if(a){
				window.qlipboard.text = z(a) || window.qlipboard.clipboard;
			}
		},
		quotePASTEquote = ($this, a) => $this.val($this.val().slice(0, $this[0].selectionStart) + a +$this.val().slice($this[0].selectionEnd)),
		warning= a=>{
			let warn = z=>{alert("Browser has been denied access clipboard. Some features may not work until permission is granted.\n" +
			'To grant permission, go into your browser setting and allow "Clipboard"')};
			if(isFF){
				browser.permissions.request({
						permissions: ["clipboardWrite"]
					})
					.then(responce => { // Will be either true or false
						if(!responce){
							warn()
						}
					})
			} else {
				navigator.permissions.query({name: "clipboard-read"}).then(result => {
					if(result.state == "denied"){
						warn()
					}
				})
			}
			warning = nothing
		},
		nothing=a=>0,
		exec=a=>{return document.execCommand(a)||(b=>{throw 0})()},
		focused=a=>$(":focus").length ? $(":focus"):$(document.activeElement);

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
			if(this.is(":focus") || (this[0] === document.activeElement && (this[0].type || this[0].href))){
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

	let $select = $.fn.select;
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
			selec.removeAllRanges()
			selec.addRange(range)
		} else {
			console.warn("Could not select element")
		}
		return this;
	};

	$.cut = function(){
		try {
			if(isFF){
				warning()
			}
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
				if(isFF){
					warning()
				}
				return exec("copy")
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
						text = window.getSelection().toString();
					} else if(document.selection && document.selection.type != "Control"){
						text = document.selection.createRange().text;
					}
					warning()
					navigator.clipboard.writeText(text)
					setQlipboard()
				} else {
					success = !!console.error("Cannot copy text to clipboard")
				}
				return success
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
			warning()
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
		config = {
			permissionPrompt: config.permissionPrompt || "when needed",
			permissionAlert: config.permissionAlert || "when needed",
			copyListener: config.copyListener || config.copyListener === undefined
		}
		if(!config.clipboardVar){
			delete window.qlipboard.clipboard;
			setQlipboard = function($this){
				let a = $this == undefined ? null : $this.clone();
				window.qlipboard.jqobj = a;
				window.qlipboard.text = null;
				if(a){
					window.qlipboard.text = z(a) || "";
				}
			}
		}
		if(config.permissionPrompt == "immediate"){
			navigator.clipboard.readText().then(nothing)
		}
		switch(config.permissionAlert){
			case "immediate":
				warning()
			case "never":
				warning = nothing
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
			}
		});
		if(config.copyListener){
			($(document).on || $(document).bind)("copy", setQlipboard)
		}
	};

	$.jQlipboardVersion = "0.1.2"
}((function(){
	try{
		return jQuery
	} catch(e){
		return console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
	}
})()));