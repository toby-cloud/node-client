
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

var tobyBot = require('../libs/TobyBot.js');

var botId = process.argv[2];
var secret = process.argv[3];

if (!(botId && secret)) {
  console.log("usage: node basic.js <botId> <botPassword>");
  process.exit(1);
}

function onConnect() {
  console.log("connected!");
  setInterval(function() {
    toby.send({
      message: "Hello world!",
      messageType: "TEXT",
      tags: ["example"],
      ackTag: "ackTag"
    });
  }, 3000);
}

function onMessage() {
  console.log(from,JSON.stringify(message));
}

var toby = new tobyBot(botId, secret, onConnect, onMessage;

toby.start();

setTimeout(function() {
  toby.end();
}, 30000);
