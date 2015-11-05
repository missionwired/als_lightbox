/*global ga:true */

// Anne Lewis Strategies
// Generalized lightbox asset
// uses fancybox in iframe
// Developed by by Ben Long <ben@annelewisllc.com> and Todd Plants <todd@annelewisllc.com>.

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) { return false; }
  }
  return true;
}

var alsLightbox = {};

alsLightbox.thisScriptID = "als_lightbox_js";

// Searches for selector ('script[data-id="als_fancybox_js"], #als_fancybox_js') or similar.
alsLightbox.thisScript = document.querySelector('script[data-id="' + alsLightbox.thisScriptID + '"], #' + alsLightbox.thisScriptID);

alsLightbox.config = {};
alsLightbox.config.available = {
	"iframeURL": ["iframe-url","iframeURL"],
  "maxWidth": ["max-width","maxWidth"],
  "maxHeight": ["max-height","maxHeight"],
	"startDate": ["start-date","startDate"],
	"endDate": ["end-date","endDate"],
	"cookieName": ["cookie-name","cookieName"],
	"cookieDuration": ["cookie-duration","cookieDuration"],
	"configFile": ["configFile"],
	"supplementalCSS": ["supplementalCSS"],
	"testMode": ["test-mode","testMode"],
	"killSwitch": ["killSwitch"]
};

alsLightbox.config.paths = {
	"jQuery": "//code.jquery.com/jquery-latest.min.js",
	"fancybox_js": "//s3.amazonaws.com/clintonfoundation/lightbox/bower_components/fancybox/source/jquery.fancybox.pack.js",
	"fancybox_css": "//s3.amazonaws.com/clintonfoundation/lightbox/bower_components/fancybox/source/jquery.fancybox.css",
	"als_lightbox_css": "//s3.amazonaws.com/clintonfoundation/lightbox/css/als_lightbox.css"
};

// Relative paths for localhost testing.
// alsLightbox.config.paths = {
// 	"jQuery": "bower_components/jquery/dist/jquery.min.js",
// 	"fancybox_js": "bower_components/fancybox/source/jquery.fancybox.pack.js",
// 	"fancybox_css": "bower_components/fancybox/source/jquery.fancybox.css",
// 	"als_lightbox_css": "css/als_lightbox.css"
// };

alsLightbox.config.active = {};
alsLightbox.config.external = {};
alsLightbox.config.active.configFile = alsLightbox.thisScript.getAttribute('data-configFile') ? alsLightbox.thisScript.getAttribute('data-configFile') : '';

$.getJSON(alsLightbox.config.active.configFile ? alsLightbox.config.active.configFile : '', function(json) {
	alsLightbox.config.external = json;
	alsLightbox.setActiveConfig();
	alsLightbox.launch();
}).fail(function() {
	alsLightbox.setActiveConfig();
	alsLightbox.launch();
});

alsLightbox.setActiveConfig = function() {
	if (!isEmpty(alsLightbox.config.external)) {
		alsLightbox.config.active = alsLightbox.config.external;
	} else {
		for (var setting in alsLightbox.config.available) {
			for (var index = 0; index < alsLightbox.config.available[setting].length; index++) {
				alsLightbox.config.active[setting] = alsLightbox.thisScript.getAttribute('data-' + alsLightbox.config.available[setting][index]);
				if (alsLightbox.config.active[setting]) { break; }
			}
		}
	}
};

