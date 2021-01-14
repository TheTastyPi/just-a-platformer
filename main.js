/*/
TODO 
- multi-jump section
- speed section
- wall jump section
- final section
- secret section? :o
/*/

var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
var player = {
	spawnPoint: newSave(),
	levelCoord: [0,0],
	get currentLevel() {return worldMap[player.levelCoord[0]][player.levelCoord[1]]},
	x: 0,
	y: 0,
	xv: 0,
	yv: 0,
	g: 325,
	canWalljump: false,
	currentJumps: 0,
	maxJumps: 1,
	moveSpeed: 600,
	triggers: [],
	godMode: false
};
const control = {
	left: false,
	right: false,
};
const worldMap = [
	[34,33,23,22,21,18,17, 0],
	[35,32,24,25,20,19,16, 1],
	[36,31,30,26,13,14,15, 2],
	[37,38,29,27,12, 5, 4, 3],
	[40,39,28,10,11, 6, 0, 0],
	[ 0, 0, 9, 8, 4, 7, 0, 0]
]
const levels = [
	[
		[1,1,1,1,1,1,1,1],
		[1,0,0,0,0,1,0,1],
		[1,0,0,1,0,1,0,1],
		[1,0,1,1,0,1,0,1],
		[1,0,0,1,0,1,0,1],
		[1,0,0,0,0,1,0,1],
		[1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,[-1,0],1],
		[1,0,0,0,1],
		[1,0,0,1,1],
		[1,0,1,1,1],
		[1,0,0,1,1],
		[1,0,0,0,1],
		[1,1,1,[-1,0],1]
	],
	[
		[0,0,1,[-1,0],1],
		[1,1,1,3,1],
		[1,0,0,0,1],
		[1,0,0,1,1],
		[1,0,0,2,1],
		[1,0,0,1,1],
		[1,0,0,0,1],
		[1,1,1,0,1],
		[0,0,1,[-1,0],1]
	],
	[
		[1,[-1,0],1,0],
		[1,0,1,1],
		[1,0,0,[-1,0]],
		[1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,0],0,0,0,0,0,0,0,0,0,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1],
		[[-1,0],0,0,0,0,5,1],
		[1,1,[-1,0],1,1,1,1]
	],
	[
		[0,0,1,[-1,0],1],
		[1,1,1,0,1],
		[1,0,0,0,1],
		[1,0,0,0,5],
		[1,0,0,0,1],
		[1,0,1,1,1],
		[1,[-1,0],1,0,0]
	],
	[
		[1,1,[-1,0],1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,1,3,1],
		[1,0,1,0,2,0,1,0,0,1],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,2,0,1,0,1,0,1],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,0,1,0,0,0,0,5],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,1,0,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,[-1,0],1,1,[-1,1,-1,-1],1,1,1,1],
		[1,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,5,0,0,1],
		[1,0,0,0,0,0,0,1,0,1],
		[1,1,1,1,0,0,0,0,0,5],
		[[-1,0],0,0,0,0,3,1,0,0,[-1,0]],
		[1,1,1,1,0,0,0,0,0,5],
		[1,0,0,0,0,0,0,1,0,1],
		[1,0,0,0,0,0,5,0,0,1],
		[1,0,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,1],
		[1,1,2,1,1,2,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1],
		[[-1,0],0,0,1,0,0,[-1,0,0,1]],
		[1,0,0,1,0,0,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,0],
		[1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[[-1,0],0,0,0,0,0,6,0,1],
		[[-1,1],0,0,0,0,0,6,0,1],
		[[-1,2],0,0,0,0,0,6,0,1],
		[1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,[-1,0],1,1,1],
		[1,0,0,0,[-1,0]],
		[1,0,0,0,[-1,1]],
		[1,0,0,0,[-1,2]],
		[1,1,1,1,1]
	],
	[
		[1,1,1,1,[-1,0],1],
		[1,2,0,0,0,1],
		[1,2,0,1,0,1],
		[1,2,0,0,0,1],
		[1,2,5,0,0,1],
		[1,2,0,0,0,1],
		[1,1,0,0,0,1],
		[1,3,0,0,0,1],
		[1,[-1,0],1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[1,1,1,2,0,0,0,0,1],
		[1,1,1,1,0,1,1,0,1],
		[[-1,0],0,0,2,0,1,0,0,1],
		[1,2,0,1,0,2,0,0,1],
		[1,1,0,0,0,2,1,0,1],
		[1,1,1,1,5,0,0,0,1],
		[0,0,0,1,3,0,1,1,1],
		[0,0,0,1,[-1,0],1,1,1,1]
	],
	[
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,0,0,0,1,0,2,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
		[[-1,0],0,0,1,0,1,0,0,0,1,0,1,0,2,0,1,0,2,0,1,3,1],
		[1,1,0,2,0,1,0,2,0,1,0,1,0,0,0,1,0,1,0,1,0,[-1,0]],
		[0,1,0,1,0,0,0,1,0,0,0,2,0,1,0,2,0,0,0,1,0,1],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,[-1,0],1],
		[1,0,7,0,0,0,0,0,1],
		[1,0,7,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,[-1,0],1],
		[1,1,2,1,1,7,1],
		[1,1,0,1,2,0,1],
		[1,0,0,0,1,0,1],
		[1,0,1,0,0,0,1],
		[1,0,1,1,0,2,1],
		[1,6,1,1,1,1,1],
		[1,0,1,2,1,1,1],
		[1,0,1,0,1,1,1],
		[0,0,0,0,0,2,1],
		[0,0,0,0,0,1,1],
		[1,0,0,5,0,3,1],
		[1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[2,0,0,6,0,0,6,0,1],
		[2,0,0,0,0,0,6,0,[-1,0]],
		[2,0,0,6,0,0,0,0,1],
		[2,0,0,1,1,1,1,1,1],
		[2,0,0,0,0,0,0,6,1],
		[2,0,0,0,0,0,0,1,1],
		[2,0,0,7,0,0,0,3,1],
		[1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,0],8,0,0,0,0,0,0,0,0,0,0,0,3,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,6,1],
		[2,0,0,2,0,0,0,2,0,0,0,2,0,0,1],
		[2,0,0,2,0,0,0,2,0,0,0,0,0,0,1],
		[2,0,0,2,0,0,0,0,0,0,0,2,0,0,1],
		[2,0,0,0,0,0,0,2,0,0,0,2,0,0,1],
		[1,0,0,2,0,0,0,2,0,0,0,2,0,0,1],
		[1,[-1,0],1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,[-1,0],1,1,1,1,2,1,2,1,1,1,1,1,1],
		[1,3,1,0,0,0,2,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
		[2,2,2,1,0,0,1,0,0,0,0,1,2,2,2],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,2,0,1,0,0,1],
		[2,2,2,2,2,1,0,0,0,2,0,2,0,1,2],
		[1,0,0,0,0,0,0,0,0,2,0,2,7,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1,2,1,2,1,1,1]
	],
	[
		[1,1,1,1,1,1,[-1,0],1,1],
		[1,0,0,0,0,0,0,0,2],
		[1,0,1,1,1,1,0,1,1],
		[1,0,0,0,0,2,0,0,5],
		[1,1,0,1,0,1,0,0,2],
		[0,1,0,1,0,2,0,1,1],
		[1,1,0,1,0,1,0,0,2],
		[[-1,0],10,3,1,0,0,0,0,5],
		[1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,[-1,0]],
		[1,0,1,1,1,1,1,1],
		[1,0,0,1,0,0,9,5],
		[1,0,0,0,0,1,0,2],
		[1,0,0,1,0,0,0,2],
		[1,0,0,0,0,0,1,2],
		[1,0,0,0,5,0,0,2],
		[1,0,0,0,0,0,5,2],
		[1,0,1,3,1,0,0,2],
		[1,1,1,[-1,0],1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,1,2,[-3,0],0,2,1],
		[1,8,1,0,2,1,0,0,0,0,[-1,0,0,0]],
		[1,0,1,0,0,0,0,2,0,0,5],
		[1,0,1,1,1,0,0,0,0,0,2],
		[1,0,0,0,5,1,1,1,1,1,1],
		[[-1,0],3,1,9,2,2,0,0,0,0,[-1,1]],
		[1,0,0,0,5,1,1,1,1,1,1],
		[1,0,1,1,1,0,0,0,0,2,1],
		[1,0,1,0,0,0,1,2,0,1,1],
		[1,10,1,0,2,2,1,0,0,0,[-1,0,0,0]],
		[1,0,0,0,1,1,1,[-3,1],0,2,1],
		[1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[[-1,1],3,1,0,0,0,0,0,2],
		[1,8,7,0,0,2,0,6,1],
		[1,1,1,1,1,2,0,0,2],
		[1,7,2,0,0,0,0,0,2],
		[2,0,0,0,0,2,0,6,1],
		[1,1,1,1,1,2,0,0,2],
		[2,0,2,0,0,0,0,0,2],
		[2,0,0,0,0,2,0,0,1],
		[1,[-1,0],2,1,1,1,1,1,1]
	],
	[
		[1,[-1,0],1,1,1,1,1,1,1,1,1,1,1],
		[1,7,0,0,0,0,10,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,3,1],
		[[-1,0],0,0,0,0,2,1,2,0,0,0,6,1],
		[1,2,0,0,0,6,1,7,0,0,0,2,1],
		[1,7,0,0,0,2,1,2,0,0,0,6,1],
		[1,2,0,0,0,6,1,7,0,0,0,2,1],
		[1,7,0,0,0,0,2,0,0,0,0,6,1],
		[1,2,0,0,0,0,0,0,0,0,0,2,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,2,9,9,1,1,1],
		[2,0,0,0,0,0,1,3,[-1,0]],
		[1,0,2,1,1,0,2,0,1],
		[2,0,0,8,2,0,1,0,1],
		[1,0,2,0,1,0,2,0,1],
		[2,0,1,0,1,0,0,0,1],
		[1,0,2,0,1,1,1,1,1],
		[5,0,0,0,0,0,0,0,2],
		[1,1,1,1,2,7,2,[-1,0],1]
	],
	[
		[1,[-1,0],1,1,1,1,1,1,1,1,1,1,1,1],
		[1,3,1,0,0,2,0,0,0,0,2,2,2,[-1,0,0,0]],
		[1,0,1,0,0,6,7,2,0,0,0,0,0,[-1,1,0,0]],
		[1,0,0,0,0,2,0,2,0,0,2,2,2,[-1,2,0,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,0,0,0],2,0,0,2,0,0,0,0,0,0,2,0,[-1,3,0,0]],
		[[-1,1,0,0],2,0,0,0,0,0,2,0,0,0,2,0,[-1,4,0,0]],
		[[-1,2,0,0],0,0,0,2,0,0,2,0,0,0,9,0,[-1,5,0,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,3,0,0],2,0,0,0,0,0,0,0,0,0,0,2,1],
		[[-1,4,0,0],0,0,0,0,2,0,0,0,0,0,0,2,1],
		[[-1,5,0,0],2,0,0,0,2,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,3,1],
		[2,7,0,9,6,2,0,0,8,1,2,0,0,1],
		[5,8,2,5,0,2,0,5,0,1,2,0,6,1],
		[2,9,6,2,0,0,0,2,0,0,7,0,0,5],
		[2,0,0,5,1,1,1,1,1,1,1,1,1,1],
		[[-1,6,0,1],7,0,2,2,0,0,0,0,0,0,0,0,[-1,9,0,0]],
		[[-1,7,0,1],0,0,0,0,0,0,0,0,2,1,1,1,1],
		[[-1,8,0,1],0,0,2,1,1,1,1,1,0,0,0,0,[-1,6,0,0]],
		[1,0,0,10,0,0,0,0,2,0,0,0,0,[-1,7,0,0]],
		[1,0,0,10,0,0,0,0,0,0,0,0,0,[-1,8,0,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,9,0,0],0,0,0,0,0,0,6,0,0,0,0,0,2],
		[1,1,1,1,1,1,1,1,1,1,1,2,8,1],
		[1,2,2,2,[-3,4],[-3,4],2,2,[-3,2],[-3,2],2,1,3,1],
		[1,0,7,0,0,0,0,0,0,0,0,0,0,1],
		[1,2,2,2,2,2,[-3,3],[-3,3],2,2,2,2,2,1],
		[1,2,2,2,1,1,1,1,1,1,1,1,1,1],
		[1,2,2,2,2,2,[-3,6],[-3,6],2,2,2,2,2,1],
		[1,0,0,0,0,0,0,0,0,0,0,6,0,1],
		[1,2,2,2,[-3,5],[-3,5],2,2,[-3,7],[-3,7],2,2,2,1],
		[1,1,1,1,1,1,1,1,1,1,2,2,2,1],
		[1,5,6,6,2,1,1,1,1,1,2,2,2,1],
		[2,[-3,8],0,0,[-3,9],2,0,0,0,0,0,0,0,1],
		[2,[-3,8],0,0,[-3,9],2,0,0,7,2,1,1,1,1],
		[2,[-3,8],0,0,[-3,9],2,0,0,0,0,0,0,2,1],
		[1,2,7,7,5,1,1,1,2,6,0,0,2,1],
		[1,2,0,0,0,7,0,0,9,0,0,0,2,1],
		[1,2,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,2,0,2,0,0,2,0,0,0,2,9,1],
		[1,0,10,0,0,0,0,0,0,0,0,0,9,2],
		[1,0,2,0,2,0,0,2,0,0,0,2,9,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,[-1,0],1],
		[1,7,0,0,0,0,0,0,0,0,0,6,1],
		[1,1,7,0,0,0,0,0,0,0,6,1,1],
		[1,0,1,7,0,0,0,0,0,6,1,0,1],
		[1,0,0,1,7,0,0,0,6,1,0,0,1],
		[1,0,0,0,1,7,0,6,1,0,0,0,1],
		[1,0,0,0,0,1,[-3,-1],1,0,0,0,0,1],
		[1,0,0,0,1,7,0,6,1,0,0,0,1],
		[1,0,0,1,7,0,0,0,6,1,0,0,1],
		[1,0,1,7,0,0,0,0,0,6,1,0,1],
		[1,1,7,0,0,0,0,0,0,0,6,1,1],
		[1,7,0,0,0,0,0,0,0,0,0,0,[-1,0,2,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[0,0,0,0,1,[-1,0],1,0,0],
		[0,0,0,0,1,0,1,1,1],
		[1,1,1,1,1,0,0,0,2],
		[1,0,0,0,14,0,0,0,2],
		[1,3,1,1,1,1,1,1,1],
		[1,[-1,1,1,1],1,0,0,0,0,0,0]
	],
	[
		[1,[-1,0],1,1,1,1,1,1,1],
		[1,0,1,1,1,1,1,1,1],
		[1,0,0,0,2,1,1,1,1],
		[1,0,0,0,1,1,1,1,1],
		[1,1,0,0,0,0,2,1,1],
		[1,1,0,0,0,0,1,1,1],
		[1,1,1,1,0,0,0,0,2],
		[1,1,1,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,3,1],
		[1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,2,0,0,0,0,0,2],
		[1,0,0,0,0,2,0,0,[-1,0]],
		[1,0,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,5,1,0],
		[1,0,0,0,1,0,2,1,0],
		[1,1,1,1,1,0,2,1,0],
		[1,0,0,0,2,0,0,1,0],
		[1,3,1,0,0,0,0,1,0],
		[1,[-1,0],1,1,1,1,1,1,0]
	],
	[
		[1,1,1,1,1,1,1,[-1,0],1],
		[[-1,0],3,1,0,0,0,0,0,2],
		[1,0,2,0,2,1,1,1,1],
		[1,0,2,0,0,0,0,5,1],
		[1,0,1,1,1,1,0,1,1],
		[1,0,2,2,2,0,0,2,2],
		[1,0,0,0,0,0,0,0,2],
		[1,2,2,2,2,2,2,2,2],
		[1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,[-1,0],2],
		[1,0,0,0,2,0,1],
		[1,[-3,14],2,0,1,0,2],
		[1,1,1,2,1,0,1],
		[1,0,0,0,2,1,1],
		[1,0,2,0,1,[-3,12],1],
		[1,[-3,13],1,0,1,0,2],
		[1,1,1,2,2,0,1],
		[1,0,0,0,0,0,2],
		[1,2,1,1,1,1,1],
		[1,0,1,[-3,10],0,0,2],
		[1,0,2,1,1,0,1],
		[1,0,0,0,1,0,1],
		[1,0,2,0,1,0,2],
		[1,0,1,0,1,0,2],
		[1,0,2,2,1,0,1],
		[1,[-3,11],2,0,0,0,5],
		[1,1,1,1,0,0,2],
		[1,0,0,0,0,0,2],
		[1,0,1,1,1,1,1],
		[1,0,2,0,0,0,2],
		[1,0,0,0,5,3,1],
		[1,1,1,1,1,[-1,0],1]
	],
	[
		[0,0,0,0,0,1,1,1,2,2,1],
		[0,0,0,0,0,1,0,0,0,0,[-1,0]],
		[0,0,0,1,1,1,0,0,2,1,1],
		[0,1,1,1,2,2,0,0,2,1,0],
		[0,1,0,0,0,0,14,0,2,1,0],
		[1,1,0,0,2,1,1,1,1,1,0],
		[1,2,0,0,2,1,0,0,0,0,0],
		[1,0,0,0,2,1,0,0,0,0,0],
		[1,3,1,1,1,1,0,0,0,0,0],
		[1,[-1,0],1,0,0,0,0,0,0,0,0]
	],
	[
		[1,1,1,1,1,1,1,1,1,1],
		[[-1,0],3,1,0,0,0,0,0,14,2],
		[1,0,2,0,0,2,0,0,2,2],
		[1,0,0,0,0,2,0,0,0,2],
		[1,2,2,2,2,2,0,0,0,2],
		[1,0,0,14,0,2,0,0,2,2],
		[1,0,0,2,0,14,0,0,5,1],
		[1,0,0,2,2,2,2,2,2,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,[-1,0],1,2,2,2,2,2,2,2,2,2],
		[1,0,3,1,0,0,14,0,0,0,0,0,2],
		[2,0,0,2,0,0,14,0,0,0,0,0,2],
		[2,0,0,2,0,0,2,2,2,2,14,14,2],
		[2,0,0,0,0,0,0,0,0,2,0,0,2],
		[2,0,0,0,0,0,0,0,0,2,0,0,2],
		[2,2,2,2,2,2,2,2,2,2,14,14,2],
		[2,[-3,15],[-3,15],1,0,0,14,0,0,14,0,0,2],
		[2,[-3,15],[-3,15],1,0,0,14,0,0,14,0,0,2],
		[2,0,0,2,0,0,2,2,2,2,2,2,2],
		[2,0,0,2,0,0,0,0,0,0,0,0,2],
		[2,0,0,2,0,0,0,0,0,0,0,0,2],
		[2,0,0,2,2,2,2,2,2,2,14,14,2],
		[2,0,0,14,0,0,14,0,0,2,0,0,2],
		[2,0,0,14,0,0,14,0,0,2,0,0,2],
		[2,2,2,2,2,2,2,0,0,2,0,0,2],
		[2,0,0,14,0,0,2,0,0,14,0,0,5],
		[1,0,0,14,0,0,2,0,0,14,0,0,5],
		[1,1,[-1,0],1,2,2,2,2,2,2,2,2,2]
	],
	[
		[1,1,1,1,1,1,1,[-1,0],1],
		[2,0,0,0,0,2,1,3,1],
		[2,0,1,2,0,1,1,15,1],
		[1,0,2,1,0,0,0,0,1],
		[1,0,2,1,1,1,1,1,1],
		[1,0,2,0,0,0,1,1,1],
		[1,0,1,0,2,0,0,2,1],
		[1,0,0,0,2,0,0,0,1],
		[1,1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,[-1,0],1],
		[1,0,0,1,0,0,1,0,0,1,1,0,0,0,3,1],
		[1,0,0,1,0,0,2,0,0,2,1,0,1,1,1,1],
		[1,0,0,2,0,0,0,0,0,2,1,0,0,0,2,1],
		[1,0,0,0,0,0,0,0,0,2,1,2,0,0,2,1],
		[1,2,0,0,2,2,0,2,2,2,1,0,0,0,2,1],
		[1,0,0,0,0,0,0,0,0,2,1,0,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,2,0,0,2,1,2,1],
		[1,0,0,0,0,0,0,0,0,2,0,0,2,1,2,1],
		[1,0,1,1,1,1,1,3,1,2,0,0,0,2,1,1],
		[1,0,0,0,0,0,2,0,2,1,2,0,0,2,1,1],
		[1,2,2,2,0,0,2,0,0,0,2,0,0,0,2,1],
		[1,1,0,1,0,0,2,0,0,0,5,2,0,0,2,1],
		[[-1,0],0,0,0,0,5,1,0,0,0,0,0,0,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1],
		[1,0,0,0,0,[-1,0]],
		[1,0,0,0,3,1],
		[1,0,0,0,0,1],
		[2,16,16,16,16,2],
		[2,0,0,0,0,2],
		[2,0,0,0,0,2],
		[2,0,0,2,2,1],
		[2,0,0,0,0,2],
		[2,0,0,0,0,2],
		[1,2,2,0,0,2],
		[2,0,0,0,0,2],
		[2,0,0,0,0,2],
		[2,0,0,0,2,1],
		[2,0,0,0,2,1],
		[2,0,0,2,1,2],
		[2,0,0,2,1,2],
		[2,0,0,0,2,1],
		[1,2,0,0,2,1],
		[1,2,0,0,0,2],
		[2,1,2,0,0,2],
		[2,1,2,0,0,2],
		[1,2,0,0,0,2],
		[1,2,0,0,2,2],
		[1,1,1,[-1,0],1,1]
	],
	[
		[1,[-1,0],1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,3,1,1,1,1,1,1,0,0,0,0,0,2,1],
		[1,0,0,12,0,2,1,2,0,5,2,0,0,1,1],
		[1,0,0,0,12,2,1,0,0,0,0,5,0,14,2],
		[1,12,0,0,0,2,1,0,1,2,1,0,0,1,1],
		[1,0,12,0,0,2,1,0,0,0,2,0,0,0,2],
		[1,12,0,0,0,2,1,0,0,0,0,0,0,0,2],
		[1,0,0,0,12,2,1,0,1,0,5,2,1,0,2],
		[1,12,0,12,0,2,1,0,1,0,1,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,0,0,0,2,1,1],
		[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
]
const hasHitbox = [1,5,11];

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			if (player.canWalljump) {
				if (player.wallJumpDir == "left") {
					player.xv = -player.moveSpeed;
					player.yv = -Math.sign(player.g)*205;
				}
				if (player.wallJumpDir == "right") {
					player.xv = player.moveSpeed;
					player.yv = -Math.sign(player.g)*205;
				}
			} else if (player.currentJumps > 0 || player.godMode) {
				player.yv = -Math.sign(player.g)*205;
				player.currentJumps--;
			}
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = true;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = true;
			break;
		case "Delete":
			wipeSave();
			break;
	}
});

document.addEventListener("keyup", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowLeft":
		case "KeyA":
			control.left = false;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = false;
			break;
	}
});

