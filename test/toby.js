
const
	expect = require("chai").expect,
	should = require("chai").should,
  request = require('request'),
  toby = require("../lib/bot.js");


var botId = process.argv[3];
var secret = process.argv[4];

if (!(botId && secret)) {
  console.log("usage: npm test <botId> <botPassword>");
  process.exit(1);
}

describe("Bot tests", function() {



})
