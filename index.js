const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_BOT_SECRET;
const channels = require('./channels.json');
const regout = /^[^A-Za-z]*out+[^A-Za-z]*$/i;
const regin = /^[^A-Za-z]*in+[^A-Za-z]*$/i;
const regyes = /^[^A-Za-z]*yes+[^A-Za-z]*$/i;
const regno = /^[^A-Za-z]*no+[^A-Za-z]*$/i;
const outs = [];
const timeBetweenPings = 1000 * 60 * 30;

function getOut(auid, chid) {
    let theOneInTheOuts = null;
    outs.forEach(outt => {
        if (outt.who.id == auid && outt.where.id == chid) {
            theOneInTheOuts = outt;
        }
    });
    return theOneInTheOuts;
}

function itsTime(ou) {
  let toot = getOut(ou.who.id, ou.where.id);
  if(toot != null) {
    if(toot.tries > 0) {
      ou.where.send("Due to no response, assuming " + userMention(msg.author) + " is IN.");
      outs.splice(toot, 1);
    }
    else {
      ou.where.send("Hey " + userMention(msg.author) + " are you still out? Reply yes or no, please!");
      setTimeout(itsTime, timeBetweenPings, ou);
    }
    toot.tries = toot.tries + 1;
  }
}

function userMention(uzer) {
  return "<@" + uzer.id + ">";
}

client.on('ready', () => {
    console.log("I'm in");
    console.log(client.user.username);
});

client.on('message', msg => {
    if (msg.author.id != client.user.id && channels.includes(msg.channel.name)) {
        //console.log('Received msg in ' + msg.channel.name);
        let o = getOut(msg.author.id, msg.channel.id);
        if (msg.content.match(regout) != null && o == null) {
          let poosh = {
              who: msg.author,
              where: msg.channel,
              when: (new Date().getTime()),
              tries: 0
          };
          outs.push(poosh);
          poosh.timeout = setTimeout(itsTime, timeBetweenPings, poosh);
          msg.channel.send("Recognized " + userMention(msg.author) + " went out!");
        }
        else if (msg.content.match(regin) != null && o != null) {
          msg.channel.send("Recognized " + userMention(msg.author) + " came in!");
          outs.splice(o, 1);
        }
        else if(msg.content.match(regno) != null) {
          msg.channel.send("Recognized " + userMention(msg.author) + " came in!");
          outs.splice(o, 1);
        }
        else if(msg.content.match(regyes) != null) {
          msg.channel.send("Keeping " + userMention(msg.author) + " out!");
	  o.timeout = setTimeout(itsTime, timeBetweenPings, o);
        }
        else if(msg.content.trim().toLowerCase() == ".outs") {
          let theMsg = "Currently out on a run: ";
          outs.forEach(outt => {
            theMsg += outt.who.username + " ";
          });
          msg.channel.send(theMsg);
        }
    }
});

client.login(token);
