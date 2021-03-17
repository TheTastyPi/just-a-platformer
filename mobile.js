const mobileConfig = {
	main: [["a", "d"]],
	left: [["w"]],
};

const mobileDiv = document.getElementById("mobileControls")
const leftDiv = document.getElementById("mobileControlsLeft")

// stolen from https://stackoverflow.com/a/11381730
function detectMobile() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i,
	];

	return toMatch.some(toMatchItem => navigator.userAgent.match(toMatchItem));
}

function simulateKeypress(key, type) {
	document.dispatchEvent(new KeyboardEvent(`key${type}`, { code: `Key${key.toUpperCase()}` }));
}

function makeEl(thing) {
	const mobileEl = document.createElement("table");
	for (const id in thing) {
		const row = thing[id];
		const rowEl = document.createElement("tr");
		for (const col in row) {
			const colEl = document.createElement("td");
			const buttonEl = document.createElement("button");
			buttonEl.textContent = row[col];
			buttonEl.style.width = "100px";
			buttonEl.style.height = "100px";
			buttonEl.style.fontSize = "50px";
			buttonEl.style.fontFamily = "monospace";
			buttonEl.style.textAlign = "center";
			buttonEl.style.background = "rgba(255, 255, 255, 50%)";
			buttonEl.style.border = "solid thin black";
			buttonEl.style.borderRadius = "5px";
			buttonEl.style.padding = "0";
			buttonEl.style.touchAction = "manipulation";
			buttonEl.style.userSelect = "none";
			buttonEl.style.webkitUserSelect = "none";
			buttonEl.addEventListener("touchstart", e => {
				simulateKeypress(row[col], "down")
				e.preventDefault()
			});
			buttonEl.addEventListener("touchend", e => {
				simulateKeypress(row[col], "up")
				e.preventDefault()
			});
			if (row[col] !== null) colEl.appendChild(buttonEl);
			rowEl.appendChild(colEl);
		}
		mobileEl.appendChild(rowEl);
	}
	return mobileEl
}

const isMobile = detectMobile();
if (isMobile) {
	const mobileEl = makeEl(mobileConfig.main);
	mobileDiv.appendChild(mobileEl)

	const leftEl = makeEl(mobileConfig.left);
	leftDiv.appendChild(leftEl)
}
