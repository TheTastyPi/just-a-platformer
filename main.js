var savePoint = 0; // i'll add something here later
const player = {
	x: 50,
	y: 50,
	xv: 0,
	yv: 0,
};
var grav = 5;
var lastFrame = 0;
function nextFrame(timeStamp) {
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	player.x += player.xv * dt / 1000;
	player.y += player.yv * dt / 1000;
	player.xv -= 5;
	draw();
	window.requestAnimationFrame(nextFrame);
}
function draw() {
	let screen = document.getElementById("gameScreen").getContext("2d");
	screen.clearRect(0,0,"100%","100%");
	
	screen.fillStyle = "#FF0000";
	screen.fillRect(player.x, player.y, 5, 5);
}
window.requestAnimationFrame(nextFrame);
