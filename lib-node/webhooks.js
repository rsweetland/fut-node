"use strict";

var _util = require("./util");

var _unixTimestamp = require("unix-timestamp");

var _unixTimestamp2 = _interopRequireDefault(_unixTimestamp);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  /*
   *  Validates webhook signature. Set verifyAge to false when testing / mocking HTTP requests
   *  (Node only) - The core API posts webhooks to extensions as one of the main functions. This is obviously server-side only.
   */
  validateWebhook: function validateWebhook(webhookSignature, webhookTimestamp, rawBody) {
    var verifyAge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var generatedSig = _crypto2.default.createHmac("sha256", webhookTimestamp + this.config.clientSecret).update(rawBody).digest("hex");
    (0, _util.debug)("validateWebhook: rawBody", rawBody);
    (0, _util.debug)("validateWebhook: clientSecret", this.config.clientSecret);
    (0, _util.debug)("validateWebhook: generatedSig", generatedSig);
    (0, _util.debug)("validateWebhook: webhookSig", webhookSignature);
    if (generatedSig !== webhookSignature) return false;

    var hookAge = _unixTimestamp2.default.now() - webhookTimestamp;
    if (hookAge > 900 && verifyAge) {
      (0, _util.debug)("validateWebhook: failed age check: ", hookAge);

      return false;
    }
    (0, _util.debug)("validateWebhook: webhook validated!");
    return true;
  }
};