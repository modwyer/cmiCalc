/**
 * This module helps identify the browser type.
 */
var BROWSER_INFO = (function() {
	var bi = {};
	
	//http://stackoverflow.com/a/2401861
	bi.getBrowserType = function() {
		var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])) {
			tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		}
		if(M[1]=== 'Chrome') {
			tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
			if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem= ua.match(/version\/(\d+)/i))!= null) 
			M.splice(1, 1, tem[1]);
		return M.join(' ');
	}
	
	bi.isIE9OrHigher = function() {
		return /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) > 8;
	}
	
	/**
	 * Convenience function to quickly tell if the browser is IE8 or not.
	 */
	bi.isIE8 = function() {
		var ret = false;
		var b = bi.getBrowserType();
		
		var isIE = (b.indexOf("MSIE") > -1) ? true : false;
		if (isIE) {
			// It is IE but is it IE8?
			var is9plus = bi.isIE9OrHigher();
			if (!is9plus) {
				ret = true;
			}
		}				
		return ret;
	}
	
	return bi;
}());