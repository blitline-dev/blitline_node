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
  
  this.postHttp = function(callback) {
  
    var siteUrl = url.parse("http://www.blitline.com/api/job");
    var site = http.createClient(siteUrl.port || 80, siteUrl.host); 
        
    console.log("---->", JSON.stringify(jobs));
    var reformattedSubmit = { json :  JSON.stringify(jobs)};
    var body = JSON.stringify(reformattedSubmit);
    
    var request = site.request('POST', siteUrl.pathname, { 
        'host' : siteUrl.host,
        'Content-Length': body.length,
        'Content-Type': 'application/json' 
        });
    console.log('BODY SENT: ' + body);
    request.write(body);
    request.end();
    
    request.on('response', function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        callback(chunk);
      });
    });
  };
};