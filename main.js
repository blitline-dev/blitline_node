/* Sample code to perform trivial operation on Blitline */
/* Requires an APPLICATION_ID which you can get from blitline.com for free and without obligation, or e
ven an email. */

var Blitline = require('./lib/blitline');
var blitline = new Blitline();


/* Replace MY_APP_ID with your Blitline application_id */
var applicationId = "MY_APP_ID"; // "MY_APP_ID"

var job = blitline.addJob(applicationId, "http://www.google.com/intl/en_com/images/srpr/logo3w.png");
/* Add a blur function to the image */
var blur_function = job.addFunction("blur", null, "my_blurred_image");
/* Once blurred, add a sepia filter to the image */
var sepia_function = blur_function.addFunction("sepia_tone", null, "my_blurred_sepia_toned_image");
/* Once blurred, crop to 50x50 */
var crop_function = sepia_function.addFunction("resize_to_fill", { width: 50, height: 50}, "my_sepia_tone_blurred_cropped_image");

blitline.postJobs(function(response) {
  console.log(response);
});

