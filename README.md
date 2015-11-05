als_lightbox
============

Splash pages, simplified.

The code to add to client HTML:
-----------
Implementation for them should be simple. Just cut and paste this code snippet:

```html
<!-- Add ALS Lightbox assets -->
<script type="text/javascript"
  src="//s3.amazonaws.com/clintonfoundation/lightbox/js/min/als_lightbox.min.js"
  id="als_lightbox_js"
  data-id="als_lightbox_js"
  data-configFile="//s3.amazonaws.com/clintonfoundation/lightbox/clients/clintonfoundation/config.json"
  data-iframeURL="//s3.amazonaws.com/clintonfoundation/lightbox/clients/clintonfoundation/lightbox_src/lightbox-src-2015-01-a.html"
  data-maxWidth="888"
  data-maxHeight="528"
  data-startDate="November 6, 2015 05:00:00"
  data-endDate="December 1, 2015 04:00:00"
  data-cookieName="als_lightbox"
  data-cookieDuration="1"
  data-supplementalCSS="//s3.amazonaws.com/clintonfoundation/lightbox/clients/clintonfoundation/css/als_lightbox_clintonfoundation.css"
  data-testMode="0"
  />
</script>
```   

Webmasters can set configurations in two ways:

1. Specify a config file through the `data-configFile` attribute. **Important: Setting an external config file is an all or nothing proposition. If the external file exists, it will overwrite all data- attributes.**

2. Specify `data-` attributes as described below:

`data-` attribute       | Description
------------------------|------------
`data-id`               | Required. Set to `als_lightbox`.
`data-configFile`       | Path to configuration JSON. Relative to the underlying HTML page.
`data-iframeURL`        |
`data-maxWidth`         | The maximum width of the lightbox on desktop. In most cases this can be thought of as the "desktop width."
`data-maxHeight`        | The maximum height of the lightbox on desktop. In most cases this can be thought of as the "desktop height.
`data-startDate`        | Date and time to _start_ showing the lightbox to visits. Javascript UTC Date() format.
`data-endDate`          | Date and time to _stop_ showing the lightbox to visits. Javascript UTC Date() format.
`data-cookieName`       | Cookie name to track repeat site visitors. Defaults to `als_lightbox` if nothing specified.
`data-cookieDuration`   | Number of days after which the cookie will expire and repeat visitors will see the lightbox again. Commonly set to `1` (show no more than once per day) or `30` (show no more than once per month).
`data-supplementalCSS`  | Path to supplemental CSS file for site-specific stying tweaks.
`data-testMode`         | Activate test mode by setting a value of `1`. Lightbox will show on every page load. Set to `0` or remove data-attribute to disable.
