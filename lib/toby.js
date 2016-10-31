
const
  mqtt = require('mqtt'),
  assert = require('assert'),
  randomID = require('random-id'),
  mqttStart = require('./mqttStart.js'),
  findHashtags = require('./hashtag.js').findHashtags,
  removeHashtags = require('./hashtag.js').removeHashtags;


/**
 * TobyBot - Class to abstract connecting to Toby MQTT Broker
 *
 * @param  {String}   botId     the bot's ID
 * @param  {String}   secret    the bot's secret
 * @param  {Function} onConnect the callback to run when bot connects
 * @param  {Function} onMessage the callback to run when bot receives a message
 */
function Bot(botId, secret, onConnect, onMessage) {

  // constructor
  var botId = botId;
  var secret = secret;
  var onConnect = onConnect;
  var onMessage = onMessage;
  var mqtt_client = false;

  // start the connection to the MQTT Broker
  this.start = function() {
    mqtt_client = mqttStart(botId, secret, onConnect, onMessage);
  }

  // end the connection
  this.end = function() {
    mqtt_client.end();
  }

  // send a message
  this.send = function(message) {
    mqtt_client.publish("server/" + botId + "/send", JSON.stringify(message));
  }

  // turn hooks on
  this.hooksOn = function(hookSecret, ackTag) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + botId + "/hooks-on", JSON.stringify({hookSecret: hookSecret, ackTag: ackTag}));
  };

  // turn hooks off
  this.hooksOff = function(ackTag) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + botId + "/hooks-off", JSON.stringify({ackTag: ackTag}));
  };

  // get bot info
  this.info = function(ackTag) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + botId + "/info", JSON.stringify({ackTag: ackTag}));
  };

  // create bot
  this.createBot = function(name, password, ackTag) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      id: name,
      secret: password,
      ackTag: ackTag || ""
    };
    mqtt_client.publish("server/" + botId + "/create-bot", JSON.stringify(payload));
  };

  // create socket
  this.createSocket = function(persist, ackTag) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ackTag: ackTag || "",
      persist: persist == true
    }
    mqtt_client.publish("server/" + botId + "/create-socket", JSON.stringify(payload));
  };

  // remove bot
  this.removeBot = function(targetId, ackTag) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ackTag: ackTag || "",
      botId: targetId
    };
    mqtt_client.publish("server/" + botId + "/remove-bot", JSON.stringify(payload));
  };

  // remove socket
  this.removeSocket = function(targetId, ackTag) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ackTag: ackTag || "",
      botId: targetId
    };
    mqtt_client.publish("server/" + botId + "/remove-socket", JSON.stringify(payload));
  };

  // add bot subscriptions
  this.follow = function(tags, ackTag) {
    if (!mqtt_client) return console.log("can't follow, not connected");
    var payload = {
      tags: tags,
      ackTag: ackTag
    };
    mqtt_client.publish("server/" + botId + "/follow", JSON.stringify(payload));
  };

  // remove bot subscriptions
  this.unfollow = function(tags, ackTag) {
    if (!mqtt_client) return console.log("can't unfollow, not connected");
    var payload = {
      tags: tags,
      ackTag: ackTag
    };
    mqtt_client.publish("server/" + botId + "/unfollow", JSON.stringify(payload));
  };

  // subscribe to an MQTT topic (admin only)
  this.raw_subscribe = function(topic) {
    mqtt_client.subscribe(topic);
  };

  // publish to an MQTT topic (admin only)
  this.raw_publish = function(topic, payload, callback) {
    mqtt_client.publish(topic, payload);
  };
}

module.exports.Bot = Bot;
