var gameSpeed = 1;
const player = {
  startPoint: getDefaultSpawn(),
  spawnPoint: getDefaultSpawn(),
  x: 0,
  y: 0,
  xv: 0,
  yv: 0,
  g: 325,
  xg: false,
  currentJumps: 0,
  canWalljump: false,
  wallJumpDir: "left",
  maxJumps: 1,
  moveSpeed: 600,
  jumpHeight: 205,
  switchOn: false,
  timerOn: false,
  jumpOn: false,
  godMode: false,
  noclip: false,
  selectedBlock: [1, 0],
  playerFocus: true
};
const control = {
  lmb: false,
  rmb: false,
  left: false,
  right: false,
  up: false,
  down: false,
  f: false
};
var level = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const hasHitbox = [1, 5, 11, 24, 25, 26, 33, 37, 40, 43, 47, 51, 61, 62];
const blockName = [
  "Empty Space",
  "Solid Block",
  "Death Block",
  "Check Point",
  "Activated Check Point",
  "Bounce Block", // basic (0,1,2,3,4,5)
  "G-Up Field",
  "G-Down Field",
  "G-Low Field",
  "G-Medium Field",
  "G-High Field", // grav (6,7,8,9,10)
  "Wall-Jump Block",
  "0-Jump Field",
  "1-Jump Field",
  "2-Jump Field",
  "3-Jump Field",
  "Inf-Jump Field", // jumping (11,12,13,14,15,16)
  "Start",
  "Goal",
  "Deactivated Start",
  "Activated Goal", // exclusive (17,18,19,20)
  "S-Slow Field",
  "S-Normal Field",
  "S-Fast Field", // speed (21,22,23)
  "Bounce Block++",
  "G-Bounce Up",
  "G-Bounce Down", // more bounce (24,25,26)
  "Force Field L",
  "Force Field R",
  "Force Field U",
  "Force Field D", // force (27,28,29,30)
  "Switch Block",
  "Toggle Block A",
  "Toggle Block B",
  "Toggle Death Block A",
  "Toggle Death Block B", // switchables (31,32,33,34,35)
  "Timer Block A",
  "Timer Block B",
  "Timer Death Block A",
  "Timer Death Block B", // timer (36,37,38,39)
  "Ice Block",
  "Portal", // other stuff (40,41)
  "Jump Block A",
  "Jump Block B",
  "Jump Death Block A",
  "Jump Death Block B", // jump-toggle (42,43,44,45)
  "Text Block",
  "Custom Bounce Block",
  "Custom G-Field",
  "Custom Jump Field",
  "Custom Speed Field",
  "Colored Solid Block",
  "Custom Toggle Block",
  "Custom Timer Block",
  "Custom Jump Block", // customizables (46,47,48,49,50,51,52,53,54)
  "One-Way Block L",
  "One-Way Block R",
  "One-Way Block U",
  "One-Way Block D", // one-way (55,56,57,58)
  "G-Left Field",
  "G-Right Field",
  "G-Bounce Left",
  "G-Bounce Right" // g-sideways (59,60,61,62)
];
const bannedBlock = [4, 19, 20];
const blockSelect = [
  "Special",
  17,
  3,
  18,
  41,
  46,
  "Basic",
  0,
  1,
  51,
  2,
  "Gravity",
  6,
  7,
  59,
  60,
  8,
  9,
  10,
  48,
  25,
  26,
  61,
  62,
  "Jumping",
  5,
  24,
  47,
  11,
  12,
  13,
  14,
  15,
  16,
  49,
  "Speed",
  21,
  22,
  23,
  50,
  40,
  "One-Way",
  55,
  56,
  57,
  58,
  "Force",
  27,
  28,
  29,
  30,
  "Switch",
  31,
  32,
  33,
  34,
  35,
  52,
  "Timer",
  36,
  37,
  38,
  39,
  53,
  "Jump-Toggle",
  42,
  43,
  44,
  45,
  54
];
const blockProperty = {
  41: ["TP Offset X", "TP Offset Y"],
  46: ["Text"],
  47: ["Power"],
  48: ["Gravity","Horizontal"],
  49: ["Jumps"],
  50: ["Speed"],
  51: ["ColorR", "ColorG", "ColorB"],
  52: ["BlockA", "BlockB", "Invert"],
  53: ["BlockA", "BlockB", "Invert"],
  54: ["BlockA", "BlockB", "Invert"]
};
const defaultProperty = {
  41: [0, 0],
  46: ["Text"],
  47: [275],
  48: [325, false],
  49: [1],
  50: [600],
  51: [127, 127, 255],
  52: [0, 1, false],
  53: [0, 1, false],
  54: [0, 1, false]
};
const propertyType = {
  41: ["number", "number"],
  46: ["any"],
  47: ["number"],
  48: ["number", "boolean"],
  49: ["number"],
  50: ["number"],
  51: ["number", "number", "number"],
  52: ["block", "block", "boolean"],
  53: ["block", "block", "boolean"],
  54: ["block", "block", "boolean"]
};
const propertyLimit = {
  41: ["none", "none"],
  46: ["none"],
  47: [[0, 1000]],
  48: [[-2000, 2000], "none"],
  49: [[0, Infinity]],
  50: [[0, 2000]],
  51: [
    [0, 255],
    [0, 255],
    [0, 255]
  ],
  52: [[0, blockName.length - 1], [0, blockName.length - 1], "none"],
  53: [[0, blockName.length - 1], [0, blockName.length - 1], "none"],
  54: [[0, blockName.length - 1], [0, blockName.length - 1], "none"]
};
var prevVersions = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
];
var currentVersion = 0;
var editProperty = false;
var lastFrame = 0;
var haltThreshold = 100;
var simReruns = 100;
var canSwitch = true;
var sinceLastTimerStage = 0;
var timerStage = 0;
var noFriction = false;
var prevTextCoord;
var xprev;
var yprev;
function nextFrame(timeStamp) {
  // setup stuff
  let dt = timeStamp - lastFrame;
  dt *= gameSpeed;
  lastFrame = timeStamp;
  sinceLastTimerStage += dt;
  if (dt < haltThreshold * gameSpeed) {
    dt = dt / simReruns;
    xprev = player.x;
    yprev = player.y;
    let shouldDrawLevel = false;
    for (let i = 0; i < simReruns; i++) {
      let shouldDie = false;
      // velocity change
      if (player.xg) {
        if (!noFriction) player.yv *= Math.pow(0.5, dt / 12);
        if (Math.abs(player.yv) < 5) player.yv = 0;
        if (
          (player.xv > player.g && player.g > 0) ||
          (player.xv < player.g && player.g < 0)
        ) {
          player.xv -= (player.g * dt) / 500;
          if (Math.abs(player.xv) < player.g) player.xv = player.g;
        } else {
          player.xv += (player.g * dt) / 500;
        }
      } else {
        if (!noFriction) player.xv *= Math.pow(0.5, dt / 12);
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
      }
      if (player.noclip) {
        player.xv = 0;
        player.yv = 0;
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
      if (isTouching("left") || isTouching("left", 56)) {
        if (player.xg) {
          if (
            ((getBlockType(x1b, y2b) === 5 && getBlockType(x1b, y1b) === 5) ||
              (isTouching("left", 5) &&
                (!hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y1b))))) &&
            player.g < 0
          )
            player.xv = -Math.sign(player.g) * 275;
          if (
            ((getBlockType(x1b, y2b) === 24 && getBlockType(x1b, y1b) === 24) ||
              (isTouching("left", 24) &&
                (!hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y1b))))) &&
            player.g < 0
          )
            player.xv = -Math.sign(player.g) * 700;
          if (
            ((getBlockType(x1b, y2b) === 47 && getBlockType(x1b, y1b) === 47) ||
              (isTouching("left", 47) &&
                (!hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y1b))))) &&
            player.g < 0
          ) {
            let coord = getCoord(47);
            player.xv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
          }
          if (
            ((getBlockType(x1b, y2b) === 40 && getBlockType(x1b, y1b) === 40) ||
              (isTouching("left", 40) &&
                (!hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b + 1, y1b))))) &&
            player.g < 0
          ) {
            noFriction = true;
          } else if (i == 0) noFriction = false;
          if (player.g < 0 && player.xv <= 0)
            player.currentJumps = player.maxJumps;
        } else {
          if (isTouching("left", 11) && control.left) {
            if (player.yv > player.g / 10 && player.g > 0)
              player.yv = player.g / 10;
            if (player.yv < player.g / 10 && player.g < 0)
              player.yv = player.g / 10;
            player.canWalljump = true;
            player.wallJumpDir = "right";
          } else if (i === 0) player.canWalljump = false;
        }
        if (
          (getBlockType(x1b, y2b) === 62 && getBlockType(x1b, y1b) === 62) ||
          (isTouching("left", 62) &&
            (!hasHitbox.includes(getBlockType(x1b, y2b)) ||
              hasHitbox.includes(getBlockType(x1b + 1, y2b)) ||
              !hasHitbox.includes(getBlockType(x1b, y1b)) ||
              hasHitbox.includes(getBlockType(x1b + 1, y1b))))
        ) {
          player.xg = true;
          player.g = -player.g;
          player.xv = player.g / 2;
        }
        if (player.xv < 0) player.xv = 0;
        player.x = (x1b + 1) * blockSize;
      } else if (isTouching("right") || isTouching("right", 55)) {
        // right wall
        if (player.xg) {
          if (
            ((getBlockType(x2b, y2b) == 5 && getBlockType(x2b, y1b) == 5) ||
              (isTouching("right", 5) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y1b))))) &&
            player.g > 0
          )
            player.xv = -Math.sign(player.g) * 275;
          if (
            ((getBlockType(x2b, y2b) == 24 && getBlockType(x2b, y1b) == 24) ||
              (isTouching("right", 24) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y1b))))) &&
            player.g > 0
          )
            player.xv = -Math.sign(player.g) * 700;
          if (
            ((getBlockType(x2b, y2b) == 47 && getBlockType(x2b, y1b) == 47) ||
              (isTouching("right", 47) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y1b))))) &&
            player.g > 0
          ) {
            let coord = getCoord(47);
            player.xv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
          }
          if (
            ((getBlockType(x2b, y2b) == 40 && getBlockType(x2b, y1b) == 40) ||
              (isTouching("right", 40) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y2b)) ||
                  !hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b - 1, y1b))))) &&
            player.g > 0
          ) {
            noFriction = true;
          } else if (i == 0) noFriction = false;
          if (player.g > 0 && player.xv >= 0)
            player.currentJumps = player.maxJumps;
        } else {
          if (isTouching("right", 11) && control.right) {
            if (player.yv > player.g / 10 && player.g > 0)
              player.yv = player.g / 10;
            if (player.yv < player.g / 10 && player.g < 0)
              player.yv = player.g / 10;
            player.canWalljump = true;
            player.wallJumpDir = "left";
          } else if (i === 0) player.canWalljump = false;
        }
        if (
          (getBlockType(x2b, y2b) == 61 && getBlockType(x2b, y1b) == 61) ||
          (isTouching("right", 61) &&
            (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
              hasHitbox.includes(getBlockType(x2b - 1, y2b)) ||
              !hasHitbox.includes(getBlockType(x2b, y1b)) ||
              hasHitbox.includes(getBlockType(x2b - 1, y1b))))
        ) {
          player.xg = true;
          player.g = -player.g;
          player.xv = player.g / 2;
        }
        if (player.xv > 0) player.xv = 0;
        player.x = x2b * blockSize - playerSize;
      } else if (i === 0) {
        if (player.xg) {
          if (player.currentJumps == player.maxJumps)
            player.currentJumps = player.maxJumps - 1;
          noFriction = false;
        } else {
          player.canWalljump = false;
        }
      }
      // ceiling
      if (isTouching("up") || isTouching("up", 58)) {
        if (player.xg) {
          if (isTouching("up", 11) && control.left) {
            if (player.xv > player.g / 10 && player.g > 0)
              player.xv = player.g / 10;
            if (player.xv < player.g / 10 && player.g < 0)
              player.xv = player.g / 10;
            player.canWalljump = true;
            player.wallJumpDir = "down";
          } else if (i === 0) player.canWalljump = false;
        } else {
          if (
            ((getBlockType(x2b, y1b) === 5 && getBlockType(x1b, y1b) === 5) ||
              (isTouching("up", 5) &&
                (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
            player.g < 0
          )
            player.yv = -Math.sign(player.g) * 275;
          if (
            ((getBlockType(x2b, y1b) === 24 && getBlockType(x1b, y1b) === 24) ||
              (isTouching("up", 24) &&
                (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
            player.g < 0
          )
            player.yv = -Math.sign(player.g) * 700;
          if (
            ((getBlockType(x2b, y1b) === 47 && getBlockType(x1b, y1b) === 47) ||
              (isTouching("up", 47) &&
                (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
            player.g < 0
          ) {
            let coord = getCoord(47);
            player.yv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
          }
          if (
            ((getBlockType(x2b, y1b) == 40 && getBlockType(x1b, y1b) == 40) ||
              (isTouching("up", 40) &&
                (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                  hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                  hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
            player.g < 0
          ) {
            noFriction = true;
          } else if (i == 0) noFriction = false;
          if (player.g < 0 && player.yv <= 0)
            player.currentJumps = player.maxJumps;
        }
        if (
          (getBlockType(x2b, y1b) === 26 && getBlockType(x1b, y1b) === 26) ||
          (isTouching("up", 26) &&
            (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
              hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
              !hasHitbox.includes(getBlockType(x1b, y1b)) ||
              hasHitbox.includes(getBlockType(x1b, y1b + 1))))
        ) {
          player.xg = false;
          player.g = -player.g;
          player.yv = player.g / 2;
        }
        if (player.yv < 0) player.yv = 0;
        player.y = (y1b + 1) * blockSize;
      } else if (isTouching("down") || isTouching("down", 57)) {
        // floor
        if (player.xg) {
          if (isTouching("down", 11) && control.right) {
            if (player.xv > player.g / 10 && player.g > 0)
              player.xv = player.g / 10;
            if (player.xv < player.g / 10 && player.g < 0)
              player.xv = player.g / 10;
            player.canWalljump = true;
            player.wallJumpDir = "up";
          } else if (i === 0) player.canWalljump = false;
        } else {
          if (
            ((getBlockType(x2b, y2b) == 5 && getBlockType(x1b, y2b) == 5) ||
              (isTouching("down", 5) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
            player.g > 0
          )
            player.yv = -Math.sign(player.g) * 275;
          if (
            ((getBlockType(x2b, y2b) == 24 && getBlockType(x1b, y2b) == 24) ||
              (isTouching("down", 24) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
            player.g > 0
          )
            player.yv = -Math.sign(player.g) * 700;
          if (
            ((getBlockType(x2b, y2b) == 47 && getBlockType(x1b, y2b) == 47) ||
              (isTouching("down", 47) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
            player.g > 0
          ) {
            let coord = getCoord(47);
            player.yv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
          }
          if (
            ((getBlockType(x2b, y2b) == 40 && getBlockType(x1b, y2b) == 40) ||
              (isTouching("down", 40) &&
                (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                  hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                  !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                  hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
            player.g > 0
          ) {
            noFriction = true;
          } else if (i == 0) noFriction = false;
          if (player.g > 0 && player.yv >= 0)
            player.currentJumps = player.maxJumps;
        }
        if (
          (getBlockType(x2b, y2b) == 25 && getBlockType(x1b, y2b) == 25) ||
          (isTouching("down", 25) &&
            (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
              hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
              !hasHitbox.includes(getBlockType(x1b, y2b)) ||
              hasHitbox.includes(getBlockType(x1b, y2b - 1))))
        ) {
          player.xg = false;
          player.g = -player.g;
          player.yv = player.g / 2;
        }
        if (player.yv > 0) player.yv = 0;
        player.y = y2b * blockSize - playerSize;
      } else if (i === 0) {
        if (player.xg) {
          player.canWalljump = false;
        } else {
          if (player.currentJumps == player.maxJumps)
            player.currentJumps = player.maxJumps - 1;
          noFriction = false;
        }
      }
      // fully-in-block
      if (
        hasHitbox.includes(getBlockType(x1b, y1b)) &&
        hasHitbox.includes(getBlockType(x2b, y1b)) &&
        hasHitbox.includes(getBlockType(x1b, y2b)) &&
        hasHitbox.includes(getBlockType(x2b, y2b)) &&
        !player.noclip
      ) {
        let cx = x1 + playerSize / 2;
        let cy = y1 + playerSize / 2;
        let cxb = Math.floor(cx / blockSize);
        let cyb = Math.floor(cy / blockSize);
        let dx1 = cx % blockSize;
        let dx2 = blockSize - dx1;
        let dy1 = cy % blockSize;
        let dy2 = blockSize - dy1;
        let list = [dx1, dx2, dy1, dy2].sort();
        let maybeShouldDie = true;
        for (let i in list) {
          if (list[i] < blockSize / 2) {
            if (
              list[i] == dx1 &&
              !hasHitbox.includes(getBlockType(cxb - 1, cyb))
            ) {
              player.xv = 0;
              player.x = cxb * blockSize - playerSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dx2 &&
              !hasHitbox.includes(getBlockType(cxb + 1, cyb))
            ) {
              player.xv = 0;
              player.x = (cxb + 1) * blockSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dy1 &&
              !hasHitbox.includes(getBlockType(cxb, cyb - 1))
            ) {
              player.yv = 0;
              player.y = cyb * blockSize - playerSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dy2 &&
              !hasHitbox.includes(getBlockType(cxb, cyb + 1))
            ) {
              player.yv = 0;
              player.y = (cyb + 1) * blockSize;
              maybeShouldDie = false;
              break;
            }
          }
        }
        if (maybeShouldDie) shouldDie = true;
      }
      // grav-dir
      if (isTouching("any", 6)) {
        player.xg = false;
        if (player.g > 0) player.g = -player.g;
      }
      if (isTouching("any", 7)) {
        player.xg = false;
        if (player.g < 0) player.g = -player.g;
      }
      if (isTouching("any", 59)) {
        player.xg = true;
        if (player.g > 0) player.g = -player.g;
      }
      if (isTouching("any", 60)) {
        player.xg = true;
        if (player.g < 0) player.g = -player.g;
      }
      // grav magnitude
      if (isTouching("any", 8)) player.g = Math.sign(player.g) * 170;
      if (isTouching("any", 9)) player.g = Math.sign(player.g) * 325;
      if (isTouching("any", 10)) player.g = Math.sign(player.g) * 650;
      if (isTouching("any", 48)) {
        let coord = getCoord(48);
        player.g = level[coord[0]][coord[1]][1];
        player.xg = level[coord[0]][coord[1]][2];
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
      if (isTouching("any", 49)) {
        let coord = getCoord(49);
        player.maxJumps = level[coord[0]][coord[1]][1];
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      // checkpoint
      if (isTouching("any", 3)) {
        let coord = getCoord(3);
        let type = getBlockType(coord[0], coord[1], false);
        if (level[player.spawnPoint[0]] !== undefined) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i == 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn,
          player.xg
        ];
        if (type !== 3) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i == 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 3
            ) {
              level[coord[0]][coord[1]][i] = 4;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 4;
        shouldDrawLevel = true;
      }
      if (isTouching("any", 18)) {
        let coord = getCoord(18);
        let type = getBlockType(coord[0], coord[1], false);
        if (level[player.spawnPoint[0]] !== undefined) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i === 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn,
          player.xg
        ];
        if (type !== 18) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i == 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 18
            ) {
              level[coord[0]][coord[1]][i] = 20;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 20;
        shouldDrawLevel = true;
      }
      if (isTouching("any", 19)) {
        let coord = getCoord(19);
        let type = getBlockType(coord[0], coord[1], false);
        if (level[player.spawnPoint[0]] !== undefined) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i === 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn,
          player.xg
        ];
        if (type !== 19) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i === 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 19
            ) {
              level[coord[0]][coord[1]][i] = 17;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 17;
        shouldDrawLevel = true;
      }
      // speed change
      if (isTouching("any", 21)) player.moveSpeed = 300;
      if (isTouching("any", 22)) player.moveSpeed = 600;
      if (isTouching("any", 23)) player.moveSpeed = 1200;
      if (isTouching("any", 50)) {
        let coord = getCoord(50);
        player.moveSpeed = level[coord[0]][coord[1]][1];
      }
      // force field
      if (isTouching("any", 27) && player.xv > -100) player.xv = -100;
      if (isTouching("any", 28) && player.xv < 100) player.xv = 100;
      if (isTouching("any", 29) && player.yv > -100) player.yv = -100;
      if (isTouching("any", 30) && player.yv < 100) player.yv = 100;
      // switch
      if (isTouching("any", 31)) {
        if (canSwitch) {
          player.switchOn = !player.switchOn;
          shouldDrawLevel = true;
        }
        canSwitch = false;
      } else canSwitch = true;
      if (player.switchOn) {
        hasHitbox[6] = 32;
      } else hasHitbox[6] = 33;
      // timer
      if (sinceLastTimerStage > 1000) {
        timerStage++;
        sinceLastTimerStage = sinceLastTimerStage % 1000;
        shouldDrawLevel = true;
      }
      if (timerStage > 3) {
        player.timerOn = !player.timerOn;
        timerStage = 0;
      }
      if (player.timerOn) {
        hasHitbox[7] = 36;
      } else hasHitbox[7] = 37;
      // jump-toggle
      if (player.jumpOn) {
        hasHitbox[9] = 42;
      } else hasHitbox[9] = 43;
      // text block
      if (isTouching("any", 46)) {
        let coord = getCoord(46);
        if (!arraysEqual(prevTextCoord, coord)) {
          let text = level[coord[0]][coord[1]][1];
          id("textBlockText").innerHTML = text;
          id("textBlockText").style.display = "block";
          let x = coord[0] * blockSize + blockSize / 2 + lvlxOffset;
          if (x < id("textBlockText").clientWidth / 2)
            x = id("textBlockText").clientWidth / 2;
          if (x > window.innerWidth - id("textBlockText").clientWidth / 2)
            x = window.innerWidth - id("textBlockText").clientWidth / 2;
          let y = coord[1] * blockSize + blockSize / 2 + lvlyOffset;
          if (y < id("textBlockText").clientHeight / 2)
            y = id("textBlockText").clientHeight / 2;
          if (y > window.innerHeight - id("textBlockText").clientHeight / 2)
            y = window.innerHeight - id("textBlockText").clientHeight / 2;
          id("textBlockText").style.left = x + "px";
          id("textBlockText").style.top = y + "px";
          prevTextCoord = coord;
        }
      } else {
        id("textBlockText").style.display = "none";
        prevTextCoord = [];
      }
      // death block
      if (isTouching("any", 2)) shouldDie = true;
      if (isTouching("any", 34) && player.switchOn) shouldDie = true;
      if (isTouching("any", 35) && !player.switchOn) shouldDie = true;
      if (isTouching("any", 38) && player.timerOn) shouldDie = true;
      if (isTouching("any", 39) && !player.timerOn) shouldDie = true;
      if (isTouching("any", 44) && player.jumpOn) shouldDie = true;
      if (isTouching("any", 45) && !player.jumpOn) shouldDie = true;
      if (!player.godMode && shouldDie) respawn();
      // portal
      if (isTouching("any", 41)) {
        let coord = getCoord(41);
        player.x =
          (coord[0] + level[coord[0]][coord[1]][1]) * blockSize +
          (blockSize - playerSize) / 2;
        player.y =
          (coord[1] + level[coord[0]][coord[1]][2]) * blockSize +
          (blockSize - playerSize) / 2;
      }
      // OoB check
      if (player.x < 0) player.x = 0;
      if (player.x > level.length * blockSize - playerSize)
        player.x = level.length * blockSize - playerSize;
      if (player.y < 0) player.y = 0;
      if (player.y > level[0].length * blockSize - playerSize)
        player.y = level[0].length * blockSize - playerSize;
    }
    // key input
    if (player.noclip) {
      if (control.left) player.x -= (simReruns * dt) / 4;
      if (control.right) player.x += (simReruns * dt) / 4;
      if (control.up) player.y -= (simReruns * dt) / 4;
      if (control.down) player.y += (simReruns * dt) / 4;
    } else if (player.xg) {
      if (control.left && player.yv > -player.moveSpeed) {
        player.yv -= (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.yv < -player.moveSpeed / (noFriction ? 5 : 1))
          player.yv = -player.moveSpeed / (noFriction ? 5 : 1);
      }
      if (control.right && player.yv < player.moveSpeed) {
        player.yv += (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.yv > player.moveSpeed / (noFriction ? 5 : 1))
          player.yv = player.moveSpeed / (noFriction ? 5 : 1);
      }
    } else {
      if (control.left && player.xv > -player.moveSpeed) {
        player.xv -= (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.xv < -player.moveSpeed / (noFriction ? 5 : 1))
          player.xv = -player.moveSpeed / (noFriction ? 5 : 1);
      }
      if (control.right && player.xv < player.moveSpeed) {
        player.xv += (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.xv > player.moveSpeed / (noFriction ? 5 : 1))
          player.xv = player.moveSpeed / (noFriction ? 5 : 1);
      }
    }
    if (player.noclip) player.currentJumps = player.maxJumps;
    // draw checks
    if (shouldDrawLevel) drawLevel();
    if (player.x != xprev || player.y != yprev) adjustScreen();
  }
  window.requestAnimationFrame(nextFrame);
}
var id = (x) => document.getElementById(x);
function addVersion() {
  currentVersion++;
  prevVersions.length = currentVersion;
  prevVersions.push(deepCopy(level));
}
function openPropertyMenu(x, y, type = getBlockType(x, y, false), editDefault) {
  control.f = false;
  if (hasProperty(type)) {
    let props = blockProperty[type];
    let menu = id("editProperty");
    menu.innerHTML = "";
    for (let i in props) {
      let sect = document.createElement("div");
      menu.appendChild(sect);
      let label = document.createElement("span");
      label.innerHTML = props[i] + ": ";
      sect.appendChild(label);
      let input;
      if (propertyType[type][i] === "block") {
        input = document.createElement("select");
        let currentSect;
        for (let i in blockSelect) {
          if (typeof blockSelect[i] === "string") {
            currentSect = document.createElement("optGroup");
            currentSect.label = blockSelect[i];
            input.appendChild(currentSect);
          } else if (!hasProperty(blockSelect[i])) {
            let option = document.createElement("option");
            option.innerHTML = blockName[blockSelect[i]];
            option.value = blockSelect[i];
            currentSect.appendChild(option);
          }
        }
      } else if (propertyType[type][i] === "boolean") {
        label.style.verticalAlign = "-0.25em";
        input = document.createElement("input");
        input.type = "checkbox";
      } else {
        label.style.verticalAlign = "1em";
        input = document.createElement("textarea");
        let text;
        if (propertyLimit[type][i] !== "none") {
          text = "From ";
          text += propertyLimit[type][i][0];
          text += " to ";
          text += propertyLimit[type][i][1];
        } else text = "No limits";
        addTooltip(input, text);
      }
      input.id = "prop" + props[i];
      if (editDefault) {
        if (propertyType[type][i] === "boolean") {
          input.checked = defaultProperty[type][i];
        } else {
          input.value = defaultProperty[type][i];
        }
      } else {
        if (propertyType[type][i] === "boolean") {
          input.checked = level[x][y][parseInt(i) + 1];
        } else {
          input.value = level[x][y][parseInt(i) + 1];
        }
      }
      sect.appendChild(input);
    }
    let confirm = document.createElement("button");
    confirm.innerHTML = "confirm";
    confirm.onclick = function () {
      let err = false;
      for (let i in props) {
        let newVal = id("prop" + props[i]).value;
        if (propertyType[type][i] == "boolean")
          newVal = id("prop" + props[i]).checked;
        if (newVal == parseFloat(newVal)) newVal = parseFloat(newVal);
        if (newVal == "Infinity") newVal = Infinity;
        if (
          (typeof newVal == propertyType[type][i] ||
            propertyType[type][i] == "any" ||
            (propertyType[type][i] == "block" && typeof newVal == "number")) &&
          ((newVal >= propertyLimit[type][i][0] &&
            newVal <= propertyLimit[type][i][1]) ||
            propertyLimit[type][i] == "none")
        ) {
          if (propertyType[type][i] == "block" && newVal == 17) {
            let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
            if (spawnPoint == 4) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
            } else if (spawnPoint == 17) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
            } else if (spawnPoint == 20) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
            } else {
              for (let i in spawnPoint) {
                if (i == 0) continue;
                if (
                  propertyType[
                    getBlockType(
                      player.spawnPoint[0],
                      player.spawnPoint[1],
                      false
                    )
                  ][parseInt(i) - 1] === "block"
                ) {
                  if (spawnPoint[i] == 4) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                    break;
                  } else if (spawnPoint[i] == 17) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                    break;
                  } else if (spawnPoint[i] == 20) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                    break;
                  }
                }
              }
            }
            player.startPoint = [
              x,
              y,
              player.g,
              player.maxJumps,
              player.moveSpeed,
              player.switchOn,
              player.jumpOn,
              player.timerOn,
              player.xg
            ];
            player.spawnPoint = [
              x,
              y,
              player.g,
              player.maxJumps,
              player.moveSpeed,
              player.switchOn,
              player.jumpOn,
              player.timerOn,
              player.xg
            ];
          }
          if (editDefault) {
            defaultProperty[type][i] = newVal;
          } else {
            level[x][y][parseInt(i) + 1] = newVal;
          }
          drawLevel();
        } else {
          err = true;
          id("prop" + props[i]).value = "";
        }
      }
      if (!err) {
        menu.style.display = "none";
        if (!editDefault) {
          drawBlock(id("blockSelect" + type), 0, 0, type, 0, 0, 1, true);
          addVersion();
        }
        editProperty = false;
      } else {
        alert("Invalid value!");
      }
    };
    menu.appendChild(confirm);
    let cancel = document.createElement("button");
    cancel.innerHTML = "cancel";
    cancel.onclick = function () {
      menu.style.display = "none";
      editProperty = false;
    };
    menu.appendChild(cancel);
    menu.onkeydown = function (input) {
      if (input.code === "Enter" && !input.shiftKey) confirm.click();
    };
    menu.style.display = "block";
    editProperty = true;
  }
}
function addTooltip(elem, text) {
  elem.addEventListener("mousemove", function (event) {
    id("tooltip").innerHTML = text;
    id("tooltip").style.display = "block";
    id("tooltip").style.left = event.clientX + 5 + "px";
    id("tooltip").style.top =
      event.clientY - id("tooltip").clientHeight - 5 + "px";
  });
  elem.addEventListener("mouseleave", function () {
    id("tooltip").style.display = "none";
  });
}
function hasProperty(blockId) {
  return Object.keys(blockProperty).includes(String(blockId));
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
function getBlockType(x, y, subtype = true) {
  if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
    return 1;
  }
  if (typeof level[x][y] === "object") {
    if (subtype) {
      if (level[x][y][0] === 52) {
        if (player.switchOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
      if (level[x][y][0] === 53) {
        if (player.timerOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
      if (level[x][y][0] === 54) {
        if (player.jumpOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
    }
    return level[x][y][0];
  }
  return level[x][y];
}
function isTouching(dir, type) {
  if (player.noclip) return false;
  let x1 = player.x;
  let x2 = player.x + playerSize;
  let y1 = player.y;
  let y2 = player.y + playerSize;
  let x1b = Math.floor(x1 / blockSize);
  let x2b = Math.floor(x2 / blockSize);
  let y1b = Math.floor(y1 / blockSize);
  let y2b = Math.floor(y2 / blockSize);
  if (x1b === x2b && y1b === y2b) {
    if (dir !== "any") return false;
  }
  switch (dir) {
    case "left":
      if (type != undefined) {
        return (
          ((getBlockType(x1b, y1b) == type &&
            blockSize - ((x1 + blockSize) % blockSize) <
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b + 1, y1b)) &&
            getBlockType(x1b + 1, y1b) != 2) ||
            (getBlockType(x1b, y2b) == type &&
              blockSize - ((x1 + blockSize) % blockSize) < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x1b + 1, y2b)) &&
              getBlockType(x1b + 1, y2b) != 2)) &&
          player.xv < 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x1b, y1b)) &&
            blockSize - ((x1 + blockSize) % blockSize) <
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b + 1, y1b)) &&
            getBlockType(x1b + 1, y1b) != 2) ||
            (hasHitbox.includes(getBlockType(x1b, y2b)) &&
              blockSize - ((x1 + blockSize) % blockSize) < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x1b + 1, y2b)) &&
              getBlockType(x1b + 1, y2b) != 2)) &&
          player.xv < 0
        );
      break;
    case "right":
      if (type != undefined) {
        return (
          ((getBlockType(x2b, y1b) == type &&
            x2 % blockSize < blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x2b - 1, y1b)) &&
            getBlockType(x2b - 1, y1b) != 2) ||
            (getBlockType(x2b, y2b) == type &&
              x2 % blockSize < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b - 1, y2b)) &&
              getBlockType(x2b - 1, y2b) != 2)) &&
          player.xv > 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x2b, y1b)) &&
            x2 % blockSize < blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x2b - 1, y1b)) &&
            getBlockType(x2b - 1, y1b) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y2b)) &&
              x2 % blockSize < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b - 1, y2b)) &&
              getBlockType(x2b - 1, y2b) != 2)) &&
          player.xv > 0
        );
      break;
    case "up":
      if (type != undefined) {
        return (
          ((getBlockType(x1b, y1b) == type &&
            blockSize - ((x1 + blockSize) % blockSize) >
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b, y1b + 1)) &&
            getBlockType(x1b, y1b + 1) != 2) ||
            (getBlockType(x2b, y1b) == type &&
              x2 % blockSize > blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b, y1b + 1)) &&
              getBlockType(x2b, y1b + 1) != 2)) &&
          player.yv < 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x1b, y1b)) &&
            blockSize - ((x1 + blockSize) % blockSize) >
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b, y1b + 1)) &&
            getBlockType(x1b, y1b + 1) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y1b)) &&
              x2 % blockSize > blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b, y1b + 1)) &&
              getBlockType(x2b, y1b + 1) != 2)) &&
          player.yv < 0
        );
      break;
    case "down":
      if (type != undefined) {
        return (
          ((getBlockType(x1b, y2b) == type &&
            blockSize - ((x1 + blockSize) % blockSize) > y2 % blockSize &&
            !hasHitbox.includes(getBlockType(x1b, y2b - 1)) &&
            getBlockType(x1b, y2b - 1) != 2) ||
            (getBlockType(x2b, y2b) == type &&
              x2 % blockSize > y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b, y2b - 1)) &&
              getBlockType(x2b, y2b - 1) != 2)) &&
          player.yv > 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x1b, y2b)) &&
            blockSize - ((x1 + blockSize) % blockSize) > y2 % blockSize &&
            !hasHitbox.includes(getBlockType(x1b, y2b - 1)) &&
            getBlockType(x1b, y2b - 1) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y2b)) &&
              x2 % blockSize > y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b, y2b - 1)) &&
              getBlockType(x2b, y2b - 1) != 2)) &&
          player.yv > 0
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
    default:
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
  if (getBlockType(x1b, y1b) === type) {
    return [x1b, y1b];
  } else if (getBlockType(x2b, y1b) === type) {
    return [x2b, y1b];
  } else if (getBlockType(x1b, y2b) === type) {
    return [x1b, y2b];
  } else if (getBlockType(x2b, y2b) === type) {
    return [x2b, y2b];
  }
}
function getDefaultSpawn() {
  return [4, 5, 325, 1, 600, false, false, false, false];
}
function toStart() {
  player.x = player.startPoint[0] * blockSize + (blockSize - playerSize) / 2;
  player.y = player.startPoint[1] * blockSize + (blockSize - playerSize) / 2;
  player.xv = 0;
  player.yv = 0;
  player.g = player.startPoint[2];
  player.maxJumps = player.startPoint[3];
  player.currentJumps = player.maxJumps - 1;
  player.moveSpeed = player.startPoint[4];
  let shouldDraw =
    player.switchOn !== player.startPoint[5] ||
    player.jumpOn !== player.startPoint[6] ||
    player.timerOn !== player.startPoint[7] ||
    timerStage !== 0;
  player.switchOn = player.startPoint[5];
  player.jumpOn = player.startPoint[6];
  player.timerOn = player.startPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  player.xg = player.startPoint[8];
  if (shouldDraw) drawLevel();
}
function respawn() {
  player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize) / 2;
  player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize) / 2;
  player.xv = 0;
  player.yv = 0;
  player.g = player.spawnPoint[2];
  player.maxJumps = player.spawnPoint[3];
  player.currentJumps = player.maxJumps - 1;
  player.moveSpeed = player.spawnPoint[4];
  let shouldDraw =
    player.switchOn !== player.spawnPoint[5] ||
    player.jumpOn !== player.spawnPoint[6] ||
    player.timerOn !== player.spawnPoint[7] ||
    timerStage !== 0;
  player.switchOn = player.spawnPoint[5];
  player.jumpOn = player.spawnPoint[6];
  player.timerOn = player.spawnPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  player.xg = player.spawnPoint[8];
  if (shouldDraw) drawLevel();
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (typeof a[i] === "object" || typeof b[i] === "object") {
      if (!arraysEqual(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) return false;
  }
  return true;
}
function init() {
  toStart();
  id("levelLayer").height = level[0].length * blockSize;
  id("levelLayer").width = level.length * blockSize;
  drawLevel();
  drawGrid();
  let blockAmt = 0;
  let currentSect;
  for (let i in blockSelect) {
    if (typeof blockSelect[i] == "string") {
      currentSect = document.createElement("div");
      currentSect.style.height = "100%";
      currentSect.style.display = "flex";
      currentSect.style.flexFlow = "wrap";
      currentSect.style.marginRight = "5px";
      currentSect.style.background = "#00000022";
      id("blockSelect").appendChild(currentSect);
      let title = document.createElement("div");
      title.appendChild(document.createTextNode(blockSelect[i]));
      title.style.minWidth = "100%";
      currentSect.appendChild(title);
      blockAmt = 0;
    } else {
      let blockDisp = document.createElement("div");
      let button = document.createElement("canvas");
      button.id = "blockSelect" + blockSelect[i];
      button.height = blockSize;
      button.width = blockSize;
      drawBlock(button, 0, 0, blockSelect[i], 0, 0, 1, true);
      button.addEventListener("mousedown", function (input) {
        if (input.button == 0 && control.f) {
          openPropertyMenu(0, 0, blockSelect[i], true);
        } else if (input.button == 0) {
          if (player.selectedBlock[1] == player.selectedBlock[0]) {
            id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
              "0 0 0 5px #0000FF";
          } else {
            id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
          }
          if (player.selectedBlock[1] == blockSelect[i]) {
            button.style.boxShadow = "0 0 0 5px #FF00FF";
          } else {
            button.style.boxShadow = "0 0 0 5px #FF0000";
          }
          player.selectedBlock[0] = blockSelect[i];
        } else if (input.button == 2) {
          if (player.selectedBlock[0] == player.selectedBlock[1]) {
            id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
              "0 0 0 5px #FF0000";
          } else {
            id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
          }
          if (player.selectedBlock[0] == blockSelect[i]) {
            button.style.boxShadow = "0 0 0 5px #FF00FF";
          } else {
            button.style.boxShadow = "0 0 0 5px #0000FF";
          }
          player.selectedBlock[1] = blockSelect[i];
        }
      });
      if (hasProperty(blockSelect[i])) {
        addTooltip(button, "[F] + LMB to edit default properties");
      }
      blockDisp.style.width = blockSize + "px";
      blockDisp.style.marginRight = "5px";
      blockDisp.appendChild(button);
      blockDisp.appendChild(document.createElement("br"));
      blockDisp.appendChild(document.createTextNode(blockName[blockSelect[i]]));
      currentSect.appendChild(blockDisp);
      blockAmt++;
      currentSect.style.minWidth = (blockSize + 5) * blockAmt + "px";
    }
  }
  id("blockSelect0").style.boxShadow = "0 0 0 5px #0000FF";
  id("blockSelect1").style.boxShadow = "0 0 0 5px #FF0000";
}

init();
window.requestAnimationFrame(nextFrame);
