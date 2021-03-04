/*/
TODO 
- speed section
- final section
- secret section? :o
/*/
var currentVersion = 0.3;
var gameSpeed = 1;
var player = {
  spawnPoint: newSave(),
  levelCoord: [0, 0],
  get currentLevel() {
    return worldMap[player.levelCoord[0]][player.levelCoord[1]];
  },
  x: 0,
  y: 0,
  xv: 0,
  yv: 0,
  g: 325,
  canWalljump: false,
  currentJumps: 0,
  maxJumps: 1,
  moveSpeed: 600,
  triggers: [],
  godMode: false
};
const control = {
  left: false,
  right: false
};
const hasHitbox = [1, 5, 11];

document.addEventListener("keydown", function (input) {
  let key = input.code;
  switch (key) {
    case "ArrowUp":
    case "KeyW":
      if (player.canWalljump) {
        if (player.wallJumpDir == "left") {
          player.xv = -player.moveSpeed;
          player.yv = -Math.sign(player.g) * 205;
        }
        if (player.wallJumpDir == "right") {
          player.xv = player.moveSpeed;
          player.yv = -Math.sign(player.g) * 205;
        }
      } else if (player.currentJumps > 0 || player.godMode) {
        player.yv = -Math.sign(player.g) * 205;
        player.currentJumps--;
      }
      break;
    case "ArrowLeft":
    case "KeyA":
      control.left = true;
      break;
    case "ArrowRight":
    case "KeyD":
      control.right = true;
      break;
    case "Delete":
      wipeSave();
      break;
    case "KeyR":
      if (input.shiftKey) {
        if (confirm("Are you sure you want to go back to the start?")) {
          player.spawnPoint = newSave();
          player.spawnPoint[7] = player.triggers;
          respawn();
          drawLevel();
        }
      } else {
        respawn();
        drawLevel();
      }
      break;
    case "KeyI":
      openInfo();
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", function (input) {
  let key = input.code;
  switch (key) {
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
  dt *= gameSpeed;
  lastFrame = timeStamp;
  if (dt < 100 * gameSpeed) {
    dt = dt / 100;
    let xprev = player.x;
    let yprev = player.y;
    let lvlxprev = player.levelCoord[0];
    let lvlyprev = player.levelCoord[1];
    let triggersPrev = [...player.triggers];
    let shouldDrawLevel = false;
    for (let i = 0; i < 100; i++) {
      // velocity change
      player.xv *= Math.pow(0.5, dt / 12);
      if (Math.abs(player.xv) < 5) player.xv = 0;
      if (
        (player.yv > player.g && player.g > 0) ||
        (player.yv < player.g && player.g < 0)
      ) {
        player.yv -= (player.g * dt) / 500;
        if (Math.abs(player.yv) < player.g) player.yv = player.g;
      } else {
        player.yv += (player.g * dt) / 500;
      }
      // position change based on velocity
      player.x += (player.xv * dt) / 500;
      player.y += (player.yv * dt) / 500;
      // collision detection
      let x1 = player.x;
      let x2 = player.x + playerSize;
      let y1 = player.y;
      let y2 = player.y + playerSize;
      let x1b = Math.floor(x1 / blockSize);
      let x2b = Math.floor(x2 / blockSize);
      let y1b = Math.floor(y1 / blockSize);
      let y2b = Math.floor(y2 / blockSize);
      // left wall
      if (isTouching("left")) {
        if (
          (getBlockType(x1b, y1b) == 11 || getBlockType(x1b, y2b) == 11) &&
          control.left
        ) {
          if (player.yv > player.g / 10 && player.g > 0)
            player.yv = player.g / 10;
          if (player.yv < player.g / 10 && player.g < 0)
            player.yv = player.g / 10;
          player.canWalljump = true;
          player.wallJumpDir = "right";
        } else if (i == 0) player.canWalljump = false;
        player.xv = 0;
        player.x = (x1b + 1) * blockSize;
      } else if (isTouching("right")) {
        // right wall
        if (
          (getBlockType(x2b, y1b) == 11 || getBlockType(x2b, y2b) == 11) &&
          control.right
        ) {
          if (player.yv > player.g / 10 && player.g > 0)
            player.yv = player.g / 10;
          if (player.yv < player.g / 10 && player.g < 0)
            player.yv = player.g / 10;
          player.canWalljump = true;
          player.wallJumpDir = "left";
        } else if (i == 0) player.canWalljump = false;
        player.xv = 0;
        player.x = x2b * blockSize - playerSize;
      } else if (i == 0) player.canWalljump = false;
      // ceiling
      if (isTouching("up")) {
        player.yv = 0;
        if (
          ((getBlockType(x2b, y1b) == 5 && getBlockType(x1b, y1b) == 5) ||
            ((getBlockType(x2b, y1b) == 5 || getBlockType(x1b, y1b) == 5) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        )
          player.yv = -Math.sign(player.g) * 275;
        player.y = (y1b + 1) * blockSize;
        if (player.g < 0 && player.yv <= 0)
          player.currentJumps = player.maxJumps;
      } else if (player.g < 0 && player.currentJumps == player.maxJumps)
        player.currentJumps = player.maxJumps - 1;
      // floor
      if (isTouching("down")) {
        player.yv = 0;
        if (
          ((getBlockType(x2b, y2b) == 5 && getBlockType(x1b, y2b) == 5) ||
            ((getBlockType(x2b, y2b) == 5 || getBlockType(x1b, y2b) == 5) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        )
          player.yv = -Math.sign(player.g) * 275;
        player.y = y2b * blockSize - playerSize;
        if (player.g > 0 && player.yv >= 0)
          player.currentJumps = player.maxJumps;
      } else if (player.g > 0 && player.currentJumps == player.maxJumps)
        player.currentJumps = player.maxJumps - 1;
      // checkpoint
      if (isTouching("any", 3)) {
        let coord = getCoord(3);
        if (!isSpawn(coord[0], coord[1])) {
          player.spawnPoint = [
            coord[0],
            coord[1],
            player.levelCoord[0],
            player.levelCoord[1],
            player.g,
            player.maxJumps,
            player.moveSpeed,
            [...player.triggers],
            currentVersion
          ];
          shouldDrawLevel = true;
          save();
        }
      }
      // anti-grav
      if (isTouching("any", 6)) {
        if (player.g > 0) player.g = -player.g;
      }
      if (isTouching("any", 7)) {
        if (player.g < 0) player.g = -player.g;
      }
      // grav magnitude
      if (isTouching("any", 8)) {
        player.g = Math.sign(player.g) * 170;
      }
      if (isTouching("any", 9)) {
        player.g = Math.sign(player.g) * 325;
      }
      if (isTouching("any", 10)) {
        player.g = Math.sign(player.g) * 650;
      }
      // multi-jump
      if (isTouching("any", 12)) {
        player.maxJumps = 0;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 13)) {
        player.maxJumps = 1;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 14)) {
        player.maxJumps = 2;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 15)) {
        player.maxJumps = 3;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 16)) {
        player.maxJumps = Infinity;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 21)) player.moveSpeed = 300;
      if (isTouching("any", 22)) player.moveSpeed = 600;
      if (isTouching("any", 23)) player.moveSpeed = 1200;
      // death block
      if ((isTouching("any", 2) || isTouching("any", -4)) && !player.godMode)
        respawn();
      x1 = player.x + 1;
      x2 = player.x + playerSize - 1;
      y1 = player.y + 1;
      y2 = player.y + playerSize - 1;
      // trigger block
      if (isTouching("any", -3)) {
        let coord = getCoord(-3);
        let trigger = levels[player.currentLevel][coord[0]][coord[1]];
        if (!player.triggers.includes(trigger[1]))
          player.triggers.push(trigger[1]);
      }
      // triggers
      if (!player.triggers.includes(-1)) {
        levels[9][5][5] = 0;
        levels[9][5][4] = 0;
        levels[9][5][2] = 0;
        levels[9][5][1] = 0;
        levels[9][8][5] = 0;
        levels[9][10][1] = 0;
        levels[9][13][1] = 0;
      } else {
        levels[9][5][5] = 7;
        levels[9][5][4] = 6;
        levels[9][5][2] = 7;
        levels[9][5][1] = 6;
        levels[9][8][5] = 7;
        levels[9][10][1] = 6;
        levels[9][13][1] = 7;
      }
      if (!player.triggers.includes(-2)) {
        levels[9][7][5] = 0;
        levels[9][7][4] = 0;
        levels[9][7][2] = 0;
        levels[9][7][1] = 0;
      } else {
        levels[9][7][5] = 13;
        levels[9][7][4] = 16;
        levels[9][7][2] = 16;
        levels[9][7][1] = 13;
      }
      if (!player.triggers.includes(-3)) {
        levels[9][10][2] = 1;
        levels[9][10][3] = 1;
        levels[9][10][5] = 1;
      } else {
        levels[9][10][2] = 11;
        levels[9][10][3] = 11;
        levels[9][10][5] = 11;
      }
      if (!player.triggers.includes(-4)) {
        levels[9][11][1] = 0;
        levels[9][11][5] = 0;
        levels[9][13][5] = 0;
      } else {
        levels[9][11][1] = 22;
        levels[9][11][5] = 23;
        levels[9][13][5] = 22;
      }
      if (player.triggers.includes(0)) {
        levels[22][6][4] = 0;
      } else levels[22][6][4] = -4;
      if (player.triggers.includes(1)) {
        levels[22][6][5] = 0;
      } else levels[22][6][5] = -4;
      if (player.triggers.includes(2)) {
        levels[26][27][1] = 0;
        levels[26][27][2] = 0;
      } else {
        levels[26][27][1] = -4;
        levels[26][27][2] = -4;
      }
      if (player.triggers.includes(3)) {
        levels[26][28][1] = 0;
        levels[26][28][2] = 0;
      } else {
        levels[26][28][1] = -4;
        levels[26][28][2] = -4;
      }
      if (player.triggers.includes(4)) {
        levels[26][29][1] = 0;
        levels[26][29][2] = 0;
      } else {
        levels[26][29][1] = -4;
        levels[26][29][2] = -4;
      }
      if (player.triggers.includes(5)) {
        levels[26][31][11] = 0;
        levels[26][31][12] = 0;
      } else {
        levels[26][31][11] = -4;
        levels[26][31][12] = -4;
      }
      if (player.triggers.includes(6)) {
        levels[26][32][11] = 0;
        levels[26][32][12] = 0;
      } else {
        levels[26][32][11] = -4;
        levels[26][32][12] = -4;
      }
      if (player.triggers.includes(7)) {
        levels[26][33][11] = 0;
        levels[26][33][12] = 0;
      } else {
        levels[26][33][11] = -4;
        levels[26][33][12] = -4;
      }
      if (player.triggers.includes(8)) {
        levels[26][38][1] = 0;
      } else levels[26][38][1] = -4;
      if (player.triggers.includes(9)) {
        levels[26][39][1] = 0;
      } else levels[26][39][1] = -4;
      if (player.triggers.includes(10)) {
        levels[32][15][3] = 0;
      } else levels[32][15][3] = -4;
      if (player.triggers.includes(11)) {
        levels[32][9][1] = 0;
      } else levels[32][9][1] = -4;
      if (player.triggers.includes(12)) {
        levels[32][7][3] = 0;
      } else levels[32][7][3] = -4;
      if (player.triggers.includes(13)) {
        levels[32][3][3] = 0;
      } else levels[32][3][3] = -4;
      if (player.triggers.includes(14)) {
        levels[32][1][4] = 0;
      } else levels[32][1][4] = -4;
      if (player.triggers.includes(15)) {
        levels[35][15][4] = 0;
        levels[35][15][5] = 0;
      } else {
        levels[35][15][4] = -4;
        levels[35][15][5] = -4;
      }
      if (player.triggers.includes(16)) {
        levels[42][12][9] = 0;
      } else levels[42][12][9] = -4;
      if (player.triggers.includes(17)) {
        levels[42][1][1] = 0;
      } else levels[42][1][1] = -4;
      if (player.triggers.includes(18)) {
        levels[43][10][6] = 0;
      } else levels[43][10][6] = -4;
      if (player.triggers.includes(19)) {
        levels[43][5][9] = 0;
      } else levels[43][5][9] = -4;
      if (player.triggers.includes(20)) {
        levels[43][7][10] = 0;
      } else levels[43][7][10] = -4;
      if (player.triggers.includes(21)) {
        levels[43][6][12] = 0;
      } else levels[43][6][12] = -4;
      if (player.triggers.includes(22)) {
        levels[52][1][2] = 0;
      } else levels[52][1][2] = -4;
      if (player.triggers.includes(23)) {
        levels[63][27][5] = 0;
      } else levels[63][27][5] = -4;
      if (player.triggers.includes(24)) {
        levels[63][27][2] = 0;
      } else levels[63][27][2] = -4;
      if (player.triggers.includes(25)) {
        levels[63][25][5] = 0;
      } else levels[63][25][5] = -4;
      if (player.triggers.includes(26)) {
        levels[63][25][8] = 0;
      } else levels[63][25][8] = -4;
      // level warp
      if (isTouching("any", -2)) {
        let coord = getCoord(-1);
        let warp = levels[player.currentLevel][coord[0]][coord[1]];
        let warpId = warp[1];
        if (x1 < 0) {
          // left
          if (warp[2] != undefined) {
            player.levelCoord[0] += warp[2];
            player.levelCoord[1] += warp[3];
          } else player.levelCoord[0]--;
          player.x =
            levels[player.currentLevel].length * blockSize - playerSize;
          player.y =
            blockSize *
              levels[player.currentLevel][
                levels[player.currentLevel].length - 1
              ].findIndex((x) => x[0] == -1 && x[1] == warpId) +
            ((y1 + blockSize) % blockSize);
        } else if (x2 > levels[player.currentLevel].length * blockSize) {
          // right
          if (warp[2] != undefined) {
            player.levelCoord[0] += warp[2];
            player.levelCoord[1] += warp[3];
          } else player.levelCoord[0]++;
          player.x = 0;
          player.y =
            blockSize *
              levels[player.currentLevel][0].findIndex(
                (x) => x[0] == -1 && x[1] == warpId
              ) +
            ((y1 + blockSize) % blockSize);
        } else if (y1 < 0) {
          // up
          if (warp[2] != undefined) {
            player.levelCoord[0] += warp[2];
            player.levelCoord[1] += warp[3];
          } else player.levelCoord[1]++;
          player.y =
            levels[player.currentLevel][0].length * blockSize - playerSize;
          player.x =
            blockSize *
              levels[player.currentLevel].findIndex(
                (x) => x[x.length - 1][0] == -1 && x[x.length - 1][1] == warpId
              ) +
            ((x1 + blockSize) % blockSize);
        } else if (y2 > levels[player.currentLevel][0].length * blockSize) {
          // down
          if (warp[2] != undefined) {
            player.levelCoord[0] += warp[2];
            player.levelCoord[1] += warp[3];
          } else player.levelCoord[1]--;
          player.y = 0;
          player.x =
            blockSize *
              levels[player.currentLevel].findIndex(
                (x) => x[0][0] == -1 && x[0][1] == warpId
              ) +
            ((x1 + blockSize) % blockSize);
        }
      }
    }
    // key input
    if (control.left && player.xv > -player.moveSpeed) {
      player.xv -= player.moveSpeed * dt;
      if (player.xv < -player.moveSpeed) player.xv = -player.moveSpeed;
    }
    if (control.right && player.xv < player.moveSpeed) {
      player.xv += player.moveSpeed * dt;
      if (player.xv > player.moveSpeed) player.xv = player.moveSpeed;
    }
    // draw checks
    if (player.x != xprev || player.y != yprev) drawPlayer();
    if (
      player.levelCoord[0] !== lvlxprev ||
      player.levelCoord[1] !== lvlyprev ||
      !arraysEqual(player.triggers, triggersPrev) ||
      shouldDrawLevel
    )
      drawLevel();
    if (camx !== lvlx || camy !== lvly)
      adjustScreen(
        player.levelCoord[0] !== lvlxprev || player.levelCoord[1] !== lvlyprev
      );
  }
  window.requestAnimationFrame(nextFrame);
}

function openInfo() {
  if (id("info").style.bottom == "0%") {
    id("info").style.bottom = "100%";
  } else id("info").style.bottom = "0%";
}
function newSave() {
  return [1, 6, 0, 8, 325, 1, 600, [], currentVersion];
}
function save() {
  let saveData = player.spawnPoint;
  if (saveData[5] == Infinity) saveData[5] = "Infinity";
  localStorage.setItem("just-a-save", JSON.stringify(saveData));
}
function load() {
  if (localStorage.getItem("just-a-save")) {
    let saveData = JSON.parse(localStorage.getItem("just-a-save"));
    if (saveData[5] == "Infinity") saveData[5] = Infinity;
    if (saveData[8] == undefined) {
      saveData[8] = newSave()[8];
      saveData[3] += 3;
    }
    player.spawnPoint = saveData;
    save();
  }
}
function wipeSave() {
  if (confirm("Are you sure you want to delete your save?")) {
    if (
      levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][
        player.spawnPoint[0]
      ][player.spawnPoint[1]] == 4
    )
      levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][
        player.spawnPoint[0]
      ][player.spawnPoint[1]] = 3;
    player.spawnPoint = newSave();
    save();
    respawn();
    drawLevel();
    drawPlayer();
    adjustScreen(true);
  }
}
function isSpawn(x, y) {
  return (
    player.spawnPoint[2] == player.levelCoord[0] &&
    player.spawnPoint[3] == player.levelCoord[1] &&
    player.spawnPoint[0] == x &&
    player.spawnPoint[1] == y
  );
}
function respawn() {
  player.levelCoord = [player.spawnPoint[2], player.spawnPoint[3]];
  player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize) / 2;
  player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize) / 2;
  player.xv = 0;
  player.yv = 0;
  player.g = player.spawnPoint[4];
  player.maxJumps = player.spawnPoint[5];
  player.currentJumps = player.maxJumps - 1;
  player.moveSpeed = player.spawnPoint[6];
  player.triggers = [...player.spawnPoint[7]];
}
function getBlockType(x, y) {
  if (
    x < 0 ||
    x >= levels[player.currentLevel].length ||
    y < 0 ||
    y >= levels[player.currentLevel][0].length
  ) {
    if (levels[player.currentLevel][x - 1] != undefined) {
      if (typeof levels[player.currentLevel][x - 1][y] == "object") {
        if (levels[player.currentLevel][x - 1][y][0] == -1) {
          return -2;
        }
      }
    }
    if (levels[player.currentLevel][x + 1] != undefined) {
      if (typeof levels[player.currentLevel][x + 1][y] == "object") {
        if (levels[player.currentLevel][x + 1][y][0] == -1) {
          return -2;
        }
      }
    }
    if (levels[player.currentLevel][x] != undefined) {
      if (typeof levels[player.currentLevel][x][y - 1] == "object") {
        if (levels[player.currentLevel][x][y - 1][0] == -1) {
          return -2;
        }
      }
      if (typeof levels[player.currentLevel][x][y + 1] == "object") {
        if (levels[player.currentLevel][x][y + 1][0] == -1) {
          return -2;
        }
      }
    }
    return 1;
  }
  if (typeof levels[player.currentLevel][x][y] == "object")
    return levels[player.currentLevel][x][y][0];
  return levels[player.currentLevel][x][y];
}
function isTouching(dir, type) {
  let x1 = player.x;
  let x2 = player.x + playerSize;
  let y1 = player.y;
  let y2 = player.y + playerSize;
  let x1b = Math.floor(x1 / blockSize);
  let x2b = Math.floor(x2 / blockSize);
  let y1b = Math.floor(y1 / blockSize);
  let y2b = Math.floor(y2 / blockSize);
  switch (dir) {
    case "left":
      return (
        (hasHitbox.includes(getBlockType(x1b, y1b)) &&
          hasHitbox.includes(getBlockType(x1b, y2b))) ||
        (hasHitbox.includes(getBlockType(x1b, y1b)) &&
          blockSize - ((x1 + blockSize) % blockSize) <
            blockSize - ((y1 + blockSize) % blockSize) &&
          !hasHitbox.includes(getBlockType(x1b + 1, y1b)) &&
          getBlockType(x1b + 1, y1b) != 2) ||
        (hasHitbox.includes(getBlockType(x1b, y2b)) &&
          blockSize - ((x1 + blockSize) % blockSize) < y2 % blockSize &&
          !hasHitbox.includes(getBlockType(x1b + 1, y2b)) &&
          getBlockType(x1b + 1, y2b) != 2)
      );
      break;
    case "right":
      return (
        (hasHitbox.includes(getBlockType(x2b, y1b)) &&
          hasHitbox.includes(getBlockType(x2b, y2b))) ||
        (hasHitbox.includes(getBlockType(x2b, y1b)) &&
          x2 % blockSize < blockSize - ((y1 + blockSize) % blockSize) &&
          !hasHitbox.includes(getBlockType(x2b - 1, y1b)) &&
          getBlockType(x2b - 1, y1b) != 2) ||
        (hasHitbox.includes(getBlockType(x2b, y2b)) &&
          x2 % blockSize < y2 % blockSize &&
          !hasHitbox.includes(getBlockType(x2b - 1, y2b)) &&
          getBlockType(x2b - 1, y2b) != 2)
      );
      break;
    case "up":
      return (
        (hasHitbox.includes(getBlockType(x1b, y1b)) &&
          hasHitbox.includes(getBlockType(x2b, y1b))) ||
        (((hasHitbox.includes(getBlockType(x1b, y1b)) &&
          blockSize - ((x1 + blockSize) % blockSize) >
            blockSize - ((y1 + blockSize) % blockSize) &&
          !hasHitbox.includes(getBlockType(x1b, y1b + 1)) &&
          getBlockType(x1b, y1b + 1) != 2) ||
          (hasHitbox.includes(getBlockType(x2b, y1b)) &&
            x2 % blockSize > blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x2b, y1b + 1)) &&
            getBlockType(x2b, y1b + 1) != 2)) &&
          player.yv < 0)
      );
      break;
    case "down":
      return (
        (hasHitbox.includes(getBlockType(x1b, y2b)) &&
          hasHitbox.includes(getBlockType(x2b, y2b))) ||
        (((hasHitbox.includes(getBlockType(x1b, y2b)) &&
          blockSize - ((x1 + blockSize) % blockSize) > y2 % blockSize &&
          !hasHitbox.includes(getBlockType(x1b, y2b - 1)) &&
          getBlockType(x1b, y2b - 1) != 2) ||
          (hasHitbox.includes(getBlockType(x2b, y2b)) &&
            x2 % blockSize > y2 % blockSize &&
            !hasHitbox.includes(getBlockType(x2b, y2b - 1)) &&
            getBlockType(x2b, y2b - 1) != 2)) &&
          player.yv > 0)
      );
      break;
    case "any":
      x1 = player.x + 0.000001;
      x2 = player.x + playerSize - 0.000001;
      y1 = player.y + 0.000001;
      y2 = player.y + playerSize - 0.000001;
      x1b = Math.floor(x1 / blockSize);
      x2b = Math.floor(x2 / blockSize);
      y1b = Math.floor(y1 / blockSize);
      y2b = Math.floor(y2 / blockSize);
      return (
        getBlockType(x1b, y1b) == type ||
        getBlockType(x2b, y1b) == type ||
        getBlockType(x1b, y2b) == type ||
        getBlockType(x2b, y2b) == type
      );
  }
}
function getCoord(type) {
  let x1 = player.x;
  let x2 = player.x + playerSize;
  let y1 = player.y;
  let y2 = player.y + playerSize;
  let x1b = Math.floor(x1 / blockSize);
  let x2b = Math.floor(x2 / blockSize);
  let y1b = Math.floor(y1 / blockSize);
  let y2b = Math.floor(y2 / blockSize);
  if (getBlockType(x1b, y1b) == type) {
    return [x1b, y1b];
  } else if (getBlockType(x2b, y1b) == type) {
    return [x2b, y1b];
  } else if (getBlockType(x1b, y2b) == type) {
    return [x1b, y2b];
  } else if (getBlockType(x2b, y2b) == type) {
    return [x2b, y2b];
  }
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
var id = (x) => document.getElementById(x);

load();
respawn();
drawPlayer();
drawLevel();
adjustScreen(true);
window.requestAnimationFrame(nextFrame);
