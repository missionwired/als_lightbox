// Anne Lewis Strategies
// Generalized lightbox asset
// uses fancybox in iframe
// Developed by by Ben Long <ben@annelewisllc.com>.

// Helper functions. 

function getScript(url, success) {

	var script     = document.createElement('script');
		script.src = url;
	
	var head = document.getElementsByTagName('head')[0],
	done = false;
	
	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function() {
	
		if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		
		done = true;
			
			// callback function provided as param
			success();
			
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
			
		};
	
	};
	
	head.appendChild(script);

};

function createCookieAls(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookieAls(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookieAls(name) {
	createCookie(name,"",-1);
}

// Load jQuery if not present. Technique from http://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/

var thisPageUsingOtherJSLibrary = false;

// Only do anything if jQuery isn't defined
if (typeof jQuery == 'undefined') {

	if (typeof $ == 'function') {
		// warning, global var
		thisPageUsingOtherJSLibrary = true;
	}
	
	getScript('http://code.jquery.com/jquery-latest.min.js', function() {
	
		if (typeof jQuery=='undefined') {
		
			// Super failsafe - still somehow failed...
		
		} else {
		
			// jQuery loaded! Make sure to use .noConflict just in case

			jQuery.noConflict();
			(function( $ ) { 
				load_fancybox($); 
			})(jQuery);
			
			if (thisPageUsingOtherJSLibrary) {


			} else {


			}
		
		}
	
	});
	
} else { // jQuery was already loaded
	
	load_fancybox($);

};

// Load Fancybox if not present.

function load_fancybox($) {

	if(typeof $.fancybox == 'function') {
		 load_fancybox_css($);
		 execute_fancybox($);
	} else {

		getScript('http://s3.amazonaws.com/annelewisllc/assets/fancybox/jquery.fancybox.pack.js', function() {
		
			if (typeof $.fancybox !== 'function') {
				// Super failsafe - still somehow failed...
			} else {
				load_fancybox_css($);
				execute_fancybox($);
			}
		
		});

	}

}

// Load Fancybox CSS if not present.

function load_fancybox_css($) {
	if (!$('link[href$="jquery.fancybox.css"]').length) {
		var fancybox_base_style_tag = document.createElement('link');
			fancybox_base_style_tag.rel  = 'stylesheet';
			fancybox_base_style_tag.type = 'text/css';
			fancybox_base_style_tag.media = 'screen';
			fancybox_base_style_tag.href = 'http://s3.amazonaws.com/annelewisllc/assets/fancybox/jquery.fancybox.css';
			fancybox_base_style_tag.id = 'als_fancybox_base_style_tag';
		document.getElementsByTagName('head')[0].appendChild(fancybox_base_style_tag);
	}
}

// Execute fancybox implementation.

function execute_fancybox($) {

	// Add base ALS styling CSS file.
	var als_style_tag = document.createElement('link');
		als_style_tag.rel  = 'stylesheet';
		als_style_tag.type = 'text/css';
		als_style_tag.media = 'all';
		als_style_tag.href = '//annelewisllc.s3.amazonaws.com/assets/splash/css/als_fancybox_launch.css';
	document.getElementsByTagName('head')[0].appendChild(als_style_tag);

	// Add postMessage listener to allow child iframe to close itself. 		

	// Create IE + others compatible event handler
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
		if (e.data == 'fancybox.close') {
			jQuery.fancybox.close();
		}
	},false);
	
/* -------
Disable ability for child iframe to resize itself.

	// Add postMessage listeners to allow child iframe to resize itself. 		
	var postMessage_height = 0;
	eventer(messageEvent,function(e) {
		if (/fancybox\.height\('{0,1}\d+'{0,1}\)/.test(e.data)) {
			$(document).ready(function() {
				
				postMessage_height = parseInt(e.data.match(/fancybox\.height\('{0,1}(\d+)'{0,1}\)/)[1]);
				fancybox_change_height(postMessage_height);
				
			});
		}
	},false);
	
	function fancybox_change_height(h) {
		$(".als-fancybox-inner").css({
			height: h
		});
	}
	
	var postMessage_width = 0;
	eventer(messageEvent,function(e) {
		if (/fancybox\.width\('{0,1}\d+'{0,1}\)/.test(e.data)) {
			$(document).ready(function() {
				
				postMessage_width = parseInt(e.data.match(/fancybox\.width\('{0,1}(\d+)'{0,1}\)/)[1]);
				fancybox_change_width(postMessage_width);
				
			});
		}
	},false);
	
	function fancybox_change_width(w) {
		$(".als-fancybox-inner, .als-fancybox-wrap").css({
			width: w
		});
	}
	
------- */

	$(document).ready(function( $ ) {
	
		$('body').prepend('<div id="als_lightbox" style="display:none;"></div>');

		var todayDate = new Date();
	
		//settings
		var thisScript = document.querySelector('script[data-id="als_fancybox_js"]');
		var boxMaxWidth = thisScript.getAttribute('data-max-width');
		var boxMaxHeight = thisScript.getAttribute('data-max-height');
		var boxUrl = thisScript.getAttribute('data-iframe-url'); //http://localhost/www/github/als_lightbox/weta-lightbox-src.html
		var alsCookieName = thisScript.getAttribute('data-cookie-name');
		var alsCookieDuration = thisScript.getAttribute('data-cookie-duration'); //in days
		var alsStart = thisScript.getAttribute('data-start-date'); //'October 13, 2014 10:00:00'
		var alsEnd = thisScript.getAttribute('data-end-date'); //'December 13, 2014 23:59:59'
		var alsTestMode = thisScript.getAttribute('data-test-mode');
	
		//defaults
		if(!alsCookieName) {
			alsCookieName = "fancybox_als";
		}
		if(!alsCookieDuration) {
			alsCookieDuration = 1;
		}
		if(!alsStart) {
			alsStart = "January 1, 1970 00:00:00";
		}
		if(!alsEnd) {
			alsEnd = "January 1, 2038 00:00:00";
		}    
	
		$("#als_lightbox").fancybox({
			openEffect: 'fade',
			closeEffect: 'fade',
			openSpeed: 500,
			closeSpeed: 250,	
			margin: 0,
			padding: 0,
			closeBtn: true,
			autoSize: true,
			autoScale: false,
			wrapCSS: 'als_fancybox',
			scrollOutside: true, //If true, the script will try to avoid horizontal scrolling for iframes and html content 
			scrolling: 'no',
			maxHeight: boxMaxHeight,
			maxWidth: boxMaxWidth,
			href: boxUrl,
			type: 'iframe',
			helpers: {
				overlay: {
					locked: true,
					closeClick: true
				}
			},
			tpl: {
				wrap     : '<div class="als-fancybox-wrap fancybox-wrap" tabIndex="-1"><div class="als-fancybox-skin fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner als-fancybox-inner"></div></div></div></div>',
				closeBtn : '<a title="Close" class="fancybox-item als-fancybox-close fancybox-close" href="javascript:;"></a>'
			}
// 			, onUpdate: function() {
//					// Necessary to allow child frame to resize itself. 				
//  				if(postMessage_height != 0) { fancybox_change_height(postMessage_height); }
//  				if(postMessage_width != 0) { fancybox_change_width(postMessage_width); }
// 			}				
		});
	
	
		if(
			(!readCookieAls(alsCookieName)
			&& todayDate > new Date(alsStart)
			&& todayDate < new Date(alsEnd)
		) || (
			alsTestMode >= 1
		)) {
			$("#als_lightbox").trigger('click');
			createCookieAls(alsCookieName,1,alsCookieDuration);
		}
	
	});

}