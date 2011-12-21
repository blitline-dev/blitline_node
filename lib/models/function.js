var Save = require('./save');
var S3Destination = require('./s3_destination');

var BlitlineFunction = module.exports = function() {
  this.name = null;
  this.params = null;
  this.save = null;
  this.functions = null;
  
  this.addFunction = function(function_name, params, image_identifier) {
    var blitlineFunction = new BlitlineFunction();
    blitlineFunction.name = function_name;
    blitlineFunction.params = params;
    if (image_identifier) {
      var save = new Save();
      save.image_identifier = image_identifier;
      blitlineFunction.save = save;
    }
    if (this.functions === null) {
      this.functions = [];
    }
    this.functions.push(blitlineFunction);
    return blitlineFunction;
  };
  
  this.addSave = function(image_identifier, s3Bucket, s3Key) {
    /* S3Bucket and S3Key are optional, only for use if Blitline
    is pushing to your bucket and you have given Blitline permission
    to write to that bucket */
    
    var save = new Save();
    save.image_identifier = image_identifier;
    if (s3Bucket && s3Key) {
      var s3Destination = new S3Destination();
      s3Destination.bucket = s3Bucket;
      s3Destination.key = s3Key;
      save.s3_destination = s3Destination;
    }
    
    this.save = save;
  };
  
  this.validate = function(callback) {
    var subFunctionCallbackValue = true;
    var subFunctionCallbackReason = [];
    var subFunctionCount = 0;
    var _this = this;

    var subFunctionCallbackHandler = function(success, reason) {
      if (!success) {
        subFunctionCallbackValue = false;
        subFunctionCallbackReason.push(reason);
      }
      subFunctionCount += 1;
      if (subFunctionCount == _this.functions.length) {
        callback(subFunctionCallbackValue, subFunctionCallbackReason.join(","));
      }
    };
    
    if (!this.name) {
      callback(false, "Function must have a name");
      return;
    }else {
      if (this.save) {
        this.save.validate(function(success, reason) {
          if (success) {
            if (_this.functions) {
              _this.functions.forEach(function(subFunction) {
                subFunction.validate(subFunctionCallbackHandler);
              });
              return;
            }
          }
          callback(success, reason);
        });
      }else {
        callback(true);
      }
    }
  };
  
  
};
