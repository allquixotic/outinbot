Discord bot for recruitment out/in tracker.

 ## Configuration

 - .env should store the DISCORD_BOT_SECRET
 - The file `settings.json` should have an Object with two properties: `channels` is an Array of strings of the channel names (without #) to listen on, and `timeBetweenPings` is a Number of the time in milliseconds between pings to make sure someone is still out.
 - ./run.sh
 - Tested with nodejs version 8 and later
 
 Example settings.json:
 
 ```
 {
 "timeBetweenPings": 1800000
 "channels": ["foo"]
 }
 ```

 ## How To Use

 - Command `.outs` lists the people who are currently out.
 - Say `out` to go out.
 - Say `in` to come back in.
 - Every `timeBetweenPings` minutes (default: 30 minutes), the bot will ask you if you're still out, pinging you.
 - When prompted by the bot, reply "yes" to stay out for another `timeBetweenPings` minutes (default: 30 minutes).
 - Reply "no" to the bot to effectively come in (same thing as typing "in").
 - You can also reply with a number after "yes". For example: `yes 60` will keep the bot from bugging you again for 60 minutes.

