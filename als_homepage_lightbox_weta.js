// Anne Lewis Strategies
// Homepage lightbox to send to convio donation pages
// 
// Developed by by Ben Long <ben@annelewisllc.com>.


// Add base ALS styling CSS file.
/*
var als_style_tag = document.createElement('link');
	als_style_tag.rel  = 'stylesheet';
	als_style_tag.type = 'text/css';
	als_style_tag.media = 'all';
	//als_style_tag.href = '//annelewisllc.s3.amazonaws.com/assets/convio/responsive_contrib/als_convio_responsive_contrib.css';
	als_style_tag.href = 'http://localhost/www/GitHub/als_convio/homepage_lightbox/als_homepage_lightbox_weta.css';
document.getElementsByTagName('head')[0].appendChild(als_style_tag);
*/
// Add fancybox styling
/*
var fancybox_style_tag = document.createElement('link');
	fancybox_style_tag.rel  = 'stylesheet';
	fancybox_style_tag.type = 'text/css';
	fancybox_style_tag.media = 'all';
	fancybox_style_tag.href = '//s3.amazonaws.com/convioluminate/fancybox/jquery.fancybox.css';
document.getElementsByTagName('head')[0].appendChild(fancybox_style_tag);
*/


var lightbox_html = '<!-- the lightbox html -->'
+ '<div id="lightbox" style="display:none;">'
+ '<div id="lightbox-right">'
+ '<!-- <h2>Can you make it monthly?</h2> -->'
+ '<div id="lightbox-copy">'
+ '<form id="donation-form" action="http://support.weta.org/site/Donation2" method="get" enctype="multipart/form-data">'
+ '<input type="hidden" name="df_id" value="7660" />'
+ '<input type="hidden" name="7660.donation" value="form1" />'
+ '<span><input type="radio" name="set.DonationLevel" value="20624" id="v35" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v35">$35</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20621" id="v50" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v50">$50</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20625" id="v75" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v75">$75</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20628" id="v100" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v100">$100</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20627" id="v250" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v250">$250</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20623" id="v500" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v500">$500</label></span>'
+ '<span><input type="radio" name="set.DonationLevel" value="20622" id="v1000" /> <label class="amount-btn lightbox-btn lightbox-btn-large" for="v1000">$1000</label></span>'
+ '<div id="other-div"><input type="radio" name="set.DonationLevel" value="20626" id="vOther" />'
+ '<label for="vOther">$</label><input class="amount-other" type="tel" name="other-amount" placeholder="Other" />'
+ '<input id="other-amount-to-pass" type="hidden" name="set.Value" value="" /><!-- this will be other-amount multiplied by 100 to convert to cents -->'
+ '</div><br />'
//+ '<div id="recurring-check">'
//+ '<input type="checkbox" name="make-recurring" id="make-recurring" /> <label for="make-recurring">Make this a recurring donation</label>'
//+ '<input id="recurring-to-pass" type="hidden" name="set.OptionalRepeat" value="" /><!-- will be true or false, set when form is submitted -->'
//+ '<br />'
//+ '</div>'
+ '<!-- <input class="lightbox-btn lightbox-btn-success lightbox-btn-large" type="submit" value="Next >" /> -->'
+ '<button class="lightbox-btn lightbox-btn-success lightbox-btn-large" type="submit">Next <span class="glyphicon glyphicon-play submit_button_glyph" aria-hidden="true"></span></button>'
+ '</form>'
+ '</div>'
+ '<div>'
+ '<a id="lightbox_close" class="lightbox-btn lightbox-btn-default lightbox-btn-large">No thanks, continue to WETA</a>'
+ '</div>'
+ '</div>'
+ '</div>'
+ '';



function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}




/* Lightbox guts here */

jQuery(document).ready(function( $ ) {		
        $('body').prepend('<a class="lightbox" href="#lightbox"></a>');
        $('body').append(lightbox_html);
        
        
	$('#donation-form input#vOther').prop('checked', false);
	$('#donation-form input[type="radio"]:checked').siblings('label').addClass('amount-btn-selected');
	if( $('input.amount-other').val() ) {
	    $('#donation-form input#vOther').prop('checked', true);
	}
	
	 
	$('#donation-form input[type="radio"]').on('click', function() {
	    $('#donation-form input[type="radio"]:checked').siblings('label').addClass('amount-btn-selected');
	    $('#donation-form input[type="radio"]:not(:checked)').siblings('label').removeClass('amount-btn-selected');
	    $('#donation-form input#vOther').prop('checked', false);
	});
	
	$('input.amount-other').on('keyup', function() {
	    if( $('input.amount-other').val() ) { //this conditional needed in case they hit delete!
		$('#donation-form input[type="radio"]:checked').prop('checked', false);
		$('#donation-form input[type="radio"]:not(:checked)').siblings('label').removeClass('amount-btn-selected');
		$('#donation-form input#vOther').prop('checked', true);
	    }
	});
	 
         //lightbox
         $(".lightbox").fancybox({
                openEffect  : 'fade',
                closeEffect : 'fade',
                openSpeed   : 500,
                closeSpeed  : 250,
		  padding	: 0,
                  maxWidth	: 850,
                  maxHeight	: 650,
                  width		: '100%',
                  height	: '100%',
                  closeClick  : false,
                  closeBtn : true,
                  helpers : {
                           overlay : {
                                    locked : true,
                                    closeClick: true
                           }
                  },
                  keys : {
                           close  : null
                  },
                  beforeLoad: function() {
                           //get one-time amount
 
                  },
                  beforeClose: function() {
                           //document.getElementById("ProcessForm").submit(); // Submit underlying form
                  }
         });
	
	
	if(!readCookie('2014-eoy-lightbox')) {
		$(".lightbox").trigger('click');
		createCookie('2014-eoy-lightbox',1,1);
	}
	 
	 $('#lightbox_close').on('click', function() {
	    parent.$.fancybox.close();
	 });
         
         //prevent submit
         $("form#donation-form").submit(function(e) {
                  var form = this;
                  e.preventDefault(); // disable the default submit action
                  
		  //multiply the "other" amount by 100, set as value of hidden other-amount-to-pass and submit
		  if( $('input.amount-other').val() ) {
			$('input#other-amount-to-pass').val( $('input.amount-other').val()*100 );
		  }
		  
		  if( $('input#make-recurring').is(':checked') ) {
			$('input#recurring-to-pass').val('true');
		  } else {
			$('input#recurring-to-pass').val('false');
		  }
		  
		  
		  form.submit();
		  
                  //check whether one-time or recurring
		  /*
                  if($(".generic-repeat-label-checkbox-container input[type='checkbox']").is(':checked')) {

                          
                           form.submit(); // Submit underlying form
                  } else {
                           $(".lightbox").trigger('click'); //trigger the upsell
                  }
                  */
         });
             
     });