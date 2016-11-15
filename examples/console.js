

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

var toby = require('../lib/toby.js');
var findHashtags = require('../lib/helpers.js').findHashtags;
var removeHashtags = require('../lib/helpers.js').removeHashtags;

var botId = process.argv[2];
var secret = process.argv[3];

if (!(botId && secret)) {
  console.log("usage: node console.js <botId> <botPassword>");
  process.exit(1);
}

// we successfully connected
function on_connect() {
  console.log("connected!");
  bot.follow([botId]);
  startPrompt();
}

function on_disconnect() {
  console.log("disconnected");
  process.exit(1);
}

// we received a message with a tag we are subscribed to
function on_message(message) {
  process.stdout.write("\b\b\b\breceived >>> " + message.toString() + "\n>>> ");
}

var bot = new toby.Bot(botId, secret, on_connect, on_disconnect, on_message);
bot.start();

function startPrompt() {

  process.stdout.write(">>> ");
  var stdin = process.openStdin();

  stdin.addListener("data", function(d) {
    var str = d.toString().trim();

    if (str) {
		  var payload = {
			 message: removeHashtags(str),
		  }
      bot.send(payload, findHashtags(str), botId);
    }
    process.stdout.write(">>> ");
  });

}
