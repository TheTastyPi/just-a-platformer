var savePoint = 0; // i'll add something here later
const player = {
	x: 50,
	y: 50,
	xv: 0,
	yv: 0,
	g: 20,
	canJump: false,
};

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			player.yv = -40;
			break;
		case "ArrowLeft":
		case "KeyA":
			player.xv = -20;
			break;
		case "ArrowRight":
		case "KeyD":
			player.xv = 20;
			break;
			
	}
});

var lastFrame = 0;
function nextFrame(timeStamp) {
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	
	player.x += player.xv * dt / 1000;
	player.y += player.yv * dt / 1000;
	
	player.xv *= 0.5;
	if (Math.abs(player.xv) < 5) player.xv = 0;
	player.yv += player.g * dt / 1000;
	
	draw();
	window.requestAnimationFrame(nextFrame);
}
function draw() {
	let canvas = document.getElementById("gameScreen");
	let screen = canvas.getContext("2d");
	screen.clearRect(0,0,canvas.width,canvas.height);
	
	screen.fillStyle = "#FF0000";
	screen.fillRect(player.x, player.y, 5, 5);
}
window.requestAnimationFrame(nextFrame);
