/*global ga:true, Drupal:true*/

// Anne Lewis Strategies
// Generalized lightbox asset
// uses fancybox3 in iframe
// Developed by by Ben Long <ben@annelewisllc.com> and Todd Plants <todd@annelewisllc.com>.

// Create a global namespace for ALS Lightbox assets. All properties and helper functions flow from there.

var alsLightboxFancybox3 = function () {

    // Expected ID attribute of the script tag calling this script.
    // TODO Graceful failure if script tag is not identified correctly.
    alsLightboxFancybox3.thisScriptID = "als_lightbox_js";

    // Searches for selector ('script[data-id="als_fancybox3_js"], #als_fancybox3_js') or similar.
    alsLightboxFancybox3.thisScript = document.querySelector('script[data-id="' + alsLightboxFancybox3.thisScriptID + '"], #' +
        alsLightboxFancybox3.thisScriptID);

    // Create alsLightboxFancybox3.config object. Object will eventually have four children:
    // 1 - alsLightboxFancybox3.config.available: The list of available config options.
    // 2 - alsLightboxFancybox3.config.paths: Paths to dependencies- jQuery, fancybox3, and ALS lightbox CSS assets
    // 3 - alsLightboxFancybox3.config.external: Config options from "external" json if specified. This will override any
    //     data-attributes.
    // 4 - alsLightboxFancybox3.config.active: The active config options that will ultimately govern execution of the script.
    alsLightboxFancybox3.config = {};

    // OK to be hard-coded because this is the definitive list of supported options. Set by us as the developers.
    // Note that some available options have dash-style names (not recommened in javascript) and new camelCase names.
    alsLightboxFancybox3.config.available = {
        "iframeURL": ["iframe-url", "iframeURL"],
        "maxWidth": ["max-width", "maxWidth"],
        "maxHeight": ["max-height", "maxHeight"],
        "startDate": ["start-date", "startDate"],
        "endDate": ["end-date", "endDate"],
        "cookieName": ["cookie-name", "cookieName"],
        "cookieDuration": ["cookie-duration", "cookieDuration"],
        "configFile": ["configFile"],
        "supplementalCSS": ["supplementalCSS"],
        "testMode": ["test-mode", "testMode"],
        "killSwitch": ["killSwitch"],
        "blacklist": ["blacklist"],
        "exitIntent": ["exitIntent"]
    };

    // Specify paths to dependencies.
    alsLightboxFancybox3.config.paths = {
        "jQuery": "https://code.jquery.com/jquery-latest.min.js",
        "fancybox3_js": "https://s3.amazonaws.com/annelewisllc/lightbox/src/bower_components/fancybox/source/jquery.fancybox3.als.js",
        "fancybox3_css": "https://s3.amazonaws.com/annelewisllc/lightbox/src/bower_components/fancybox/source/jquery.fancybox3.css",
        "als_lightbox_css": "https://s3.amazonaws.com/annelewisllc/lightbox/src/css/als_lightbox.css"
    };



    // Relative paths for localhost testing. Uncomment lines below.
    // alsLightboxFancybox3.config.paths = {
    // 	"jQuery": "bower_components/jquery/dist/jquery.min.js",
    // 	"fancybox3_js": "bower_components/fancybox/source/jquery.fancybox3.als.js",
    // 	"fancybox3_css": "bower_components/fancybox/source/jquery.fancybox3.css",
    // 	"als_lightbox_css": "css/als_lightbox.css"
    // };

    // Create objects.
    alsLightboxFancybox3.config.external = {};
    alsLightboxFancybox3.config.active = {};

    // Helper function. Determine whether a javascript object is, in fact, empty.
    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) { return false; }
        }
        return true;
    }

    // If alsLightboxFancybox3.config.external is not empty, make it the active config.
    // Otherwise, cycle through the available options. If the option is specified in the data- attributes,
    // make them active.
    alsLightboxFancybox3.setActiveConfig = function () {
        if (!isEmpty(alsLightboxFancybox3.config.external)) {
            alsLightboxFancybox3.config.active = alsLightboxFancybox3.config.external;
        } else {
            for (var setting in alsLightboxFancybox3.config.available) {
                for (var index = 0; index < alsLightboxFancybox3.config.available[setting].length; index++) {
                    alsLightboxFancybox3.config.active[setting] = alsLightboxFancybox3.thisScript.getAttribute('data-' + alsLightboxFancybox3.config.available[setting][index]);
                    if (alsLightboxFancybox3.config.active[setting]) { break; }
                }
            }
        }
    };

    // This is the main logic of this tool. In future iterations, it probably can and should be broken up into
    // more discrete sections.
    alsLightboxFancybox3.launch = function () {

        // Allows for developers (ALS) to disable lightbox "remotely."
        if (alsLightboxFancybox3.config.active.killSwitch) { return; }

        // Regex to check for blacklisted URL parameters
        var blacklistArray = alsLightboxFancybox3.config.active.blacklist;
        if (blacklistArray && blacklistArray.length > 0) {
            blacklistArray = new RegExp("(" + blacklistArray.join(")|(") + ")", 'i');
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
            script.onload = script.onreadystatechange = function () {

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
        function createCookieAls(name, value, days) {
            var expires = '';
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = '';
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        // Function to read a browser cookie.
        function readCookieAls(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
                if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
            }
            return null;
        }

        // Load jQuery if not present.
        // Technique from http://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/

        var thisPageUsingOtherJSLibrary = false;

        // Only do anything if jQuery isn't defined
        if ((typeof jQuery === 'undefined') || (jQuery.fn.jquery < enforceMinJQueryVersion)) {
            if (typeof $ === 'function') {
                // warning, global var
                thisPageUsingOtherJSLibrary = true;
            }

            getScript(alsLightboxFancybox3.config.paths.jQuery, function () {
                if (typeof jQuery === 'undefined') {
                    // Super failsafe - still somehow failed...
                } else {
                    // jQuery loaded! Make sure to use .noConflict just in case
                    // Assign new jQuery to namespace and release from all other uses.
                    alsLightboxFancybox3.jQuery = jQuery.noConflict(true);

                    // Now that jQuery is in the namespace, start running functions that need it.
                    (function ($) { load_fancybox3($); })(alsLightboxFancybox3.jQuery);

                    // Placeholder
                    if (thisPageUsingOtherJSLibrary) { } else { }
                }
            });

        } else { // jQuery was already loaded
            // Assign existing jQuery to namespace, but do not release from global var.
            alsLightboxFancybox3.jQuery = jQuery;
            // Now that jQuery is in the namespace, start running functions that need it.
            (function ($) { load_fancybox3($); })(alsLightboxFancybox3.jQuery);
        }




        // Load fancybox3 if not present.

        function load_fancybox3($) {

            if (typeof $.fancybox3 === 'function') {
                load_fancybox3_css($);
                execute_fancybox3($);
            } else {
                // Use $.getScript to make sure that the current local version of $ (alsLightboxFancybox3.jQuery) stays in scope.
                $.getScript(alsLightboxFancybox3.config.paths.fancybox3_js, function () {
                    load_fancybox3_css($);
                    execute_fancybox3($);
                });
            }

        }

        // Load fancybox3 CSS if not present.

        function load_fancybox3_css($) {
            if (!$('link[href$="jquery.fancybox3.css"]').length) {
                var fancybox3_base_style_tag = document.createElement('link');
                fancybox3_base_style_tag.rel = 'stylesheet';
                fancybox3_base_style_tag.type = 'text/css';
                fancybox3_base_style_tag.media = 'screen';
                fancybox3_base_style_tag.href = alsLightboxFancybox3.config.paths.fancybox3_css;
                fancybox3_base_style_tag.id = 'als_fancybox3_base_style_tag';
                document.getElementsByTagName('head')[0].appendChild(fancybox3_base_style_tag);
            }
        }

        // Execute fancybox3 implementation.

        function execute_fancybox3($) {

            // Add base ALS styling CSS file.
            var als_style_tag = document.createElement('link');
            als_style_tag.rel = 'stylesheet';
            als_style_tag.type = 'text/css';
            als_style_tag.media = 'all';
            als_style_tag.href = alsLightboxFancybox3.config.paths.als_lightbox_css;
            document.getElementsByTagName('head')[0].appendChild(als_style_tag);

            // Add site-specific supplemental CSS if one exists.
            if (alsLightboxFancybox3.config.active.supplementalCSS) {
                var alsSupplementalCSSTag = document.createElement('link');
                alsSupplementalCSSTag.rel = 'stylesheet';
                alsSupplementalCSSTag.type = 'text/css';
                alsSupplementalCSSTag.media = 'all';
                alsSupplementalCSSTag.href = alsLightboxFancybox3.config.active.supplementalCSS;
                document.getElementsByTagName('head')[0].appendChild(alsSupplementalCSSTag);
            }

            // Add postMessage listener to allow child iframe to close itself.

            // Create IE + others compatible event handler
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

            // Listen to message from child window
            eventer(messageEvent, function (e) {
                if (e.data === 'fancybox3.close') {
                    $.fancybox3.close();
                }
            }, false);

            /* -------
            Disable ability for child iframe to resize itself.
        
                // Add postMessage listeners to allow child iframe to resize itself.
                var postMessage_height = 0;
                eventer(messageEvent,function(e) {
                    if (/fancybox3\.height\('{0,1}\d+'{0,1}\)/.test(e.data)) {
                        $(document).ready(function() {
        
                            postMessage_height = parseInt(e.data.match(/fancybox3\.height\('{0,1}(\d+)'{0,1}\)/)[1]);
                            fancybox3_change_height(postMessage_height);
        
                        });
                    }
                },false);
        
                function fancybox3_change_height(h) {
                    $(".als-fancybox3-inner").css({
                        height: h
                    });
                }
        
                var postMessage_width = 0;
                eventer(messageEvent,function(e) {
                    if (/fancybox3\.width\('{0,1}\d+'{0,1}\)/.test(e.data)) {
                        $(document).ready(function() {
        
                            postMessage_width = parseInt(e.data.match(/fancybox3\.width\('{0,1}(\d+)'{0,1}\)/)[1]);
                            fancybox3_change_width(postMessage_width);
        
                        });
                    }
                },false);
        
                function fancybox3_change_width(w) {
                    $(".als-fancybox3-inner, .als-fancybox3-wrap").css({
                        width: w
                    });
                }
        
            ------- */

            // Set URL paramter for cross-domain analytics tracking.

            function decorateLinksIfAnalytics(url) {
                if (window.ga) {
                    ga(function (tracker) {
                        var linker = new window.gaplugins.Linker(tracker);
                        url = linker.decorate(url);		// Appends query string parameter to URL that allows for cross-domain analytics tracking. Requires companion call in URL source. More: https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain#decorate
                    });
                }
                return url;
            }

            // helper function for mobile exitIntent functionality
            function myScrollSpeedFunction() {
                if ($('body').hasClass('on-mobile-device') && !$('body').hasClass('on-mobile-device-triggered')) {
                    if (my_scroll() < -150) {
                        $("#als_lightbox").trigger('click');
                        createCookieAls(alsLightboxFancybox3.config.active.cookieName, 1, alsLightboxFancybox3.config.active.cookieDuration);
                        $('body').removeClass('on-mobile-device');
                        $("body").addClass('on-mobile-device-triggered')
                    }
                }
            }

            // helper function for mobile exitIntent functionality
            var my_scroll = (function () { //Function that checks the speed of scrolling
                var last_position, new_position, timer, delta, delay = 50;
                function clear() {
                    last_position = null;
                    delta = 0;
                }

                clear();
                return function () {
                    new_position = window.scrollY;
                    if (last_position != null) {
                        delta = new_position - last_position;
                    }
                    last_position = new_position;
                    clearTimeout(timer);
                    timer = setTimeout(clear, delay);
                    return delta;
                };
            })();

            $(document).ready(function ($) {

                $('body').prepend('<div id="als_lightbox" style="display:none;"></div>');
                // check if we are on mobile device and add class to body accordingly.
                $(document).on('touchstart', function () {
                    if (readCookieAls(alsLightboxFancybox3.config.active.cookieName)) {
                        $("body").addClass('on-mobile-device-triggered'); // if cookie is set, add class to body to prevent lightbox from showing on mobile devices.
                    } else {
                        $("body").addClass('on-mobile-device'); // if cookie is not set, add class to body to show lightbox on mobile devices.
                    }
                });

                var todayDate = new Date();

                //defaults
                console.log('alsLightboxFancybox3.config.active.cookieName', alsLightboxFancybox3.config.active.cookieName);
                if (!alsLightboxFancybox3.config.active.cookieName) {
                    alsLightboxFancybox3.config.active.cookieName = "als_lightbox";
                }
                if (!alsLightboxFancybox3.config.active.cookieDuration) {
                    alsLightboxFancybox3.config.active.cookieDuration = 1;
                }
                if (!alsLightboxFancybox3.config.active.startDate) {
                    alsLightboxFancybox3.config.active.startDate = "January 1, 1970 00:00:00";
                }
                if (!alsLightboxFancybox3.config.active.endDate) {
                    alsLightboxFancybox3.config.active.endDate = "January 1, 2038 00:00:00";
                }
                if (!alsLightboxFancybox3.config.active.exitIntent) {
                    alsLightboxFancybox3.config.active.exitIntent = false;
                }

                $("#als_lightbox").fancybox3({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    openSpeed: 500,
                    closeSpeed: 250,
                    margin: 0,
                    padding: 0,
                    closeBtn: true,
                    autoSize: true,
                    autoScale: false,
                    wrapCSS: 'als_fancybox3',
                    scrollOutside: true, //If true, the script will try to avoid horizontal scrolling for iframes and html content
                    scrolling: 'no',
                    maxHeight: alsLightboxFancybox3.config.active.maxHeight,
                    maxWidth: alsLightboxFancybox3.config.active.maxWidth,
                    height: '100%',
                    width: '100%',
                    href: decorateLinksIfAnalytics(alsLightboxFancybox3.config.active.iframeURL),
                    type: 'iframe',
                    helpers: {
                        overlay: {
                            locked: true,
                            closeClick: true
                        }
                    },
                    tpl: {
                        wrap: '<div class="als-fancybox3-wrap fancybox3-wrap" tabIndex="-1"><div class="als-fancybox3-skin fancybox3-skin"><div class="fancybox3-outer"><div class="fancybox3-inner als-fancybox3-inner"></div></div></div></div>',
                    }
                    // 			, onUpdate: function() {
                    //					// Necessary to allow child frame to resize itself.
                    //  				if(postMessage_height != 0) { fancybox3_change_height(postMessage_height); }
                    //  				if(postMessage_width != 0) { fancybox3_change_width(postMessage_width); }
                    // 			}
                });


                if (
                    (!readCookieAls(alsLightboxFancybox3.config.active.cookieName) &&
                        todayDate > new Date(alsLightboxFancybox3.config.active.startDate) &&
                        todayDate < new Date(alsLightboxFancybox3.config.active.endDate)
                    ) || (
                        alsLightboxFancybox3.config.active.testMode >= 1 || // Legacy support for values of 1 and 0.
                        alsLightboxFancybox3.config.active.testMode === 'true' // Support for string "true" in script tag's data- attributes.
                    )) {
                    // Exit intent functionality.					
                    if (alsLightboxFancybox3.config.active.exitIntent) {
                        $(document).on('scroll', myScrollSpeedFunction); // if on mobile, show lightbox when user scrolls up quickly
                        $(document).one("mouseleave", function () { // show lightbox the first time the mouse leaves the browser window
                            $("#als_lightbox").trigger('click');
                            createCookieAls(alsLightboxFancybox3.config.active.cookieName, 1, alsLightboxFancybox3.config.active.cookieDuration);
                        });
                    } else {
                        $("#als_lightbox").trigger('click'); // show lightbox immediately
                        createCookieAls(alsLightboxFancybox3.config.active.cookieName, 1, alsLightboxFancybox3.config.active.cookieDuration);
                    }
                }
            });
        }
    };    // End alsLightboxFancybox3.launch

    // If this script's HTML tag element has a configFile specified, use that value as the path to the config JSON.
    // Otherwise, use empty string.
    alsLightboxFancybox3.config.active.configFile = alsLightboxFancybox3.thisScript.getAttribute('data-configFile') ?
        alsLightboxFancybox3.thisScript.getAttribute('data-configFile') : '';

    // If there's a config file specified, go get the JSON. Then use it to set the active config and launch the lightbox.
    // Otherwise, just set the active config and launch the lightbox without external config JSON.
    if (alsLightboxFancybox3.config.active.configFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(alsLightboxFancybox3.config.active.configFile));
        xhr.onload = function () {
            if (xhr.status === 200) {
                alsLightboxFancybox3.config.external = JSON.parse(xhr.responseText);
                alsLightboxFancybox3.setActiveConfig();
                alsLightboxFancybox3.launch();
            }
            else {
                alsLightboxFancybox3.setActiveConfig();
                alsLightboxFancybox3.launch();
            }
        };
        xhr.send();
    } else {
        alsLightboxFancybox3.setActiveConfig();
        alsLightboxFancybox3.launch();
    }

};

// Add support for Drupal behaviors. Drupal has a weird way of handling jQuery and document ready.
// Basically you have to register your script as a "behavior."
// This implementation should throw an error if Drupal.behaviors doesn't exist, but try/catch means the script
// will just move on. Either way, we run the big master namespace function.
try {
    Drupal.behaviors.alsLightboxFancybox3 = {
        attach: function () {
            alsLightboxFancybox3();
        }
    };
}
catch (err) {
    alsLightboxFancybox3();
}