function newSave() {
	return [1,6,0,7,325,1,600,[],0.3];
}
function save() {
	let saveData = player.spawnPoint;
	if (saveData[5] == Infinity) saveData[5] = "Infinity";
	localStorage.setItem('just-a-save',JSON.stringify(saveData));
}

function load() {
	if (localStorage.getItem('just-a-save')) {
		let saveData = JSON.parse(localStorage.getItem('just-a-save'));
		if (saveData[5] == "Infinity") saveData[5] = Infinity;
		if (saveData[6] == undefined) {
			saveData[6] = newSave()[6];
			saveData[3] += 2;
		}
		player.spawnPoint = saveData;
	}
}
function wipeSave() {
	if (confirm("Are you sure you want to delete your save?")) {
		if (levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] == 4) levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = newSave();
		save();
		respawn();
		drawLevel();
		drawPlayer();
	}
}

function getBlockType(x,y) {
	if (x < 0 || x >= levels[player.currentLevel].length || y < 0 || y >= levels[player.currentLevel][0].length) {
		if (levels[player.currentLevel][x-1] != undefined) {
			if (typeof(levels[player.currentLevel][x-1][y]) == "object") {
				if (levels[player.currentLevel][x-1][y][0] == -1) {
					return -2;
				}
			}
		}
		if (levels[player.currentLevel][x+1] != undefined) {
			if (typeof(levels[player.currentLevel][x+1][y]) == "object") {
				if (levels[player.currentLevel][x+1][y][0] == -1) {
					return -2;
				}
			}
		}
		if (levels[player.currentLevel][x] != undefined) {
			if (typeof(levels[player.currentLevel][x][y-1]) == "object") {
				if (levels[player.currentLevel][x][y-1][0] == -1) {
					return -2;
				}
			}
			if (typeof(levels[player.currentLevel][x][y+1]) == "object") {
				if (levels[player.currentLevel][x][y+1][0] == -1) {
					return -2;
				}
			}
		}
		return 1;
	}
	if (typeof(levels[player.currentLevel][x][y]) == "object") return levels[player.currentLevel][x][y][0];
	return levels[player.currentLevel][x][y];
}
function isTouching(dir, type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	switch (dir) {
		case "left":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && hasHitbox.includes(getBlockType(x1b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize < blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b+1,y1b)) && getBlockType(x1b+1,y1b) != 2) 
			|| (hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize < y2%blockSize && !hasHitbox.includes(getBlockType(x1b+1,y2b)) && getBlockType(x1b+1,y2b) != 2));
			break;
		case "right":
			return (hasHitbox.includes(getBlockType(x2b,y1b)) && hasHitbox.includes(getBlockType(x2b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize < blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b-1,y1b)) && getBlockType(x2b-1,y1b) != 2) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize < y2%blockSize && !hasHitbox.includes(getBlockType(x2b-1,y2b)) && getBlockType(x2b-1,y2b) != 2));
			break;
		case "up":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && hasHitbox.includes(getBlockType(x2b,y1b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b,y1b+1)) && getBlockType(x1b,y1b+1) != 2) 
			|| (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b,y1b+1)) && getBlockType(x2b,y1b+1) != 2))
			&& player.yv < 0;
			break;
		case "down":
			return (hasHitbox.includes(getBlockType(x1b,y2b)) && hasHitbox.includes(getBlockType(x2b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x1b,y2b-1)) && getBlockType(x1b,y2b-1) != 2) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x2b,y2b-1)) && getBlockType(x2b,y2b-1) != 2))
			&& player.yv > 0;
			break;
		case "any":
			x1 = player.x + 1;
			x2 = player.x+playerSize - 1;
			y1 = player.y + 1;
			y2 = player.y+playerSize - 1;
			x1b = Math.floor(x1/blockSize);
			x2b = Math.floor(x2/blockSize);
			y1b = Math.floor(y1/blockSize);
			y2b = Math.floor(y2/blockSize);
			return getBlockType(x1b,y1b) == type
			|| getBlockType(x2b,y1b) == type
			|| getBlockType(x1b,y2b) == type
			|| getBlockType(x2b,y2b) == type;
	}
}
function getCoord(type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	if (getBlockType(x1b,y1b) == type) {
		return [x1b,y1b];
	} else if (getBlockType(x2b,y1b) == type) {
		return [x2b,y1b];
	} else if (getBlockType(x1b,y2b) == type) {
		return [x1b,y2b];
	} else if (getBlockType(x2b,y2b) == type) {
		return [x2b,y2b];
	}
}
function respawn() {
	player.levelCoord = [player.spawnPoint[2],player.spawnPoint[3]];
	player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
	player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize)/2;
	player.xv = 0;
	player.yv = 0;
	player.g = player.spawnPoint[4];
	player.maxJumps = player.spawnPoint[5];
	player.currentJumps = player.maxJumps -1;
	player.moveSpeed = player.spawnPoint[6];
	player.triggers = [...player.spawnPoint[7]];
}

