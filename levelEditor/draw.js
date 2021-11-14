const diff = "";
var baseBlockSize = 50;
var lvlxOffset = 0;
var lvlyOffset = 0;
var prevPlayerx = 0;
var prevPlayery = 0;
function drawPlayer() {
  let canvas = id("playerLayer");
  let pL = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  pL.clearRect(prevPlayerx, prevPlayery, player.size, player.size);
  let ratio = player.currentJumps / player.maxJumps;
  if (player.maxJumps === Infinity) ratio = 1;
  if (player.maxJumps === 0) ratio = 0;
  pL.fillStyle = `rgb(${255 - ratio * 255},0,${ratio * 255})`;
  if (options.darkMode)
    pL.fillStyle = `rgb(${255 - ratio * 255 * 0.75},${255 * 0.25},${
      ratio * 255 * 0.75 + 255 * 0.25
    })`;
  if (player.godMode) pL.fillStyle = "#FF00FF";
  if (player.noclip || player.isDead) pL.fillStyle += "88";

  if (player.customColor)
    pL.fillStyle = `rgb(${player.customColor.join(", ")})`;
  pL.fillRect(
    Math.floor(player.x) + Math.floor(camx),
    Math.floor(player.y) + Math.floor(camy),
    player.size,
    player.size
  );
}
var prevLevel = [];
var prevSwitch = [];
var prevTimer = false;
var prevTimerStage = 0;
var prevJumpState = false;
var prevCoin = 0;
var prevSpawnPos = [];
function drawLevel(clear = false) {
  let canvas = id("levelLayer");
  id("background").style.width = canvas.width + "px";
  id("background").style.height = canvas.height + "px";
  if (clear) {
    prevLevel = [];
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }
  for (
    let x = Math.max(Math.floor(-camCenterx / baseBlockSize), 0);
    x <=
    Math.min(
      Math.floor((canvas.width - camCenterx) / baseBlockSize),
      level.length
    ) -
      1;
    x++
  ) {
    for (
      let y = Math.max(Math.floor(-camCentery / baseBlockSize), 0);
      y <=
      Math.min(
        Math.floor((canvas.height - camCentery) / baseBlockSize),
        level[0].length
      ) -
        1;
      y++
    ) {
      if (prevLevel[x] == undefined) {
        drawBlock(canvas, x, y);
      } else {
        let prevBlock = prevLevel[x][y];
        if (prevBlock == undefined) prevBlock = 0;
        if (
          !arraysEqual(level[x][y], prevBlock) ||
          (!arraysEqual(player.switchsOn, prevSwitch) &&
            ([31, 32, 33, 34, 35, 52].includes(getBlockType(x, y, false)) ||
              blockIncludes(level[x][y], [31, 32, 33, 34, 35, 52]))) ||
          ((timerStage != prevTimerStage || player.timerOn != prevTimer) &&
            ([36, 37, 38, 39, 53].includes(getBlockType(x, y, false)) ||
              blockIncludes(level[x][y], [36, 37, 38, 39, 53]))) ||
          (player.jumpOn != prevJumpState &&
            ([42, 43, 44, 45, 54].includes(getBlockType(x, y, false)) ||
              blockIncludes(level[x][y], [42, 43, 44, 45, 54]))) ||
          (player.coins != prevCoin &&
            ([78, 79, 80, 81, 82].includes(getBlockType(x, y, false)) ||
              blockIncludes(level[x][y], [78, 79, 80, 81, 82]))) ||
          (!arraysEqual(prevSpawnPos, [
            player.spawnPoint[0],
            player.spawnPoint[1]
          ]) &&
            (arraysEqual(
              [Math.floor(prevSpawnPos[0]), Math.floor(prevSpawnPos[1])],
              [parseInt(x), parseInt(y)]
            ) ||
              arraysEqual(
                [
                  Math.floor(player.spawnPoint[0]),
                  Math.floor(player.spawnPoint[1])
                ],
                [parseInt(x), parseInt(y)]
              )))
        )
          drawBlock(canvas, parseInt(x), parseInt(y));
      }
    }
  }
  drawPlayer();
  prevLevel = deepCopy(level);
  prevSwitch = deepCopy(player.switchsOn);
  prevTimer = player.timerOn;
  prevTimerStage = timerStage;
  prevJumpState = player.jumpOn;
  prevCoin = player.coins;
  prevSpawnPos = [player.spawnPoint[0], player.spawnPoint[1]];
}

