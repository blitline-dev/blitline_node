/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Module dependencies.
 */

// models
var Job = require('./models/job');
var S3 = require('./models/s3_destination');
var http = require('http');
var url = require('url');
/**
 * Exports.
 */
 
module.exports = function() {
  var jobs = [];
  
  this.addJob = function(application_id, src) {
    var job = new Job();
    job.application_id = application_id;
    job.src = src;
    jobs.push(job);
    return job;
  };
  
  this.postJobs = function(callback) {
    var siteUrl = url.parse("http://api.blitline.com/job");
    var site = http.createClient(siteUrl.port || 80, siteUrl.host);
    
    validate(function(success, reason) {
      if (success) {
        var reformattedSubmit = { json :  JSON.stringify(jobs)};
        var body = JSON.stringify(reformattedSubmit);
        
        var request = site.request('POST', siteUrl.pathname, {
            'host' : siteUrl.host,
            'Content-Length': body.length,
            'Content-Type': 'application/json'
            });
        request.write(body);
        request.end();
        
        request.on('response', function (response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            callback(chunk);
          });
        });
      }else {
        callback(false, reason);
      }
    });
  };

  function validate(callback) {
    if (jobs.length === 0) {
      throw "No jobs created";
    }

    var subJobCallbackValue = true;
    var subJobCallbackReason = [];
    var subJobCount = 0;
    var subJobCallbackHandler = function(success, reason) {
      if (!success) {
        subJobCallbackValue = false;
        subJobCallbackReason.push(reason);
      }
      subJobCount += 1;
      if (subJobCount == jobs.length) {
        callback(subJobCallbackValue, subJobCallbackReason.join(","));
      }
    };

    jobs.forEach(function(job){
      job.validate(subJobCallbackHandler);
    });

  }
  
};