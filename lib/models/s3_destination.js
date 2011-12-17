module.exports = function() {
  this.key = null;
  this.bucket = null;
  
  this.validate =function(callback) {
    if (!this.key || !this.bucket) {
      callback(false, "S3 Destination must have key and bucket values set");
      return;
    }
    callback(true);
  };
  
};

