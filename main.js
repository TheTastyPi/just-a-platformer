var savePoint = 0;
const player = {
	x: 50,
	y: 14,
	xv: 0,
	yv: 0,
	g: 80,
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
	[1,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,1,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,1,0,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,1],
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
	player.x += player.xv * dt / 1000;
	player.y += player.yv * dt / 1000;
	// velocity change
	player.xv *= 0.5;
	if (Math.abs(player.xv) < 5) player.xv = 0;
	player.yv += player.g * dt / 1000;
	// collision detection
	let x1 = player.x;
	let x2 = player.x+4;
	let y1 = player.y;
	let y2 = player.y+4;
	if ((level[Math.floor(x1/10)][Math.floor(y1/10)] == 1
	    && 10-x1%10 < 10-y1%10)
	   || (level[Math.floor(x1/10)][Math.floor(y2/10)] == 1
	      && 10-x1%10 < y2%10)) { // left wall
		player.xv = 0;
		player.x = Math.floor(x1/10 + 1) * 10;
	} else if ((level[Math.floor(x2/10)][Math.floor(y1/10)] == 1
		   && x2%10 < 10-y1%10)
	   || (level[Math.floor(x2/10)][Math.floor(y2/10)] == 1
	      && x2%10 < y2%10)) { // right wall
		player.xv = 0;
		player.x = Math.floor(x2/10) * 10 - 4;
	}
	if ((level[Math.floor(x1/10)][Math.floor(y2/10)] == 1
	    && 10-x1%10 > y2%10)
	   || (level[Math.floor(x2/10)][Math.floor(y2/10)] == 1
	      && x2%10 > y2%10)) { // floor
		player.yv = 0;
		player.y = Math.floor(y2/10) * 10 - 4;
		player.canJump = true;
	} else if ((level[Math.floor(x1/10)][Math.floor(y1/10)] == 1
		   && 10-x1%10 > 10-y1%10)
	   || (level[Math.floor(x2/10)][Math.floor(y1/10)] == 1
	      && x2%10 > 10-y1%10)) { // ceiling
		player.yv = 0;
		player.y = Math.floor(y1/10 + 1) * 10;
	}
	// key input
	if (control.up && player.canJump) {
		player.yv = -40;
		player.canJump = false;
	}
	if (control.left) player.xv = -20;
	if (control.right) player.xv = 20;
	// draw + ending stuff
	draw();
	window.requestAnimationFrame(nextFrame);
}
function draw() {
	// setup
	let canvas = document.getElementById("gameScreen");
	let screen = canvas.getContext("2d");
	let lvlx = Math.round((canvas.width - level.length * 10) / 2);
	let lvly = Math.round((canvas.height - level[0].length * 10) / 2);
	screen.clearRect(0,0,canvas.width,canvas.height);
	screen.lineWidth = 0;
	// draw level
	screen.fillStyle = "#000000";
	for (let x in level) {
		for (let y in level[x]) {
			if (level[x][y] == 1) {
				screen.fillRect(lvlx + x * 10, lvly + y * 10, 10, 10);
			}
		}
	}
	// draw player
	screen.fillStyle = "#FF0000";
	screen.fillRect(Math.round(player.x) + lvlx, Math.round(player.y) + lvly, 4, 4);
}
window.requestAnimationFrame(nextFrame);
