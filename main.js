var spawnPoint = [4,7];
var playerSize = 20;
var blockSize = 50;
const player = {
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
const level = [
	[1,1,1,1,1,1,1,1,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,0,1,0,1,1],
	[1,0,0,1,0,0,0,0,2],
	[1,0,0,0,2,0,1,0,1],
	[1,0,0,0,2,0,0,0,1],
	[1,0,1,0,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,2,0,1,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1],
];

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
	// left wall
	if ((level[Math.floor(x1/blockSize)][Math.floor(y1/blockSize)] == 1
	    && blockSize-x1%blockSize < blockSize-y1%blockSize)
	   || (level[Math.floor(x1/blockSize)][Math.floor(y2/blockSize)] == 1 
	      && blockSize-x1%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = Math.floor(x1/blockSize + 1) * blockSize;
	}
	// right wall
	if ((level[Math.floor(x2/blockSize)][Math.floor(y1/blockSize)] == 1
	    && x2%blockSize < blockSize-y1%blockSize)
	   || (level[Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] == 1
	      && x2%blockSize < y2%blockSize)) {
		player.xv = 0;
		player.x = Math.floor(x2/blockSize) * blockSize - playerSize;
	}
	// floor
	if (((level[Math.floor(x1/blockSize)][Math.floor(y2/blockSize)] == 1
	    && blockSize-x1%blockSize > y2%blockSize
	    && level[Math.floor(x1/blockSize)][Math.floor(y2/blockSize)-1] == 0)
	   || (level[Math.floor(x2/blockSize)][Math.floor(y2/blockSize)] == 1
	      && x2%blockSize > y2%blockSize)
	      && level[Math.floor(x2/blockSize)][Math.floor(y2/blockSize)-1] == 0)
	   && player.yv > 0) {
		player.yv = 0;
		player.y = Math.floor(y2/blockSize) * blockSize - playerSize;
		player.canJump = true;
	} else player.canJump = false;
	// ceiling
	if (((level[Math.floor(x1/blockSize)][Math.floor(y1/blockSize)] == 1
	    && blockSize-x1%blockSize > blockSize-y1%blockSize
	    && level[Math.floor(x1/blockSize)][Math.floor(y1/blockSize)+1] == 0)
	   || (level[Math.floor(x2/blockSize)][Math.floor(y1/blockSize)] == 1
	      && x2%blockSize > blockSize-y1%blockSize)
	      && level[Math.floor(x2/blockSize)][Math.floor(y1/blockSize)+1] == 0)
	   && player.yv < 0) {
		player.yv = 0;
		player.y = Math.floor(y1/blockSize + 1) * blockSize;
	}
	// death block
	if (level[Math.floor((player.x + 1)/blockSize)][Math.floor((player.y + 1)/blockSize)] == 2
	   || level[Math.floor((player.x+playerSize - 1)/blockSize)][Math.floor((player.y + 1)/blockSize)] == 2
	   || level[Math.floor((player.x + 1)/blockSize)][Math.floor((player.y+playerSize - 1)/blockSize)] == 2
	   || level[Math.floor((player.x+playerSize - 1)/blockSize)][Math.floor((player.y+playerSize - 1)/blockSize)] == 2) {
		player.x = spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
		player.y = spawnPoint[1] * blockSize + blockSize - playerSize;
	}
	// checkpoint
	if (level[Math.floor((player.x + 1)/blockSize)][Math.floor((player.y + 1)/blockSize)] == 2
	   || level[Math.floor((player.x+playerSize - 1)/blockSize)][Math.floor((player.y + 1)/blockSize)] == 2
	   || level[Math.floor((player.x + 1)/blockSize)][Math.floor((player.y+playerSize - 1)/blockSize)] == 2
	   || level[Math.floor((player.x+playerSize - 1)/blockSize)][Math.floor((player.y+playerSize - 1)/blockSize)] == 2) {
		player.x = spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
		player.y = spawnPoint[1] * blockSize + blockSize - playerSize;
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
	let lvlx = Math.round((canvas.width - level.length * blockSize) / 2);
	let lvly = Math.round((canvas.height - level[0].length * blockSize) / 2);
	screen.clearRect(0,0,canvas.width,canvas.height);
	screen.lineWidth = 0;
	// draw level
	for (let x in level) {
		for (let y in level[x]) {
			let type = level[x][y];
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
