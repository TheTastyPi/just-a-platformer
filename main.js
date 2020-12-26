var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
const player = {
	spawnPoint: [4,7,0,0,400],
	levelCoord: [0,1],
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
	[5,0,1],
	[4,3,2],
]
const levels = [
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,0,1,0,0,0,1],
		[1,0,0,0,0,1,0,1,1],
		[1,0,0,1,0,0,0,0,2],
		[1,0,0,0,2,0,1,3,1],
		[1,0,0,0,2,0,0,0,1],
		[0,0,5,0,1,0,0,0,1],
		[1,0,0,0,2,0,1,1,1],
		[1,2,0,1,2,0,0,0,0],
		[1,1,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,1,0,0,0,1,1],
		[1,0,0,0,1,0,0,1,3],
		[1,0,1,0,2,0,0,0,0],
		[1,0,2,0,1,0,5,0,1],
		[1,0,1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1,0,1],
		[1,0,2,0,5,0,0,0,1],
		[1,0,0,0,0,1,0,0,2],
		[1,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,3,1],
		[1,0,1,0,0,0,0,0,1],
		[1,0,2,0,0,0,0,0,5],
		[1,0,0,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0],
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
	[
		[1,1,0,1,1,1,1],
		[1,1,0,2,0,5,1],
		[2,0,0,0,0,2,1],
		[5,0,7,2,0,1,1],
		[2,0,0,2,0,0,5],
		[1,1,1,1,1,3,1],
		[0,0,0,0,0,0,2],
		[1,1,1,1,1,1,1],
	],
	[
		[5,5,5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[5,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,1,5,5,1,0,0,2,0,0,8,0,0,2,2,3,1,0,5,7,2,0,5,7,8,5,0,0,0,5,0,0,0,2,0,0,2,0,0,1,3,1],
		[0,8,0,0,7,0,1,2,7,7,2,0,7,0,2,0,0,0,2,0,0,0,8,0,0,2,3,1,0,2,0,0,0,0,0,0,2,0,0,0,0,1],
		[5,5,5,5,1,0,0,8,0,0,0,2,0,8,0,7,2,0,8,0,0,2,2,0,0,0,0,5,0,8,0,0,2,0,0,0,0,0,0,1,0,1],
		[5,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
		[5,1,5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,0,1],
	],
];
const noHitbox = [-1,0,2,3,4,6,7,8];

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

function getBlockType(x,y) {
	if (x < 0 || x >= levels[player.currentLevel].length || y < 0 || y >= levels[player.currentLevel][0].length) {
		if (levels[player.currentLevel][x-1] != undefined) {
			if (levels[player.currentLevel][x-1][y] == 0) return 6;
		}
		if (levels[player.currentLevel][x+1] != undefined) {
			if (levels[player.currentLevel][x+1][y] == 0) return 6;
		}
		if (levels[player.currentLevel][x] != undefined) {
			if (levels[player.currentLevel][x][y-1] == 0 || levels[player.currentLevel][x][y+1] == 0) return 6;
		}
		return 1;
	}
	return levels[player.currentLevel][x][y];
}

var lastFrame = 0;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	if (dt < 100) {
		// position change based on velocity
		player.x += player.xv * dt / 500 * gameSpeed;
		player.y += player.yv * dt / 500 * gameSpeed;
		// velocity change
		player.xv *= 0.5;
		if (Math.abs(player.xv) < 5) player.xv = 0;
		player.yv += player.g * dt / 500 * gameSpeed;
		if (Math.abs(player.yv) > Math.abs(player.g)) player.yv = player.g;
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
		if ((!noHitbox.includes(getBlockType(x1b,y1b))
		    && blockSize-(x1+blockSize)%blockSize < blockSize-(y1+blockSize)%blockSize)
		   || (!noHitbox.includes(getBlockType(x1b,y2b)) 
		      && blockSize-(x1+blockSize)%blockSize < y2%blockSize)) {
			player.xv = 0;
			player.x = (x1b + 1) * blockSize;
		}
		// right wall
		if ((!noHitbox.includes(getBlockType(x2b,y1b))
		    && x2%blockSize < blockSize-(y1+blockSize)%blockSize)
		   || (!noHitbox.includes(getBlockType(x2b,y2b))
		      && x2%blockSize < y2%blockSize)) {
			player.xv = 0;
			player.x = x2b * blockSize - playerSize;
		}
		// ceiling
		if (((!noHitbox.includes(getBlockType(x1b,y1b))
		    && blockSize-(x1+blockSize)%blockSize > blockSize-(y1+blockSize)%blockSize
		    && noHitbox.includes(getBlockType(x1b,y1b+1)))
		   || (!noHitbox.includes(getBlockType(x2b,y1b))
		      && x2%blockSize > blockSize-(y1+blockSize)%blockSize)
		      && noHitbox.includes(getBlockType(x2b,y1b+1)))
		   && player.yv < 0) {
			player.yv = 0;
			if (((getBlockType(x2b,y1b) == 5 && getBlockType(x1b,y1b) == 5)
			   || ((getBlockType(x2b,y1b) == 5 || getBlockType(x1b,y1b) == 5)
			       && (noHitbox.includes(getBlockType(x2b,y1b)) || noHitbox.includes(getBlockType(x1b,y1b)))))
			   && player.g < 0) player.yv = -player.g*3/4;
			player.y = (y1b + 1) * blockSize;
			if (player.g < 0 && player.yv <= 0) player.canJump = true;
		} else if (player.g < 0) player.canJump = false;
		// floor
		if (((!noHitbox.includes(getBlockType(x1b,y2b))
		    && blockSize-(x1+blockSize)%blockSize > y2%blockSize
		    && noHitbox.includes(getBlockType(x1b,y2b-1)))
		   || (!noHitbox.includes(getBlockType(x2b,y2b))
		      && x2%blockSize > y2%blockSize)
		      && noHitbox.includes(getBlockType(x2b,y2b-1)))
		   && player.yv > 0) {
			player.yv = 0;
			if (((getBlockType(x2b,y2b) == 5 && getBlockType(x1b,y2b) == 5)
			   || ((getBlockType(x2b,y2b) == 5 || getBlockType(x1b,y2b) == 5)
			       && (noHitbox.includes(getBlockType(x2b,y2b)) || noHitbox.includes(getBlockType(x1b,y2b)))))
			   && player.g > 0) player.yv = -player.g*3/4;
			player.y = y2b * blockSize - playerSize;
			if (player.g > 0 && player.yv >= 0) player.canJump = true;
		} else if (player.g > 0) player.canJump = false;
		x1 = player.x + 1;
		x2 = player.x+playerSize - 1;
		y1 = player.y + 1;
		y2 = player.y+playerSize - 1;
		x1b = Math.floor(x1/blockSize);
		x2b = Math.floor(x2/blockSize);
		y1b = Math.floor(y1/blockSize);
		y2b = Math.floor(y2/blockSize);
		// checkpoint
		if (getBlockType(x1b,y1b) == 3) {
			levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			player.spawnPoint = [x1b,y1b,player.levelCoord[0],player.levelCoord[1],player.g];
			levels[player.currentLevel][x1b][y1b] = 4;
		}
		if (getBlockType(x2b,y1b) == 3) {
			levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			player.spawnPoint = [x2b,y1b,player.levelCoord[0],player.levelCoord[1],player.g];
			levels[player.currentLevel][x2b][y1b] = 4;
		}
		if (getBlockType(x1b,y2b) == 3) {
			levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			player.spawnPoint = [x1b,y2b,player.levelCoord[0],player.levelCoord[1],player.g];
			levels[player.currentLevel][x1b][y2b] = 4;
		}
		if (getBlockType(x2b,y2b) == 3) {
			levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			player.spawnPoint = [x2b,y2b,player.levelCoord[0],player.levelCoord[1],player.g];
			levels[player.currentLevel][x2b][y2b] = 4;
		}
		// anti-grav
		if (getBlockType(x1b,y1b) == 7
		   || getBlockType(x2b,y1b) == 7
		   || getBlockType(x1b,y2b) == 7
		   || getBlockType(x2b,y2b) == 7) {
			if (player.g > 0) player.g = -player.g;
		}
		if (getBlockType(x1b,y1b) == 8
		   || getBlockType(x2b,y1b) == 8
		   || getBlockType(x1b,y2b) == 8
		   || getBlockType(x2b,y2b) == 8) {
			if (player.g < 0) player.g = -player.g;
		}
		// death block
		if (getBlockType(x1b,y1b) == 2
		   || getBlockType(x2b,y1b) == 2
		   || getBlockType(x1b,y2b) == 2
		   || getBlockType(x2b,y2b) == 2) {
			player.levelCoord = [player.spawnPoint[2],player.spawnPoint[3]];
			player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
			player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize)/2;
			player.xv = 0;
			player.yv = 0;
			player.g = player.spawnPoint[4];
		}
		// level warp
		if (getBlockType(x1b,y1b) == 6
		   || getBlockType(x2b,y1b) == 6
		   || getBlockType(x1b,y2b) == 6
		   || getBlockType(x2b,y2b) == 6) {
			// left
			if (x1 < 0) {
				player.levelCoord[0]--;
				player.x = levels[player.currentLevel].length * blockSize - playerSize;
				player.y = blockSize*levels[player.currentLevel][levels[player.currentLevel].length-1].findIndex(x => x==0)+(y1+blockSize)%blockSize;
			}
			// right
			if (x2 > levels[player.currentLevel].length * blockSize) {
				player.levelCoord[0]++;
				player.x = 0;
				player.y = blockSize*levels[player.currentLevel][0].findIndex(x => x==0)+(y1+blockSize)%blockSize;
			}
			// up
			if (y1 < 0) {
				player.levelCoord[1]++;
				player.y = levels[player.currentLevel][0].length * blockSize - playerSize;
				player.x = blockSize*levels[player.currentLevel].findIndex(x => x[x.length-1]==0)+(x1+blockSize)%blockSize;
			}
			// down
			if (y2 > levels[player.currentLevel][0].length * blockSize) {
				player.levelCoord[1]--;
				player.y = 0;
				player.x = blockSize*levels[player.currentLevel].findIndex(x => x[0]==0)+(x1+blockSize)%blockSize;
			}
		}
		// key input
		if (control.up && player.canJump) player.yv = -player.g/2;
		if (control.left) player.xv = -100;
		if (control.right) player.xv = 100;
		// draw + ending stuff
		draw();
	}
	window.requestAnimationFrame(nextFrame);
}
function draw() {
	// setup
	let canvas = document.getElementById("gameScreen");
	let screen = canvas.getContext("2d");
	let lvlx = Math.round((canvas.width - levels[player.currentLevel].length*blockSize) / 2);
	if (lvlx < 0) {
		lvlx = canvas.width/2 - (player.x+playerSize/2);
		if (lvlx > 0) lvlx = 0;
		if (lvlx < canvas.width - levels[player.currentLevel].length*blockSize) lvlx = levels[player.currentLevel].length*blockSize - canvas.width;
	}
	let lvly = Math.round((canvas.height - levels[player.currentLevel][0].length*blockSize) / 2);
	if (lvly < 0) {
		lvly = canvas.height/2 - (player.y+playerSize/2);
		if (lvly > 0) lvly = 0;
		if (lvly < canvas.height - levels[player.currentLevel][0].length*blockSize) lvly = canvas.height - levels[player.currentLevel][0].length*blockSize;
	}
	screen.clearRect(0,0,canvas.width,canvas.height);
	screen.lineWidth = 0;
	// draw level
	for (let x in levels[player.currentLevel]) {
		for (let y in levels[player.currentLevel][x]) {
			let type = getBlockType(x,y);
			if (type != -1 && type != 0 && type != 6) {
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
					case 7:
						screen.fillStyle = "#FF8888";
						break;
					case 8:
						screen.fillStyle = "#8888FF";
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
