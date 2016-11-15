
const
  mqtt = require('mqtt'),
  assert = require('assert'),
  randomID = require('random-id'),
  mqttStart = require('./mqttStart.js'),
  findHashtags = require('./helpers.js').findHashtags,
  removeHashtags = require('./helpers.js').removeHashtags;


/**
 * TobyBot - Class to abstract connecting to Toby MQTT Broker
 *
 * @param  {String}   id     the bot's ID
 * @param  {String}   sk    the bot's secret
 * @param  {Function} onConnect the callback to run when bot connects
 * @param  {Function} onMessage the callback to run when bot receives a message
 */
function Bot(id, sk, onConnect, onDisconnect, onMessage) {

  // constructor
  var id = id;
  var sk = sk;
  var onConnect = onConnect;
  var onDisconnect = onDisconnect;
  var onMessage = onMessage;
  var mqtt_client = false;

  // start the connection to the MQTT Broker
  this.start = function() {
    mqtt_client = mqttStart(id, sk, onConnect, onDisconnect, onMessage);
  }

  // end the connection
  this.stop = function() {
    mqtt_client.end();
  }

  // send a message
  this.send = function(payload, tags, ack) {
    mqtt_client.publish("server/" + id + "/send", JSON.stringify({payload: payload, tags: tags, ack: ack }));
  }

  // turn hooks on
  this.hooksOn = function(sk, ack) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + id + "/hooks-on", JSON.stringify({sk: sk, ack: ack}));
  };

  // turn hooks off
  this.hooksOff = function(ack) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + id + "/hooks-off", JSON.stringify({ack: ack}));
  };

  // get bot info
  this.info = function(ack) {
    if (!mqtt_client) return console.log("not connected");
    mqtt_client.publish("server/" + id + "/info", JSON.stringify({ack: ack}));
  };

  // create bot
  this.createBot = function(name, password, ack) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      id: name,
      sk: password,
      ack: ack || ""
    };
    mqtt_client.publish("server/" + id + "/create-bot", JSON.stringify(payload));
  };

  // create socket
  this.createSocket = function(persist, ack) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ack: ack || "",
      persist: persist == true
    }
    mqtt_client.publish("server/" + id + "/create-socket", JSON.stringify(payload));
  };

  // remove bot
  this.removeBot = function(targetId, ack) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ack: ack || "",
      id: targetId
    };
    mqtt_client.publish("server/" + id + "/remove-bot", JSON.stringify(payload));
  };

  // remove socket
  this.removeSocket = function(targetId, ack) {
    if (!mqtt_client) return console.log("not connected");
    var payload = {
      ack: ack || "",
      id: targetId
    };
    mqtt_client.publish("server/" + id + "/remove-socket", JSON.stringify(payload));
  };

  // add bot subscriptions
  this.follow = function(tags, ack) {
    if (!mqtt_client) return console.log("can't follow, not connected");
    var payload = {
      tags: tags,
      ack: ack
    };
    mqtt_client.publish("server/" + id + "/follow", JSON.stringify(payload));
  };

  // remove bot subscriptions
  this.unfollow = function(tags, ack) {
    if (!mqtt_client) return console.log("can't unfollow, not connected");
    var payload = {
      tags: tags,
      ack: ack
    };
    mqtt_client.publish("server/" + id + "/unfollow", JSON.stringify(payload));
  };

}

module.exports.Bot = Bot;
