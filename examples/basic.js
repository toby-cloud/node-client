
/** basic.js
 *
 * Basic example
 *
 * usage: `node basic.js <botId> <botPassword>`
 *
 * Connects to Toby using the credentials provided as command line arguments.
 * Uncomment methods in onConnect() to test things out.
 */

var toby = require('../lib/toby.js');
var Message = require('../lib/message.js');

var id = process.argv[2];
var sk = process.argv[3];

if (!(id && sk)) {
  console.log("usage: node basic.js <botId> <botSk>");
  process.exit(1);
}

function onConnect() {
  console.log("connected!");
  bot.info("info");
  bot.send({"hello":"world"}, [], "asdf");
  //bot.follow(["asdf"], "follow");
  //bot.follow(["asdf"], "unfollow");
  //bot.createBot("gbot2", "gbot2", "asdf");
  //bot.removeBot("gbot2", "gbot2");
  //bot.createSocket(false, "asdf");
  //bot.removeSocket("AKEyMqSz", "asdf");
  //bot.hooksOn("SeCuRe", "asdf");
  //bot.hooksOff("asdf");
}

function onDisconnect() {

}

function onMessage(message) {
  var tag = message.getTags()[0];
  var payload = message.getPayload();
  switch(tag) {
    case "info":
      console.log("Bot info:", payload); break;
    case "follow":
      if (payload.status == 200) console.log("Subscription successful.");
      else console.log("Subscription failed.");
      break;
    case "unfollow":
      if (payload.status == 200) console.log("Unsubscription successful.");
      else console.log("Unsubscription failed.");
      break;
    default:
      if ('message' in payload) {
        console.log("@" + message.getFrom() + ": " + payload['message']);
          bot.send({"message":"hello world"}, [], "asdf");

      }
  }
}

var bot = new toby.Bot(id, sk, onConnect, onDisconnect, onMessage);
bot.start();
