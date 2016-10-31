

/** console.js
 *
 * usage: `node console.js <botId> <botPassword>`
 *
 * Simple console application to connect and interact with your bots.
 *
 */


//
// Simple example showing how to connect a bot to Toby.
// Replace botId and secret with your bot's credentials.
//

var ClientBot = require('../libs/TobyBot.js');
var findHashtags = require('../libs/hashtag.js').findHashtags;
var removeHashtags = require('../libs/hashtag.js').removeHashtags;

var botId = process.argv[2];
var secret = process.argv[3];

if (!(botId && secret)) {
  console.log("usage: node console.js <botId> <botPassword>");
  process.exit(1);
}

// we successfully connected
function on_connect() {
  console.log("connected!");
  client.follow([botId], function() {
    console.log("followed" + botId)
  });

  startPrompt();
}

// we received a message with a tag we are subscribed to
function on_message(from, message) {
  if (from == "@hook") {
    process.stdout.write("\b\b\b\b" + from + " " + JSON.stringify(message) + "\n>>> ");
  } else {
    process.stdout.write("\b\b\b\b" + from + " " + message.message + "\n>>> ");
  }

  if (message.ackTag) {
    var payload = {
      message: "I received your message: " + message.message,
      messageType: "TEXT",
      tags: [message.ackTag],
    }
    //client.send(payload);
  }
}

var client = new ClientBot(botId, secret, on_connect, on_message);
client.start();

function startPrompt() {

  process.stdout.write(">>> ");
  var stdin = process.openStdin();

  stdin.addListener("data", function(d) {
    var str = d.toString().trim();

    if (str) {
		    var payload = {
			   message: removeHashtags(str),
			   messageType: "TEXT",
			   tags: findHashtags(str),
               ackTag: botId
		  }

      client.send(payload);
    }
    process.stdout.write(">>> ");
  });

}
