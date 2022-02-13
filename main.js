var currentVersion = 0.3;
var gameSpeed = 1;
var player = {
  spawnPoint: newSave(),
  isDead: false,
  spawnDelay: Math.floor((options.spawnDelay * 100) / 3),
  spawnTimer: Math.floor((options.spawnDelay * 100) / 3),
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
  canJump: true,
  currentJumps: 0,
  maxJumps: 1,
  moveSpeed: 600,
  triggers: [],
  godMode: false,
  reachedHub: false,
  deaths: 0,
  timePlayed: 0,
  branchTime: 0,
  finalDeaths: 0,
  finalTimePlayed: 0,
  gameComplete: false
};
const control = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false
};
const hasHitbox = [1, 5, 11, 40];
const prefix = diff === "" ? "" : "../";
const music = {
  hub: initAudio(prefix+"audio/jap_hub.wav"),
  grav: initAudio(prefix+"audio/jap_grav.wav"),
  mj: initAudio(prefix+"audio/jap_mj.wav"),
  wj: initAudio(prefix+"audio/jap_wj.wav"),
  speed: initAudio(prefix+"audio/jap_speed.wav"),
  final: initAudio(prefix+"audio/jap_final.wav"),
  end: initAudio(prefix+"audio/jap_end.wav")
};
var currentlyPlaying = null;
function initAudio(url) {
  let a = new Audio(url);
  a.loop = true;
  a.volume = 0;
  return a;
}
var fadein = null;
var fadeout = null;
var toFadein = null;
function playAudio(target) {
  if (currentlyPlaying === target) return;
  if (currentlyPlaying) {
    if (fadeout) {
      fadeout.volume = 0;
      fadeout.pause();
      fadeout.currentTime = 0;
      fadeout = null;
    }
    fadeout = currentlyPlaying;
  }
  if (toFadein) clearTimeout(toFadein)
  if (target) {
    toFadein = setTimeout(function () {
      target.play();
      fadein = target;
      currentlyPlaying = target;
      toFadein = null;
    }, 2500);
  } else toFadein = null;
}
function updateAudio() {
  switch (true) {
    case player.currentLevel === 8 || player.currentLevel === 9:
      playAudio(music.hub);
      break;
    case player.currentLevel >= 10 && player.currentLevel <= 27:
      playAudio(music.grav);
      break;
    case player.currentLevel >= 28 && player.currentLevel <= 45:
      playAudio(music.mj);
      break;
    case player.currentLevel >= 46 && player.currentLevel <= 64:
      playAudio(music.wj);
      break;
    case player.currentLevel >= 65 && player.currentLevel <= 76:
      playAudio(music.speed);
      break;
    case player.currentLevel >= 77 && player.currentLevel <= 87:
      playAudio(music.final);
      break;
    case player.currentLevel === 88:
      playAudio(music.end);
      break;
    default:
      playAudio(null);
  }
}
var audioInitDone = false;
document.addEventListener("keydown", function (input) {
  if (!audioInitDone) {
    updateAudio();
    audioInitDone = true;
  }
  let key = input.code;
  switch (key) {
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
    case "Space":
      control.space = true;
      break;
    case "Delete":
      wipeSave();
      break;
    case "KeyR":
      if (input.shiftKey) {
        if (player.reachedHub) {
          if (confirm("Are you sure you want to go to the hub?")) {
            player.spawnPoint = [
              7,
              5,
              5,
              4,
              325,
              1,
              600,
              [...player.triggers],
              currentVersion,
              true,
              player.timePlayed,
              player.deaths,
              player.gameComplete,
              player.finalTimePlayed,
              player.finalDeaths,
              0
            ];
            respawn();
          }
        } else alert("You have not reached the hub yet.");
      } else {
        player.isDead = true;
        player.spawnTimer = 0;
      }
      break;
    case "KeyC":
      openInfo();
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", function (input) {
  let key = input.code;
  switch (key) {
    case "ArrowUp":
    case "KeyW":
      control.up = false;
      if (!control.down && !control.space) player.canJump = true;
      break;
    case "ArrowDown":
    case "KeyS":
      control.down = false;
      if (!control.up && !control.space) player.canJump = true;
      break;
    case "ArrowLeft":
    case "KeyA":
      control.left = false;
      break;
    case "ArrowRight":
    case "KeyD":
      control.right = false;
      break;
    case "Space":
      control.space = false;
      if (!control.up && !control.down) player.canJump = true;
      break;
    default:
      break;
  }
});

var lastFrame = 0;
var simReruns = 20;
var sinceLastSave = 0;
var noFriction = false;
var branchInProgress = true;
function nextFrame(timeStamp) {
  // setup stuff
  let dt = timeStamp - lastFrame;
  player.timePlayed += dt;
  if (branchInProgress) player.branchTime += dt;
  player.spawnPoint[10] = player.timePlayed;
  player.spawnPoint[15] = player.branchTime;
  id("timePlayed").innerHTML = formatTime(player.timePlayed);
  id("branchTime").innerHTML = formatTime(player.branchTime);
  id("timer").innerHTML =
    formatTime(player.timePlayed, false) +
    "<br>" +
    formatTime(player.branchTime, false);
  sinceLastSave += dt;
  if (sinceLastSave >= 5000) {
    save();
    sinceLastSave -= 5000;
  }
  if (fadein) {
    fadein.volume = Math.min(
      fadein.volume + (dt / 5000) * options.volume,
      options.volume
    );
    if (fadein.volume === options.volume) fadein = null;
  }
  if (fadeout) {
    fadeout.volume = Math.max(fadeout.volume - (dt / 5000) * options.volume, 0);
    if (fadeout.volume === 0) {
      fadeout.pause();
      fadeout.currentTime = 0;
      fadeout = null;
    }
  }
  dt *= gameSpeed;
  lastFrame = timeStamp;
  if (dt < 100 * gameSpeed) {
    dt = dt / simReruns;
    let xprev = player.x;
    let yprev = player.y;
    let lvlxprev = player.levelCoord[0];
    let lvlyprev = player.levelCoord[1];
    let triggersPrev = [...player.triggers];
    let shouldDrawLevel = false;
    for (let i = 0; i < simReruns; i++) {
      // some weird fricker to do stuff
      if (!player.isDead) {
        player.x += (player.xv * dt) / 500;
        player.y +=
          (player.yv * dt) / 500 + ((player.g / 2) * dt * dt) / 500 / 500;
        // velocity change
        if (!noFriction) {
          player.xv *= Math.pow(0.5, dt / 6);
          if (Math.abs(player.xv) < 5) player.xv = 0;
        }
        if (
          (player.yv > player.g && player.g > 0) ||
          (player.yv < player.g && player.g < 0)
        ) {
          player.yv -= (player.g * dt) / 500;
          if (Math.abs(player.yv) < player.g) player.yv = player.g;
        } else {
          player.yv += (player.g * dt) / 500;
        }
      }
      // collision detection
      if (i === 0) {
        player.canWalljump = false;
      }
      let level = levels[player.currentLevel];
      let onIce = false;
      let shouldDie = false;
      let bx1 = Math.floor((player.x - 0.001) / blockSize);
      let bx2 = Math.floor((player.x + playerSize) / blockSize);
      let by1 = Math.floor((player.y - 0.001) / blockSize);
      let by2 = Math.floor((player.y + playerSize) / blockSize);
      let wallLeft = false;
      let wallRight = false;
      let wallTop = false;
      let wallBottom = false;
      // solid blocks
      for (let x = bx1; x <= bx2; x++) {
        for (let y = by1; y <= by2; y++) {
          if (
            lvlxprev !== player.levelCoord[0] ||
            lvlyprev !== player.levelCoord[1]
          )
            break;
          let type = getBlockType(x, y);
          let props = type;
          if (typeof type === "object") type = type[0];
          let onLeft = false;
          let onRight = false;
          let onTop = false;
          let onBottom = false;
          if (hasHitbox.includes(type)) {
            let dx1 = Math.abs(
              (player.x - (x + 1) * blockSize) / Math.min(-1, player.xv)
            );
            let dx2 = Math.abs(
              (player.x + playerSize - x * blockSize) / Math.max(1, player.xv)
            );
            let dy1 = Math.abs(
              (player.y - (y + 1) * blockSize) / Math.min(-1, player.yv)
            );
            let dy2 = Math.abs(
              (player.y + playerSize - y * blockSize) / Math.max(1, player.yv)
            );
            // top left corner
            if (x === bx1 && y === by1) {
              if (dx1 < dy1 && !hasHitbox.includes(getBlockType(x + 1, y))) {
                onLeft = true;
              } else if (!hasHitbox.includes(getBlockType(x, y + 1))) {
                onTop = true;
              }
            }
            // bottom left corner
            else if (x === bx1 && y === by2) {
              if (dx1 < dy2 && !hasHitbox.includes(getBlockType(x + 1, y))) {
                onLeft = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // top right corner
            else if (x === bx2 && y === by1) {
              if (dx2 < dy1 && !hasHitbox.includes(getBlockType(x - 1, y))) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y + 1))) {
                onTop = true;
              }
            }
            // bottom right corner
            else if (x === bx2 && y === by2) {
              if (dx2 < dy2 && !hasHitbox.includes(getBlockType(x - 1, y))) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // bottom right corner
            else if (x === bx2 && y === by2) {
              if (
                Math.abs(
                  (x * blockSize - (player.x + playerSize)) /
                    Math.max(1, Math.abs(player.xv))
                ) <
                  Math.abs(
                    (y * blockSize - (player.y + playerSize)) /
                      Math.max(1, Math.abs(player.yv))
                  ) &&
                !hasHitbox.includes(getBlockType(x - 1, y))
              ) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // left bound
            else if (x === bx1) wallLeft = true;
            // right bound
            else if (x === bx2) wallRight = true;
            // top bound
            else if (y === by1) wallTop = true;
            // bottom bound
            else if (y === by2) wallBottom = true;
            // inside
            else shouldDie = true;
            // velocity check
            if (player.xv < 0) {
              onRight = false;
            } else if (player.xv > 0) onLeft = false;
            if (player.yv < 0) {
              onBottom = false;
            } else if (player.yv > 0) onTop = false;
            // touching side special event
            if (onLeft) {
              wallLeft = true;
              switch (type) {
                case 11:
                  if (!player.xg) {
                    player.canWalljump = true;
                    player.wallJumpDir = "right";
                    if (player.yv > player.g / 10 && player.g > 0)
                      player.yv = player.g / 10;
                    if (player.yv < player.g / 10 && player.g < 0)
                      player.yv = player.g / 10;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onRight) {
              wallRight = true;
              switch (type) {
                case 11:
                  if (!player.xg) {
                    player.canWalljump = true;
                    player.wallJumpDir = "left";
                    if (player.yv > player.g / 10 && player.g > 0)
                      player.yv = player.g / 10;
                    if (player.yv < player.g / 10 && player.g < 0)
                      player.yv = player.g / 10;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onTop) {
              wallTop = true;
              switch (type) {
                case 5:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 5 &&
                      !hasHitbox.includes(getBlockType(j, y + 1))
                    )
                      break;
                    if (j === bx2 && player.g < 0)
                      player.yv = Math.max(275, player.yv);
                  }
                  break;
                case 40:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 40 &&
                      !hasHitbox.includes(getBlockType(j, y + 1))
                    )
                      break;
                    if (j === bx2) onIce = true;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onBottom) {
              wallBottom = true;
              switch (type) {
                case 5:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 5 &&
                      !hasHitbox.includes(getBlockType(j, y - 1))
                    )
                      break;
                    if (j === bx2 && player.g > 0)
                      player.yv = Math.min(-275, player.yv);
                  }
                  break;
                case 40:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 40 &&
                      !hasHitbox.includes(getBlockType(j, y - 1))
                    )
                      break;
                    if (j === bx2) onIce = true;
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
      if (
        lvlxprev !== player.levelCoord[0] ||
        lvlyprev !== player.levelCoord[1]
      )
        break;
      // ice lol
      if (onIce) {
        noFriction = true;
      } else noFriction = false;
      // collision action
      let onFloor = false;
      if (wallLeft) {
        player.x = (bx1 + 1) * blockSize;
        player.xv = Math.max(0, player.xv);
      }
      if (wallRight) {
        player.x = bx2 * blockSize - playerSize;
        player.xv = Math.min(0, player.xv);
      }
      if (wallTop) {
        player.y = (by1 + 1) * blockSize;
        player.yv = Math.max(0, player.yv);
        if (player.g < 0 && player.yv <= 0) onFloor = true;
      }
      if (wallBottom) {
        player.y = by2 * blockSize - playerSize;
        player.yv = Math.min(0, player.yv);
        if (player.g > 0 && player.yv >= 0) onFloor = true;
      }
      // fully in block
      if (
        hasHitbox.includes(getBlockType(bx1, by1)) &&
        hasHitbox.includes(getBlockType(bx1, by2)) &&
        hasHitbox.includes(getBlockType(bx2, by1)) &&
        hasHitbox.includes(getBlockType(bx2, by2))
      )
        shouldDie = true;
      if (!shouldDie) {
        for (let x = bx1; x <= bx2; x++) {
          for (let y = by1; y <= by2; y++) {
            if (
              lvlxprev !== player.levelCoord[0] ||
              lvlyprev !== player.levelCoord[1]
            )
              break;
            let type = getBlockType(x, y);
            let props = type;
            if (typeof type === "object") type = type[0];
            if (
              player.x < (x + 1) * blockSize - 0.01 &&
              player.x + playerSize > x * blockSize + 0.01 &&
              player.y < (y + 1) * blockSize - 0.01 &&
              player.y + playerSize > y * blockSize + 0.01
            ) {
              switch (type) {
                // grav-dir
                case 6:
                  player.xg = false;
                  if (player.g > 0) player.g = -player.g;
                  break;
                case 7:
                  player.xg = false;
                  if (player.g < 0) player.g = -player.g;
                  break;
                // grav magnitude
                case 8:
                  player.g = Math.sign(player.g) * 170;
                  break;
                case 9:
                  player.g = Math.sign(player.g) * 325;
                  break;
                case 10:
                  player.g = Math.sign(player.g) * 650;
                  break;
                // multi-jump
                case 12:
                  player.maxJumps = 0;
                  player.currentJumps = player.maxJumps;
                  break;
                case 13:
                  player.maxJumps = 1;
                  player.currentJumps = player.maxJumps;
                  break;
                case 14:
                  player.maxJumps = 2;
                  player.currentJumps = player.maxJumps;
                  break;
                case 15:
                  player.maxJumps = 3;
                  player.currentJumps = player.maxJumps;
                  break;
                case 16:
                  player.maxJumps = Infinity;
                  player.currentJumps = player.maxJumps;
                  break;
                // checkpoint
                case -5:
                  if (!player.gameComplete) {
                    player.gameComplete = true;
                    player.finalTimePlayed = player.timePlayed;
                    player.finalDeaths = player.deaths;
                    id("endStat").style.display = "inline";
                    id("timePlayedEnd").innerHTML = formatTime(
                      player.finalTimePlayed
                    );
                    id("deathCountEnd").innerHTML = player.finalDeaths;
                    if (id("mainInfo").style.bottom != "0%") openInfo();
                  }
                case 3:
                  if (!isSpawn(x, y)) {
                    if (player.currentLevel === 8) {
                      branchInProgress = false;
                      player.reachedHub = true;
                    }
                    player.spawnPoint = [
                      x,
                      y,
                      player.levelCoord[0],
                      player.levelCoord[1],
                      player.g,
                      player.maxJumps,
                      player.moveSpeed,
                      [...player.triggers],
                      currentVersion,
                      player.reachedHub,
                      player.timePlayed,
                      player.deaths,
                      player.gameComplete,
                      player.finalTimePlayed,
                      player.finalDeaths,
                      player.branchTime
                    ];
                    shouldDrawLevel = true;
                    save();
                  }
                  break;
                // speed change
                case 21:
                  player.moveSpeed = 300;
                  break;
                case 22:
                  player.moveSpeed = 600;
                  break;
                case 23:
                  player.moveSpeed = 1200;
                  break;
                // death block
                case 2:
                case -4:
                  shouldDie = true;
                  break;
                // special
                case -3:
                  if (!player.triggers.includes(props[1]))
                    player.triggers.push(props[1]);
                  if (props[1] < 0) branchInProgress = false;
                  break;
                case -2:
                  if (player.currentLevel === 8) {
                    branchInProgress = true;
                    player.branchTime = 0;
                  }
                  let warpId = props[1];
                  if (bx1 < 0) {
                    // left
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[0]--;
                    player.x =
                      levels[player.currentLevel].length * blockSize -
                      playerSize;
                    player.y =
                      blockSize *
                        levels[player.currentLevel][
                          levels[player.currentLevel].length - 1
                        ].findIndex((x) => x[0] == -1 && x[1] == warpId) +
                      ((player.y + blockSize) % blockSize);
                  } else if (bx2 >= level.length) {
                    // right
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[0]++;
                    player.x = 0;
                    player.y =
                      blockSize *
                        levels[player.currentLevel][0].findIndex(
                          (x) => x[0] == -1 && x[1] == warpId
                        ) +
                      ((player.y + blockSize) % blockSize);
                  } else if (by1 < 0) {
                    // up
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[1]++;
                    player.y =
                      levels[player.currentLevel][0].length * blockSize -
                      playerSize;
                    player.x =
                      blockSize *
                        levels[player.currentLevel].findIndex(
                          (x) =>
                            x[x.length - 1][0] == -1 &&
                            x[x.length - 1][1] == warpId
                        ) +
                      ((player.x + blockSize) % blockSize);
                  } else if (by2 >= level[0].length) {
                    // down
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[1]--;
                    player.y = 0;
                    player.x =
                      blockSize *
                        levels[player.currentLevel].findIndex(
                          (x) => x[0][0] == -1 && x[0][1] == warpId
                        ) +
                      ((player.x + blockSize) % blockSize);
                  }
                  updateAudio();
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
      if (onFloor) {
        player.currentJumps = player.maxJumps;
      } else if (player.currentJumps === player.maxJumps) player.currentJumps--;
      // die
      if (!player.godMode && shouldDie && !player.isDead) player.isDead = true;
      if (player.isDead) {
        player.spawnTimer -= dt;
        if (player.spawnTimer <= 0) respawn();
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
        if (diff === "-HARD") levels[43][6][9] = -4;
      } else {
        levels[43][7][10] = -4;
        if (diff === "-HARD") levels[43][6][9] = 0;
      }
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
      if (player.triggers.includes(27)) {
        levels[73][13][4] = 0;
      } else levels[73][13][4] = -4;
      if (player.triggers.includes(28)) {
        levels[73][13][3] = 0;
      } else levels[73][13][3] = -4;
      if (player.triggers.includes(29)) {
        levels[74][4][8] = 0;
        levels[74][4][9] = 0;
      } else {
        levels[74][4][8] = -4;
        levels[74][4][9] = -4;
      }
      if (player.triggers.includes(30)) {
        levels[74][6][4] = 0;
      } else levels[74][6][4] = -4;
      if (player.triggers.includes(31)) {
        levels[74][5][20] = 0;
      } else levels[74][5][20] = -4;
      if (player.triggers.includes(32)) {
        levels[75][5][4] = 0;
      } else levels[75][5][4] = -4;
      if (player.triggers.includes(33)) {
        levels[75][5][2] = 0;
      } else levels[75][5][2] = -4;
      if (player.triggers.includes(34)) {
        levels[75][7][10] = 0;
      } else levels[75][7][10] = -4;
      if (player.triggers.includes(35)) {
        levels[85][16][11] = 0;
      } else levels[85][16][11] = -4;
      if (player.triggers.includes(36)) {
        levels[85][18][11] = 0;
      } else levels[85][18][11] = -4;
      if (player.triggers.includes(37)) {
        levels[85][19][3] = 0;
      } else levels[85][19][3] = -4;
      if (player.triggers.includes(38)) {
        levels[85][19][1] = 0;
      } else levels[85][19][1] = -4;
      if (player.triggers.includes(39)) {
        levels[87][16][11] = 0;
        levels[87][16][12] = 0;
      } else {
        levels[87][16][11] = -4;
        levels[87][16][12] = -4;
      }
      if (player.triggers.includes(40)) {
        levels[87][18][11] = 0;
        levels[87][18][12] = 0;
      } else {
        levels[87][18][11] = -4;
        levels[87][18][12] = -4;
      }
      if (player.triggers.includes(41)) {
        levels[87][20][11] = 0;
        levels[87][20][12] = 0;
      } else {
        levels[87][20][11] = -4;
        levels[87][20][12] = -4;
      }
      if (player.triggers.includes(42)) {
        levels[87][22][11] = 0;
        levels[87][22][12] = 0;
      } else {
        levels[87][22][11] = -4;
        levels[87][22][12] = -4;
      }
    }
    dt = dt * simReruns;
    // key input
    if (control.left && player.xv > -player.moveSpeed) {
      player.xv -= (player.moveSpeed * dt) / 50 / (noFriction ? 6 : 1);
      if (player.xv < -player.moveSpeed / (noFriction ? 6 : 1))
        player.xv = -player.moveSpeed / (noFriction ? 6 : 1);
    }
    if (control.right && player.xv < player.moveSpeed) {
      player.xv += (player.moveSpeed * dt) / 50 / (noFriction ? 6 : 1);
      if (player.xv > player.moveSpeed / (noFriction ? 6 : 1))
        player.xv = player.moveSpeed / (noFriction ? 6 : 1);
    }
    if (control.up || control.down || control.space) {
      if (player.canWalljump) {
        if (player.wallJumpDir === "left" && control.left) {
          player.canJump = false;
          player.xv = -600;
          player.yv = -Math.sign(player.g) * 205;
        }
        if (player.wallJumpDir === "right" && control.right) {
          player.canJump = false;
          player.xv = 600;
          player.yv = -Math.sign(player.g) * 205;
        }
      } else if (
        player.canJump &&
        (player.currentJumps > 0 || player.godMode)
      ) {
        player.canJump = false;
        player.yv = -Math.sign(player.g) * 205;
        player.currentJumps--;
      }
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
  if (id("mainInfo").style.bottom == "0%") {
    id("mainInfo").style.bottom = "100%";
    id("mainInfo").style.opacity = 0;
  } else {
    id("mainInfo").style.bottom = "0%";
    id("mainInfo").style.opacity = 1;
  }
}
function newSave() {
  return [
    1,
    6,
    0,
    8,
    325,
    1,
    600,
    [],
    currentVersion,
    false,
    0,
    0,
    false,
    0,
    0,
    0
  ];
}
function save() {
  let saveData = deepCopy(player.spawnPoint);
  if (saveData[5] == Infinity) saveData[5] = "Infinity";
  localStorage.setItem("just-a-save" + diff, JSON.stringify(saveData));
}
function load() {
  if (localStorage.getItem("just-a-save" + diff)) {
    let saveData = JSON.parse(localStorage.getItem("just-a-save" + diff));
    if (saveData[5] == "Infinity") saveData[5] = Infinity;
    if (saveData[8] == undefined) {
      saveData[8] = newSave()[8];
      saveData[3] += 3;
    }
    player.spawnPoint = saveData;
    player.timePlayed = player.spawnPoint[10] ?? 0;
    player.deaths = player.spawnPoint[11] ?? 0;
    player.gameComplete = player.spawnPoint[12] ?? false;
    player.finalTimePlayed = player.spawnPoint[13] ?? 0;
    player.finalDeaths = player.spawnPoint[14] ?? 0;
    player.branchTime = player.spawnPoint[15] ?? 0;
    id("timePlayed").innerHTML = formatTime(player.timePlayed);
    id("deathCount").innerHTML = player.deaths;
    if (player.gameComplete) {
      id("endStat").style.display = "inline";
      id("timePlayedEnd").innerHTML = formatTime(player.finalTimePlayed);
      id("deathCountEnd").innerHTML = player.finalDeaths;
    }
    save();
  }
}
function wipeSave() {
  if (
    !options.wipeConfirm ||
    confirm("Are you sure you want to delete your save?")
  ) {
    player.spawnPoint = newSave();
    save();
    load();
    respawn(false);
    branchInProgress = true;
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
function respawn(death = true) {
  if (death) {
    player.deaths++;
    player.spawnPoint[11] = player.deaths;
    id("deathCount").innerHTML = player.deaths;
    save();
  }
  player.spawnTimer = player.spawnDelay;
  player.isDead = false;
  player.levelCoord = [player.spawnPoint[2], player.spawnPoint[3]];
  player.xv = 0;
  player.yv = 0;
  player.g = player.spawnPoint[4];
  player.maxJumps = player.spawnPoint[5];
  player.currentJumps = player.maxJumps;
  player.moveSpeed = player.spawnPoint[6];
  player.triggers = [...player.spawnPoint[7]];
  player.reachedHub = player.spawnPoint[9];
  let spawnx = player.spawnPoint[0] * blockSize + (blockSize - playerSize) / 2;
  let spawny = player.spawnPoint[1] * blockSize;
  if (player.g > 0) spawny += blockSize - playerSize;
  player.x = spawnx;
  player.y = spawny;
  drawLevel();
  drawPlayer();
  if (audioInitDone) updateAudio();
}
function getBlockType(x, y) {
  let level = levels[player.currentLevel];
  if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
    if (level[x - 1] != undefined) {
      if (typeof level[x - 1][y] == "object") {
        if (level[x - 1][y][0] == -1) {
          return [
            -2,
            level[x - 1][y][1],
            level[x - 1][y][2],
            level[x - 1][y][3]
          ];
        }
      }
    }
    if (level[x + 1] != undefined) {
      if (typeof level[x + 1][y] == "object") {
        if (level[x + 1][y][0] == -1) {
          return [
            -2,
            level[x + 1][y][1],
            level[x + 1][y][2],
            level[x + 1][y][3]
          ];
        }
      }
    }
    if (level[x] != undefined) {
      if (typeof level[x][y - 1] == "object") {
        if (level[x][y - 1][0] == -1) {
          return [
            -2,
            level[x][y - 1][1],
            level[x][y - 1][2],
            level[x][y - 1][3]
          ];
        }
      }
      if (typeof level[x][y + 1] == "object") {
        if (level[x][y + 1][0] == -1) {
          return [
            -2,
            level[x][y + 1][1],
            level[x][y + 1][2],
            level[x][y + 1][3]
          ];
        }
      }
    }
    return 1;
  }
  return level[x][y];
}
function deepCopy(inObject) {
  //definitely not copied from somewhere else
  let outObject, value, key;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }
  outObject = Array.isArray(inObject) ? [] : {};
  for (key in inObject) {
    value = inObject[key];
    outObject[key] = deepCopy(value);
  }
  return outObject;
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
function formatTime(ms, word = true) {
  let s = ms / 1000;
  let ds = s % 60;
  let m = Math.floor(s / 60);
  let dm = m % 60;
  let h = Math.floor(m / 60);
  let dh = h % 24;
  let d = Math.floor(h / 24);
  let dd = d % 30.43685;
  let mo = Math.floor(d / 30.43685);
  let dmo = mo % 12;
  let dy = Math.floor(mo / 365.2422);
  let time = "";
  if (word) {
    if (s < 60) {
      time = ds.toFixed(3) + " second" + pluralCheck(ds);
    } else {
      time = "and " + ds.toFixed(3) + " second" + pluralCheck(ds);
    }
    if (dm >= 1) time = dm + " minute" + pluralCheck(dm) + ", " + time;
    if (dh >= 1) time = dh + " hour" + pluralCheck(dh) + ", " + time;
    if (dd >= 1) time = dd + " day" + pluralCheck(dd) + ", " + time;
    if (dmo >= 1) time = dmo + " month" + pluralCheck(dmo) + ", " + time;
    if (dy >= 1) time = dy + " year" + pluralCheck(dy) + ", " + time;
    if (m < 60) time = time.replace(",", "");
    return time;
  } else {
    time = (ds < 10 ? "0" : "") + ds.toFixed(2);
    time = (dm < 10 ? "0" : "") + dm + ":" + time;
    if (dh >= 1) time = (dh < 10 ? "0" : "") + dh + ":" + time;
    if (dd >= 1) time = dd + ":" + time;
    if (dmo >= 1) time = dmo + ":" + time;
    if (dy >= 1) time = dy + ":" + time;
    return time;
  }
}
function pluralCheck(n) {
  return n === 1 ? "" : "s";
}
var id = (x) => document.getElementById(x);

load();
respawn(false);
adjustScreen(true);
window.requestAnimationFrame(nextFrame);
setTimeout(drawLevel, 100);
