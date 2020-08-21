(function($){

	
	
	/*
	
	use for the min.js file
	
	$.fn.submission = function() {
		let t = this[0].tagName;
		if ("INPUT" === t || "TEXTAREA" === t) {
			let i = this.attr("type").toLowerCase();
			return ["button", "file", "image", "reset", "submit"].includes(i) && "TEXTAREA" !== t ? "file" === i ? this[0].files : this : $.trim(this.val()) || this.attr("placeholder") || ""
		}
		return this
	};*/
	$.fn.submission = function() {
		let tag = this[0].tagName;
		if("INPUT" === tag || "TEXTAREA" === tag){
			switch(this.attr("type").toLowerCase()){
				case "button":
				case "image":
				case "reset":
				case "submit":
					return this;
				case "file":
					return this[0].files;
				default:
					return $.trim(this.val()) || this.attr("placeholder") || "";
			}
		} 
		return this;
	};
	
	$.fn.getBrowser = function(){
		if(this == window){
			
		}
		console.error("This function only works in the form of $(window).getBrowser()")
	}
	function getBrowser(){
		window.isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;// Opera 8.0+
		window.isOperaMini = !!window.operamini || "[object OperaMini]" === Object.prototype.toString.call(window.operamini);// Opera mini
		window.isFirefox = "undefined" != typeof InstallTrigger;// Firefox 1.0+
		window.isSafari = /constructor/i.test(window.HTMLElement) || "[object SafariRemoteNotification]" === (!window.safari || "undefined" != typeof safari && safari.pushNotification).toString();// Safari 3.0+ "[object HTMLElementConstructor]" 
		window.isIE = !!document.documentMode;// Internet Explorer 6-11
		window.isEdge = !isIE && !!window.StyleMedia;// Edge 20+
		window.isChrome = !(!window.chrome || !window.chrome.webstore && !window.chrome.runtime);// Chrome 1 - 79
		window.isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") > -1;// Edge (based on chromium) detection
		window.isBlink = (isChrome || isOpera) && !!window.CSS;// Blink engine detection
		window.isUC = navigator.userAgent.indexOf(" UCBrowser/") >= 0;// UC Browser
	}

}(jQuery));