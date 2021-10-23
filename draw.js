var playerSize = 20;
var blockSize = 50;
function drawPlayer() {
  let canvas = id("playerLayer");
  let pL = canvas.getContext("2d");
  canvas.width = levels[player.currentLevel].length * blockSize;
  canvas.height = levels[player.currentLevel][0].length * blockSize;
  pL.clearRect(0, 0, canvas.width, canvas.height);
  let ratio = player.currentJumps / player.maxJumps;
  if (player.maxJumps === Infinity) ratio = 1;
  if (player.maxJumps === 0) ratio = 0;
  pL.fillStyle = `rgb(${255 - ratio * 255},0,${ratio * 255})`;
  if (options.darkMode)
    pL.fillStyle = `rgb(${255 - ratio * 255 * 0.75},${255 * 0.25},${
      ratio * 255 * 0.75 + 255 * 0.25
    })`;
  if (player.isDead) pL.fillStyle += "88";
  pL.fillRect(
    Math.floor(player.x),
    Math.floor(player.y),
    playerSize,
    playerSize
  );
  adjustScreen();
}

const transparentBlocks = [
  -5,
  -4,
  -3,
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
  21,
  22,
  23
];
function drawLevel() {
  let canvas = id("levelLayer");
  let lL = canvas.getContext("2d");
  let bcanv = id("bgLayer");
  let bL = id("bgLayer").getContext("2d");
  canvas.width = levels[player.currentLevel].length * blockSize;
  canvas.height = levels[player.currentLevel][0].length * blockSize;
  bcanv.width = levels[player.currentLevel].length * blockSize;
  bcanv.height = levels[player.currentLevel][0].length * blockSize;
  lL.clearRect(0, 0, canvas.width, canvas.height);
  bL.clearRect(0, 0, canvas.width, canvas.height);
  bL.fillStyle = "#FFFFFF";
  for (let x in levels[player.currentLevel]) {
    for (let y in levels[player.currentLevel][x]) {
      lL.lineWidth = (blockSize * 3) / 25;
      let xb = x * blockSize;
      let yb = y * blockSize;
      let type = getBlockType(x, y);
      let props = type;
      if (typeof type === "object") type = type[0];
      switch (type) {
        case -5:
          if (isSpawn(x, y)) {
            lL.fillStyle = "#FFFF0088";
          } else lL.fillStyle = "#88880088";
          break;
        case -4:
          lL.fillStyle = "#00FF0088";
          break;
        case -3:
          if (!player.triggers.includes(props[1])) {
            lL.fillStyle = "#00880088";
          } else lL.fillStyle = "#00FF0088";
          break;
        case 1:
          lL.fillStyle = "#000000";
          break;
        case 2:
          lL.fillStyle = "#FF0000";
          break;
        case 3:
          if (isSpawn(x, y)) {
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
        case 21:
          lL.fillStyle = "#00880088";
          break;
        case 22:
          lL.fillStyle = "#00BB0088";
          break;
        case 23:
          lL.fillStyle = "#00FF0088";
          break;
        case 40:
          lL.fillStyle = "#8888FF";
          break;
        default:
          lL.fillStyle = "#00000000";
      }
      lL.fillRect(xb, yb, blockSize, blockSize);
      if (transparentBlocks.includes(type))
        bL.fillRect(xb, yb, blockSize, blockSize);
      switch (type) {
        case -5:
          if (isSpawn(x, y)) {
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
        case -4:
          lL.strokeStyle = "#00880088";
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
        case -3:
          lL.lineWidth = blockSize / 25;
          if (!player.triggers.includes(props[1])) {
            lL.strokeStyle = "#00440088";
            lL.fillStyle = "#00440088";
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
            lL.strokeStyle = "#00880088";
            lL.fillStyle = "#00880088";
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
          break;
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
          if (isSpawn(x, y)) {
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
          lL.lineTo(
            xb + blockSize / 2,
            yb + blockSize / 5 + (blockSize / 25) * 6
          );
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
            lL.lineTo(
              xb + (blockSize / 6) * i + blockSize / 2,
              yb + blockSize / 2
            );
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
            lL.lineTo(
              xb + (blockSize / 8) * i + blockSize / 2,
              yb + blockSize / 2
            );
            lL.lineTo(
              xb + (blockSize / 8) * i,
              yb + blockSize - (blockSize / 25) * 3
            );
            lL.stroke();
          }
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
        default:
          break;
      }
    }
  }
  adjustScreen();
}

var lvlx = 0;
var lvly = 0;
var camx = 0;
var camy = 0;
var camDelay = 15;
function adjustScreen(instant = false) {
  lvlx = Math.floor(
    (window.innerWidth - levels[player.currentLevel].length * blockSize) / 2
  );
  if (lvlx < 0) {
    lvlx =
      Math.floor(window.innerWidth / 2) - Math.floor(player.x + playerSize / 2);
    if (lvlx > 0) lvlx = 0;
    if (
      lvlx <
      window.innerWidth - levels[player.currentLevel].length * blockSize
    )
      lvlx = Math.floor(
        window.innerWidth - levels[player.currentLevel].length * blockSize
      );
  }
  lvly = Math.floor(
    (window.innerHeight - levels[player.currentLevel][0].length * blockSize) / 2
  );
  if (lvly < 0) {
    lvly =
      Math.floor(window.innerHeight / 2) -
      Math.floor(player.y + playerSize / 2);
    if (lvly > 0) lvly = 0;
    if (
      lvly <
      window.innerHeight - levels[player.currentLevel][0].length * blockSize
    )
      lvly = Math.floor(
        window.innerHeight - levels[player.currentLevel][0].length * blockSize
      );
  }
  camx = (camx * (camDelay - 1) + lvlx) / camDelay;
  camy = (camy * (camDelay - 1) + lvly) / camDelay;
  if (Math.abs(camx - lvlx) < 1 || instant) camx = lvlx;
  if (Math.abs(camy - lvly) < 1 || instant) camy = lvly;
  id("bgLayer").style.left = camx + "px";
  id("bgLayer").style.top = camy + "px";
  id("playerLayer").style.left = camx + "px";
  id("levelLayer").style.left = camx + "px";
  id("playerLayer").style.top = camy + "px";
  id("levelLayer").style.top = camy + "px";
}
