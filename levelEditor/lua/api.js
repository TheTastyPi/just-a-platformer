const luactx = id("luaLayer").getContext("2d");

const propBindings = {
	gravity: "g",
	sidewaysGrav: "xg",
	maxJumps: "maxJumps",
	currentJumps: "currentJumps",
	speed: "moveSpeed",
	size: "targetSize",
	realSize: "size",
	gameSpeed: "gameSpeed",
	timerInterval: "timerInterval",
	x: "x",
	y: "y",
	xv: "xv",
	yv: "yv",
	coins: "coins"
};

const APIGlobals = {
	setBlock(x, y, val) {
		// TODO this is probably really unsafe?? idk
		level[x][y] = val;
		drawBlock(id("levelLayer"), x, y)
	},
	getBlock(x, y) {
		return level[x][y];
	},
	// 0 -> 255
	// set r to `false` to revert to default
	setPlayerColor(r, g, b) {
		if (r === false) player.customColor = false;
		else player.customColor = [r, g, b];
		drawPlayer();
	},
	getPlayerColor() {
		if (player.customColor) return player.customColor;
		let ratio = player.currentJumps / player.maxJumps, out;
		if (player.maxJumps === Infinity) ratio = 1;
		if (player.maxJumps === 0) ratio = 0;
		if (options.darkMode) out = [255 - ratio * 255 * 0.75, 255 * 0.25, ratio * 255 * 0.75 + 255 * 0.25];
		else out = [255 - ratio * 255, 0, ratio * 255];
		return out;
	},
	// no set because that could be bad
	getOption(id) {
		return options[id];
	},
	// 1 block = 50x/y
	setCoords(x, y) {
		player.x = x;
		player.y = y;
		drawPlayer();
	},
	getCoords() {
		return {
			x: player.x,
			y: player.y
		}
	},

	getProp(prop) {
		if (propBindings[prop]) return player[propBindings[prop]];
		this.error(`Trying to get unknown property ${prop}`);
	},
	setProp(prop, value) {
		if (propBindings[prop]) player[propBindings[prop]] = value;
		else this.error(`Trying to set unknown property ${prop} to ${value}`);

		if (prop === "x" || prop === "y") drawPlayer();
	},

	print(...args) {
		printHandler(args, "info")
	},
	warn(...args) {
		printHandler(args, "warn")
	},
	error(...args) {
		printHandler(args, "error")
	},
	// TODO add more `layer` functions?
	layer: {
		clear() {
			luactx.clearRect(0, 0, 10000, 10000);
		},
		// intensity 0 to 1, 0 = nothing, 1 = solid fill
		filter(r, g, b, intensity) {
			luactx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`
			luactx.fillRect(0, 0, 10000, 10000);
		},
	},
	lock({ teleporting, building, godMode, noclip }) {
		locks.teleporting = teleporting ?? false;
		locks.building = building ?? false;
		locks.godMode = godMode ?? false;
		locks.noclip = noclip ?? false;
	},
	fill(x, y, w, h, id) {
		if (x + w > level.length || y + h > level[1].length) this.error("Filling beyond level boundaries!");
		else if (w < 1 || h < 1) this.error("Negative width or height.");
		else if (x < 0 || y < 0) this.error("Negative x or y.");
		else {
			for (let i = x; i < x + w; i++) {
				for (let j = y; j < y + h; j++) {
					level[i][j] = id;
				}
			}
		}
	},
	respawn,
};

let printedMessages = [];
let keep = {};
let locks = {
	teleporting: false,
	building: false,
	godMode: false,
	noclip: false,
}

let code = "";
let isFirstRun = true;
let errored = false;

function runCode(miscGlobals) {
	const out = fluaRunWithGlobals(
		{
			...APIGlobals,
			...miscGlobals,
			keep,
		},
		code,
		["keep"]
	);

	keep = out.keep;
}

function updateCode() {
	code = id("editor").editor.getValue();
	isFirstRun = true;
	errored = false;
	keep = {};
	locks = {
		building: false,
		godMode: false,
		noclip: false,
	}
	APIGlobals.layer.clear();
}

function printHandler(args, type) {
	args.forEach(msg => {
		printedMessages.push({ msg, type });
	});

	updatePrintedMessages();
}

function updatePrintedMessages() {
	while (printedMessages.length > 10) {
		printedMessages.shift();
	}

	drawPrintedMessages();
}

function drawPrintedMessages() {
	Array.from(id("luaConsole").children).forEach(child => child.remove());
	printedMessages.forEach(({ msg, type }) => {
		const el = document.createElement("span");
		el.textContent = msg;
		el.classList.add(`lua-${type}`)

		id("luaConsole").appendChild(el);
	});
}

// https://stackoverflow.com/a/13640097
const keys = {};
window.addEventListener("keydown", e => {
	keys[e.key] = true;
});

window.addEventListener("keyup", e => {
	delete keys[e.key];
});
