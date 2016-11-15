
const
  helpers = require("./helpers.js"),
  isArray = helpers.isArray,
  isString = helpers.isString,
  isJsonObject = helpers.isJsonObject,
  isJsonString = helpers.isJsonString;


function Message(from, payload, tags, ack) {
  this.setFrom(from);
  this.setPayload(payload);
  this.setTags(tags);
  this.setAck(ack);
}

Message.prototype.getPayload = function() {
  return this._payload;
}
Message.prototype.getFrom = function() {
  return this._from;
}
Message.prototype.getTags = function() {
  return this._tags;
}
Message.prototype.getAck = function() {
  return this._ack;
}

Message.prototype.setPayload = function(payload) {
  if (isJsonObject(payload)) {
    this._payload = JSON.parse(JSON.stringify(payload)); // this gets rids of [Function: ]
    return true;
  } else {
    this._payload = {}
    return false;
  }
}

Message.prototype.setFrom = function(sender) {
  if (isString(sender)) {
    this._from = sender;
    return true;
  } else {
    this._from = "";
    return false;
  }
}

Message.prototype.setAck = function(ack) {
  if (isString(ack)) {
    this._ack = ack;
    return true;
  } else {
    this._ack = "";
    return false;
  }
}

Message.prototype.setTags = function(tags) {
  if (isArray(tags)) {
    this._tags = tags;
    return true;
  } else {
    this._tags = [];
    return false;
  }
}

Message.prototype.isValid = function() {
  return isString(this._from) && isJsonObject(this._payload) && isArray(this._tags) && isString(this._ack);
}

Message.prototype.validate = function() {
  this.setFrom(this._from);
  this.setPayload(this._payload);
  this.setTags(this._tags);
  this.setAck(this._ack);
}

Message.prototype.toString = function() {
  return JSON.stringify({
    from: this._from,
    payload: this._payload,
    tags: this._tags,
    ack: this._ack
  });
}

module.exports = Message;
