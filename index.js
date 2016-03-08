//"Implementing" the discord.io package to our code
var Discordbot = require('discord.io');
var fs = require('fs');

//Creating our bot object
var bot = new Discordbot({
	email: "",
	password: "",
	autorun: true
});

//JSON stuff
var json;


try {
     //Parsing config.json
     json = JSON.parse(fs.readFileSync("config.json", "utf-8"));
} catch (e){
    throw e;
}

//Shit
var username = "";

//Error event
bot.on("err", function(error) {
    //Log error
	console.log(error)
});

//Ready event
bot.on("ready", function(rawEvent) {
    //Log connected message to console
	console.log("Connected!");
    //Log bot username and ID
	console.log("Logged in as: ");
	console.log(bot.username + " - (" + bot.id + ")");
});

//Message event
bot.on("message", function(user, userID, channelID, message, rawEvent) {
    //Log message and channel to console
	console.log(user + " - " + userID);
	console.log("in " + channelID);
	console.log(message);
	console.log("----------");
    
    
    if (username == ""){ //If other userchain is NOT started
	   if (message == "<@" + bot.id + ">") { //if message is the martian
            if (user != bot.username){
                //Sending ask message
                sendMessages(channelID, ["Yes, " + user + "?"]);
                //Starting the userchain!
                username = user;
            }
	   }
    } else { //If other userchain IS started
        if (user == username){
            sendMessages(channelID, [json[message]]);
            //Clearing userchain
            username = "";
        }
    }
});

//Status change event
bot.on("presence", function(user, userID, status, rawEvent) {
	/*console.log(user + " is now: " + status);*/
    sendMessages(userID, [status]);
});

//Debug event
bot.on("debug", function(rawEvent) {
	/*console.log(rawEvent)*/ //Logs every event
});

//Disconnect event
bot.on("disconnected", function() {
	console.log("Bot disconnected. Trying to reconnect...");
	bot.connect();
});

//Send message function (thanks for guys from discord.io)
function sendMessages(ID, messageArr, interval) {
	var callback, resArr = [], len = messageArr.length;
	typeof(arguments[2]) === 'function' ? callback = arguments[2] : callback = arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;
	
	function _sendMessages() {
		setTimeout(function() {
			if (messageArr[0]) {
				bot.sendMessage({
					to: ID,
					message: messageArr.shift()
				}, function(err, res) {
					if (err) {
						resArr.push(err);
					} else {
						resArr.push(res);
					}
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendMessages();
			}
		}, interval);
	}
	_sendMessages();
}

//Send file function (thanks for guys from discord.io)(left it in because of the purpose of extending stuff)
function sendFiles(channelID, fileArr, interval) {
	var callback, resArr = [], len = fileArr.length;
	typeof(arguments[2]) === 'function' ? callback = arguments[2] : callback = arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;
	
	function _sendFiles() {
		setTimeout(function() {
			if (fileArr[0]) {
				bot.uploadFile({
					to: channelID,
					file: fileArr.shift()
				}, function(err, res) {
					if (err) {
						resArr.push(err);
					} else {
						resArr.push(res);
					}
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendFiles();
			}
		}, interval);
	}
	_sendFiles();
}