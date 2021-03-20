/**
 *	jQlipboard v0.2
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
	* @param {string} text
	* @returns {boolean}
	*/
	$.copy = text => {
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
		}
	};
	
	$.jQlipboard = {version: "v0.2"};
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));