var playerSize = 20;
var blockSize = 50;
const player = {
	spawnPoint: [4,7,0,0],
	levelCoord: [0,0],
	get currentLevel() {return worldMap[player.levelCoord[0]][player.levelCoord[1]]},
	x: 240,
	y: 380,
	xv: 0,
	yv: 0,
	g: 400,
	canJump: false,
};
const control = {
	up: false,
	down: false,
	left: false,
	right: false,
};
const worldMap = [
	[0],
	[1],
]
const levels = [
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,0,1,0,0,0,1],
		[1,0,0,0,0,1,0,1,1],
		[1,0,0,1,0,0,0,0,2],
		[1,0,0,0,2,0,1,3,1],
		[1,0,0,0,2,0,0,0,1],
		[1,3,1,0,1,0,0,0,1],
		[1,0,0,0,0,0,0,0,1],
		[1,2,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,0,1],
	],
	[
		[1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,5],
		[1,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1],
		[1,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,1,0,0,1],
		[1,0,0,0,5,0,0,0,1],
		[1,1,1,1,1,1,1,1,1],
	],
];
const noHitbox = [0,2,3,4];

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = true;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = true;
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = true;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = true;
			break;
	}
});

document.addEventListener("keyup", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = false;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = false;
			break;
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

var lastFrame = 0;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	// position change based on velocity
	player.x += player.xv * dt / 500;
	player.y += player.yv * dt / 500;
	// velocity change
	player.xv *= 0.5;
	if (Math.abs(player.xv) < 5) player.xv = 0;
	player.yv += player.g * dt / 500;
	// collision detection
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	// level boundary (change level)
	// left boundary
	if (x1 < 0) {
		player.levelCoord[0]--;
		player.x = (levels[player.currentLevel].length-1)*blockSize-playerSize;
		player.y = blockSize*levels[player.currentLevel][levels[player.currentLevel].length-1].findIndex(x => x==0)+player.y%blockSize;
	}
	// right boundary
	if (x2 > levels[player.currentLevel].length*blockSize) {
		player.levelCoord[0]++;
		player.x = 0;
		player.y = blockSize*levels[player.currentLevel][0].findIndex(x => x==0)+player.y%blockSize;
	}
	// top boundary
	if (y1 < 0) {
		player.levelCoord[1]--;
		player.x = blockSize*levels[player.currentLevel].findIndex(x => x[x.length-1]==0)+player.y%blockSize;
		player.y = (levels[player.currentLevel][0].length-1)*blockSize-playerSize;
	}
	// bottom boundary
	if (y2 > levels[player.currentLevel][0].length*blockSize) {
		player.levelCoord[1]++;
		player.x = blockSize*levels[player.currentLevel].findIndex(x => x[0]==0)+player.y%blockSize;
		player.y = 0;
	}
	x1 = player.x;
	x2 = player.x+playerSize;
	y1 = player.y;
	y2 = player.y+playerSize;
	// block collision
	// left wall
	if ((!noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)])
	    && blockSize-x1%blockSize < blockSize-y1%blockSize)
	   || (!noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize)]) 
	      && blockSize-x1%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = Math.floor(x1/blockSize + 1) * blockSize;
	}
	// right wall
	if ((!noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)])
	    && x2%blockSize < blockSize-y1%blockSize)
	   || (!noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)])
	      && x2%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = Math.floor(x2/blockSize) * blockSize - playerSize;
	}
	// floor
	if (((!noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize))
	    && blockSize-x1%blockSize > y2%blockSize
	    && noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize)-1]))
	   || (!noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)])
	      && x2%blockSize > y2%blockSize)
	      && noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)-1]))
	   && player.yv > 0) {
		player.yv = 0;
		if (levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] == 5) player.yv = -300;
		player.y = Math.floor(y2/blockSize) * blockSize - playerSize;
		player.canJump = true;
	} else player.canJump = false;
	// ceiling
	if (((!noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)])
	    && blockSize-x1%blockSize > blockSize-y1%blockSize
	    && noHitbox.includes(levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)+1]))
	   || (!noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)])
	      && x2%blockSize > blockSize-y1%blockSize)
	      && noHitbox.includes(levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)+1]))
	   && player.yv < 0) {
		player.yv = 0;
		player.y = Math.floor(y1/blockSize + 1) * blockSize;
	}
	x1 = player.x + 1;
	x2 = player.x+playerSize - 1;
	y1 = player.y + 1;
	y2 = player.y+playerSize - 1;
	// death block
	if (levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)] == 2
	   || levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)] == 2
	   || levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize)] == 2
	   || levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] == 2) {
		player.levelCoord = [player.spawnPoint[2],player.spawnPoint[3]];
		player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
		player.y = player.spawnPoint[1] * blockSize + blockSize - playerSize;
		player.xv = 0;
		player.yv = 0;
	}
	// checkpoint
	if (levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [Math.floor(x1/blockSize),Math.floor(y1/blockSize),player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y1/blockSize)] = 4;
	}
	if (levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [Math.floor(x2/blockSize),Math.floor(y1/blockSize),player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y1/blockSize)] = 4;
	}
	if (levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize)] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [Math.floor(x1/blockSize),Math.floor(y2/blockSize),player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][Math.floor(x1/blockSize)][Math.floor(y2/blockSize)] = 4;
	}
	if (levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [Math.floor(x2/blockSize),Math.floor(y2/blockSize),player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] = 4;
	}
	// key input
	if (control.up && player.canJump) player.yv = -200;
	if (control.left) player.xv = -100;
	if (control.right) player.xv = 100;
	// draw + ending stuff
	draw();
	window.requestAnimationFrame(nextFrame);
}
function draw() {
	// setup
	let canvas = document.getElementById("gameScreen");
	let screen = canvas.getContext("2d");
	let lvlx = Math.round((canvas.width - levels[player.currentLevel].length * blockSize) / 2);
	let lvly = Math.round((canvas.height - levels[player.currentLevel][0].length * blockSize) / 2);
	screen.clearRect(0,0,canvas.width,canvas.height);
	screen.lineWidth = 0;
	// draw level
	for (let x in levels[player.currentLevel]) {
		for (let y in levels[player.currentLevel][x]) {
			let type = levels[player.currentLevel][x][y];
			if (type != 0) {
				switch (type) {
					case 1:
						screen.fillStyle = "#000000";
						break;
					case 2:
						screen.fillStyle = "#FF0000";
						break;
					case 3:
						screen.fillStyle = "#008888";
						break;
					case 4:
						screen.fillStyle = "#00FFFF";
						break;
					case 5:
						screen.fillStyle = "#FFFF00";
						break;
				}
				screen.fillRect(lvlx + x * blockSize, lvly + y * blockSize, blockSize, blockSize);
			}
		}
	}
	// draw player
	screen.fillStyle = "#0000FF";
	screen.fillRect(Math.round(player.x) + lvlx, Math.round(player.y) + lvly, playerSize, playerSize);
}
function resizeCanvas() {
	let canvas = document.getElementById("gameScreen");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();
window.requestAnimationFrame(nextFrame);