alsLightbox.launch = function () {

	if (alsLightbox.config.active.killSwitch) { return; }

	var enforceMinJQueryVersion = '1.6'; // Minimum required jQuery version.

	// Helper functions.

	function getScript(url, success) {

		var script = document.createElement('script');
			script.src = url;

		var head = document.getElementsByTagName('head')[0],
		done = false;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {

			if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {

			done = true;

				// callback function provided as param
				success();

				script.onload = script.onreadystatechange = null;
				head.removeChild(script);

			}

		};

		head.appendChild(script);

	}

	function createCookieAls(name,value,days) {
		var expires = '';
    if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		} else {
      expires = '';
    }
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookieAls(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)===' ') { c = c.substring(1,c.length); }
			if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length,c.length); }
		}
		return null;
	}

	// Load jQuery if not present. Technique from http://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/

	var thisPageUsingOtherJSLibrary = false;

	// Only do anything if jQuery isn't defined
	if ( ( typeof jQuery === 'undefined' ) || ( jQuery.fn.jquery < enforceMinJQueryVersion ) ) {

		if (typeof $ === 'function') {
			// warning, global var
			thisPageUsingOtherJSLibrary = true;
		}

		getScript(alsLightbox.config.paths.jQuery, function() {

			if (typeof jQuery === 'undefined') {

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

	}

	// Load Fancybox if not present.

	function load_fancybox($) {

		if(typeof $.fancybox === 'function') {
			 load_fancybox_css($);
			 execute_fancybox($);
		} else {

			getScript(alsLightbox.config.paths.fancybox_js, function() {

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
				fancybox_base_style_tag.href = alsLightbox.config.paths.fancybox_css;
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
			als_style_tag.href = alsLightbox.config.paths.als_lightbox_css;
		document.getElementsByTagName('head')[0].appendChild(als_style_tag);

    // Add site-specific supplemental CSS if one exists.
    if (alsLightbox.config.active.supplementalCSS) {
      var alsSupplementalCSSTag = document.createElement('link');
  			alsSupplementalCSSTag.rel  = 'stylesheet';
  			alsSupplementalCSSTag.type = 'text/css';
  			alsSupplementalCSSTag.media = 'all';
  			alsSupplementalCSSTag.href = alsLightbox.config.active.supplementalCSS;
  		document.getElementsByTagName('head')[0].appendChild(alsSupplementalCSSTag);
    }

		// Add postMessage listener to allow child iframe to close itself.

		// Create IE + others compatible event handler
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

		// Listen to message from child window
		eventer(messageEvent,function(e) {
			if (e.data === 'fancybox.close') {
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

		// Set URL paramter for cross-domain analytics tracking.

		function decorateLinksIfAnalytics(url) {
			if(window.ga) {
				ga(function(tracker) {
					var linker = new window.gaplugins.Linker(tracker);
					url = linker.decorate(url);		// Appends query string parameter to URL that allows for cross-domain analytics tracking. Requires companion call in URL source. More: https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain#decorate
				});
			}
			return url;
		}

		$(document).ready(function( $ ) {

			$('body').prepend('<div id="als_lightbox" style="display:none;"></div>');

			var todayDate = new Date();

			//defaults
			if(!alsLightbox.config.active.cookieName) {
				alsLightbox.config.active.cookieName = "als_lightbox";
			}
			if(!alsLightbox.config.active.cookieDuration) {
				alsLightbox.config.active.cookieDuration = 1;
			}
			if(!alsLightbox.config.active.startDate) {
				alsLightbox.config.active.startDate = "January 1, 1970 00:00:00";
			}
			if(!alsLightbox.config.active.endDate) {
				alsLightbox.config.active.endDate = "January 1, 2038 00:00:00";
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
				maxHeight: alsLightbox.config.active.maxHeight,
				maxWidth: alsLightbox.config.active.maxWidth,
				height: '100%',
				width: '100%',
				href: decorateLinksIfAnalytics(alsLightbox.config.active.iframeURL),
				type: 'iframe',
				helpers: {
					overlay: {
						locked: true,
						closeClick: true
					}
				},
				tpl: {
					wrap     : '<div class="als-fancybox-wrap fancybox-wrap" tabIndex="-1"><div class="als-fancybox-skin fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner als-fancybox-inner"></div></div></div></div>',
					closeBtn : '<div class="als-fancybox-close-wrap"><a title="Close" class="fancybox-item als-fancybox-close fancybox-close hide-on-mobile" href="javascript:;"></a><a title="Close" class="fancybox-item als-fancybox-close-mobile fancybox-close" href="javascript:;"><button>Continue to Site &gt;&gt;</button></a></div>'
				}
	// 			, onUpdate: function() {
	//					// Necessary to allow child frame to resize itself.
	//  				if(postMessage_height != 0) { fancybox_change_height(postMessage_height); }
	//  				if(postMessage_width != 0) { fancybox_change_width(postMessage_width); }
	// 			}
			});


			if(
				(!readCookieAls(alsLightbox.config.active.cookieName) &&
				todayDate > new Date(alsLightbox.config.active.startDate) &&
				todayDate < new Date(alsLightbox.config.active.endDate)
			) || (
				alsLightbox.config.active.testMode >= 1
			)) {
				$("#als_lightbox").trigger('click');
				createCookieAls(alsLightbox.config.active.cookieName,1,alsLightbox.config.active.cookieDuration);
			}

		});

	}

};