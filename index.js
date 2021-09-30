const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_BOT_SECRET;
const settings = require('./settings.json') || {};
const channels = settings.channels || ["missionaries"];
const regout = /^[^A-Za-z]*out+\s*(\d+)?[^A-Za-z]*$/i;
const regin = /^[^A-Za-z]*in+[^A-Za-z]*$/i;
const regyes = /^[^A-Za-z]*yes+\s*(\d+)?[^A-Za-z]*$/i;
const regno = /^[^A-Za-z]*no+[^A-Za-z]*$/i;
var outs = [];
const timeBetweenPings = settings.timeBetweenPings || 1000 * 60 * 30;

function getOut(auid, chid) {
  let theOneInTheOuts = null;
  outs.forEach(outt => {
    if (outt.who.id == auid && outt.where == chid) {
      theOneInTheOuts = outt;
    }
  });
  return theOneInTheOuts;
}

function rm(elt) {
  outs = outs.filter(item => !(item.who.id == elt.who.id && item.where.id == elt.where.id));
}

function itsTime(ou) {
  let toot = getOut(ou.who.id, ou.where.id);
  if (toot != null) {
    if (toot.tries > 0) {
      ou.where.send("Due to no response, assuming " + userMention(toot.who) + " is IN.");
      rm(toot);
    }
    else {
      ou.where.send("Hey " + userMention(toot.who) + " are you still out? Reply yes or no within " + (timeBetweenPings / 60000) + " minutes, please!");
      ou.timeout = setTimeout(itsTime, timeBetweenPings, ou);
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
      let tbp = msg.content.match(regout)[1] || (timeBetweenPings / 60000);
      let poosh = {
        who: msg.author,
        where: msg.channel,
        when: (new Date().getTime()),
        timerStarted: (new Date().getTime()),
        tries: 0
      };
      outs.push(poosh);
      poosh.timeout = setTimeout(itsTime, tbp * 60000, poosh);
      msg.channel.send(userMention(msg.author) + " is out; will ping you in " + tbp + " minutes.");
    }
    else if ((msg.content.match(regin) != null || msg.content.match(regno) != null) && o != null) {
      msg.channel.send(userMention(msg.author) + " came in!");
      rm(o);
      if (o != null && o.timeout != null)
        clearTimeout(o.timeout);
    }
    else if (msg.content.match(regyes) != null && o != null) {
      let ll = msg.content.match(regyes)[1] || timeBetweenPings / 60000;
      msg.channel.send("Keeping " + userMention(msg.author) + " out! Pinging you back in " + ll + " minutes.");
      if (o.timeout != null)
        clearTimeout(o.timeout);
      o.timeout = setTimeout(itsTime, ll * 60000, o);
      o.timerStarted = (new Date().getTime());
      o.tries = 0;
    }
    else if (msg.content.trim().toLowerCase() == ".outs") {
      let theMsg = "Currently out on a run: ";
      outs.forEach(outt => {
        if(outt.where == msg.channel.id) {
        theMsg += outt.who.username + " out since " + new Date(outt.when).toLocaleString("en-us", { timeZone: "America/New_York" }) + ", next ping in " +
          Math.ceil((new Date(((outt.timerStarted + outt.timeout._idleTimeout) - new Date().getTime())) / 60000)) + " minutes. ";
        };
      });
      msg.channel.send(theMsg);
    }
  }
});

client.on('error', console.error);
client.login(token);
