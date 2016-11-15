
/** basic.js
 *
 * Basic example
 *
 * usage: `node basic.js <botId> <botPassword>`
 *
 * Connects to Toby using the credentials provided as command line arguments.
 * Sends a message ("Hello world!") every 3 seconds, and disconnects after 30
 * seconds.
 *
 */

var toby = require('../lib/toby.js');
var Message = require('../lib/message.js');

var botId = process.argv[2];
var secret = process.argv[3];

if (!(botId && secret)) {
  console.log("usage: node basic.js <botId> <botPassword>");
  process.exit(1);
}

function onConnect() {
  console.log("connected!");
  toby.info("info");
  //toby.send({"hello":"world"}, [], "asdf");
  toby.follow(["asdf"], "follow");
  toby.follow(["asdf"], "unfollow");
  //toby.createBot("gbot2", "gbot2", "asdf");
  //toby.removeBot("gbot2", "gbot2");
  //toby.createSocket(false, "asdf");
  //toby.removeSocket("AKEyMqSz", "asdf");
  //toby.hooksOn("SeCuRe", "asdf");
  toby.hooksOff("asdf");
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

  }
}

var toby = new toby.Bot(botId, secret, onConnect, onDisconnect, onMessage);

toby.start();

//setTimeout(function() {
//  toby.end();
//}, 60000);
