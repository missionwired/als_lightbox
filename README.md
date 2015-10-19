als_lightbox
============

Splash pages, simplified.

The code to add to headers of pages:
-----------
Implementation for them should be simple. Just cut and paste this code snippet:

    <!-- Add ALS fancybox assets -->
    <script type="text/javascript"
        src="//annelewisllc.s3.amazonaws.com/assets/splash/js/als_fancybox_launch.js"
        data-id="als_fancybox_js"
        data-max-width="800"
        data-max-height="450"
        data-iframe-url="//weta.s3.amazonaws.com/2014_spring_splash/weta-lightbox-spring-src-v1.html"
        data-start-date="February 26, 2015 05:00:00"
        data-end-date="March 23, 2015 04:00:00" 
        data-cookie-name="fancybox_als4"
        data-cookie-duration="1"
        data-test-mode="0"
        />
    </script>

Note that the client can adjust various options if desired:

    data-id="als_fancybox_js"

just an ID for the script element

    data-max-width="800" 

Max width of the iframe. This is related to the dimensions of the iframe source so shouldn’t be changed on its own.

    data-max-height="450"

Max height of the iframe. This is related to the dimensions of the iframe source so shouldn’t be changed on its own.

    data-iframe-url="//weta.s3.amazonaws.com/2014_spring_splash/weta-lightbox-spring-src-v1.html”

Source URL for the iframe.

    data-close-btn-dark-bg="1"

Styles the lightbox close button to overlay dark backgrounds. Optional.

    data-start-date="February 26, 2015 05:00:00"

Start time for the splash to be display in UTC. Currently set to the start of the day tomorrow, Feb 26

    data-end-date="March 23, 2015 04:00:00" 

End time for the splash to be display in UTC. Currently set to the start of the day, Mar 23

    data-cookie-name="fancybox_als4"

Name of cookie controlling visibility.

    data-cookie-duration="1"

Cookie expiration duration in days. Currently set to show new visitors the splash once each day.

    data-test-mode="0"
    
A value of "1" here activates test mode which always shows the splash regardless of cookies or date.