var lastFrame = 0;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	if (dt < 100) {
		dt = dt/100;
		let xprev = player.x;
		let yprev = player.y;
		let lvlxprev = player.levelCoord[0];
		let lvlyprev = player.levelCoord[1];
		let triggersPrev = [...player.triggers];
		let shouldDrawLevel = false;
		for (let i = 0; i < 100; i++) {
			// velocity change
			player.xv *= Math.pow(0.5,dt/12);
			if (Math.abs(player.xv) < 5) player.xv = 0;
			player.yv += player.g * dt / 500 * gameSpeed;
			if (player.yv > player.g && player.g > 0) player.yv = player.g;
			if (player.yv < player.g && player.g < 0) player.yv = player.g;
			// position change based on velocity
			player.x += player.xv * dt / 500 * gameSpeed;
			player.y += player.yv * dt / 500 * gameSpeed;
			// collision detection
			let x1 = player.x;
			let x2 = player.x+playerSize;
			let y1 = player.y;
			let y2 = player.y+playerSize;
			let x1b = Math.floor(x1/blockSize);
			let x2b = Math.floor(x2/blockSize);
			let y1b = Math.floor(y1/blockSize);
			let y2b = Math.floor(y2/blockSize);
			// left wall
			if (isTouching("left")) {
				if ((getBlockType(x1b,y1b) == 11 || getBlockType(x1b,y2b) == 11) && control.left) {
					if (player.yv > player.g/10 && player.g > 0) player.yv = player.g/10;
					if (player.yv < player.g/10 && player.g < 0) player.yv = player.g/10;
					player.canWalljump = true;
					player.wallJumpDir = "right";
				} else if (i == 0) player.canWalljump = false;
				player.xv = 0;
				player.x = (x1b + 1) * blockSize;
			} else if (isTouching("right")) { // right wall
				if ((getBlockType(x2b,y1b) == 11 || getBlockType(x2b,y2b) == 11) && control.right) {
					if (player.yv > player.g/10 && player.g > 0) player.yv = player.g/10;
					if (player.yv < player.g/10 && player.g < 0) player.yv = player.g/10;
					player.canWalljump = true;
					player.wallJumpDir = "left";
				} else if (i == 0) player.canWalljump = false;
				player.xv = 0;
				player.x = x2b * blockSize - playerSize;
			} else if (i == 0) player.canWalljump = false;
			// ceiling
			if (isTouching("up")) {
				player.yv = 0;
				if (((getBlockType(x2b,y1b) == 5 && getBlockType(x1b,y1b) == 5)
				   || ((getBlockType(x2b,y1b) == 5 || getBlockType(x1b,y1b) == 5)
				       && ((!hasHitbox.includes(getBlockType(x2b,y1b)) || hasHitbox.includes(getBlockType(x2b,y1b+1)))
					   || (!hasHitbox.includes(getBlockType(x1b,y1b)) || hasHitbox.includes(getBlockType(x1b,y1b+1))))))
				   && player.g < 0) player.yv = -Math.sign(player.g)*275;
				player.y = (y1b + 1) * blockSize;
				if (player.g < 0 && player.yv <= 0) player.currentJumps = player.maxJumps;
			} else if (player.g < 0 && player.currentJumps == player.maxJumps) player.currentJumps = player.maxJumps - 1;
			// floor
			if (isTouching("down")) {
				player.yv = 0;
				if (((getBlockType(x2b,y2b) == 5 && getBlockType(x1b,y2b) == 5)
				   || ((getBlockType(x2b,y2b) == 5 || getBlockType(x1b,y2b) == 5)
				       && ((!hasHitbox.includes(getBlockType(x2b,y2b)) || hasHitbox.includes(getBlockType(x2b,y2b-1))) 
					   || (!hasHitbox.includes(getBlockType(x1b,y2b)) || hasHitbox.includes(getBlockType(x1b,y2b-1))))))
				   && player.g > 0) player.yv = -Math.sign(player.g)*275;
				player.y = y2b * blockSize - playerSize;
				if (player.g > 0 && player.yv >= 0) player.currentJumps = player.maxJumps;
			} else if (player.g > 0 && player.currentJumps == player.maxJumps) player.currentJumps = player.maxJumps - 1;
			// checkpoint
			if (isTouching("any",3)) {
				if (levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] == 4) levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
				let coord = getCoord(3);
				player.spawnPoint = [coord[0],coord[1],player.levelCoord[0],player.levelCoord[1],player.g,player.maxJumps,player.moveSpeed,[...player.triggers]];
				levels[player.currentLevel][coord[0]][coord[1]] = 4;
				shouldDrawLevel = true;
				save();
			}
			// anti-grav
			if (isTouching("any",6)) {
				if (player.g > 0) player.g = -player.g;
			}
			if (isTouching("any",7)) {
				if (player.g < 0) player.g = -player.g;
			}
			// grav magnitude
			if (isTouching("any",8)) {
				player.g = Math.sign(player.g)*170;
			}
			if (isTouching("any",9)) {
				player.g = Math.sign(player.g)*325;
			}
			if (isTouching("any",10)) {
				player.g = Math.sign(player.g)*650;
			}
			// multi-jump
			if (isTouching("any",12)) {
				player.maxJumps = 0;
				if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
			}
			if (isTouching("any",13)) {
				player.maxJumps = 1;
				if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
			}
			if (isTouching("any",14)) {
				player.maxJumps = 2;
				if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
			}
			if (isTouching("any",15)) {
				player.maxJumps = 3;
				if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
			}
			if (isTouching("any",16)) {
				player.maxJumps = Infinity;
				if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
			}
			if (isTouching("any",21)) player.moveSpeed = 300;
			if (isTouching("any",22)) player.moveSpeed = 600;
			if (isTouching("any",23)) player.moveSpeed = 1200;
			// death block
			if (isTouching("any",2) && !player.godMode) respawn();
			x1 = player.x + 1;
			x2 = player.x+playerSize - 1;
			y1 = player.y + 1;
			y2 = player.y+playerSize - 1;
			// trigger block
			if (isTouching("any",-3)) {
				let coord = getCoord(-3);
				let trigger = levels[player.currentLevel][coord[0]][coord[1]];
				if (!player.triggers.includes(trigger[1])) player.triggers.push(trigger[1]);
			}
			// triggers
			if (!player.triggers.includes(-1)) {
				levels[9][5][5] = 0;
				levels[9][5][4] = 0;
				levels[9][5][2] = 0;
				levels[9][5][1] = 0;
			} else {
				levels[9][5][5] = 7;
				levels[9][5][4] = 6;
				levels[9][5][2] = 7;
				levels[9][5][1] = 6;
			}
			if (player.triggers.includes(0)) {
				levels[22][6][4] = 0;
			} else levels[22][6][4] = 2;
			if (player.triggers.includes(1)) {
				levels[22][6][5] = 0;
			} else levels[22][6][5] = 2;
			if (player.triggers.includes(2)) {
				levels[26][27][1] = 0;
				levels[26][27][2] = 0;
			} else {
				levels[26][27][1] = 2;
				levels[26][27][2] = 2;
			}
			if (player.triggers.includes(3)) {
				levels[26][28][1] = 0;
				levels[26][28][2] = 0;
			} else {
				levels[26][28][1] = 2;
				levels[26][28][2] = 2;
			}
			if (player.triggers.includes(4)) {
				levels[26][29][1] = 0;
				levels[26][29][2] = 0;
			} else {
				levels[26][29][1] = 2;
				levels[26][29][2] = 2;
			}
			if (player.triggers.includes(5)) {
				levels[26][31][11] = 0;
				levels[26][31][12] = 0;
			} else {
				levels[26][31][11] = 2;
				levels[26][31][12] = 2;
			}
			if (player.triggers.includes(6)) {
				levels[26][32][11] = 0;
				levels[26][32][12] = 0;
			} else {
				levels[26][32][11] = 2;
				levels[26][32][12] = 2;
			}
			if (player.triggers.includes(7)) {
				levels[26][33][11] = 0;
				levels[26][33][12] = 0;
			} else {
				levels[26][33][11] = 2;
				levels[26][33][12] = 2;
			}
			if (player.triggers.includes(8)) {
				levels[26][38][1] = 0;
			} else levels[26][38][1] = 2;
			if (player.triggers.includes(9)) {
				levels[26][39][1] = 0;
			} else levels[26][39][1] = 2;
			if (player.triggers.includes(10)) {
				levels[32][15][3] = 0;
			} else levels[32][15][3] = 2;
			if (player.triggers.includes(11)) {
				levels[32][9][1] = 0;
			} else levels[32][9][1] = 2;
			if (player.triggers.includes(12)) {
				levels[32][7][3] = 0;
			} else levels[32][7][3] = 2;
			if (player.triggers.includes(13)) {
				levels[32][3][3] = 0;
			} else levels[32][3][3] = 2;
			if (player.triggers.includes(14)) {
				levels[32][1][4] = 0;
			} else levels[32][1][4] = 2;
			if (player.triggers.includes(15)) {
				levels[35][15][4] = 0;
				levels[35][15][5] = 0;
			} else {
				levels[35][15][4] = 2;
				levels[35][15][5] = 2;
			}
			// level warp
			if (isTouching("any",-2)) {
				let coord = getCoord(-1);
				let warp = levels[player.currentLevel][coord[0]][coord[1]];
				let warpId = warp[1];
				if (x1 < 0) { // left
					if (warp[2] != undefined) {
						player.levelCoord[0]+=warp[2];
						player.levelCoord[1]+=warp[3];
					} else player.levelCoord[0]--;
					player.x = levels[player.currentLevel].length * blockSize - playerSize;
					player.y = blockSize*levels[player.currentLevel][levels[player.currentLevel].length-1].findIndex(x => x[0]==-1 && x[1]==warpId)+(y1+blockSize)%blockSize;
				} else if (x2 > levels[player.currentLevel].length * blockSize) { // right
					if (warp[2] != undefined) {
						player.levelCoord[0]+=warp[2];
						player.levelCoord[1]+=warp[3];
					} else player.levelCoord[0]++;
					player.x = 0;
					player.y = blockSize*levels[player.currentLevel][0].findIndex(x => x[0]==-1 && x[1]==warpId)+(y1+blockSize)%blockSize;
				} else if (y1 < 0) { // up
					if (warp[2] != undefined) {
						player.levelCoord[0]+=warp[2];
						player.levelCoord[1]+=warp[3];
					} else player.levelCoord[1]++;
					player.y = levels[player.currentLevel][0].length * blockSize - playerSize;
					player.x = blockSize*levels[player.currentLevel].findIndex(x => x[x.length-1][0]==-1 && x[x.length-1][1]==warpId)+(x1+blockSize)%blockSize;
				} else if (y2 > levels[player.currentLevel][0].length * blockSize) { // down
					if (warp[2] != undefined) {
						player.levelCoord[0]+=warp[2];
						player.levelCoord[1]+=warp[3];
					} else player.levelCoord[1]--;
					player.y = 0;
					player.x = blockSize*levels[player.currentLevel].findIndex(x => x[0][0]==-1 && x[0][1]==warpId)+(x1+blockSize)%blockSize;
				}
			}
		}
		// key input
		if (control.left && player.xv > -player.moveSpeed) {
			player.xv -= player.moveSpeed *dt;
			if (player.xv < -player.moveSpeed) player.xv = -player.moveSpeed;
		}
		if (control.right && player.xv < player.moveSpeed) {
			player.xv += player.moveSpeed *dt;
			if (player.xv > player.moveSpeed) player.xv = player.moveSpeed;
		}
		// draw checks
		if (player.x != xprev || player.y != yprev) drawPlayer();
		if (player.levelCoord[0] != lvlxprev || player.levelCoord[1] != lvlyprev || !arraysEqual(player.triggers,triggersPrev) || shouldDrawLevel) drawLevel();
	}
	window.requestAnimationFrame(nextFrame);
}
function drawPlayer() {
	let canvas = document.getElementById("playerLayer");
	let pL = canvas.getContext("2d");
	canvas.width = levels[player.currentLevel].length*blockSize;
	canvas.height = levels[player.currentLevel][0].length*blockSize;
	pL.clearRect(0,0,canvas.width,canvas.height);
	pL.fillStyle = "#0000FF";
	pL.fillRect(Math.floor(player.x), Math.floor(player.y), playerSize, playerSize);
	adjustScreen();
}
function drawLevel() {
	let canvas = document.getElementById("levelLayer");
	let lL = canvas.getContext("2d");
	canvas.width = levels[player.currentLevel].length*blockSize;
	canvas.height = levels[player.currentLevel][0].length*blockSize;
	lL.clearRect(0,0,canvas.width,canvas.height);
	for (let x in levels[player.currentLevel]) {
		for (let y in levels[player.currentLevel][x]) {
			lL.lineWidth = blockSize*3/25;
			let xb = x * blockSize;
			let yb = y * blockSize;
			let type = getBlockType(x,y);
			switch (type) {
				case -3:
					if (!player.triggers.includes(levels[player.currentLevel][x][y][1])) {
						lL.fillStyle = "#00880088";
					} else lL.fillStyle = "#00FF0088";
					break;
				case 1:
					lL.fillStyle = "#000000";
					break;
				case 2:
					lL.fillStyle = "#FF0000";
					break;
				case 3:
					lL.fillStyle = "#00888888";
					break;
				case 4:
					lL.fillStyle = "#00FFFF88";
					break;
				case 5:
					lL.fillStyle = "#FFFF00";
					break;
				case 6:
					lL.fillStyle = "#FF888888";
					break;
				case 7:
					lL.fillStyle = "#8888FF88";
					break;
				case 8:
					lL.fillStyle = "#FFFF8888";
					break;
				case 9:
					lL.fillStyle = "#88FF8888";
					break;
				case 10:
					lL.fillStyle = "#88FFFF88";
					break;
				case 11:
					lL.fillStyle = "#7289DA";
					break;
				case 12:
					lL.fillStyle = "#77440088";
					break;
				case 13:
					lL.fillStyle = "#99550088";
					break;
				case 14:
					lL.fillStyle = "#BB660088";
					break;
				case 15:
					lL.fillStyle = "#DD770088";
					break;
				case 16:
					lL.fillStyle = "#FF880088";
					break;
				case 21:
					lL.fillStyle = "#00880088";
					break;
				case 22:
					lL.fillStyle = "#00BB0088";
					break;
				case 23:
					lL.fillStyle = "#00FF0088";
					break;
				default:
					lL.fillStyle = "#00000000";
			}
			lL.fillRect(xb, yb, blockSize, blockSize);
			switch (type) {
				case -3:
					lL.lineWidth = blockSize/25;
					if (!player.triggers.includes(levels[player.currentLevel][x][y][1])) {
						lL.strokeStyle = "#00440088";
						lL.fillStyle = "#00440088";
						lL.strokeRect(xb+blockSize/3,yb+blockSize/25*3,blockSize/3,blockSize-blockSize/25*6);
						lL.fillRect(xb+blockSize/3+blockSize/50*3,yb+blockSize/25*3+blockSize/50*3,blockSize/3-blockSize/25*3,blockSize/2-blockSize/25*3-blockSize/50*3);
					} else {
						lL.strokeStyle = "#00880088";
						lL.fillStyle = "#00880088";
						lL.strokeRect(xb+blockSize/3,yb+blockSize/25*3,blockSize/3,blockSize-blockSize/25*6);
						lL.fillRect(xb+blockSize/3+blockSize/50*3,yb+blockSize/2,blockSize/3-blockSize/25*3,blockSize/2-blockSize/25*3-blockSize/50*3);
					}
					break;
				case 2:
					lL.strokeStyle = "#880000";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 3:
					lL.strokeStyle = "#00444488";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 4:
					lL.strokeStyle = "#00888888";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 5:
					lL.strokeStyle = "#888800";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/4);
					lL.stroke();
					break;
				case 6:
					lL.strokeStyle = "#88000088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/5-blockSize/25*6);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2-blockSize/25*3,yb+blockSize/25*6);
					lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2+blockSize/25*3,yb+blockSize/25*6);
					lL.stroke();
					break;
				case 7:
					lL.strokeStyle = "#00008888";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize/25*3,blockSize/5,blockSize/5);
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/5+blockSize/25*6);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2-blockSize/25*3,yb+blockSize-blockSize/25*6);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/2+blockSize/25*3,yb+blockSize-blockSize/25*6);
					lL.stroke();
					break;
				case 8:
					lL.strokeStyle = "#88880088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*9);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 9:
					lL.strokeStyle = "#00880088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/4);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 10:
					lL.strokeStyle = "#00888888";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/25*3);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 11:
					lL.strokeStyle = "#4E5D94";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/2);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/2);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/4,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize/4);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize-blockSize/4,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
					lL.stroke();
					break;
				case 12:
					lL.strokeStyle = "#44220088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 13:
					lL.strokeStyle = "#55270088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/3*2,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/3*2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 14:
					lL.strokeStyle = "#66330088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					for (let i = 1; i < 3; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/3*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/3*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/6,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/6*5,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/6,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/6*5,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 15:
					lL.strokeStyle = "#77380088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					for (let i = 1; i < 4; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/4*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/4*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 16:
					lL.strokeStyle = "#88440088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize/25*3,yb+blockSize/25*3,xb+blockSize/25*3,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3,xb+blockSize/2,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3,xb+blockSize-blockSize/25*3,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3,xb+blockSize-blockSize/2,yb+blockSize/2);
					lL.stroke();
					break;
				case 21:
					lL.strokeStyle = "#00440088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/4,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/4+blockSize/2,yb+blockSize/2);
					lL.lineTo(xb+blockSize/4,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 22:
					lL.strokeStyle = "#00660088";
					lL.lineWidth = blockSize/25;
					for (let i = 1; i < 3; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/6*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/6*i+blockSize/2,yb+blockSize/2);
						lL.lineTo(xb+blockSize/6*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					break;
				case 23:
					lL.strokeStyle = "#00880088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					for (let i = 1; i < 4; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/8*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/8*i+blockSize/2,yb+blockSize/2);
						lL.lineTo(xb+blockSize/8*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					break;
			}
		}
	}
	adjustScreen();
}
function adjustScreen() {
	let lvlx = Math.floor((window.innerWidth - levels[player.currentLevel].length*blockSize) / 2);
	if (lvlx < 0) {
		lvlx = Math.floor(window.innerWidth/2) - Math.floor(player.x+playerSize/2);
		if (lvlx > 0) lvlx = 0;
		if (lvlx < window.innerWidth - levels[player.currentLevel].length*blockSize) lvlx = Math.floor(window.innerWidth - levels[player.currentLevel].length*blockSize);
	}
	let lvly = Math.floor((window.innerHeight - levels[player.currentLevel][0].length*blockSize) / 2);
	if (lvly < 0) {
		lvly = Math.floor(window.innerHeight/2) - Math.floor(player.y+playerSize/2);
		if (lvly > 0) lvly = 0;
		if (lvly < window.innerHeight - levels[player.currentLevel][0].length*blockSize) lvly = Math.floor(window.innerHeight - levels[player.currentLevel][0].length*blockSize);
	}
	document.getElementById("playerLayer").style.left = lvlx+"px";
	document.getElementById("levelLayer").style.left = lvlx+"px";
	document.getElementById("playerLayer").style.top = lvly+"px";
	document.getElementById("levelLayer").style.top = lvly+"px";
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

load();
respawn();
drawPlayer();
drawLevel();
window.requestAnimationFrame(nextFrame);
