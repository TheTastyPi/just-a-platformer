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
  if (!editProperty) {
    input.preventDefault();
    window.focus();
    let xb = Math.floor(input.offsetX / blockSize);
    let yb = Math.floor(input.offsetY / blockSize);
    if (control.f) {
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
        if (player.selectedBlock[1] === 4) player.selectedBlock[1] = 3;
        if (player.selectedBlock[1] === 19) player.selectedBlock[1] = 17;
        if (player.selectedBlock[1] === 20) player.selectedBlock[1] = 18;
        if (hasProperty(player.selectedBlock[1])) {
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            defaultProperty[player.selectedBlock[1]][i] =
              level[xb][yb][parseInt(i) + 1];
            if (propertyType[player.selectedBlock[1]][i] === "block") {
              if (defaultProperty[player.selectedBlock[1]][i] == 4) {
                defaultProperty[player.selectedBlock[1]][i] = 3;
                break;
              } else if (defaultProperty[player.selectedBlock[1]][i] == 17) {
                defaultProperty[player.selectedBlock[1]][i] = 19;
                break;
              } else if (defaultProperty[player.selectedBlock[1]][i] == 20) {
                defaultProperty[player.selectedBlock[1]][i] = 18;
                break;
              }
            }
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
      if (
        input.button === 0 &&
        !bannedBlock.includes(player.selectedBlock[0])
      ) {
        control.lmb = true;
        if (player.selectedBlock[0] === 17) {
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
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
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
        if (player.selectedBlock[0] === 4) player.selectedBlock[0] = 3;
        if (player.selectedBlock[0] === 19) player.selectedBlock[0] = 17;
        if (player.selectedBlock[0] === 20) player.selectedBlock[0] = 18;
        if (hasProperty(player.selectedBlock[0])) {
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            defaultProperty[player.selectedBlock[0]][i] =
              level[xb][yb][parseInt(i) + 1];
            if (propertyType[player.selectedBlock[0]][i] === "block") {
              if (defaultProperty[player.selectedBlock[0]][i] == 4) {
                defaultProperty[player.selectedBlock[0]][i] = 3;
                break;
              } else if (defaultProperty[player.selectedBlock[0]][i] == 17) {
                defaultProperty[player.selectedBlock[0]][i] = 19;
                break;
              } else if (defaultProperty[player.selectedBlock[0]][i] == 20) {
                defaultProperty[player.selectedBlock[0]][i] = 18;
                break;
              }
            }
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
      } else if (
        input.button === 2 &&
        !bannedBlock.includes(player.selectedBlock[1])
      ) {
        if (player.selectedBlock[1] === 17) {
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
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[1])) {
          control.lmb = false;
          control.rmb = false;
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        control.rmb = true;
        drawLevel();
      }
    }
  }
});
id("levelLayer").addEventListener("mousemove", function (input) {
  if (!editProperty) {
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
      if (control.lmb && !bannedBlock.includes(player.selectedBlock[0])) {
        if (player.selectedBlock[0] === 17) {
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
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        drawLevel();
      } else if (
        control.rmb &&
        !bannedBlock.includes(player.selectedBlock[1])
      ) {
        if (player.selectedBlock[0] === 17) {
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
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
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
          text += blockName[level[xb][yb][parseInt(i) + 1]];
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
  if (!editProperty) {
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
      case "KeyF":
        control.f = true;
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
      case "KeyE":
        if (input.ctrlKey || input.metaKey) {
          control.lmb = false;
          control.rmb = false;
          let data = prompt("Please enter level data.");
          if (data) {
            data = JSON.parse(data);
            level = data;
            id("lvlWidth").innerHTML = level.length;
            id("lvlHeight").innerHTML = level[0].length;
            id("levelLayer").height = level[0].length * blockSize;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            toStart();
            drawLevel();
          }
        } else if (input.shiftKey) {
          control.lmb = false;
          control.rmb = false;
          let data = prompt("Please enter level data.");
          if (data) {
            data = JSON.parse(data);
            level = data[0];
            player.startPoint = data[1];
            if (!player.startPoint[3]) player.startPoint[3] = 1;
            if (player.startPoint[3] === "Infinity")
              player.startPoint[3] = Infinity;
            if (!player.startPoint[4]) player.startPoint[4] = 600;
            if (player.startPoint[4] === 100) player.startPoint[4] = 300;
            if (player.startPoint[4] === 200) player.startPoint[4] = 600;
            if (player.startPoint[4] === 400) player.startPoint[4] = 1200;
            if (player.startPoint[4] === 325) player.startPoint[4] = 300;
            if (player.startPoint[4] === 750) player.startPoint[4] = 600;
            if (player.startPoint[4] === 1500) player.startPoint[4] = 1200;
            if (!player.startPoint[5]) player.startPoint[5] = false;
            player.spawnPoint = deepCopy(player.startPoint);
            id("lvlWidth").innerHTML = level.length;
            id("lvlHeight").innerHTML = level[0].length;
            id("levelLayer").height = level[0].length * blockSize;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            toStart();
            drawLevel();
          }
        } else {
          control.lmb = false;
          control.rmb = false;
          let adjustedLevel = deepCopy(level);
          for (let x in adjustedLevel) {
            for (let y in adjustedLevel[x]) {
              if (adjustedLevel[x][y] == 4) {
                adjustedLevel[x][y] = 3;
              } else if (adjustedLevel[x][y] == 19) {
                adjustedLevel[x][y] = 17;
              } else if (adjustedLevel[x][y] == 20) {
                adjustedLevel[x][y] = 18;
              } else if (hasProperty(adjustedLevel[x][y])) {
                for (let i in adjustedLevel[x][y]) {
                  if (i == 0) continue;
                  if (
                    propertyType[adjustedLevel[x][y][0]][parseInt(i) - 1] ===
                    "block"
                  ) {
                    if (adjustedLevel[x][y][i] == 4) {
                      adjustedLevel[x][y][i] = 3;
                      break;
                    } else if (adjustedLevel[x][y][i] == 19) {
                      adjustedLevel[x][y][i] = 17;
                      break;
                    } else if (adjustedLevel[x][y][i] == 20) {
                      adjustedLevel[x][y][i] = 18;
                      break;
                    }
                  }
                }
              }
            }
          }
          let startData = player.startPoint;
          if (startData[3] === Infinity) startData[3] = "Infinity";
          id("exportArea").value = JSON.stringify([adjustedLevel, startData]);
          id("exportArea").style.display = "inline";
          id("exportArea").focus();
          id("exportArea").select();
          document.execCommand("copy");
          id("exportArea").style.display = "none";
          alert("Level data copied to clipboard!");
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
  if (!editProperty) {
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
      case "KeyF":
        control.f = false;
        break;
      default:
    }
  }
});
