/*global ga:true, Drupal:true*/

// Anne Lewis Strategies
// Generalized lightbox asset
// uses fancybox in iframe
// Developed by by Ben Long <ben@annelewisllc.com> and Todd Plants <todd@annelewisllc.com>.

// Create a global namespace for ALS Lightbox assets. All properties and helper functions flow from there.

var alsLightbox = function() {

// Expected ID attribute of the script tag calling this script.
// TODO Graceful failure if script tag is not identified correctly.
alsLightbox.thisScriptID = "als_lightbox_js";

// Searches for selector ('script[data-id="als_fancybox_js"], #als_fancybox_js') or similar.
alsLightbox.thisScript = document.querySelector('script[data-id="' + alsLightbox.thisScriptID + '"], #' +
  alsLightbox.thisScriptID);

// Create alsLightbox.config object. Object will eventually have four children:
// 1 - alsLightbox.config.available: The list of available config options.
// 2 - alsLightbox.config.paths: Paths to dependencies- jQuery, fancybox, and ALS lightbox CSS assets
// 3 - alsLightbox.config.external: Config options from "external" json if specified. This will override any
//     data-attributes.
// 4 - alsLightbox.config.active: The active config options that will ultimately govern execution of the script.
alsLightbox.config = {};

// OK to be hard-coded because this is the definitive list of supported options. Set by us as the developers.
// Note that some available options have dash-style names (not recommened in javascript) and new camelCase names.
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
	"killSwitch": ["killSwitch"],
	"blacklist": ["blacklist"]
};

// Specify paths to dependencies.
alsLightbox.config.paths = {
	"jQuery": "https://code.jquery.com/jquery-latest.min.js",
	"fancybox_js": "https://s3.amazonaws.com/annelewisllc/lightbox/src/bower_components/fancybox/source/jquery.fancybox.pack.als.js",
	"fancybox_css": "https://s3.amazonaws.com/annelewisllc/lightbox/src/bower_components/fancybox/source/jquery.fancybox.css",
	"als_lightbox_css": "https://s3.amazonaws.com/annelewisllc/lightbox/src/css/als_lightbox.css"
};



// Relative paths for localhost testing. Uncomment lines below.
// alsLightbox.config.paths = {
// 	"jQuery": "bower_components/jquery/dist/jquery.min.js",
// 	"fancybox_js": "bower_components/fancybox/source/jquery.fancybox.pack.als.js",
// 	"fancybox_css": "bower_components/fancybox/source/jquery.fancybox.css",
// 	"als_lightbox_css": "css/als_lightbox.css"
// };

// Create objects.
alsLightbox.config.external = {};
alsLightbox.config.active = {};

// Helper function. Determine whether a javascript object is, in fact, empty.
function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) { return false; }
  }
  return true;
}

// If alsLightbox.config.external is not empty, make it the active config.
// Otherwise, cycle through the available options. If the option is specified in the data- attributes,
// make them active.
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

// This is the main logic of this tool. In future iterations, it probably can and should be broken up into
// more discrete sections.
alsLightbox.launch = function () {

  // Allows for developers (ALS) to disable lightbox "remotely."
  if (alsLightbox.config.active.killSwitch) { return; }

	// Regex to check for blacklisted URL parameters
	if ((alsLightbox.config.active.blacklist).length > 0) {  
		var blacklistArray = new RegExp((alsLightbox.config.active.blacklist).join("|"), 'i');
		if (window.location.href.match(blacklistArray) !== null) { return; }
	}

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

  // Function to create a browser cookie.
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

	// Function to read a browser cookie.
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

	// Load jQuery if not present.
  // Technique from http://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/

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
        // Assign new jQuery to namespace and release from all other uses.
				alsLightbox.jQuery = jQuery.noConflict(true);

        // Now that jQuery is in the namespace, start running functions that need it.
        (function($) { load_fancybox($); })(alsLightbox.jQuery);

        // Placeholder
        if (thisPageUsingOtherJSLibrary) {} else {}
			}
		});

	} else { // jQuery was already loaded
    // Assign existing jQuery to namespace, but do not release from global var.
    alsLightbox.jQuery = jQuery;
    // Now that jQuery is in the namespace, start running functions that need it.
    (function($) { load_fancybox($); })(alsLightbox.jQuery);
	}




	// Load Fancybox if not present.

	function load_fancybox($) {

		if(typeof $.fancybox === 'function') {
			 load_fancybox_css($);
			 execute_fancybox($);
		} else {
      // Use $.getScript to make sure that the current local version of $ (alsLightbox.jQuery) stays in scope.
      $.getScript(alsLightbox.config.paths.fancybox_js, function(){
        load_fancybox_css($);
        execute_fancybox($);
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
				$.fancybox.close();
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
				alsLightbox.config.active.testMode >= 1 || // Legacy support for values of 1 and 0.
        		alsLightbox.config.active.testMode === 'true' // Support for string "true" in script tag's data- attributes.
			)) {
				$("#als_lightbox").trigger('click');
				createCookieAls(alsLightbox.config.active.cookieName,1,alsLightbox.config.active.cookieDuration);
			}

		});

	}

};    // End alsLightbox.launch

// If this script's HTML tag element has a configFile specified, use that value as the path to the config JSON.
// Otherwise, use empty string.
alsLightbox.config.active.configFile = alsLightbox.thisScript.getAttribute('data-configFile') ?
  alsLightbox.thisScript.getAttribute('data-configFile') : '';

// If there's a config file specified, go get the JSON. Then use it to set the active config and launch the lightbox.
// Otherwise, just set the active config and launch the lightbox without external config JSON.
if (alsLightbox.config.active.configFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', encodeURI(alsLightbox.config.active.configFile));
  xhr.onload = function() {
      if (xhr.status === 200) {
        alsLightbox.config.external = JSON.parse(xhr.responseText);
        alsLightbox.setActiveConfig();
        alsLightbox.launch();
      }
      else {
        alsLightbox.setActiveConfig();
        alsLightbox.launch();
      }
  };
  xhr.send();
} else {
  alsLightbox.setActiveConfig();
  alsLightbox.launch();
}

};

// Add support for Drupal behaviors. Drupal has a weird way of handling jQuery and document ready.
// Basically you have to register your script as a "behavior."
// This implementation should throw an error if Drupal.behaviors doesn't exist, but try/catch means the script
// will just move on. Either way, we run the big master namespace function.
try {
	Drupal.behaviors.alsLightbox = {
	  attach: function () {
      alsLightbox();
		}
	};
}
catch(err) {
  alsLightbox();
}
