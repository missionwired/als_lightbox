# ALS Lightbox

Splash pages, simplified.

[Live demo.](https://annelewisllc.s3.amazonaws.com/lightbox/src/index.html)

## Local development

1. In order to develop on and test changes to this repo locally, you will need to have `php` installed. To check if you have php installed already, run `php -v` in your terminal - this should either throw an error, or give you a version number. If you get an error, please install php for mac through brew. I followed the top comment in [this thread](https://stackoverflow.com/questions/69786222/zsh-command-not-found-php).

2. Once you have php installed, go into `index.html` and `index_data.html` and switch the scripts that the files are using from the deployment script to the local development script. The only difference here is that we will not use the minified version of the `js` files, this will make development faster.

3. We will also need to go into `js/als_lightbox.js` and `js/als_lightbox_v2.2.js` and switch the `alsLightbox.config.paths` to the object for local development. IMPORTANT! Do not deploy changes for this repo without changing this back! There are live lightboxes using this code, and we don't want to break them. 

4. Once all of this is done, you can run `php -S localhost:8080` to start a local php server. Navigate to `localhost:8080/index.html` to see the demo page and any changes you make will be reflected here after a refresh. 

5. Once you are happy with your changes, you will want to have someone test them. You can create a staging minification using the code below under Minification.

6. Deploy the changes to AWS using the command in `deploy.sh`. These files can now be referenced in the `als_lightbox_content` repo for testing. 

7. Repeat steps 5 and 6 but use the minification step to overwrite the production minification files that already exist for the version you are updating (`als_lightbox.min.js` and `als_lightbox_shp.min.js`)

## Minification

You can minify your javascript with the following script from the `/js/` directory. (Note, you need UglifyJS installed. You can install globally with `npm install uglify-js -g`)

`uglifyjs PATH_TO_FILE_TO_MINIFY -o min/MINIFIED_FILE_NAME.min.js -c -m --source-map "root='../',url='MINIFIED_FILE_NAME.min.js.map'"`

For example, to minify the `als_lightbox.js` file to a staging version, the script would look like this: 
`uglifyjs ./als_lightbox.js -o min/als_lightbox_staging.min.js -c -m --source-map "root='../',url='als_lightbox_staging.min.js.map'"`

To deploy that same file to production after testing/approval, we will overwrite the current minified version with this:
`uglifyjs ./als_lightbox.js -o min/als_lightbox.min.js -c -m --source-map "root='../',url='als_lightbox.min.js.map'"`

## Implementation

**Note that the below configurations are outdated and these settings are all set by each project's config JSON file**

Cut and paste this code snippet and configure accordingly:

```html
<!-- Add ALS Lightbox assets -->
<script type="text/javascript"
  src="https://s3.amazonaws.com/annelewisllc/lightbox/src/js/min/als_lightbox.min.js"
  id="als_lightbox_js"
  data-id="als_lightbox_js"
  data-configFile="https://s3.amazonaws.com/annelewisllc/lightbox/src/demo/config.json"
  data-iframeURL="https://s3.amazonaws.com/annelewisllc/lightbox/src/demo/lightbox_src/index.html"
  data-maxWidth="728"
  data-maxHeight="400"
  data-startDate="January 1, 2015 05:00:00"
  data-endDate="January 1, 2020 05:00:00"
  data-cookieName="als_lightbox"
  data-cookieDuration="1"
  data-supplementalCSS="https://s3.amazonaws.com/annelewisllc/lightbox/src/demo/css/als_lightbox_sampleclient.css"
  data-testMode="false"
  data-exitIntent="false"
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
`data-exitIntent`       | Boolean. Activate the exitIntent lightbox by setting this to true, it will override the default lighthouse functionality and trigger a pop-up when we detect  that the user is leaving the website. 

## Release Notes

### v2.2 - "How to Dismantle An Atomic Bomb" - 2021-12-17
- Change every reference of `fancybox` to `fancybox2` so the fancybox library does not interfere with the one used on the SHP site.
- So far, this is only to be deployed on the SHP site. We should test this rigorously before completely replacing it.

### v2.1 - "Where Did It All Go Wrong?" - 2018-11-28
- Implemented a blacklist filter to allow us to list URLs with a string to prevent the lightbox from displaying (i.e. prevent the lightbox from displaying on the privacy page with "privacy" in the URL)

### v2.0 - "October" - 2015-12-15

- Implemented support for config file, allowing lightbox behavior to be controlled without direct web server access.
- Implemented "kill switch" to disable ligtbox. Allows for immediate lightbox shutoff without client intervention when combined with remote config file.
- Added support for Drupal 6 behaviors
- Simplified and updated documentation for config parameters.
- Removed client-specific content from repo in preparation for public release.
- Implemented U2-album-themed release naming convention. Point releases are named after tracks and B-sides.
