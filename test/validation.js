var Blitline = require('../lib/blitline');
var Job = require('../lib/models/job');
var Save = require('../lib/models/save');
var S3_destination = require('../lib/models/s3_destination');
var Bfunction = require('../lib/models/function');

var fail_expected = function(success, reason) {
	if (success===false) {
		console.log("PASS. Reason="+reason);
	}else {
		console.log("======================== FAIL !!! Test should have failed");
	}
};

var success_expected = function(success, reason) {
	if (success===false) {
		console.log("======================== FAIL !!! Reason="+reason);
	}else {
		console.log("PASS.");
	}
};


// S3 Destination Test
console.log("");
console.log("---> S3 Destination:");
var s3_destination = new S3_destination();
if (s3_destination) console.log("PASS");

s3_destination.key = "foo";
s3_destination.validate(fail_expected);
s3_destination.key = null;
s3_destination.bucket = "/bar";
s3_destination.validate(fail_expected);
s3_destination.key = "foo";
s3_destination.bucket = "/bar";
s3_destination.validate(success_expected);

// Save Test
console.log("");
console.log("---> Save:");
var save = new Save();
if (save) console.log("PASS");

save.validate(fail_expected);
save.image_identifier = "foo";
save.validate(success_expected);

var s3_destination = new S3_destination();
save.s3_destination = s3_destination;
save.validate(fail_expected);
s3_destination.key = "foo";
s3_destination.bucket = "/bar";

// Function Test
console.log("");
console.log("---> Function:");
var bfunction = new Bfunction();
if (bfunction) console.log("PASS");

bfunction.validate(fail_expected);
bfunction.name = "blur";
bfunction.validate(success_expected);
bfunction.addSave("my_identifier", "s3bucket", "s3key");
bfunction.validate(success_expected);
bfunction.addFunction("crop", { width: 10, height: 20 }, "my_image");
bfunction.validate(success_expected);

var failFunction = new Bfunction(); // Test failing subfunction
bfunction.functions.push(failFunction);
bfunction.validate(fail_expected);

// Function Job
console.log("");
console.log("---> Job:");
var job = new Job();
if (job) console.log("PASS");
job.validate(fail_expected);
job.application_id = "My_APP_ID";
job.validate(fail_expected);
job.src = "http://www.some.url";
job.validate(fail_expected);
job.addFunction("crop", { width: 10, height: 20 }, "my_image");
job.validate(success_expected);

// Function Blitline
console.log("");
console.log("---> Blitline:");
var blitline = new Blitline();
if (blitline) console.log("PASS");

var createJob = blitline.addJob("MY_APP_ID", "http://www.some.image");
blitline.postJobs(fail_expected);
createJob.addFunction("crop", { width: 10, height: 20 }, "my_image");
blitline.postJobs(success_expected);















