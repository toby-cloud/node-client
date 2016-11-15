
const
  expect = require("chai").expect,
  should = require("chai").should,
  request = require('request'),
  toby = require("../lib/toby.js");

URL = "http://104.196.223.85:8080";

var botId = process.argv[process.argv.length-2];
var secret = process.argv[process.argv.length-1];

if (!(botId && secret)) {
  console.log("usage: npm test <botId> <botPassword>");
  process.exit(1);
}

console.log("credentials", botId, secret);

describe("Bot tests", function() {

  var userbot, userbotId = botId, userbotSk = secret;
  var testbot, testbotId = "testbot" + String(Date.now()), testbotSk = "sUpErsEcUrE";
  var socketbot, socketbotId, socketbotSk;

  it("connects to broker", function (done) {

    var onConnect = function() {
      userbot.stop();
      done();
    }

    var onDisconnect = function () {}
    var onMessage = function () {}

    userbot = new toby.Bot(userbotId, userbotSk, onConnect, onDisconnect, onMessage);
    userbot.start();
  });

  it("can get user bot info", function(done) {

    var onConnect = function() {
      userbot.info("info");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["info"]);
      expect(message.getPayload()["type"]).to.equal("user");
      userbot.stop();
      done();
    }
    var userbot = new toby.Bot(userbotId, userbotSk, onConnect, onDisconnect, onMessage);
    userbot.start();

  });

  it("can create standard bot", function(done) {

    var onConnect = function() {
      userbot.createBot(testbotId, testbotSk, "created");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["created"]);
      expect(message.getPayload()["status"]).to.equal(200);
      userbot.stop();
      done();
    }
    var userbot = new toby.Bot(userbotId, userbotSk, onConnect, onDisconnect, onMessage);
    userbot.start();

  });

  it("user bot gets notification when standard bot goes online, sends message, and goes offline", function(done) {

    var count = 0;

    var onConnect = function() {
      testbot = new toby.Bot(testbotId, testbotSk, function(){}, function(){}, function(){});
      testbot.start();
    }
    var onDisconnect = function () {}

    var onMessage = function (message) {
      if (count == 0) {
        count += 1;
        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal([]);
        expect(message.getPayload()).to.deep.equal({online: testbotId});
        testbot.send({"hi":"there"}, ["good", "stuff"], "ackMe");
      } else if (count == 1) {
        count += 1
        expect(message.getFrom()).to.equal(testbotId);
        expect(message.getAck()).to.equal("ackMe");
        expect(message.getTags()).to.deep.equal(["good", "stuff"]);
        expect(message.getPayload()).to.deep.equal({hi: "there"});
        testbot.stop();

      } else if (count == 2){

        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal([]);
        expect(message.getPayload()).to.deep.equal({offline: testbotId});
        userbot.stop();
        done();
      }

    }

    userbot = new toby.Bot(userbotId, userbotSk, onConnect, onDisconnect, onMessage);
    userbot.start();

  });


  it("can get standard bot info", function(done) {

    var onConnect = function() {
      testbot.info("standard info");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["standard info"]);
      expect(message.getPayload()["subscriptions"]).to.deep.equal([]);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can follow with standard bot", function(done) {

    var onConnect = function() {
      testbot.follow(["standard1", "standard2"], "followed");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal(["followed"]);
        expect(message.getPayload()["status"]).to.equal(200);
        testbot.stop();
        done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("successfully followed tags", function(done) {

    var onConnect = function() {
      testbot.info("standard");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["standard"]);
      expect(message.getPayload()["subscriptions"]).to.deep.equal(["standard2", "standard1"]);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can unfollow with standard bot", function(done) {

    var onConnect = function() {
      testbot.unfollow(["standard1"], "unfollowed");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal(["unfollowed"]);
        expect(message.getPayload()["status"]).to.equal(200);
        testbot.stop();
        done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("successfully unfollowed tags", function(done) {

    var onConnect = function() {
      testbot.info("standard");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["standard"]);
      expect(message.getPayload()["subscriptions"]).to.deep.equal(["standard2"]);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can turn hooks on", function(done) {
    var onConnect = function() {
      testbot.hooksOn("hookSecret", "hooks on");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["hooks on"]);
      expect(message.getPayload()["status"]).to.equal(200);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can receive hook requests", function(done) {
    var onConnect = function() {
      request.post(URL + "/hook/" + testbotId + "/hookSecret",
        {form: {hello: 'world'}},
        function(err, res, body) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
        }
      );
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("hook");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal([]);
      expect(message.getPayload()).to.deep.equal({hello: "world"});
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can turn hooks off", function(done) {
    var onConnect = function() {
      testbot.hooksOff("hooks off");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["hooks off"]);
      expect(message.getPayload()["status"]).to.equal(200);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can create socket bot", function(done) {
    var onConnect = function() {
      testbot.createSocket(true, "socket");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["socket"]);
      socketbotId = message.getPayload()["id"];
      socketbotSk = message.getPayload()["sk"];
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("standard bot gets notification when socket bot goes online and offline", function(done) {

    var firstMessage = true;

    var onConnect = function() {
      socketbot = new toby.Bot(socketbotId, socketbotSk, function(){}, function(){}, function(){});
      socketbot.start();
    }
    var onDisconnect = function () {}

    var onMessage = function (message) {
      if (firstMessage) {
        firstMessage = false;
        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal([]);
        expect(message.getPayload()).to.deep.equal({online: socketbotId});
        socketbot.stop();
      } else {
        expect(message.getFrom()).to.equal("server");
        expect(message.getAck()).to.equal("");
        expect(message.getTags()).to.deep.equal([]);
        expect(message.getPayload()).to.deep.equal({offline: socketbotId});
        testbot.stop();
        done();
      }
    }

    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();
  });

  it("can remove socket bot", function(done) {

    var onConnect = function() {
      testbot.removeSocket(socketbotId, "removed");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["removed"]);
      expect(message.getPayload()["status"]).to.equal(200);
      testbot.stop();
      done();
    }
    testbot = new toby.Bot(testbotId, testbotSk, onConnect, onDisconnect, onMessage);
    testbot.start();

  });

  it("can remove standard bot", function(done) {

    var onConnect = function() {
      userbot.removeBot(testbotId, "removed");
    }

    var onDisconnect = function () {}

    var onMessage = function(message) {
      expect(message.getFrom()).to.equal("server");
      expect(message.getAck()).to.equal("");
      expect(message.getTags()).to.deep.equal(["removed"]);
      expect(message.getPayload()["status"]).to.equal(200);
      userbot.stop();
      done();
    }
    userbot = new toby.Bot(userbotId, userbotSk, onConnect, onDisconnect, onMessage);
    userbot.start();

  });


});
