document.addEventListener("mousedown", function (input) {
  if (input.ctrlKey) {
    if (input.button === 0) control.lmb = true;
    if (input.button === 2) {
      player.playerFocus = true;
      adjustScreen();
    }
  }
});
id("levelLayer").addEventListener("mousedown", function (input) {
  if (!editDisabled) {
    input.preventDefault();
    window.focus();
    let xb = Math.floor(input.offsetX / blockSize);
    let yb = Math.floor(input.offsetY / blockSize);
    if (control.e) {
      if (input.button === 0) {
        openPropertyMenu(xb, yb);
      }
    } else if (input.ctrlKey) {
      if (input.button === 0) control.lmb = true;
      if (input.button === 2) {
        player.playerFocus = true;
        adjustScreen();
      }
    } else if (input.shiftKey) {
      if (input.button === 1) {
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "#0 0 0 5px FF0000";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
        }
        player.selectedBlock[1] = getBlockType(xb, yb, false);
        if (hasProperty(player.selectedBlock[1])) {
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            defaultProperty[player.selectedBlock[1]][i] =
              level[xb][yb][parseInt(i) + 1];
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[1]),
            0,
            0,
            player.selectedBlock[1],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #0000FF";
        }
      } else {
        player.x = input.offsetX - playerSize / 2;
        player.y = input.offsetY - playerSize / 2;
        player.xv = 0;
        player.yv = 0;
        drawPlayer();
      }
    } else {
      if (input.button === 0) {
        control.lmb = true;
        if (player.selectedBlock[0] === 17) {
          setSpawn(xb, yb, true);
        }
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        drawLevel();
      } else if (input.button === 1) {
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #0000FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
        }
        player.selectedBlock[0] = getBlockType(xb, yb, false);
        if (hasProperty(player.selectedBlock[0])) {
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            defaultProperty[player.selectedBlock[0]][i] =
              level[xb][yb][parseInt(i) + 1];
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[0]),
            0,
            0,
            player.selectedBlock[0],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF0000";
        }
      } else if (input.button === 2) {
        control.rmb = true;
        if (player.selectedBlock[1] === 17) {
          setSpawn(xb, yb, true);
        }
        if (hasProperty(player.selectedBlock[1])) {
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        drawLevel();
      }
    }
  }
});
id("levelLayer").addEventListener("mousemove", function (input) {
  if (!editDisabled) {
    input.preventDefault();
    let xb = Math.floor(input.offsetX / blockSize);
    let yb = Math.floor(input.offsetY / blockSize);
    if (input.ctrlKey) {
      if (control.lmb) {
        player.playerFocus = false;
        lvlxOffset += input.movementX;
        lvlyOffset += input.movementY;
        adjustScreen();
      }
    } else if (!input.shiftKey) {
      if (control.lmb) {
        if (player.selectedBlock[0] === 17) {
          setSpawn(xb, yb, true);
        }
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        drawLevel();
      } else if (control.rmb) {
        if (player.selectedBlock[1] === 17) {
          setSpawn(xb, yb, true);
        }
        if (hasProperty(player.selectedBlock[1])) {
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        drawLevel();
      }
    }
    id("mousePos").innerHTML = "[" + xb + "," + yb + "]";
    if (hasProperty(getBlockType(xb, yb, false))) {
      let text = "";
      for (let i in blockProperty[getBlockType(xb, yb, false)]) {
        text += blockProperty[getBlockType(xb, yb, false)][i];
        text += ": ";
        if (propertyType[getBlockType(xb, yb, false)][i] === "block") {
          if (typeof level[xb][yb][parseInt(i) + 1] === "object") {
            text += blockName[level[xb][yb][parseInt(i) + 1][0]];
            for (let j in level[xb][yb][parseInt(i) + 1]) {
              if (j == 0) continue;
              text += "<br>";
              text += "  ";
              text += blockProperty[level[xb][yb][parseInt(i) + 1][0]][j - 1];
              text += ": ";
              text += level[xb][yb][parseInt(i) + 1][j];
            }
          } else text += blockName[level[xb][yb][parseInt(i) + 1]];
        } else text += level[xb][yb][parseInt(i) + 1];
        text += "<br>";
      }
      id("tooltip").innerHTML = text;
      id("tooltip").style.display = "block";
      id("tooltip").style.left = input.clientX + 5 + "px";
      id("tooltip").style.top =
        input.clientY - id("tooltip").clientHeight - 5 + "px";
    } else {
      id("tooltip").style.display = "none";
    }
  }
});
id("levelLayer").addEventListener("mouseup", function (input) {
  if (input.button === 0) {
    control.lmb = false;
  } else if (input.button === 2) {
    control.rmb = false;
  }
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
id("levelLayer").addEventListener("mouseleave", function () {
  id("tooltip").style.display = "none";
  control.lmb = false;
  control.rmb = false;
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
document.addEventListener("contextmenu", function (input) {
  input.preventDefault();
});

document.addEventListener("keydown", function (input) {
  if (!editDisabled) {
    input.preventDefault();
    let key = input.code;
    switch (key) {
      case "ArrowUp":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          for (let i in level) {
            if (dw > 0) for (let j = 0; j < dw; j++) level[i].unshift(0);
            if (dw < 0) {
              for (let j = 0; j > dw; j--) {
                if (level[0].length > 1) level[i].shift();
              }
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          if (level[0].length > 1) {
            for (let i in level) level[i].shift();
          }
          player.spawnPoint[1]--;
          player.startPoint[1]--;
          player.y -= blockSize;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.shiftKey) {
          for (let i in level) {
            level[i].unshift(0);
          }
          player.spawnPoint[1]++;
          player.startPoint[1]++;
          player.y += blockSize;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        }
      case "KeyW":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey)) {
          control.up = true;
          if (player.canWalljump) {
            player.jumpOn = !player.jumpOn;
            drawLevel();
            if (player.wallJumpDir == "left") {
              player.xv = -600;
              player.yv = -Math.sign(player.g) * player.jumpHeight;
            }
            if (player.wallJumpDir == "right") {
              player.xv = 600;
              player.yv = -Math.sign(player.g) * player.jumpHeight;
            }
            if (player.wallJumpDir == "up") {
              player.yv = -600;
              player.xv = -Math.sign(player.g) * player.jumpHeight;
            }
            if (player.wallJumpDir == "down") {
              player.yv = 600;
              player.xv = -Math.sign(player.g) * player.jumpHeight;
            }
          } else if (player.currentJumps > 0 || player.godMode) {
            player.jumpOn = !player.jumpOn;
            drawLevel();
            if (player.xg) {
              player.xv = -Math.sign(player.g) * player.jumpHeight;
            } else player.yv = -Math.sign(player.g) * player.jumpHeight;
            player.currentJumps--;
          }
        }
        break;
      case "ArrowDown":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          for (let i in level) {
            if (dw > 0) for (let j = 0; j < dw; j++) level[i].push(0);
            if (dw < 0) {
              for (let j = 0; j > dw; j--) {
                if (level[0].length > 1) level[i].pop();
              }
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          if (level[0].length > 1) {
            for (let i in level) level[i].pop();
          }
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.shiftKey) {
          for (let i in level) {
            level[i].push(0);
          }
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        }
      case "KeyS":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.down = true;
        break;
      case "ArrowLeft":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          if (dw > 0) {
            for (let j = 0; j < dw; j++) {
              level.unshift([]);
              level[0].length = level[1].length;
              level[0].fill(0);
            }
          }
          if (dw < 0) {
            for (let j = 0; j > dw; j--) {
              if (level.length > 1) level.shift();
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          if (level.length > 1) {
            level.shift();
            player.spawnPoint[0]--;
            player.startPoint[0]--;
            player.x -= blockSize;
            id("lvlWidth").innerHTML = level.length;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            drawLevel();
            drawGrid();
            addVersion();
          }
        } else if (input.shiftKey) {
          level.unshift([]);
          level[0].length = level[1].length;
          level[0].fill(0);
          player.spawnPoint[0]++;
          player.startPoint[0]++;
          player.x += blockSize;
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        }
      case "KeyA":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.left = true;
        break;
      case "ArrowRight":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          if (dw > 0) {
            for (let j = 0; j < dw; j++) {
              level.push([]);
              level[level.length - 1].length = level[0].length;
              level[level.length - 1].fill(0);
            }
          }
          if (dw < 0) {
            for (let j = 0; j > dw; j--) {
              if (level.length > 1) level.pop();
            }
          }
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          if (level.length > 1) {
            level.pop();
            id("lvlWidth").innerHTML = level.length;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            drawLevel();
            drawGrid();
            addVersion();
          }
        } else if (input.shiftKey) {
          level.push([]);
          level[level.length - 1].length = level[0].length;
          level[level.length - 1].fill(0);
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          drawGrid();
          addVersion();
        }
      case "KeyD":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.right = true;
        break;
      case "KeyE":
        control.e = true;
        break;
      case "KeyR":
        if (input.shiftKey) {
          toStart();
        } else respawn();
        break;
      case "KeyG":
        player.godMode = !player.godMode;
        drawPlayer();
        break;
      case "KeyN":
        player.noclip = !player.noclip;
        drawPlayer();
        break;
      case "Digit1":
        if (id("info").style.display !== "none") {
          id("info").style.display = "none";
        } else if (id("info").style.display !== "inline")
          id("info").style.display = "inline";
        break;
      case "Digit2":
        if (id("control").style.display !== "none") {
          id("control").style.display = "none";
        } else if (id("control").style.display !== "inline")
          id("control").style.display = "inline";
        break;
      case "Digit3":
        if (id("blockSelect").style.display !== "none") {
          id("blockSelect").style.display = "none";
        } else if (id("blockSelect").style.display !== "flex")
          id("blockSelect").style.display = "flex";
        break;
      case "Digit4":
        if (id("grid").style.display !== "none") {
          id("grid").style.display = "none";
        } else if (id("grid").style.display !== "block")
          id("grid").style.display = "block";
        break;
      case "KeyF":
        if (input.shiftKey) {
          save();
        } else if (input.ctrlKey) {
          control.lmb = false;
          control.rmb = false;
          toggleSaveMenu();
        }
        break;
      case "Delete":
        if (input.shiftKey) {
          for (let i in level) level[i] = level[i].fill(0);
          drawLevel();
        }
        break;
      case "KeyZ":
        if (input.ctrlKey || input.metaKey) {
          if (input.shiftKey) {
            if (currentVersion < prevVersions.length - 1) {
              currentVersion++;
              level = deepCopy(prevVersions[currentVersion]);
              drawLevel();
            }
          } else if (currentVersion > 0) {
            currentVersion--;
            level = deepCopy(prevVersions[currentVersion]);
            drawLevel();
          }
        }
        break;
      default:
    }
  }
});
document.addEventListener("keyup", function (input) {
  if (!editDisabled) {
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
      case "ArrowUp":
      case "KeyW":
        control.up = false;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = false;
        break;
      case "KeyE":
        control.e = false;
        break;
      default:
    }
  }
});