// TODO make this an obj. with [prop]: true, etc.
const transparentBlocks = [
  3,
  6,
  7,
  8,
  9,
  10,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  21,
  22,
  23,
  27,
  28,
  29,
  30,
  31,
  41,
  46,
  48,
  49,
  50,
  59,
  60,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  76
];

function drawBlock(
  canvas,
  x,
  y,
  type = getBlockType(x, y, false),
  xOffset = 0,
  yOffset = 0,
  size = 1,
  useDefault = false,
  subBlock = getSubBlockPos(x, y)
) {
  let blockSize = baseBlockSize * size;
  let lL = canvas.getContext("2d");
  let bL = id("bgLayer").getContext("2d");
  lL.lineWidth = (blockSize * 3) / 25;
  let xb = (x + xOffset) * baseBlockSize + camCenterx;
  let yb = (y + yOffset) * baseBlockSize + camCentery;
  if (useDefault) {
    xb = 0;
    yb = 0;
  }
  let clear = false;
  let data;
  if (typeof type === "object") {
    data = deepCopy(type);
    type = type[0];
  }
  if (hasProperty(type) && data === undefined) {
    if (useDefault) {
      data = defaultProperty[type].slice();
      data.unshift(type);
    } else {
      data = level[x][y];
    }
  }
  let sOn = player.switchsOn;
  let tOn = player.timerOn;
  let tMs =
    timerStage * Math.min(1000, player.timerInterval / 4) + sinceLastTimerStage;
  let tIn = player.timerInterval;
  let jOn = player.jumpOn;
  if (useDefault) {
    sOn = [];
    tOn = false;
    tMs = 0;
    tIn = 4000;
    jOn = false;
  }
  lL.clearRect(xb, yb, blockSize, blockSize);
  bL.clearRect(xb, yb, blockSize, blockSize);
  bL.fillStyle = "#FFFFFF";
  if (transparentBlocks.includes(type))
    bL.fillRect(xb, yb, blockSize, blockSize);
  if (transparentBlocks.includes(type) && canvas.id.startsWith("blockSelect")) {
    lL.fillStyle = "#FFFFFF";
    lL.fillRect(xb, yb, blockSize, blockSize);
  }
  switch (type) {
    case 1:
      lL.fillStyle = "#000000";
      break;
    case 2:
      lL.fillStyle = "#FF0000";
      break;
    case 3:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.fillStyle = "#00FFFF88";
      } else lL.fillStyle = "#00888888";
      break;
    case 5:
      lL.fillStyle = "#FFFF00";
      break;
    case 6:
      lL.fillStyle = "#FF888888";
      break;
    case 7:
      lL.fillStyle = "#8888FF88";
      break;
    case 8:
      lL.fillStyle = "#FFFF8888";
      break;
    case 9:
      lL.fillStyle = "#88FF8888";
      break;
    case 10:
      lL.fillStyle = "#88FFFF88";
      break;
    case 11:
      lL.fillStyle = "#7289DA";
      break;
    case 12:
      lL.fillStyle = "#77440088";
      break;
    case 13:
      lL.fillStyle = "#99550088";
      break;
    case 14:
      lL.fillStyle = "#BB660088";
      break;
    case 15:
      lL.fillStyle = "#DD770088";
      break;
    case 16:
      lL.fillStyle = "#FF880088";
      break;
    case 17:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.fillStyle = "#FFFF0088";
      } else lL.fillStyle = "#88880088";
      break;
    case 18:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.fillStyle = "#FFFF0088";
      } else lL.fillStyle = "#88880088";
      break;
    case 21:
      lL.fillStyle = "#00880088";
      break;
    case 22:
      lL.fillStyle = "#00BB0088";
      break;
    case 23:
      lL.fillStyle = "#00FF0088";
      break;
    case 24:
      lL.fillStyle = "#FF00FF";
      break;
    case 25:
      lL.fillStyle = "#FF8888";
      break;
    case 26:
      lL.fillStyle = "#88FFFF";
      break;
    case 27:
      lL.fillStyle = "#00000088";
      break;
    case 28:
      lL.fillStyle = "#00000088";
      break;
    case 29:
      lL.fillStyle = "#00000088";
      break;
    case 30:
      lL.fillStyle = "#00000088";
      break;
    case 31:
      if (!data[2] || data[3] === "unused") {
        if (!sOn[data[1]]) {
          lL.fillStyle = "#00880088";
        } else lL.fillStyle = "#00FF0088";
      } else {
        if (!sOn[data[1]]) {
          lL.fillStyle = "#88000088";
        } else lL.fillStyle = "#FF000088";
      }
      break;
    case 32:
      if (!sOn[data[1]]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 33:
      if (sOn[data[1]]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 34:
      if (!sOn[data[1]]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 35:
      if (sOn[data[1]]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 36:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 37:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 38:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 39:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 40:
      lL.fillStyle = "#8888FF";
      break;
    case 41:
      lL.fillStyle = "#FF88FF88";
      break;
    case 42:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 43:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 44:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 45:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 46:
      lL.fillStyle = "#0000FF88";
      break;
    case 47:
      lL.fillStyle = `hsl(${(data[1] / 1000) * 360},100%,50%)`;
      break;
    case 48:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 49:
      lL.fillStyle = `hsla(${(data[1] / 10) * 360},100%,50%,0.5)`;
      break;
    case 50:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 51:
      lL.fillStyle = `rgb(${data[1]},${data[2]},${data[3]})`;
      break;
    case 59:
      lL.fillStyle = "#FF88FF88";
      break;
    case 60:
      lL.fillStyle = "#FFBB8888";
      break;
    case 61:
      lL.fillStyle = "#FF88FF";
      break;
    case 62:
      lL.fillStyle = "#FFBB88";
      break;
    case 63:
      lL.fillStyle = "#BBBBBB88";
      break;
    case 64:
      lL.fillStyle = "#00008888";
      break;
    case 65:
      lL.fillStyle = "#0000BB88";
      break;
    case 66:
      lL.fillStyle = "#0000FF88";
      break;
    case 67:
      lL.fillStyle = `hsla(${(data[1] / 500) * 360},100%,50%,0.5)`;
      break;
    case 68:
      lL.fillStyle = "#88008888";
      break;
    case 69:
      lL.fillStyle = "#BB00BB88";
      break;
    case 70:
      lL.fillStyle = "#FF00FF88";
      break;
    case 71:
      lL.fillStyle = `hsla(${(data[1] / 5) * 360},100%,50%,0.5)`;
      break;
    case 72:
      lL.fillStyle = `rgb(${(1 - Math.min(data[2] / data[1], 1)) * 255},0,0)`;
      if (data[2] === 0)
        lL.fillStyle = `rgba(${Math.min(data[4] / data[3], 1) * 255},0,0,0.5)`;
      break;
    case 74:
      lL.fillStyle = `rgb(${data[1]},${data[2]},${data[3]})`;
      bL.fillStyle = `rgb(${data[1]},${data[2]},${data[3]})`;
      break;
    case 75:
      lL.fillStyle = "#222288";
      break;
    case 76:
      lL.fillStyle = `hsla(240,50%,50%,${(data[4] ^ data[6]) * 0.5 + 0.5})`;
      break;
    case 78:
      if (!(player.coins >= data[1])) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FFFF00";
      break;
    case 79:
      if (player.coins >= data[1]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#888800";
      break;
    case 80:
      if (!(player.coins >= data[1])) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FFFF00";
      break;
    case 81:
      if (player.coins >= data[1]) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#888800";
      break;
    case 85:
      lL.fillStyle = `hsla(240,50%,50%,${(data[4] ^ data[6]) * 0.5 + 0.5})`;
      break;
    default:
      clear = true;
  }

  if (!clear && (type !== 74 || canvas.id !== "levelLayer"))
    lL.fillRect(xb, yb, blockSize, blockSize);
  if (type === 74 && canvas.id === "levelLayer")
    bL.fillRect(xb, yb, blockSize, blockSize);
  switch (type) {
    case 2:
      lL.strokeStyle = "#880000";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 3:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.strokeStyle = "#00888888";
      } else lL.strokeStyle = "#00444488";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 5:
      lL.strokeStyle = "#888800";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 6:
      lL.strokeStyle = "#88000088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 7:
      lL.strokeStyle = "#00008888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5 + (blockSize / 25) * 6);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 8:
      lL.strokeStyle = "#88880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 9
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 9:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 10:
      lL.strokeStyle = "#00888888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + (blockSize / 25) * 3
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 11:
      lL.strokeStyle = "#4E5D94";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize - blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();
      break;
    case 12:
      lL.strokeStyle = "#44220088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 13:
      lL.strokeStyle = "#55270088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 3) * 2, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 3) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 14:
      lL.strokeStyle = "#66330088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 3) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 3) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 6) * 5, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 6) * 5,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 15:
      lL.strokeStyle = "#77380088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 4) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 4) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 16:
      lL.strokeStyle = "#88440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize / 2,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize - blockSize / 2,
        yb + blockSize / 2
      );
      lL.stroke();
      break;
    case 17:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.strokeStyle = "#88880088";
      } else lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 18:
      if (isSpawn(x + xOffset, y + yOffset)) {
        lL.strokeStyle = "#88880088";
      } else lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 21:
      lL.strokeStyle = "#00440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 4 + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 4, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();
      break;
    case 22:
      lL.strokeStyle = "#00660088";
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 23:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 8) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 8) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 8) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 24:
      lL.strokeStyle = "#880088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 25:
      lL.strokeStyle = "#884444";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 26:
      lL.strokeStyle = "#448888";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 27:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 5, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 4,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 28:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 5, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 4, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 29:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 30:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 31:
      lL.lineWidth = blockSize / 25;
      if (!sOn[data[1]]) {
        if (!data[2] || data[3] === "unused") {
          lL.fillStyle = "#00440088";
        } else {
          lL.fillStyle = "#44000088";
        }
        lL.strokeStyle = lL.fillStyle;
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + (blockSize / 25) * 3 + (blockSize / 50) * 3,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      } else {
        if (!data[2] || data[3] === "unused") {
          lL.fillStyle = "#00880088";
        } else {
          lL.fillStyle = "#88000088";
        }
        lL.strokeStyle = lL.fillStyle;
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + blockSize / 2,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      }
      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 32:
      lL.strokeStyle = "#008800";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 33:
      lL.strokeStyle = "#004400";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 34:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 35:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#004400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 36:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#66666688";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 37:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#33333388";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 38:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#66666688";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 39:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#33333388";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 40:
      lL.strokeStyle = "#444488";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.stroke();
      break;
    case 41:
      lL.strokeStyle = "#88448888";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();

      // little arrow
      let arrowXOffset = 0,
        arrowYOffset = 0;
      if (data[1] - x * data[3] > 0) arrowXOffset = 3 * (blockSize / 25);
      else if (data[1] - x * data[3] < 0) arrowXOffset = -3 * (blockSize / 25);
      if (data[2] - y * data[3] > 0) arrowYOffset = 3 * (blockSize / 25);
      else if (data[2] - y * data[3] < 0) arrowYOffset = -3 * (blockSize / 25);
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2 + arrowXOffset,
        yb + blockSize / 2 + arrowYOffset,
        blockSize / 20,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 42:
      lL.strokeStyle = "#880000";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 43:
      lL.strokeStyle = "#442200";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 44:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#880000";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;
      break;
    case 45:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#442200";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 46:
      lL.fillStyle = "#00008888";
      lL.font = blockSize + "px serif";
      lL.textAlign = "center";
      lL.textBaseline = "middle";
      lL.fillText(
        "T",
        xb + blockSize / 2,
        yb + blockSize / 2 + (blockSize / 25) * 2
      );
      break;
    case 47:
      lL.strokeStyle = `hsl(${(data[1] / 1000) * 360},100%,25%)`;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 48:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 49:
      lL.strokeStyle = `hsla(${(data[1] * 360) / 10},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 50:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 52:
      if (!sOn[data[4]] !== !data[3]) {
        drawBlock(canvas, x, y, data[1], xOffset, yOffset, size, useDefault, 1);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[2],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            2
          );
      } else {
        drawBlock(canvas, x, y, data[2], xOffset, yOffset, size, useDefault, 2);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[1],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            1
          );
      }

      lL.fillStyle = "#00880044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[4], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[4], xb, yb);
      break;
    case 53:
      if (tOn !== data[3]) {
        drawBlock(canvas, x, y, data[1], xOffset, yOffset, size, useDefault, 1);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[2],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            2
          );
      } else {
        drawBlock(canvas, x, y, data[2], xOffset, yOffset, size, useDefault, 2);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[1],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            1
          );
      }

      lL.fillStyle = "#88888844";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.fillStyle = "#888888BB";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#888888";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 54:
      if (jOn !== data[3]) {
        drawBlock(canvas, x, y, data[1], xOffset, yOffset, size, useDefault, 1);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[2],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            2
          );
      } else {
        drawBlock(canvas, x, y, data[2], xOffset, yOffset, size, useDefault, 2);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[1],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            1
          );
      }

      lL.fillStyle = "#88440044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#884400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 55:
      lL.fillStyle = "#000000";
      lL.fillRect(xb, yb, (blockSize / 25) * 3, blockSize);
      lL.fillRect(xb, yb, (blockSize / 25) * 6, (blockSize / 25) * 3);
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 3,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      lL.strokeStyle = "#00000088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize * 3) / 4, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + (blockSize * 3) / 4, yb + (blockSize * 3) / 4);
      lL.stroke();
      break;
    case 56:
      lL.fillStyle = "#000000";
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb,
        (blockSize / 25) * 3,
        blockSize
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 6,
        yb,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize - (blockSize / 25) * 3,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      lL.strokeStyle = "#00000088";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 4, yb + (blockSize * 3) / 4);
      lL.stroke();
      break;
    case 57:
      lL.fillStyle = "#000000";
      lL.fillRect(xb, yb, blockSize, (blockSize / 25) * 3);
      lL.fillRect(xb, yb, (blockSize / 25) * 3, (blockSize / 25) * 6);
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      lL.strokeStyle = "#00000088";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize * 3) / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + (blockSize * 3) / 4, yb + (blockSize * 3) / 4);
      lL.stroke();
      break;
    case 58:
      lL.fillStyle = "#000000";
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 3,
        blockSize,
        (blockSize / 25) * 3
      );
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 6,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      lL.strokeStyle = "#00000088";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + (blockSize * 3) / 4, yb + blockSize / 4);
      lL.stroke();
      break;
    case 59:
      lL.strokeStyle = "#88008888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        yb + (blockSize - blockSize / 5) / 2,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - blockSize / 5 - (blockSize / 25) * 6,
        yb + blockSize / 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 25) * 6,
        yb + blockSize / 2 + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 60:
      lL.strokeStyle = "#88440088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize / 25) * 3,
        yb + (blockSize - blockSize / 5) / 2,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5 + (blockSize / 25) * 6, yb + blockSize / 2);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize / 2 + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 61:
      lL.strokeStyle = "#884488";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 5, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 4,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 62:
      lL.strokeStyle = "#886644";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 5, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 4, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 63:
      let minAngle = (data[1] / (60 * 1000) / 60) * 2 * Math.PI;
      let secAngle = ((data[1] % (60 * 1000)) / 60000) * 2 * Math.PI;
      lL.strokeStyle = "#66666688";
      lL.lineWidth = (blockSize / 25) * 2;
      lL.lineCap = "round";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 50) * 19 * Math.cos(Math.PI / 2 - minAngle),
        yb +
          blockSize / 2 -
          (blockSize / 50) * 19 * Math.sin(Math.PI / 2 - minAngle)
      );
      lL.stroke();

      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 50) * 19 * Math.cos(Math.PI / 2 - secAngle),
        yb +
          blockSize / 2 -
          (blockSize / 50) * 19 * Math.sin(Math.PI / 2 - secAngle)
      );
      lL.stroke();
      lL.lineCap = "butt";

      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 64:
      lL.strokeStyle = "#00004488";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 6
      );

      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 6
      );

      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 6,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 6
      );

      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 6,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 65:
      lL.strokeStyle = "#00006688";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + blockSize / 4 + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 4, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 4 + (blockSize / 25) * 3, yb + blockSize / 4);

      lL.moveTo(
        xb + blockSize - blockSize / 4,
        yb + blockSize / 4 + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - blockSize / 4, yb + blockSize / 4);
      lL.lineTo(
        xb + blockSize - blockSize / 4 - (blockSize / 25) * 3,
        yb + blockSize / 4
      );

      lL.moveTo(
        xb + blockSize / 4,
        yb + blockSize - blockSize / 4 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize / 4, yb + blockSize - blockSize / 4);
      lL.lineTo(
        xb + blockSize / 4 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );

      lL.moveTo(
        xb + blockSize - blockSize / 4,
        yb + blockSize - blockSize / 4 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - blockSize / 4, yb + blockSize - blockSize / 4);
      lL.lineTo(
        xb + blockSize - blockSize / 4 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 66:
      lL.strokeStyle = "#00008888";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 6, yb + (blockSize / 25) * 3);
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 6);

      lL.moveTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );

      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 6,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );

      lL.moveTo(
        xb + blockSize - blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2 + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 67:
      lL.strokeStyle = `hsla(${(data[1] / 500) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + blockSize / 4 + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 4, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 4 + (blockSize / 25) * 3, yb + blockSize / 4);

      lL.moveTo(
        xb + blockSize - blockSize / 4,
        yb + blockSize / 4 + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - blockSize / 4, yb + blockSize / 4);
      lL.lineTo(
        xb + blockSize - blockSize / 4 - (blockSize / 25) * 3,
        yb + blockSize / 4
      );

      lL.moveTo(
        xb + blockSize / 4,
        yb + blockSize - blockSize / 4 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize / 4, yb + blockSize - blockSize / 4);
      lL.lineTo(
        xb + blockSize / 4 + (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );

      lL.moveTo(
        xb + blockSize - blockSize / 4,
        yb + blockSize - blockSize / 4 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - blockSize / 4, yb + blockSize - blockSize / 4);
      lL.lineTo(
        xb + blockSize - blockSize / 4 - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 68:
      lL.strokeStyle = "#44004488";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        Math.PI * 2
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 2 - (blockSize / 25) * 3) * Math.cos(Math.PI / 4),
        yb +
          blockSize / 2 -
          (blockSize / 2 - (blockSize / 25) * 3) * Math.sin(Math.PI / 4)
      );
      lL.stroke();
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.arc(
          xb + blockSize / 2,
          yb + blockSize / 2,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 25) * 3 * i,
          (Math.PI * 3) / 2,
          (Math.PI * 7) / 4
        );
        lL.stroke();
      }
      break;
    case 69:
      lL.strokeStyle = "#66006688";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        Math.PI * 2
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 2 - (blockSize / 25) * 3) * Math.cos(0),
        yb +
          blockSize / 2 -
          (blockSize / 2 - (blockSize / 25) * 3) * Math.sin(0)
      );
      lL.stroke();
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.arc(
          xb + blockSize / 2,
          yb + blockSize / 2,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 25) * 3 * i,
          (Math.PI * 3) / 2,
          Math.PI * 2
        );
        lL.stroke();
      }
      break;
    case 70:
      lL.strokeStyle = "#88008888";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        Math.PI * 2
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 2 - (blockSize / 25) * 3) * Math.cos(-Math.PI / 2),
        yb +
          blockSize / 2 -
          (blockSize / 2 - (blockSize / 25) * 3) * Math.sin(-Math.PI / 2)
      );
      lL.stroke();
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.arc(
          xb + blockSize / 2,
          yb + blockSize / 2,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 25) * 3 * i,
          (Math.PI * 3) / 2,
          (Math.PI * 5) / 2
        );
        lL.stroke();
      }
      break;
    case 71:
      lL.strokeStyle = `hsla(${(data[1] / 5) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        Math.PI * 2
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 2 - (blockSize / 25) * 3) * Math.cos(0),
        yb +
          blockSize / 2 -
          (blockSize / 2 - (blockSize / 25) * 3) * Math.sin(0)
      );
      lL.stroke();
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.arc(
          xb + blockSize / 2,
          yb + blockSize / 2,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 25) * 3 * i,
          (Math.PI * 3) / 2,
          Math.PI * 2
        );
        lL.stroke();
      }
      break;
    case 72:
      lL.strokeStyle = `rgb(${
        (1 - Math.min(data[2] / data[1], 1)) * 128 + 127
      },127,127)`;
      if (data[2] === 0)
        lL.strokeStyle = `rgba(${
          Math.min(data[4] / data[3], 1) * 127
        },0,0,0.5)`;
      lL.fillStyle = lL.strokeStyle;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 4) * 3);
      lL.stroke();

      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + (blockSize / 8) * 7,
        (blockSize / 25) * 2,
        0,
        2 * Math.PI
      );
      lL.fill();
      break;
    case 73:
      drawBlock(canvas, x, y, data[1], 0, 0, 1 / 2, useDefault);
      drawBlock(canvas, x, y, data[2], 0, 1 / 2, 1 / 2, useDefault);
      drawBlock(canvas, x, y, data[3], 1 / 2, 0, 1 / 2, useDefault);
      drawBlock(canvas, x, y, data[4], 1 / 2, 1 / 2, 1 / 2, useDefault);
      break;
    case 75:
      lL.strokeStyle = `hsl(240,50%,${(60 * data[4]) / data[3]}%)`;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - blockSize / 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.stroke();
      lL.strokeRect(
        xb + blockSize / 4,
        yb + blockSize / 4,
        blockSize / 2,
        blockSize / 2
      );
      break;
    case 76:
      lL.strokeStyle = `hsla(240,50%,${(80 * data[5]) / data[3]}%,${
        (data[4] ^ data[6]) * 0.75 + 0.25
      })`;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - blockSize / 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.stroke();
      break;
    case 77: {
      let collected = data[2] !== "uncollected";
      let a = data[3] ? "55" : "CC";
      let b = data[3] ? "CC" : "55";
      if (data[1] < 0) {
        lL.fillStyle = `#${a}55${b}`;
      } else lL.fillStyle = `#${a}CC${b}`;
      if (collected) lL.fillStyle += "88";
      lL.fillRect(
        xb + blockSize / 4,
        yb + blockSize / 4,
        blockSize / 2,
        blockSize / 2
      );

      a = data[3] ? "66" : "FF";
      b = data[3] ? "FF" : "66";
      if (data[1] < 0) {
        lL.fillStyle = `#${a}66${b}`;
      } else lL.fillStyle = `#${a}FF${b}`;
      if (collected) lL.fillStyle += "88";
      lL.fillRect(
        xb + (3 * blockSize) / 8,
        yb + (3 * blockSize) / 8,
        blockSize / 4,
        blockSize / 4
      );

      lL.fillStyle = "#000000";
      if (collected) lL.fillStyle += "88";
      lL.font = blockSize / 4 + "px DSEG7-7SEGG";
      lL.textAlign = "center";
      lL.textBaseline = "middle";
      lL.fillText(
        Math.abs(data[1]),
        xb + (7 * blockSize) / 16,
        yb + blockSize / 2
      );
      break;
    }
    case 78:
      lL.strokeStyle = "#888800";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 79:
      lL.strokeStyle = "#444400";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 80:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#888800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 81:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#444400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 82:
      if (!(player.coins >= data[1]) !== !data[4]) {
        drawBlock(canvas, x, y, data[2], xOffset, yOffset, size, useDefault, 2);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[3],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            3
          );
      } else {
        drawBlock(canvas, x, y, data[3], xOffset, yOffset, size, useDefault, 3);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[2],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            2
          );
      }

      lL.fillStyle = "#88880044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#888800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.fillStyle = "#FFFFFFBB";
      lL.font = blockSize / 3 + "px DSEG7-7SEGG";
      lL.textAlign = "left";
      lL.textBaseline = "top";
      lL.fillText(data[1], xb + blockSize / 25, yb + blockSize / 25);
      lL.fillStyle = "#000000BB";
      lL.fillText(data[1], xb, yb);
      break;
    case 83:
      lL.fillStyle = "#00000088";
      lL.fillRect(xb, yb, blockSize, blockSize);
      break;
    case 84:
      drawBlock(
        canvas,
        x,
        y,
        data[player.falseTexture ? 1 : 2],
        xOffset,
        yOffset,
        size,
        useDefault,
        subBlock
      );
      break;
    case 85:
      lL.strokeStyle = `hsla(240,50%,${(80 * data[5]) / data[3]}%,${
        (data[4] ^ data[6]) * 0.75 + 0.25
      })`;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );

      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 86:
      if (data[4] ^ data[6]) {
        drawBlock(canvas, x, y, data[7], xOffset, yOffset, size, useDefault, 1);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[8],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            2
          );
      } else {
        drawBlock(canvas, x, y, data[8], xOffset, yOffset, size, useDefault, 2);
        if (player.showSubblock)
          drawBlock(
            canvas,
            x,
            y,
            data[7],
            xOffset + size / 2,
            yOffset + size / 2,
            size / 2,
            useDefault,
            1
          );
      }

      lL.fillStyle = `hsla(240,50%,50%,0.25)`;
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = `hsl(240,50%,${(80 * data[5]) / data[3]}%)`;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    default:
  }
}
function drawGrid() {
  let canvas = id("grid");
  let g = canvas.getContext("2d");
  g.lineWidth = baseBlockSize / 25;
  canvas.width = Math.min(
    level.length * baseBlockSize,
    window.innerWidth + 2 * camOffsetLimit
  );
  canvas.height = Math.min(
    level[0].length * baseBlockSize,
    window.innerHeight + 2 * camOffsetLimit
  );
  for (let x = 0.5; x < canvas.width / baseBlockSize + 0.5; x += 0.5) {
    if (x % 1 === 0.5) {
      g.strokeStyle = options.darkMode ? "#666666" : "#BBBBBB";
    } else g.strokeStyle = options.darkMode ? "#BBBBBB" : "#444444";
    g.beginPath();
    g.moveTo(baseBlockSize * x + (camCenterx % baseBlockSize), 0);
    g.lineTo(baseBlockSize * x + (camCenterx % baseBlockSize), canvas.height);
    g.stroke();
  }
  for (let y = 0.5; y < canvas.height / baseBlockSize + 0.5; y += 0.5) {
    if (y % 1 === 0.5) {
      g.strokeStyle = options.darkMode ? "#666666" : "#BBBBBB";
    } else g.strokeStyle = options.darkMode ? "#BBBBBB" : "#444444";
    g.beginPath();
    g.moveTo(0, baseBlockSize * y + (camCentery % baseBlockSize));
    g.lineTo(canvas.width, baseBlockSize * y + (camCentery % baseBlockSize));
    g.stroke();
  }
}
var camx = 0;
var camy = 0;
var camDelay = 10;
var camCenterx = 0;
var camCentery = 0;
var prevCenterx = 0;
var prevCentery = 0;
var camOffsetLimit = baseBlockSize * 10;
function adjustScreen(instant = false) {
  let lvlx = level.length * baseBlockSize;
  let lvly = level[0].length * baseBlockSize;
  if (player.playerFocus) {
    lvlxOffset = Math.floor((window.innerWidth - lvlx) / 2);
    if (lvlxOffset < 0) {
      lvlxOffset =
        Math.floor(window.innerWidth / 2) -
        Math.floor(player.x + player.size / 2);
      if (lvlxOffset > 0) lvlxOffset = 0;
      if (lvlxOffset < window.innerWidth - lvlx)
        lvlxOffset = Math.floor(window.innerWidth - lvlx);
    }
    lvlyOffset = Math.floor((window.innerHeight - lvly) / 2);
    if (lvlyOffset < 0) {
      lvlyOffset =
        Math.floor(window.innerHeight / 2) -
        Math.floor(player.y + player.size / 2);
      if (lvlyOffset > 0) lvlyOffset = 0;
      if (lvlyOffset < window.innerHeight - lvly)
        lvlyOffset = Math.floor(window.innerHeight - lvly);
    }
  }
  camx = (camx * (camDelay - 1) + lvlxOffset) / camDelay;
  camy = (camy * (camDelay - 1) + lvlyOffset) / camDelay;
  if (camx > lvlxOffset) {
    camx = Math.floor(camx);
  } else camx = Math.ceil(camx);
  if (camy > lvlyOffset) {
    camy = Math.floor(camy);
  } else camy = Math.ceil(camy);
  if (Math.abs(camx - lvlxOffset) < 1 || instant) camx = lvlxOffset;
  if (Math.abs(camy - lvlyOffset) < 1 || instant) camy = lvlyOffset;

  let camOffsetx = camx - camCenterx;
  let camOffsety = camy - camCentery;
  if (camOffsetx > 0 || camOffsetx < -2 * camOffsetLimit) {
    camCenterx = camx + camOffsetLimit;
    if (camCenterx > 0) camCenterx = 0;
    if (camCenterx < id("levelLayer").width - lvlx)
      camCenterx = id("levelLayer").width - lvlx;
    camOffsetx = camx - camCenterx;
    if (prevCenterx !== camCenterx) {
      drawLevel(true);
      drawGrid();
    }
    prevCenterx = camCenterx;
  }
  if (camOffsety > 0 || camOffsety < -2 * camOffsetLimit) {
    camCentery = camy + camOffsetLimit;
    if (camCentery > 0) camCentery = 0;
    if (camCentery < id("levelLayer").height - lvly)
      camCentery = id("levelLayer").height - lvly;
    camOffsety = camy - camCentery;
    if (prevCentery !== camCentery) {
      drawLevel(true);
      drawGrid();
    }
    prevCentery = camCentery;
  }
  id("bgLayer").style.left = camOffsetx + "px";
  id("bgLayer").style.top = camOffsety + "px";
  id("levelLayer").style.left = camOffsetx + "px";
  id("levelLayer").style.top = camOffsety + "px";
  id("background").style.left = camOffsetx + "px";
  id("background").style.top = camOffsety + "px";
  id("grid").style.left = camOffsetx + "px";
  id("grid").style.top = camOffsety + "px";
  drawPlayer();
}
function adjustLevelSize() {
  id("levelLayer").width = Math.min(
    level.length * baseBlockSize,
    window.innerWidth + 2 * camOffsetLimit
  );
  id("levelLayer").height = Math.min(
    level[0].length * baseBlockSize,
    window.innerHeight + 2 * camOffsetLimit
  );
  id("bgLayer").width = Math.min(
    level.length * baseBlockSize,
    window.innerWidth + 2 * camOffsetLimit
  );
  id("bgLayer").height = Math.min(
    level[0].length * baseBlockSize,
    window.innerHeight + 2 * camOffsetLimit
  );
  drawLevel(true);
  adjustScreen(true);
}
