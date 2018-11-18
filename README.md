Discord bot for recruitment out/in tracker.

 ## Configuration

 - .env should store the DISCORD_BOT_SECRET
 - The file `settings.json` should have an Object with two properties: `channels` is an Array of strings of the channel names (without #) to listen on, and `timeBetweenPings` is a Number of the time in milliseconds between pings to make sure someone is still out.
 - ./run.sh
 - Tested with nodejs version 8 and later

 ## Use

 - Command `.outs` lists the people who are currently out
 - Say `out` to go out
 - Say `in` to come back in

