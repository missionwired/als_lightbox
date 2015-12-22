# ALS Lightbox

Splash pages, simplified.

[Live demo.](http://annelewisllc.s3.amazonaws.com/lightbox/src/index.html)

## Implementation

Cut and paste this code snippet and configure accordingly:

```html
<!-- Add ALS Lightbox assets -->
<script type="text/javascript"
  src="//s3.amazonaws.com/annelewisllc/lightbox/src/js/min/als_lightbox.min.js"
  id="als_lightbox_js"
  data-id="als_lightbox_js"
  data-configFile="//s3.amazonaws.com/annelewisllc/lightbox/src/demo/config.json"
  data-iframeURL="//s3.amazonaws.com/annelewisllc/lightbox/src/demo/lightbox_src/index.html"
  data-maxWidth="728"
  data-maxHeight="400"
  data-startDate="January 1, 2015 05:00:00"
  data-endDate="January 1, 2020 05:00:00"
  data-cookieName="als_lightbox"
  data-cookieDuration="1"
  data-supplementalCSS="//s3.amazonaws.com/annelewisllc/lightbox/src/demo/css/als_lightbox_sampleclient.css"
  data-testMode="false"
></script>
```

Webmasters can set configurations in two ways:

1. Specify a config file through the `data-configFile` attribute. **Important: Setting an external config file is an all or nothing proposition. If the external file exists, it will overwrite all data- attributes.**

2. Specify `data-` attributes as described below:

`data-` attribute       | Description
------------------------|------------
`data-id`               | Required. Set to `als_lightbox`.
`data-configFile`       | Path to configuration JSON. Relative to the underlying HTML page.
`data-iframeURL`        | Path to the html source of lightbox iframe. Relative to the underlying HTML page.
`data-maxWidth`         | The maximum width of the lightbox on desktop. In most cases this can be thought of as the "desktop width." Recommended: 768.
`data-maxHeight`        | The maximum height of the lightbox on desktop. In most cases this can be thought of as the "desktop height." Recommended: 450.
`data-startDate`        | Date and time to _start_ showing the lightbox to visitors. Javascript UTC Date() format.
`data-endDate`          | Date and time to _stop_ showing the lightbox to visitors. Javascript UTC Date() format.
`data-cookieName`       | Cookie name to track repeat site visitors. Defaults to `als_lightbox` if nothing specified.
`data-cookieDuration`   | Number of days after which the cookie will expire and repeat visitors will see the lightbox again. Commonly set to `1` (show no more than once per day) or `30` (show no more than once per month).
`data-supplementalCSS`  | Path to supplemental CSS file for site-specific styling tweaks.
`data-testMode`         | Boolean. Activate test mode by setting a value of `true`. Lightbox will show on every page load. Set to `false` or remove data-attribute to disable.

## Release Notes

### v2.0 - "October" - 2015-12-15

- Implemented support for config file, allowing lightbox behavior to be controlled without direct web server access.
- Implemented "kill switch" to disable ligtbox. Allows for immediate lightbox shutoff without client intervention when combined with remote config file.
- Added support for Drupal 6 behaviors
- Simplified and updated documentation for config parameters.
- Removed client-specific content from repo in preparation for public release.
- Implemented U2-album-themed release naming convention. Point releases are named after tracks and B-sides.
