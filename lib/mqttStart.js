
const
  assert = require('assert'),
  mqtt = require('mqtt');


/**
 * mqttStart - start connection to MQTT broker and register
 * onConnect and onMessage callbacks.
 *
 * @param  {String} botId     the bot's ID
 * @param  {String} secret    the bot's secret
 * @param  {Function} onConnect the callback to run when connection established
 * @param  {Function} onMessage the callback to run when message received
 */
function mqttStart (botId, secret, onConnect, onMessage) {

	  var url = "tcp://toby.cloud";
    var options = {
      port: 444,
      clientId: botId,
      username: botId,
      password: secret,
    };
    mqtt_client = mqtt.connect(url, options);

    // Connected to MQTT broker
    mqtt_client.on('connect', function() {
      mqtt_client.subscribe("client/" + botId + "/#", function(err,res) {
        assert.equal(null,err);
        setTimeout(function() {onConnect()}, 500);
      });
    });
    // Received message on subscribed topic
    mqtt_client.on('message', function(topic, message, packet) {
			try {
				onMessage(topic.split("/").splice(2).join("/"), JSON.parse(message.toString()));
			} catch (SyntaxError) {
				onMessage(topic.split("/").splice(2).join("/"), message.toString());
			}
    });

    // Disconnected from MQTT broker
    mqtt_client.on('close', function() {
      console.log("MQTT broker connection closed.");
      mqtt_client.unsubscribe("#");
      mqtt_client.end();
      process.exit();
    });

		return mqtt_client;
}


module.exports = mqttStart;
