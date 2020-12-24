var savePoint = 0;
const player = {
	x: 25,
	y: 50,
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
	[0,0,1,1,1,0,1,0,1],
	[0,1,1,1,0,1,1,1,1],
	[0,0,0,1,1,0,0,0,1],
	[0,1,1,1,0,1,1,1,1],
	[1,1,1,1,1,1,1,1,1]
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
	if (level[Math.floor((player.x)/10)][Math.floor((player.y + 4)/10)] == 1
	   || level[Math.floor((player.x + 4)/10)][Math.floor((player.y + 4)/10)] == 1) { // floor
		player.yv = 0;
		player.y = Math.floor((player.y + 4)/10) * 10 - 4;
		player.canJump = true;
	}
	if (level[Math.floor((player.x)/10)][Math.floor((player.y)/10)] == 1
	   || level[Math.floor((player.x + 4)/10)][Math.floor((player.y)/10)] == 1) { // ceiling
		player.yv = 0;
		player.y = Math.floor((player.y)/10) * 10;
	}
	if (level[Math.floor((player.x)/10)][Math.floor((player.y)/10)] == 1
	   || level[Math.floor((player.x)/10)][Math.floor((player.y + 4)/10)] == 1) { // left wall
		player.xv = 0;
		player.x = Math.floor((player.x)/10) * 10;
	}
	if (level[Math.floor((player.x + 4)/10)][Math.floor((player.y)/10)] == 1
	   || level[Math.floor((player.x + 4)/10)][Math.floor((player.y + 4)/10)] == 1) { // right wall
		player.xv = 0;
		player.x = Math.floor((player.x + 4)/10) * 10 - 4;
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
