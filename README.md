
# toby-node

> A node.js Toby helper library.

[![NPM](https://nodei.co/npm/toby.png)](https://nodei.co/npm/toby/)

## Installation

The easiest way to install **toby-node** is from [NPM](https://npmjs.org). You can run
the command below to instally the library:

```bash
npm install toby
```

Or you can [clone the source code](https://github.com/toby-cloud/toby-node.git) for **toby-node**,
and install from there.

```bash
git clone https://github.com/toby-cloud/toby-node.git
cd toby-node
npm install
```

Then in your code:

```javascript
var toby = require("path/to/toby-node");
```

### Testing your installation

Try connecting to Toby with your user bot, like this:

```javascript
var botId = '{{ username }}'; // Your username from toby.cloud
var secret = '{{ password }}'; // Your password from toby.cloud

var toby = require('toby');

// the callback to be executed when connected
function onConnect() {
  console.log("Connected!");
}

// the callback to be executed when message received
function onMessage(from, message) {
  console.log("message received:", from, message);
}

var bot = new toby.Bot(botId, secret, onConnect, onMessage);
bot.start();
```
