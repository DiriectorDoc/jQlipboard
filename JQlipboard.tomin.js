/*
	This is the file that gets minified. It uses human-reduced code that a, online minifier just can't reduce.
*/
(function($) {
	
	if(!$) return;
	
	window.qlipboard = {};

    let isIE = !!document.documentMode,
        setQlipboard = ($this) => {
			let a = $this == undefined ? null : $this.clone();
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
			navigator.permissions.query({name: "clipboard-read"}).then(result => {
				if(result.state == "denied"){
					alert(
						"Browser has been denied access clipboard. Some features may not work until permission is granted.\n" +
						'To agrant permission, go into your browser setting and allow "Clipboard"'
					)
				}
			});

			warning = nothing
		},
		nothing=a=>0,
		z = a => a[0] && "IMG" == a[0].tagName ? "image" : a.val() || a.html();

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

    $.fn.paste = function(selector, method) {
        let a = (b) => (selector == b && !$("body").find(b).length);

        function c(d) {
            let t = d[0].tagName;
            return "INPUT" == t || "TEXTAREA" == t ? d.val(window.qlipboard.text) : "IMG" == t || "element" == method ? d.append(window.qlipboard.jqobj.clone().removeAttr("qlip-cut")) : "text" == method ? d.html(window.qlipboard.text) : d
        };
        if (!method) {
            if (a("element") || a("text")) {
                method = selector;
                selector = 0;
            }
            method = "text";
        }
        if (this.attr("qlip-cut") || selector) {
            if ($("body").find(selector).length) {
                return c(selector)
            } else {
                console.warn('Could not paste item\nUnable to find element that matched selector "' + selector + '"')
                return this
            }
        }
        return c(this)
    };

    $.fn.cut = function() {
        return this
            .attr("qlip-cut", true)
            .copy()
            .remove()
    };

    const $select = $.fn.select;
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
        }
        return this;
    };

    $.cut = function(){
        try {
            if(isIE){
                throw 0;
            } else {
                document.execCommand("cut")
            }
        } catch(err){
			if(err){
				console.error(err)
			}
            $.copy()
			quotePASTEquote($(":focus"), "")
        }
    };

    $.copy = function(text) {
        if (text !== undefined) {
            $("<a>")
                .html(text)
                .copy()
            window.qlipboard.jqobj = null;
        } else {
            try {
                document.execCommand("copy")
            } catch (err) {
                console.error(err)
                console.warn("Trying navigator.clipboard.writeText() instead")
                let text = "";
                if (window.getSelection) {
                    text = window.getSelection().toString();
                } else if (document.selection && document.selection.type != "Control") {
                    text = document.selection.createRange().text;
                }
				warning()
                navigator.clipboard.writeText(text);
            }
        }
    };

    $.paste = function() {
        if (isIE) {
            document.execCommand("paste")
        } else {
			warning()
            navigator.clipboard.readText()
                .then(clipText => {
                    quotePASTEquote($(":focus"), clipText)
                })
                .catch(err => {
                    console.error("Could not execute paste", err)
                })
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
			$(document).bind("copy", setQlipboard)
		}
	}
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return 0
	}
})()));