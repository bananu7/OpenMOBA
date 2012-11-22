# OpenSource MOBA game #

## No title yet. ##


### Obvious inspirations ###

* League of Legends
* DoTA 1 / DoTA 2
* Blizzard Allstars
* Hawken
* HoN?
* Smite?


### What’s pretty much the same ###

* Many different champions with unique skills
* Items each champion can buy, with limited item slots
* Dominion-like points for judging player performance
* They give more diversity and are easily comparable
* 3D graphics


### What I’d like different ###

* Asymmetrical maps
	* Maps are very hard to balance
	* Require more team-focused play
	* If both teams reach objective, faster wins. If noone reaches objective, it’s a draw.
* Lasthits
	* I’d like players to focus on other things than clicking on minions
* Boring phases of the game, like early farming or mid-game impasse
* More place-oriented map objectives
	* They help focus combat more
* More character development
	* The player should be able to customize the champ he plays with a bit more
	* Maybe consider mech-like gameplay - easier to customize and build from parts
* LAN-friendly
	* Account export from cloud to play on LAN
	* Dedicated server for LAN matchups and tournaments
	* **NO** way of farming experience on LAN matches - they are just for fun
* I’d wish  - web access to champions data etc.
* Launcher either in 3D (like Hawken) or in native OS technology


### What I’m not sure about just yet ###

* Different camera for each champion / while using ultimate
	* People are used to isometrical view
	* Constant view is easier to code
	* Not really fun/usable
* Dedicated item slots
	* Pro : no more 5xLongsword stacking on a fragile elf archer
	* Con : no more 5xLongsword stacking on a fragile elf archer
* Takedowns instead of Kills/Assists
* Monetizing
	* Free to play seems best anyway


### Some technical stuffz ###

* WebGL 3D Engine
	* After some discussion, **Three.js was chosen** due to its powerful features and popularity, whilst still being simple and fast.
* Library for networking
	* ~~Ice library?~~
		* ICE library would require the source code of applications using it to be OpenSource. The client could be opensource, but I doubt the server should.
	* ~~ZeroMQ is released under LGPL, which makes it possible to dynamically link it to the program.~~
		* ZeroMQ JavaScript binding uses Flash for TCP connection.
	* [**Socket.IO**](http://socket.io) - care-free realtime 100% in JavaScript on both server- and client-side
		* Client uses native WebSocket which communicates through TCP
		* Server on [Node.js](http://nodejs.org)
		* Should work on all browsers (including mobile) and without Flash
* ~~Lua for all items, champion abilities and map scripting~~
	* ~~Custom game content TBDecided~~
	* ~~Lua is under MIT licence - no problems here~~
* JSON for all items, champion abilities and map scriptin
	* Custom game content TBDecided
	* JSON is native JS format so will be parsed/loaded much faster than lua/xml
* ~~Shameless steal of SFML window classes?~~
	* ~~Windows, Linux and MacOS out-of-the-box~~
	* ~~SFML has free commercial licence, but it has some LGPL components inside~~
* Interoperability out of the box
	* webGL working on any OS in any webkit browser (best on Chrome) and possibly on other browsers in the future (Firefox and even IE?)

### What I’d like to see in Alpha stage (circa 3 months) ###

* One playable map
* Around 12-14 heroes
* Around 30 items
* Fully working multiplayer

