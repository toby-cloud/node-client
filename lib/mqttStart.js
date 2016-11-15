
const
  assert = require('assert'),
  mqtt = require('mqtt'),
  Message = require('./message.js');


/**
 * mqttStart - start connection to MQTT broker and register
 * onConnect and onMessage callbacks.
 *
 * @param  {String} botId     the bot's ID
 * @param  {String} secret    the bot's secret
 * @param  {Function} onConnect the callback to run when connection established
 * @param  {Function} onDisconnect the callback to run when connection broken
 * @param  {Function} onMessage the callback to run when message received
 */
function mqttStart (botId, secret, onConnect, onDisconnect, onMessage) {

  var url = "tcp://104.196.223.85";
	//var url = "tcp://toby.cloud";
	//var url = "tcp://localhost";
    var options = {
      port: 444,
      clientId: botId,
      username: botId,
      password: secret,
    };
    mqtt_client = mqtt.connect(url, options);

    // Connected to MQTT broker
    mqtt_client.on('connect', function() {
      mqtt_client.subscribe("client/" + botId, function(err,res) {
        assert.equal(null,err);
        setTimeout(function() {onConnect()}, 500);
      });
    });
    // Received message on subscribed topic
    mqtt_client.on('message', function(topic, buffer, packet) {
      obj = JSON.parse(packet.payload.toString());
      onMessage(new Message(obj.from, obj.payload, obj.tags, obj.ack));
    });

    // Disconnected from MQTT broker
    mqtt_client.on('close', function() {
      mqtt_client.end();
      onDisconnect();
    });

		return mqtt_client;
}


module.exports = mqttStart;
