var game = {}; // i'll add something here later
function nextFrame(timeStamp) {
	draw();
}
function draw() {
	let screen = document.getElementById("gameScreen").getContext("2d");
	// something to do something
}
window.requestAnimationFrame(nextFrame);
