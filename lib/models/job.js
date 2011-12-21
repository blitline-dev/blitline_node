var BlitlineFunction = require('./function');
var Save = require('./save');

module.exports = function() {
  this.application_id = null;
  this.src = null;
  this.postback_url = null;
  this.functions = [];
  
  this.addFunction = function(function_name, params, image_identifier) {
    var blitlineFunction = new BlitlineFunction();
    blitlineFunction.name = function_name;
    blitlineFunction.params = params;
    if (image_identifier) {
      var save = new Save();
      save.image_identifier = image_identifier;
      blitlineFunction.save = save;
    }
    this.functions.push(blitlineFunction);
    return blitlineFunction;
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
      if (subFunctionCount === _this.functions.length) {
        callback(subFunctionCallbackValue, subFunctionCallbackReason.join(", "));
      }
    };
    
    if (!this.application_id || !this.src || this.functions.length === 0) {
      var success = false;
      var reason = [];
      if (!this.application_id) { reason.push("Application ID must be set in Job");}
      if (!this.src) { reason.push("Src must be set in Job");}
      if (this.functions.length === 0) { reason.push("You must have at least one function set on Job");}

      callback(false, reason.join(", "));
      return;
    }else {
      this.functions.forEach(function(subFunction) {
        subFunction.validate(subFunctionCallbackHandler);
      });
    }
  };
};
