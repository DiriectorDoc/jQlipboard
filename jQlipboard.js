/**
 *	jQlipboard v0.3
 *	A jQuery plugin that makes handling clipboard processes easier
 *
 *
 *	Author:        Diriector_Doc
 *	Licence:       MIT
 *	Repository:    https://github.com/DiriectorDoc/jQlipboard
 *	Website:       https://diriectordoc.github.io/jQlipboard-Docs/
 *
 *
 *	Copyright (c) 2020–2021 Diriector_Doc (DiriectorDoc on github)
 **/
(function($) {

	if(!$) return;

	let selec = window.getSelection();

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
			if($(this).is("table")){
				$.copy(this[0].outerHTML)
			} else {
				let nodeB = selec.baseNode,
					offB = selec.baseOffset,
					nodeE = selec.extentNode,
					offE = selec.extentOffset;
				this.select()
				$.copy()
				select(nodeB, offB, nodeE, offE)
				/*
				if(this.css("user-select") == "none"){
					$.copy(this.val() || this.html())
				}*/
			}
			return this
		} else {
			return this
				.css({
					display: "block",
					position: "absolute",   // Ensures that appending the object does not mess up the existing document

					left: "-9999in", // Makes the object display out of sight. `display:none` will not work since it supresses selecting

					"-webkit-user-select": "text",
					"-khtml-user-select": "text",
					"-moz-user-select": "text",
					"-ms-user-select": "text",
					"user-select": "text" // Ensures that the appended object can be selected, just in case it was disabled in the stylesheet
				})
				.appendTo("body")
				.copy()
				.remove()
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
	$.fn.select = function(data, fn){
		if(arguments.length > 0){
			return this.on("select", null, data, fn)
		}
		if($(this).is("input,textarea")){
			return this.trigger("select")
		}
		select(this[0])
		return this
	};

	/*
	* @returns {undefined}
	*/
	$.deselect = () => selec.removeAllRanges();

	/*
	* @returns {boolean}
	*/
	$.cut = () => {
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
	* @param {*} data - Anything that can be turned into a string
	* @returns {(boolean|undefined)}
	*/
	$.copy = data => {
		switch(typeof data){
			case "object":
				if(data == null){
					$("<img>").copy()
					return
				}
				if(data instanceof Date)
					data = data.toISOString();
				else if(data instanceof HTMLElement)
					data = data.outerHTML;
				else if(data.toString() != "[object Object]")
					data = data.toString();
				else
					data = JSON.stringify(data);
			case "number":
			case "string":
				$('<script type="text/plain">')
					.html(data)
					.copy()
				break;
			case "undefined":
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
						navigator.clipboard.writeText(selec)
							.then(nothing)
							.catch(function(){
								console.error("Cannot copy text to clipboard")
								success = false
							})
						return success
					}
					console.error("Cannot copy text to clipboard")
					return false
				}
			default:
				try {
					return $.copy(data.toString())
				} catch(err){
					console.error("Could not convert item to a copiable string.\n",data,err)
				}
		}
	};
	
	$.jQlipboard = {version: "v0.3"};
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));
