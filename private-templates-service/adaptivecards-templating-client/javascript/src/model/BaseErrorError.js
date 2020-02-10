/*
 * adaptivecards-templating-service-javascript-sdk
 * Adaptive Cards Templating Service API definition.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.12
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.AdaptivecardsTemplatingServiceJavascriptSdk) {
      root.AdaptivecardsTemplatingServiceJavascriptSdk = {};
    }
    root.AdaptivecardsTemplatingServiceJavascriptSdk.BaseErrorError = factory(root.AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * The BaseErrorError model module.
   * @module model/BaseErrorError
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>BaseErrorError</code>.
   * @alias module:model/BaseErrorError
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>BaseErrorError</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BaseErrorError} obj Optional instance to populate.
   * @return {module:model/BaseErrorError} The populated <code>BaseErrorError</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('code'))
        obj.code = ApiClient.convertToType(data['code'], 'String');
      if (data.hasOwnProperty('message'))
        obj.message = ApiClient.convertToType(data['message'], 'String');
    }
    return obj;
  }

  /**
   * @member {String} code
   */
  exports.prototype.code = undefined;

  /**
   * @member {String} message
   */
  exports.prototype.message = undefined;

  return exports;

}));