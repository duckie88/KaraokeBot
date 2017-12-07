const Discord = require("discord.js");

const PREFIX = "k.";

var bot = new Discord.Client();

var amounts = [];
var singers = [];
var songs = [];
var bidders = [];
var minIncrease = 500;
var minBid = 2000;
var open = 0;
user1 = "Duckie";
user2 = "Jaxarus";
user3 = "Mockworld";
user4 = "Dwayne";

bot.on('ready', () => {
    console.log(`Ready!`);
});

bot.on('message', message => {
    if (!message.content.startsWith(PREFIX)) {
        return;
    }

    var commands = message.content.substring(PREFIX.length).split(" ");

    switch (commands[0].toLowerCase()) {
        case "open": //begins bidding process
            if (message.author.username == user1 || message.author.username == user2 || message.author.username == user3 || message.author.username == user4) {
                open = 1;
                message.channel.sendMessage("Bidding is now open.");
            }
            else {
                message.channel.sendMessage("You don't have permission to use this command.");
            }
            break;

        case "close": //stops new bids
            if (message.author.username == user1 || message.author.username == user2 || message.author.username == user3 || message.author.username == user4) {
                open = 0;
                message.channel.sendMessage("Bidding is now closed.");
            }
            else {
                message.channel.sendMessage("You don't have permission to use this command.");
            }
            break;

        case "reset": //resets all bids
            if (message.author.username == user1 || message.author.username == user2 || message.author.username == user3 || message.author.username == user4) {
                amounts = [];
                singers = [];
                songs = [];
                bidders = [];
                message.channel.sendMessage("All bids reset!");
            }
            else {
                message.channel.sendMessage("You don't have permission to use this command.");
            }
            break;

        case "help":
            message.channel.sendMessage("Commands Karaoke Bot supports for non-event managers:\n\nk.print\t-Prints current bid list.\nk.bid\t-Allows user to bid on someone to sing. Format: Name Poe Song\n\n\n");
            message.channel.sendMessage("\nEvent manager commands:\n\nk.open\t-Starts bidding process.\nk.close\t-Ends bidding process.\nk.delete\tDeletes a bid. Format k.delete SingerName\nk.mins\t-Sets minimum bid and out-bid values Format: MinBid MinIncrease\nk.reset\t-Resets all bids. Make sure to do this before opening up bidding for a new round of karaoke!");
            break;

        case "print":
            message.channel.sendMessage("Current Minimum Bid is: " + minBid ". Minimum outbid is: " + minIncrease + ".\n\n");
            message.channel.sendMessage("Printing current bid list:\n\nSingers:\tHigh Bid:\tPaid for By:\tSongs:\n");
            for (i = 0; i < singers.length; i++) {
                message.channel.sendMessage(singers[i] + "\t" + amounts[i] + "\t" + bidders[i] + "\t" + songs[i]);
            }
            break;

        case "mins":
            if (message.author.username == user1 || message.author.username == user2 || message.author.username == user3 || message.author.username == user4) {
                if (!(commands[1] && commands[2])) {
                    message.channel.sendMessage("Invalid command format. Proper format is Minimum Bid, Minimum Increase\nExample: k.mins 3000 500");
                    break;
                }
                minBid = parseInt(commands[1], 10);
                minIncrease = parseInt(commands[2], 10);
                message.channel.sendMessage("Minimums updated!");
                break;
            }
            else {
                message.channel.sendMessage("You don't have permission to use this command.");
            }
            break;
            

        case "bid":
            if (open == 0) { //is bidding open?
                message.channel.sendMessage("Bidding is currently closed.");
                break;
            }
            if (!(commands[1] && commands[2] && commands[3])) { //this works
                message.channel.sendMessage("Invalid bid. Format: Name Poe Song. \nExample: k.bid Duckie 2000 How_Far_I'll_Go  \nPlease note the semicolons and lack of spaces in the song name!");
                break;
            }
            if (commands[4]) {
                message.channel.sendMessage("Invalid bid. Format: Name Poe Song. \nExample: k.bid Duckie 2000 How_Far_I'll_Go  \nPlease note the semicolons and *lack of spaces* in the song name!");
                break;
            }
            if (singers.length == 0) { //first bid!
                if (parseInt(commands[2], 10) >= minBid){
                    message.channel.sendMessage("Bid accepted.");
                    amounts.push(parseInt(commands[2], 10));
                    singers.push(commands[1].toLowerCase());
                    songs.push(commands[3]);
                    bidders.push(message.author.username);
                    break;
                }
                else {
                    message.channel.sendMessage("Invalid bid. Minimum bid is currently " + minBid + " poe.");
                    break;
                }
            }
            else {
                for (i = 0; i < singers.length; i++) {
                    if (singers[i] === commands[1].toLowerCase()) { //check for pre-existing bid
                        if (amounts[i] + minIncrease > parseInt(commands[2], 10)) { //new bid is too low
                            message.channel.sendMessage("Invalid bid. Current bid for " + singers[i] + " is " + amounts[i] + ". Minimum increase in bids is currently " + minIncrease + " poe.");
                            return;
                        }
                        else {
                            message.channel.sendMessage("Bid accepted.");
                            amounts[i] = parseInt(commands[2], 10);
                            songs[i] = commands[3];
                            bidders[i] = message.author.username;
                            return;
                        }
                    }
                }
                if (parseInt(commands[2], 10) >= minBid) {
                    message.channel.sendMessage("Bid accepted.");
                    amounts.push(parseInt(commands[2], 10));
                    singers.push(commands[1].toLowerCase());
                    songs.push(commands[3]);
                    bidders.push(message.author.username);
                    return;
                }
                else {
                    message.channel.sendMessage("Invalid bid. Minimum bid is currently " + minBid + " poe.");
                    return;
                }
            }
            break;

        case "delete":
            if (message.author.username == user1 || message.author.username == user2 || message.author.username == user3 || message.author.username == user4) {
                if (!commands[1]) {
                    message.channel.sendMessage("Invalid format. Correct format is k.bids singerName");
                }
                for (i = 0; i < singers.length; i++) {
                    if (singers[i] === commands[1].toLowerCase()) {
                        singers.splice(i, 1);
                        bidders.splice(i, 1);
                        amounts.splice(i, 1);
                        songs.splice(i, 1);
                        message.channel.sendMessage("Bid removed.");
                        return;
                    }
                }
                message.channel.sendMessage("Singer not found.");
            }
            else {
                message.channel.sendMessage("You don't have permission to use this command.");
            }
            break;

        default:
            message.channel.sendMessage("Invalid command, please see k.help");
            break;
    }

});

bot.login(process.env.BOT_TOKEN);
