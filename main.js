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
	[0,1],
	[3,2],
]
const levels = [
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,0,1,0,0,0,1],
		[1,0,0,0,0,1,0,1,1],
		[1,0,0,1,0,0,0,0,2],
		[1,0,0,0,2,0,1,3,1],
		[1,0,0,0,2,0,0,0,1],
		[6,0,5,0,1,0,0,0,1],
		[1,0,0,0,0,0,0,0,1],
		[1,2,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,6,1],
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,1,0,0,0,1,1],
		[1,0,0,0,1,0,0,1,3],
		[1,0,1,0,0,0,0,0,6],
		[1,0,2,0,1,0,5,0,1],
		[1,0,1,0,0,0,0,0,1],
		[1,6,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1,6,1],
		[1,0,2,0,5,0,0,0,1],
		[1,0,0,0,0,1,0,0,2],
		[1,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1],
		[1,0,1,0,0,0,0,0,1],
		[1,0,2,0,0,0,0,0,5],
		[1,0,0,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,6],
		[1,1,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,6,1],
		[6,0,0,0,0,0,1],
		[1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,0,1],
		[1,0,0,0,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,0,1],
		[1,0,1,0,1,0,1],
		[1,0,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,0,1],
		[1,0,0,0,1,0,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,1,1],
	],
];
const noHitbox = [0,2,3,4,6];

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
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	// level boundary (change level)
	// left boundary
	if (x1 < 0) {
		if (levels[player.currentLevel][x2b][y1b] == 6
		   && levels[player.currentLevel][x2b][y2b] == 6) {
			player.levelCoord[0]--;
			player.x = (levels[player.currentLevel].length)*blockSize-playerSize;
			player.y = blockSize*levels[player.currentLevel][levels[player.currentLevel].length-1].findIndex(x => x==6)+y1%blockSize;
		} else {
			player.xv = 0;
			player.x = Math.floor(x1/blockSize + 1) * blockSize;
		}
	}
	// right boundary
	if (x2 > levels[player.currentLevel].length*blockSize) {
		if (levels[player.currentLevel][x1b][y1b] == 6
		   && levels[player.currentLevel][x1b][y2b] == 6) {
			player.levelCoord[0]++;
			player.x = 0;
			player.y = blockSize*levels[player.currentLevel][0].findIndex(x => x==6)+y1%blockSize;
		} else {
			player.xv = 0;
			player.x = x2b * blockSize - playerSize;
		}
	}
	// top boundary
	if (y1 < 0) {
		if (levels[player.currentLevel][x1b][y2b] == 6
		   && levels[player.currentLevel][x2b][y2b] == 6) {
			player.levelCoord[1]++;
			player.x = blockSize*levels[player.currentLevel].findIndex(x => x[x.length-1]==6)+x1%blockSize;
			player.y = (levels[player.currentLevel][0].length)*blockSize-playerSize;
		} else {
			player.yv = 0;
			player.y = Math.floor(y1/blockSize + 1) * blockSize;
		}
	}
	// bottom boundary
	if (y2 > levels[player.currentLevel][0].length*blockSize) {
		if (levels[player.currentLevel][x1b][y1b] == 6
		   && levels[player.currentLevel][x2b][y1b] == 6) {
			player.levelCoord[1]--;
			player.x = blockSize*levels[player.currentLevel].findIndex(x => x[0]==6)+x1%blockSize;
			player.y = 0;
		} else {
			player.yv = 0;
			player.y = y2b * blockSize - playerSize;
			player.canJump = true;
		}
	} else player.canJump = false;
	x1 = player.x;
	x2 = player.x+playerSize;
	y1 = player.y;
	y2 = player.y+playerSize;
	x1b = Math.floor(x1/blockSize);
	x2b = Math.floor(x2/blockSize);
	y1b = Math.floor(y1/blockSize);
	y2b = Math.floor(y2/blockSize);
	// block collision
	// left wall
	if ((!noHitbox.includes(levels[player.currentLevel][x1b][y1b])
	    && blockSize-x1%blockSize < blockSize-y1%blockSize)
	   || (!noHitbox.includes(levels[player.currentLevel][x1b][y2b]) 
	      && blockSize-x1%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = Math.floor(x1/blockSize + 1) * blockSize;
	}
	// right wall
	if ((!noHitbox.includes(levels[player.currentLevel][x2b][y1b])
	    && x2%blockSize < blockSize-y1%blockSize)
	   || (!noHitbox.includes(levels[player.currentLevel][x2b][y2b])
	      && x2%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = x2b * blockSize - playerSize;
	}
	// ceiling
	if (((!noHitbox.includes(levels[player.currentLevel][x1b][y1b])
	    && blockSize-x1%blockSize > blockSize-y1%blockSize
	    && noHitbox.includes(levels[player.currentLevel][x1b][y1b+1]))
	   || (!noHitbox.includes(levels[player.currentLevel][x2b][y1b])
	      && x2%blockSize > blockSize-y1%blockSize)
	      && noHitbox.includes(levels[player.currentLevel][x2b][y1b+1]))
	   && player.yv < 0) {
		player.yv = 0;
		player.y = Math.floor(y1/blockSize + 1) * blockSize;
	}
	// floor
	if (((!noHitbox.includes(levels[player.currentLevel][x1b][y2b])
	    && blockSize-x1%blockSize > y2%blockSize
	    && noHitbox.includes(levels[player.currentLevel][x1b][y2b-1]))
	   || (!noHitbox.includes(levels[player.currentLevel][x2b][y2b])
	      && x2%blockSize > y2%blockSize)
	      && noHitbox.includes(levels[player.currentLevel][x2b][y2b-1]))
	   && player.yv > 0) {
		player.yv = 0;
		if (levels[player.currentLevel][x2b][Math.floor(y2/blockSize)] == 5) player.yv = -300;
		player.y = y2b * blockSize - playerSize;
		player.canJump = true;
	}
	x1 = player.x + 1;
	x2 = player.x+playerSize - 1;
	y1 = player.y + 1;
	y2 = player.y+playerSize - 1;
	x1b = Math.floor(x1/blockSize);
	x2b = Math.floor(x2/blockSize);
	y1b = Math.floor(y1/blockSize);
	y2b = Math.floor(y2/blockSize);
	// death block
	if (levels[player.currentLevel][x1b][y1b] == 2
	   || levels[player.currentLevel][x2b][y1b] == 2
	   || levels[player.currentLevel][x1b][y2b] == 2
	   || levels[player.currentLevel][x2b][y2b] == 2) {
		player.levelCoord = [player.spawnPoint[2],player.spawnPoint[3]];
		player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
		player.y = player.spawnPoint[1] * blockSize + blockSize - playerSize;
		player.xv = 0;
		player.yv = 0;
	}
	// checkpoint
	if (levels[player.currentLevel][x1b][y1b] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [x1b,y1b,player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][x1b][y1b] = 4;
	}
	if (levels[player.currentLevel][x2b][y1b] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [x2b,y1b,player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][x2b][y1b] = 4;
	}
	if (levels[player.currentLevel][x1b][y2b] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [x1b,y2b,player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][x1b][y2b] = 4;
	}
	if (levels[player.currentLevel][x2b][Math.floor(y2/blockSize)] == 3) {
		levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
		player.spawnPoint = [x2b,y2b,player.levelCoord[0],player.levelCoord[1]];
		levels[player.currentLevel][x2b][y2b] = 4;
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
			if (type != 0 && type != 6) {
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
