var gameSpeed = 1;
const player = {
  currentSave: undefined,
  autoSave: true,
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
  switchsOn: [],
  timerOn: false,
  timerInterval: 4000,
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
  e: false
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
const hasHitbox = [
  1,
  5,
  11,
  24,
  25,
  26,
  "[REMOVED]",
  37,
  40,
  43,
  47,
  51,
  61,
  62
];
const blockName = [
  "Empty Space",
  "Solid Block",
  "Death Block",
  "Check Point",
  "[REMOVED]",
  "Bounce Block", // basic (0,1,2,3,4*,5)
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
  "[REMOVED]",
  "[REMOVED]", // exclusive (17,18,19*,20*)
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
  "G-Bounce Right", // g-sideways (59,60,61,62)
  "Timer Interval Field" // what do i even call this (63)
];
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
  63,
  "Jump-Toggle",
  42,
  43,
  44,
  45,
  54
];
const blockProperty = {
  17: [
    "Start Grav",
    "Start Jump Amt",
    "Start Speed",
    "!Switch State",
    "!Timer State",
    "!Jump State",
    "Horizontal Grav",
    "Timer Interval"
  ],
  18: [
    "Use Requirements",
    "Req Grav",
    "Req Jump Amt",
    "Req Speed",
    "Horizontal Grav",
    "Timer Interval"
  ],
  27: ["Power"],
  28: ["Power"],
  29: ["Power"],
  30: ["Power"],
  31: ["ID", "Single Use", "!Status"],
  32: ["ID"],
  33: ["ID"],
  34: ["ID"],
  35: ["ID"],
  41: ["TP Offset X", "TP Offset Y"],
  46: ["Text"],
  47: ["Power"],
  48: ["Gravity", "Horizontal"],
  49: ["Jumps"],
  50: ["Speed"],
  51: ["ColorR", "ColorG", "ColorB"],
  52: ["BlockA", "BlockB", "Invert", "ID"],
  53: ["BlockA", "BlockB", "Invert"],
  54: ["BlockA", "BlockB", "Invert"],
  63: ["Interval"]
};
const defaultProperty = {
  17: [325, 1, 600, [], false, false, false, 4000],
  18: [false, 325, false, 1, 600, 4000],
  27: [100],
  28: [100],
  29: [100],
  30: [100],
  31: [0, false, "unused"],
  32: [0],
  33: [0],
  34: [0],
  35: [0],
  41: [0, 0],
  46: ["Text"],
  47: [275],
  48: [325, false],
  49: [1],
  50: [600],
  51: [127, 127, 255],
  52: [0, 1, false, 0],
  53: [0, 1, false],
  54: [0, 1, false],
  63: [4000]
};
const propertyType = {
  17: [
    "number",
    "number",
    "number",
    "object",
    "boolean",
    "boolean",
    "boolean",
    "number"
  ],
  18: ["boolean", "number", "boolean", "number", "number", "number"],
  27: ["number"],
  28: ["number"],
  29: ["number"],
  30: ["number"],
  31: ["integer", "boolean", "any"],
  32: ["integer"],
  33: ["integer"],
  34: ["integer"],
  35: ["integer"],
  41: ["number", "number"],
  46: ["any"],
  47: ["number"],
  48: ["number", "boolean"],
  49: ["number"],
  50: ["number"],
  51: ["number", "number", "number"],
  52: ["block", "block", "boolean", "integer"],
  53: ["block", "block", "boolean"],
  54: ["block", "block", "boolean"],
  63: ["number"]
};
const propertyLimit = {
  17: [
    [-2000, 2000],
    [0, Infinity],
    [0, 2000],
    "none",
    "none",
    "none",
    "none",
    [500, 60 * 60 * 1000]
  ],
  18: [
    "none",
    [-2000, 2000],
    "none",
    [0, Infinity],
    [0, 2000],
    [500, 60 * 60 * 1000]
  ],
  27: [[0, 1000]],
  28: [[0, 1000]],
  29: [[0, 1000]],
  30: [[0, 1000]],
  31: [[0, 99], "none", "none"],
  32: [[0, 99]],
  33: [[0, 99]],
  34: [[0, 99]],
  35: [[0, 99]],
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
  52: ["none", "none", "none", [0, 99]],
  53: ["none", "none", "none"],
  54: ["none", "none", "none"],
  63: [[500, 60 * 60 * 1000]]
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
var sinceLastSave = 0;
var currentVersion = 0;
var editDisabled = false;
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
  sinceLastSave += dt;
  if (sinceLastSave > 5000) {
    save(true);
    sinceLastSave = 0;
  }
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
        if (!noFriction) {
          player.yv *= Math.pow(0.5, dt / 6);
          if (Math.abs(player.yv) < 1) player.yv = 0;
        }
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
        if (!noFriction) {
          player.xv *= Math.pow(0.5, dt / 6);
          if (Math.abs(player.xv) < 1) player.xv = 0;
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
      if (player.noclip) {
        player.xv = 0;
        player.yv = 0;
      }
      // position change based on velocity
      player.x += (player.xv * dt) / 500;
      player.y += (player.yv * dt) / 500;
      // multi-jump
      if (isTouching("any", 12)) {
        player.maxJumps = 0;
        player.currentJumps = player.maxJumps;
      }
      if (isTouching("any", 13)) {
        player.maxJumps = 1;
        player.currentJumps = player.maxJumps;
      }
      if (isTouching("any", 14)) {
        player.maxJumps = 2;
        player.currentJumps = player.maxJumps;
      }
      if (isTouching("any", 15)) {
        player.maxJumps = 3;
        player.currentJumps = player.maxJumps;
      }
      if (isTouching("any", 16)) {
        player.maxJumps = Infinity;
        player.currentJumps = player.maxJumps;
      }
      if (isTouching("any", 49)) {
        let props = getProps(49);
        player.maxJumps = props[1];
        player.currentJumps = player.maxJumps;
      }
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
            let props = getProps(47);
            player.xv = -Math.sign(player.g) * props[1];
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
            let props = getProps(47);
            player.xv = -Math.sign(player.g) * props[1];
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
      } else {
        if (player.xg) {
          if (player.currentJumps == player.maxJumps)
            player.currentJumps = player.maxJumps - 1;
          noFriction = false;
        } else {
          if (i === 0) player.canWalljump = false;
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
            let props = getProps(47);
            player.yv = -Math.sign(player.g) * props[1];
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
            let props = getProps(47);
            player.yv = -Math.sign(player.g) * props[1];
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
      } else {
        if (player.xg) {
          if (i === 0) player.canWalljump = false;
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
        let props = getProps(48);
        player.g = props[1];
        player.xg = props[2];
      }
      // checkpoint
      if (isTouching("any", 3)) {
        let coord = getCoord(3);
        if (!isSpawn(coord[0], coord[1])) {
          setSpawn(coord[0], coord[1]);
          shouldDrawLevel = true;
        }
      }
      if (isTouching("any", 17)) {
        let coord = getCoord(17);
        if (!isSpawn(coord[0], coord[1])) {
          setSpawn(coord[0], coord[1]);
          shouldDrawLevel = true;
        }
      }
      if (isTouching("any", 18)) {
        let coord = getCoord(18);
        let props = getProps(18);
        if (
          !props[1] ||
          arraysEqual(props.slice(2), [
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.xg,
            player.timerInterval
          ])
        ) {
          if (!isSpawn(coord[0], coord[1])) {
            setSpawn(coord[0], coord[1]);
            shouldDrawLevel = true;
          }
        }
      }
      // speed change
      if (isTouching("any", 21)) player.moveSpeed = 300;
      if (isTouching("any", 22)) player.moveSpeed = 600;
      if (isTouching("any", 23)) player.moveSpeed = 1200;
      if (isTouching("any", 50)) {
        let props = getProps(50);
        player.moveSpeed = props[1];
      }
      // force field
      if (isTouching("any", 27)) {
        let props = getProps(27);
        player.xv = Math.min(player.xv, -props[1]);
      }
      if (isTouching("any", 28)) {
        let props = getProps(28);
        player.xv = Math.max(player.xv, props[1]);
      }
      if (isTouching("any", 29)) {
        let props = getProps(29);
        player.yv = Math.min(player.yv, -props[1]);
      }
      if (isTouching("any", 30)) {
        let props = getProps(30);
        player.yv = Math.max(player.yv, props[1]);
      }
      // switch
      if (isTouching("any", 31)) {
        let coord = getCoord(31);
        let props = getProps(31);
        if (canSwitch && props[3] === "unused") {
          if (props[2]) editProp(coord[0], coord[1], 31, 3, "used/unsaved");
          player.switchsOn[props[1]] = !player.switchsOn[props[1]];
          shouldDrawLevel = true;
        }
        canSwitch = false;
      } else canSwitch = true;
      // timer
      if (sinceLastTimerStage > Math.min(1000, player.timerInterval / 4)) {
        timerStage++;
        sinceLastTimerStage =
          sinceLastTimerStage % Math.min(1000, player.timerInterval / 4);
        shouldDrawLevel = true;
      }
      if (timerStage > Math.max(player.timerInterval / 1000 - 1, 3)) {
        player.timerOn = !player.timerOn;
        timerStage = 0;
      }
      if (player.timerOn) {
        hasHitbox[7] = 36;
      } else hasHitbox[7] = 37;
      if (isTouching("any", 63)) {
        let props = getProps(63);
        player.timerInterval = props[1];
      }
      // jump-toggle
      if (player.jumpOn) {
        hasHitbox[9] = 42;
      } else hasHitbox[9] = 43;
      // text block
      if (isTouching("any", 46)) {
        let coord = getCoord(46);
        if (!arraysEqual(prevTextCoord, coord)) {
          let text = getProps(46)[1];
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
      if (isTouching("any", 38) && player.timerOn) shouldDie = true;
      if (isTouching("any", 39) && !player.timerOn) shouldDie = true;
      if (isTouching("any", 44) && player.jumpOn) shouldDie = true;
      if (isTouching("any", 45) && !player.jumpOn) shouldDie = true;
      if (!player.godMode && shouldDie) respawn();
      // portal
      if (isTouching("any", 41)) {
        let coord = getCoord(41);
        let props = getProps(41);
        player.x =
          (coord[0] + props[1]) * blockSize + (blockSize - playerSize) / 2;
        player.y =
          (coord[1] + props[2]) * blockSize + (blockSize - playerSize) / 2;
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
        player.yv -= (player.moveSpeed * dt * 2) / (noFriction ? 5 : 1);
        if (player.yv < -player.moveSpeed / (noFriction ? 5 : 1))
          player.yv = -player.moveSpeed / (noFriction ? 5 : 1);
      }
      if (control.right && player.yv < player.moveSpeed) {
        player.yv += (player.moveSpeed * dt * 2) / (noFriction ? 5 : 1);
        if (player.yv > player.moveSpeed / (noFriction ? 5 : 1))
          player.yv = player.moveSpeed / (noFriction ? 5 : 1);
      }
    } else {
      if (control.left && player.xv > -player.moveSpeed) {
        player.xv -= (player.moveSpeed * dt * 2) / (noFriction ? 5 : 1);
        if (player.xv < -player.moveSpeed / (noFriction ? 5 : 1))
          player.xv = -player.moveSpeed / (noFriction ? 5 : 1);
      }
      if (control.right && player.xv < player.moveSpeed) {
        player.xv += (player.moveSpeed * dt * 2) / (noFriction ? 5 : 1);
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
  if (currentVersion >= 25) {
    currentVersion--;
    prevVersions.shift();
  }
}
function setSpawn(x, y, start = false) {
  player.spawnPoint = [
    x,
    y,
    player.g,
    player.maxJumps,
    player.moveSpeed,
    [...player.switchsOn],
    player.jumpOn,
    player.timerOn,
    player.xg,
    player.timerInterval
  ];
  if (start) player.startPoint = deepCopy(player.spawnPoint);
  for (let x in level) {
    for (let y in level[x]) {
      if (
        getBlockType(x, y) === 31 &&
        getProps(31, false, x, y)[3] === "used/unsaved"
      ) {
        editProp(x, y, 31, 3, "used", true);
        shouldDraw = true;
      }
    }
  }
}
function isSpawn(x, y) {
  return player.spawnPoint[0] === x && player.spawnPoint[1] === y;
}
function addSave() {
  let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
  let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
  let name = prompt("Please enter save name.");
  while (saveList.includes(name)) {
    name = prompt(
      `There's already a save named '${name}'. Please enter a different name.`
    );
  }
  saves[name] = [deepCopy(level), deinfinify(player.startPoint), name];
  saveList.push(name);
  localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
  localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
  player.currentSave = name;
  updateSaveMenu();
}
function save(auto = false) {
  if (player.currentSave !== undefined) {
    let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
    saves[player.currentSave] = [
      level,
      deinfinify(player.startPoint),
      player.currentSave
    ];
    localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
    if (!auto) alert("Saved.");
  } else if (!auto) alert("No save is currently selected.");
}
function load(name) {
  let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
  level = saves[name][0];
  for (let x in level) {
    for (let y in level[x]) {
      let block = deepCopy(level[x][y]);
      if (hasProperty(getBlockType(x, y, false))) {
        if (typeof block !== "object") block = [block];
        if (block.length - 1 !== defaultProperty[block[0]].length) {
          block = block.concat(
            defaultProperty[block[0]].slice(block.length - 1)
          );
        }
        if (propertyType[block[0]].includes("block")) {
          for (let i in block) {
            if (i == 0) continue;
            if (
              propertyType[block[0]][parseInt(i) - 1] === "block" &&
              hasProperty(getBlockType(x, y, false, block[i]))
            ) {
              if (typeof block[i] !== "object") block[i] = [block[i]];
              if (block[i].length - 1 !== defaultProperty[block[i][0]].length) {
                block[i] = block[i].concat(
                  defaultProperty[block[i][0]].slice(block[i].length - 1)
                );
              }
            }
          }
        }
        level[x][y] = deepCopy(block);
      }
    }
  }
  let start = infinify(saves[name][1]);
  player.startPoint = getDefaultSpawn();
  for (let i in start) {
    if (start[i] !== undefined) player.startPoint[i] = start[i];
  }
  if (typeof player.startPoint[5] !== "object")
    player.startPoint[5] = [player.startPoint[5]];
  player.spawnPoint = deepCopy(player.startPoint);
  player.currentSave = name;
  id("lvlWidth").innerHTML = level.length;
  id("lvlHeight").innerHTML = level[0].length;
  id("levelLayer").height = level[0].length * blockSize;
  id("levelLayer").width = level.length * blockSize;
  prevLevel = [];
  toStart();
  drawLevel();
  drawGrid();
  updateSaveMenu();
}
function exportSave(name) {
  let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
  id("exportArea").value = JSON.stringify(saves[name]);
  id("exportArea").style.display = "inline";
  id("exportArea").focus();
  id("exportArea").select();
  document.execCommand("copy");
  id("exportArea").style.display = "none";
  alert("Level data copied to clipboard!");
}
function importSave() {
  let data = prompt("Please enter level data.");
  if (data) {
    data = JSON.parse(data);
    let name = data[2];
    let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
    let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
    if (name === undefined)
      name = prompt(
        "The imported level does not have a name. Please enter a name."
      );
    while (saveList.includes(name)) {
      name = prompt(
        `There's already a save named '${name}'. Please enter a different name.`
      );
    }
    saves[name] = data;
    saveList.push(name);
    localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
    localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
    updateSaveMenu();
  }
}
function deleteSave(name) {
  if (confirm("Are you sure you want to delete this save?")) {
    let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
    let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
    delete saves[name];
    saveList.splice(
      saveList.findIndex((x) => x === name),
      1
    );
    localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
    localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
    if (player.currentSave === name) player.currentSave = undefined;
    updateSaveMenu();
  }
}
function moveSave(name, dir) {
  let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
  let index = saveList.findIndex((x) => x === name);
  if (dir === "up" && index !== 0) {
    let temp = saveList[index];
    saveList[index] = saveList[index - 1];
    saveList[index - 1] = temp;
  }
  if (dir === "down" && index !== saveList.length - 1) {
    let temp = saveList[index];
    saveList[index] = saveList[index + 1];
    saveList[index + 1] = temp;
  }
  localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
  updateSaveMenu();
}
function renameSave(name) {
  let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
  let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
  let index = saveList.findIndex((x) => x === name);
  let newName = prompt("Please enter the new save name.");
  while (saveList.includes(newName)) {
    newName = prompt(
      `There's already a save named '${newName}'. Please enter a different name.`
    );
  }
  saves[newName] = deepCopy(saves[name]);
  delete saves[name];
  saveList[index] = newName;
  localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
  localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
  updateSaveMenu();
}
function copySave(name) {
  let saves = JSON.parse(localStorage.getItem("just-an-editor-save"));
  let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
  let index = saveList.findIndex((x) => x === name);
  let newName = prompt("Please enter a name for the copy.");
  while (saveList.includes(newName)) {
    newName = prompt(
      `There's already a save named '${newName}'. Please enter a different name.`
    );
  }
  saves[newName] = deepCopy(saves[name]);
  saveList.splice(index + 1, 0, newName);
  localStorage.setItem("just-an-editor-save", JSON.stringify(saves));
  localStorage.setItem("just-a-save-list", JSON.stringify(saveList));
  updateSaveMenu();
}
function toggleAutoSave() {
  player.autoSave = !player.autoSave;
  if (player.autoSave) {
    id("autoSaveButton").innerHTML = "Auto Save: On";
  } else id("autoSaveButton").innerHTML = "Auto Save: Off";
}
function toggleSaveMenu() {
  if (id("saveMenu").style.display === "none") {
    id("saveMenu").style.display = "block";
    editDisabled = true;
    updateSaveMenu();
  } else {
    id("saveMenu").style.display = "none";
    editDisabled = false;
  }
}
function updateSaveMenu() {
  let saveList = JSON.parse(localStorage.getItem("just-a-save-list"));
  id("saveList").innerHTML = "";
  for (let i in saveList) {
    let name = saveList[i];
    let saveSect = document.createElement("div");
    saveSect.appendChild(document.createTextNode(name));
    saveSect.appendChild(document.createElement("br"));

    if (player.currentSave === name) {
      saveSect.style.background = "#0000FF44";
      let saveButton = document.createElement("button");
      saveButton.innerHTML = "Save";
      saveButton.addEventListener("mousedown", function () {
        save();
      });
      saveSect.appendChild(saveButton);
    }

    let loadButton = document.createElement("button");
    loadButton.innerHTML = "Load";
    loadButton.addEventListener("mousedown", function () {
      load(name);
    });
    saveSect.appendChild(loadButton);

    let exportButton = document.createElement("button");
    exportButton.innerHTML = "Export";
    exportButton.addEventListener("mousedown", function () {
      exportSave(name);
    });
    saveSect.appendChild(exportButton);

    saveSect.appendChild(document.createElement("br"));

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("mousedown", function () {
      deleteSave(name);
    });
    saveSect.appendChild(deleteButton);

    let renameButton = document.createElement("button");
    renameButton.innerHTML = "Rename";
    renameButton.addEventListener("mousedown", function () {
      renameSave(name);
    });
    saveSect.appendChild(renameButton);

    let copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    copyButton.addEventListener("mousedown", function () {
      copySave(name);
    });
    saveSect.appendChild(copyButton);

    saveSect.appendChild(document.createElement("br"));

    let moveUpButton = document.createElement("button");
    moveUpButton.innerHTML = "Move Up";
    moveUpButton.addEventListener("mousedown", function () {
      moveSave(name, "up");
    });
    saveSect.appendChild(moveUpButton);

    let moveDownButton = document.createElement("button");
    moveDownButton.innerHTML = "Move Down";
    moveDownButton.addEventListener("mousedown", function () {
      moveSave(name, "down");
    });
    saveSect.appendChild(moveDownButton);

    id("saveList").appendChild(saveSect);
  }
}
function openPropertyMenu(
  x,
  y,
  type = getBlockType(x, y, false),
  editDefault = false,
  subProp = false,
  subPropName
) {
  control.e = false;
  if (hasProperty(type)) {
    let props = blockProperty[type];
    let menu = id("editProperty");
    let prefix = "";
    if (subProp) {
      menu = id("editProperty2");
      id("editProperty")
        .querySelectorAll("select, input, textarea, button")
        .forEach(function (ele) {
          ele.disabled = true;
        });
      prefix = "sub";
    }
    menu.innerHTML = "";
    for (let i in props) {
      if (props[i][0] === "!") continue;
      let sect = document.createElement("div");
      menu.appendChild(sect);
      let label = document.createElement("span");
      label.innerHTML = props[i] + ": ";
      sect.appendChild(label);
      let input;
      if (propertyType[type][i] === "block") {
        input = document.createElement("select");
        let currentSect;
        for (let j in blockSelect) {
          if (typeof blockSelect[j] === "string") {
            currentSect = document.createElement("optGroup");
            currentSect.label = blockSelect[j];
            input.appendChild(currentSect);
          } else if (
            !hasProperty(blockSelect[j]) ||
            !propertyType[blockSelect[j]].includes("block")
          ) {
            let option = document.createElement("option");
            option.innerHTML = blockName[blockSelect[j]];
            if (hasProperty(blockSelect[j])) {
              option.id = "prop" + props[i] + "Option" + blockSelect[j];
              let newVal = [blockSelect[j]];
              if (
                editDefault &&
                defaultProperty[type][i][0] === blockSelect[j]
              ) {
                for (let k in defaultProperty[type][i]) {
                  if (k == 0) continue;
                  newVal.push(defaultProperty[type][i][k]);
                }
              } else if (
                !editDefault &&
                level[x][y][parseInt(i) + 1][0] === blockSelect[j]
              ) {
                for (let k in level[x][y][parseInt(i) + 1]) {
                  if (k == 0) continue;
                  newVal.push(level[x][y][parseInt(i) + 1][k]);
                }
              } else {
                for (let k in defaultProperty[blockSelect[j]]) {
                  newVal.push(defaultProperty[blockSelect[j]][k]);
                }
              }
              option.value = JSON.stringify(newVal);
            } else option.value = blockSelect[j];
            currentSect.appendChild(option);
          }
        }
      } else if (propertyType[type][i] === "boolean") {
        input = document.createElement("input");
        input.type = "checkbox";
      } else {
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
      label.style.position = "relative";
      input.style.position = "relative";
      input.style.verticalAlign = "middle";
      let startVal;
      if (editDefault) {
        startVal = defaultProperty[type][i];
      } else if (subProp) {
        startVal = JSON.parse(id(subPropName).value)[parseInt(i) + 1];
      } else {
        startVal = level[x][y][parseInt(i) + 1];
      }
      if (typeof startVal === "object") startVal = JSON.stringify(startVal);
      if (propertyType[type][i] === "boolean") {
        input.checked = startVal;
      } else {
        input.value = startVal;
      }
      input.id = prefix + "prop" + props[i];
      sect.appendChild(input);
      if (propertyType[type][i] === "block") {
        let editSubProp = document.createElement("button");
        editSubProp.innerHTML = "Edit Property";
        if (hasProperty(JSON.parse(input.value)[0])) {
          editSubProp.style.display = "inline";
        } else editSubProp.style.display = "none";
        input.addEventListener("input", function () {
          if (hasProperty(JSON.parse(input.value)[0])) {
            editSubProp.style.display = "inline";
          } else editSubProp.style.display = "none";
        });
        editSubProp.addEventListener("click", function () {
          openPropertyMenu(
            0,
            0,
            JSON.parse(input.value)[0],
            false,
            true,
            input.id + "Option" + JSON.parse(input.value)[0]
          );
        });
        sect.appendChild(editSubProp);
      }
    }
    let confirm = document.createElement("button");
    confirm.innerHTML = "confirm";
    confirm.onclick = function () {
      let err = false;
      for (let i in props) {
        if (props[i][0] === "!") continue;
        let newVal = id(prefix + "prop" + props[i]).value;
        if (propertyType[type][i] === "boolean")
          newVal = id(prefix + "prop" + props[i]).checked;
        if (newVal == parseFloat(newVal)) newVal = parseFloat(newVal);
        if (newVal == "Infinity") newVal = Infinity;
        if (
          !(
            (typeof newVal === propertyType[type][i] ||
              propertyType[type][i] === "any" ||
              propertyType[type][i] === "block" ||
              (propertyType[type][i] === "integer" &&
                parseInt(newVal) === parseFloat(newVal))) &&
            ((newVal >= propertyLimit[type][i][0] &&
              newVal <= propertyLimit[type][i][1]) ||
              propertyLimit[type][i] === "none")
          )
        ) {
          err = true;
          id(prefix + "prop" + props[i]).value = "";
          break;
        }
      }
      if (!err) {
        for (let i in props) {
          if (props[i][0] === "!") continue;
          let newVal = id(prefix + "prop" + props[i]).value;
          if (propertyType[type][i] == "boolean")
            newVal = id(prefix + "prop" + props[i]).checked;
          if (newVal == parseFloat(newVal)) newVal = parseFloat(newVal);
          if (newVal == "Infinity") newVal = Infinity;
          if (propertyType[type][i] == "block") newVal = JSON.parse(newVal);
          if (propertyType[type][i] == "block" && newVal[0] == 17) {
            player.spawnPoint = [x, y].concat(newVal.slice(1));
            player.startPoint = deepCopy(player.spawnPoint);
          }
          if (type === 17) {
            player.spawnPoint[parseInt(i) + 2] = newVal;
          }
          if (editDefault) {
            defaultProperty[type][i] = newVal;
          } else if (subProp) {
            let value = JSON.parse(id(subPropName).value);
            value[parseInt(i) + 1] = newVal;
            id(subPropName).value = JSON.stringify(value);
          } else {
            level[x][y][parseInt(i) + 1] = newVal;
          }
        }
        if (type === 17) {
          player.startPoint = deepCopy(player.spawnPoint);
        }
        drawLevel();
        menu.style.display = "none";
        if (!editDefault) {
          addVersion();
        } else drawBlock(id("blockSelect" + type), 0, 0, type, 0, 0, 1, true);
        if (subProp) {
          id("editProperty")
            .querySelectorAll("select, input, textarea, button")
            .forEach(function (ele) {
              ele.disabled = false;
            });
        } else editDisabled = false;
      } else {
        alert("Invalid value!");
      }
    };
    menu.appendChild(confirm);
    let cancel = document.createElement("button");
    cancel.innerHTML = "cancel";
    cancel.onclick = function () {
      menu.style.display = "none";
      if (subProp) {
        id("editProperty")
          .querySelectorAll("select, input, textarea, button")
          .forEach(function (ele) {
            ele.disabled = false;
          });
      } else editDisabled = false;
    };
    menu.appendChild(cancel);
    menu.onkeydown = function (input) {
      if (input.code === "Enter" && !input.shiftKey) confirm.click();
    };
    menu.style.display = "block";
    editDisabled = true;
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
function getBlockType(x, y, subtype = true, block) {
  if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
    return 1;
  }
  let type;
  if (block === undefined) {
    type = level[x][y];
  } else type = block;
  if (subtype) {
    if (type[0] === 32) {
      if (player.switchsOn[type[1]]) {
        type = 1;
      } else type = 0;
    }
    if (type[0] === 33) {
      if (player.switchsOn[type[1]]) {
        type = 0;
      } else type = 1;
    }
    if (type[0] === 34) {
      if (player.switchsOn[type[1]]) {
        type = 2;
      } else type = 0;
    }
    if (type[0] === 35) {
      if (player.switchsOn[type[1]]) {
        type = 0;
      } else type = 2;
    }
    if (hasProperty(type[0]) && propertyType[type[0]].includes("block")) {
      type = type[getSubBlockPos(x, y)];
    }
  }
  if (typeof type === "object") return type[0];
  return type;
}
function getSubBlockPos(x, y) {
  let type = level[x][y];
  if (type[0] === 52) {
    if (!player.switchsOn[type[4]] !== !type[3]) {
      return 1;
    } else return 2;
  }
  if (type[0] === 53) {
    if (player.timerOn !== type[3]) {
      return 1;
    } else return 2;
  }
  if (type[0] === 54) {
    if (player.jumpOn !== type[3]) {
      return 1;
    } else return 2;
  }
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
function getProps(
  type,
  subBlock = false,
  x = getCoord(type)[0],
  y = getCoord(type)[1]
) {
  if (!subBlock) subBlock = getSubBlockPos(x, y);
  let block = level[x][y];
  if (block[0] !== type) {
    return block[subBlock];
  } else return block;
}
function editProp(x, y, type, num, val, all = false) {
  let block = level[x][y];
  if (block[0] !== type) {
    if (all) {
      for (let i in block) {
        if (i == 0) continue;
        if (
          propertyType[block[0]][parseInt(i) - 1] === "block" &&
          block[i][0] === type
        )
          block[i][num] = val;
      }
    } else {
      block[getSubBlockPos(x, y)][num] = val;
    }
  } else block[num] = val;
}
function levelIncludes(type) {
  return level.some((x) =>
    x.some(function (y) {
      if (getBlockType(0, 0, false, y) === type) return true;
      return blockIncludes(y, type);
    })
  );
}
function blockIncludes(block, type) {
  if (typeof type === "object") {
    for (let j in type) {
      for (let i in block) {
        if (i == 0) continue;
        if (
          getBlockType(0, 0, false, block[i]) === type[j] &&
          propertyType[block[0]][parseInt(i) - 1] === "block"
        )
          return true;
      }
    }
    return false;
  } else {
    for (let i in block) {
      if (i == 0) continue;
      if (
        getBlockType(0, 0, false, block[i]) === type &&
        propertyType[block[0]][parseInt(i) - 1] === "block"
      )
        return true;
    }
    return false;
  }
}
function getDefaultSpawn() {
  return [4, 5, 325, 1, 600, [], false, false, false, 4000];
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
    !arraysEqual(player.switchsOn, player.startPoint[5]) ||
    player.jumpOn !== player.startPoint[6] ||
    player.timerOn !== player.startPoint[7] ||
    timerStage !== 0;
  player.switchsOn = [...player.startPoint[5]];
  player.jumpOn = player.startPoint[6];
  player.timerOn = player.startPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  player.xg = player.startPoint[8];
  for (let x in level) {
    for (let y in level[x]) {
      if (blockIncludes(level[x][y], 31)) {
        editProp(x, y, 31, 3, "unused", true);
        shouldDraw = true;
      }
    }
  }
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
    arraysEqual(player.switchsOn, player.spawnPoint[5]) ||
    player.jumpOn !== player.spawnPoint[6] ||
    player.timerOn !== player.spawnPoint[7] ||
    timerStage !== 0;
  player.switchsOn = [...player.spawnPoint[5]];
  player.jumpOn = player.spawnPoint[6];
  player.timerOn = player.spawnPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  player.xg = player.spawnPoint[8];
  for (let x in level) {
    for (let y in level[x]) {
      if (
        getBlockType(x, y) === 31 &&
        getProps(31, false, x, y)[3] === "used/unsaved"
      ) {
        editProp(x, y, 31, 3, "unused", true);
        shouldDraw = true;
      }
    }
  }
  if (shouldDraw) drawLevel();
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
  if (typeof a !== "object" || typeof b !== "object") return a === b;
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
function deinfinify(obj) {
  obj = deepCopy(obj);
  for (let i in obj) {
    if (obj[i] == Infinity) obj[i] = "Infinity";
  }
  return obj;
}
function infinify(obj) {
  obj = deepCopy(obj);
  for (let i in obj) {
    if (obj[i] == "Infinity") obj[i] = Infinity;
  }
  return obj;
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
      setTimeout(function () {
        drawBlock(button, 0, 0, blockSelect[i], 0, 0, 1, true);
      }, 2000);
      button.addEventListener("mousedown", function (input) {
        if (input.button == 0 && control.e) {
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
        addTooltip(button, "[E] + LMB to edit default properties");
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
  if (!localStorage.getItem("just-an-editor-save")) {
    localStorage.setItem("just-an-editor-save", "{}");
    localStorage.setItem("just-a-save-list", "[]");
  }
  addTooltip(id("autoSaveButton"), "Saves once every 5 seconds");
}

init();
window.requestAnimationFrame(nextFrame);
