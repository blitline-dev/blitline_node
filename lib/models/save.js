var S3Destination = require('./s3_destination');

module.exports = function() {
  this.image_identifier = null;
  this.s3_destination = null;

  this.validate = function(callback) {
    if (!this.image_identifier) {
      callback(false, "Image Identifier must be set in Save object");
      return;
    }else {
      if (this.s3_destination) {
        this.s3_destination.validate(function(success, reason) {
          callback(success, reason);
        });
      }else {
        callback(true);
      }
    }
  };
};
