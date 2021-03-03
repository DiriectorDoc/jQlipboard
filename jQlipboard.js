/**
 *	jQlipboard v0.1.9
 *	A jQuery plugin that makes handling clipboard processes easier
 *
 *
 *	Author:        Diriector_Doc
 *	Licence:       MIT
 *	repository:    https://github.com/DiriectorDoc/jQlipboard
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
	
	$.jQlipboard.version = "0.1.9";
}((function(){
	try{
		return jQuery
	} catch(e){
		console.warn("jQuery not detected. You must use a jQuery version of 1.0 or newer to run this plugin.")
		return false
	}
})()));