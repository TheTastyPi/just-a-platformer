const mobileDiv = id("mobileControls");
const leftDiv = id("mobileControlsLeft");
const topDiv = id("mobileControlsTop");

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

function simulateKeypress(code, type, shiftKey = false, ctrlKey = false) {
	document.dispatchEvent(
		new KeyboardEvent(`key${type}`, { code, shiftKey, ctrlKey })
	);
}

function makeEl(thing) {
	const mobileEl = document.createElement("table");
	for (const id in thing) {
		const row = thing[id];
		const rowEl = document.createElement("tr");
		for (const col in row) {
			const colEl = document.createElement("td");
			const buttonEl = document.createElement("button");
			buttonEl.textContent = row[col].disp;
			buttonEl.classList.add("mobileBtn")
			buttonEl.addEventListener("touchstart", e => {
				simulateKeypress(row[col].key, "down");
				e.preventDefault();
			});
			buttonEl.addEventListener("touchend", e => {
				simulateKeypress(row[col].key, "up");
				e.preventDefault();
			});
			if (row[col] !== null) colEl.appendChild(buttonEl);
			rowEl.appendChild(colEl);
		}
		mobileEl.appendChild(rowEl);
	}
	return mobileEl;
}

function makeMoreMenuEl() {
	const mobileEl = document.createElement("div");
	// mobileEl.style.marginTop = "50px";
	for (const key in mobileConfig.more) {
		const val = mobileConfig.more[key];
		const moreEl = document.createElement("button");
		moreEl.innerHTML = `<span class="mobileMoreBtnDesc">${val[0]}</span> <span class="mobileMoreBtnKey">${val[1]}</span>`;
		moreEl.classList.add("mobileMoreBtn");
		moreEl.addEventListener("click", e => {
			simulateKeypress(val[2], "down", val[3] ?? false, val[4] ?? false);
			openMoreMenu();
			e.preventDefault();
		})
		mobileEl.appendChild(moreEl);
	}
	const mobileParentEl = document.createElement("div");
	mobileParentEl.appendChild(mobileEl);
	topDiv.appendChild(mobileParentEl);
}

function openMoreMenu() {
	if (topDiv.childElementCount > 1) {
		topDiv.lastElementChild.remove();
	} else {
		makeMoreMenuEl();
	}
}

const isMobile = detectMobile();
if (isMobile) {
	const mobileEl = makeEl(mobileConfig.main);
	mobileDiv.appendChild(mobileEl);

	const leftEl = makeEl(mobileConfig.left);
	leftDiv.appendChild(leftEl);

	topDiv.style.display = "block";
	if (id("infoOpen")) {
		id("infoOpen").style.display = "none";
	}
	if (id("mainInfo")) id("mainInfo").style.fontSize = "20px";
}
