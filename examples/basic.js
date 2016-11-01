
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
      tags: [],
      ackTag: "ackTag"
    });
  }, 3000);
}

function onMessage(from, message) {
  console.log(from,JSON.stringify(message));
}

var toby = new toby.Bot(botId, secret, onConnect, onMessage);

toby.start();

//setTimeout(function() {
//  toby.end();
//}, 60000); 
