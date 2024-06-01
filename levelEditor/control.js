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
    let x = Math.floor(((input.offsetX - camCenterx) / baseBlockSize) * 2) / 2;
    let y = Math.floor(((input.offsetY - camCentery) / baseBlockSize) * 2) / 2;
    let xb = Math.floor((input.offsetX - camCenterx) / baseBlockSize);
    let yb = Math.floor((input.offsetY - camCentery) / baseBlockSize);
    let trueBlock = getBlock(x, y, false);
    let block = getBlock(x, y);
    let trueType = getBlockType(x, y, false);
    let type = block;
    if (typeof type === "object") type = type[0];
    if (control.e) {
      if (input.button === 0) {
        openPropertyMenu(x, y);
      }
    } else if (input.ctrlKey) {
      if (input.button === 0) control.lmb = true;
      if (input.button === 2 && !locks.panning) {
        player.playerFocus = true;
        adjustScreen();
      }
    } else if (input.shiftKey) {
      if (input.button === 1) {
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #FF0000";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
        }
        player.selectedBlock[1] = trueType === 73 ? type : trueType;
        if (hasProperty(player.selectedBlock[1])) {
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            if (blockProperty[player.selectedBlock[1]][i][0] === "!") continue;
            defaultProperty[player.selectedBlock[1]][i] = deepCopy(
              block[parseInt(i) + 1]
            );
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
      } else if (!locks.teleporting) {
        player.x = input.offsetX - camCenterx - player.size / 2;
        player.y = input.offsetY - camCentery - player.size / 2;
        player.xv = 0;
        player.yv = 0;
        drawPlayer();
      }
    } else {
      if (input.button === 0 && !locks.building) {
        control.lmb = true;
        if (player.miniBlock && trueType !== 73)
          level[xb][yb] = [
            73,
            deepCopy(trueBlock),
            deepCopy(trueBlock),
            deepCopy(trueBlock),
            deepCopy(trueBlock)
          ];
        if (player.selectedBlock[0] === 17) setSpawn(x, y, true);
        if (hasProperty(player.selectedBlock[0])) {
          editBlock(x, y, [player.selectedBlock[0]], player.miniBlock);
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            editProp(
              x,
              y,
              false,
              parseInt(i) + 1,
              false,
              defaultProperty[player.selectedBlock[0]][i]
            );
          }
        } else editBlock(x, y, player.selectedBlock[0], player.miniBlock);
        if (
          player.miniBlock &&
          arraysEqual(level[xb][yb][1], level[xb][yb][2]) &&
          arraysEqual(level[xb][yb][2], level[xb][yb][3]) &&
          arraysEqual(level[xb][yb][3], level[xb][yb][4])
        )
          level[xb][yb] = level[xb][yb][1];
        drawLevel();
      } else if (input.button === 1 && !locks.building) {
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #0000FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
        }
        player.selectedBlock[0] = trueType === 73 ? type : trueType;
        if (hasProperty(player.selectedBlock[0])) {
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            if (blockProperty[player.selectedBlock[0]][i][0] === "!") continue;
            defaultProperty[player.selectedBlock[0]][i] = deepCopy(
              block[parseInt(i) + 1]
            );
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
      } else if (input.button === 2 && !locks.building) {
        control.rmb = true;
        if (player.miniBlock && trueType !== 73)
          level[xb][yb] = [
            73,
            deepCopy(trueBlock),
            deepCopy(trueBlock),
            deepCopy(trueBlock),
            deepCopy(trueBlock)
          ];
        if (player.selectedBlock[1] === 17) setSpawn(x, y, true);
        if (hasProperty(player.selectedBlock[1])) {
          editBlock(x, y, [player.selectedBlock[1]], player.miniBlock);
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            editProp(
              x,
              y,
              false,
              parseInt(i) + 1,
              false,
              defaultProperty[player.selectedBlock[1]][i]
            );
          }
        } else editBlock(x, y, player.selectedBlock[1], player.miniBlock);
        if (
          player.miniBlock &&
          arraysEqual(level[xb][yb][1], level[xb][yb][2]) &&
          arraysEqual(level[xb][yb][2], level[xb][yb][3]) &&
          arraysEqual(level[xb][yb][3], level[xb][yb][4])
        )
          level[xb][yb] = level[xb][yb][1];
        drawLevel();
      }
    }
  }
});
id("levelLayer").addEventListener("mousemove", function (input) {
  if (!editDisabled && !locks.building) {
    input.preventDefault();
    let x = Math.floor(((input.offsetX - camCenterx) / baseBlockSize) * 2) / 2;
    let y = Math.floor(((input.offsetY - camCentery) / baseBlockSize) * 2) / 2;
    let xb = Math.floor((input.offsetX - camCenterx) / baseBlockSize);
    let yb = Math.floor((input.offsetY - camCentery) / baseBlockSize);
    let trueBlock = getBlock(x, y, false);
    let block = getBlock(x, y);
    let trueType = getBlockType(x, y, false);
    if (input.ctrlKey) {
      if (control.lmb && !locks.panning) {
        player.playerFocus = false;
        lvlxOffset += input.movementX;
        lvlyOffset += input.movementY;
        camx = lvlxOffset;
        camy = lvlyOffset;
        adjustScreen();
      }
    } else if (!input.shiftKey) {
      if (control.lmb) {
        if (player.miniBlock && trueType !== 73)
          level[xb][yb] = [73, trueBlock, trueBlock, trueBlock, trueBlock];
        if (player.selectedBlock[0] === 17) setSpawn(x, y, true);
        if (hasProperty(player.selectedBlock[0])) {
          editBlock(x, y, [player.selectedBlock[0]], player.miniBlock);
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            editProp(
              x,
              y,
              false,
              parseInt(i) + 1,
              false,
              defaultProperty[player.selectedBlock[0]][i]
            );
          }
        } else editBlock(x, y, player.selectedBlock[0], player.miniBlock);
        if (
          player.miniBlock &&
          arraysEqual(level[xb][yb][1], level[xb][yb][2]) &&
          arraysEqual(level[xb][yb][2], level[xb][yb][3]) &&
          arraysEqual(level[xb][yb][3], level[xb][yb][4])
        )
          level[xb][yb] = level[xb][yb][1];
        drawLevel();
      } else if (control.rmb) {
        if (player.miniBlock && trueType !== 73)
          level[xb][yb] = [73, trueBlock, trueBlock, trueBlock, trueBlock];
        if (player.selectedBlock[1] === 17) setSpawn(x, y, true);
        if (hasProperty(player.selectedBlock[1])) {
          editBlock(x, y, [player.selectedBlock[1]], player.miniBlock);
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            editProp(
              x,
              y,
              false,
              parseInt(i) + 1,
              false,
              defaultProperty[player.selectedBlock[1]][i]
            );
          }
        } else editBlock(x, y, player.selectedBlock[1], player.miniBlock);
        if (
          player.miniBlock &&
          arraysEqual(level[xb][yb][1], level[xb][yb][2]) &&
          arraysEqual(level[xb][yb][2], level[xb][yb][3]) &&
          arraysEqual(level[xb][yb][3], level[xb][yb][4])
        )
          level[xb][yb] = level[xb][yb][1];
        drawLevel();
      }
    }
    id("mousePos").innerHTML = "[" + xb + "," + yb + "]";
    if (hasProperty(block[0]) && player.showTooltips) {
      let text = "";
      for (let i in blockProperty[block[0]]) {
        if (blockProperty[block[0]][i][0] === "!") continue;
        text += blockProperty[block[0]][i];
        text += ": ";
        if (propertyType[block[0]][i] === "block") {
          if (typeof block[parseInt(i) + 1] === "object") {
            text += blockName[block[parseInt(i) + 1][0]];
            for (let j in block[parseInt(i) + 1]) {
              if (j == 0) continue;
              if (blockProperty[block[parseInt(i) + 1][0]][j - 1][0] === "!")
                continue;
              text += "<br>";
              text += "  ";
              text += blockProperty[block[parseInt(i) + 1][0]][j - 1];
              text += ": ";
              text += sanitize(block[parseInt(i) + 1][j]);
            }
          } else text += blockName[block[parseInt(i) + 1]];
        } else text += sanitize(block[parseInt(i) + 1]);
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
    let key = input.code;
    if (!(key === "F12" || (key === "KeyC" && input.altKey && input.metaKey))) {
      input.preventDefault();
    }
    switch (key) {
      case "ArrowUp":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("up", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("up", -1);
        } else if (input.shiftKey) {
          changeLevelSize("up", 1);
        }
      case "KeyW":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey)) {
          control.up = true;
        }
        break;
      case "ArrowDown":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("down", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("down", -1);
        } else if (input.shiftKey) {
          changeLevelSize("down", 1);
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
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("left", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("left", -1);
        } else if (input.shiftKey) {
          changeLevelSize("left", 1);
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
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("right", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("right", -1);
        } else if (input.shiftKey) {
          changeLevelSize("right", 1);
        }
      case "KeyD":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.right = true;
        break;
      case "KeyE":
        if (isMobile) control.e = !control.e;
        else control.e = true;
        break;
      case "KeyR":
        if (input.shiftKey) {
          respawn(true);
        } else respawn();
        break;
      case "KeyG":
        if (!locks.godMode) player.godMode = !player.godMode;
        drawPlayer();
        break;
      case "KeyN":
       if (!locks.noclip) player.noclip = !player.noclip;
        drawPlayer();
        break;
      case "KeyM":
        player.miniBlock = !player.miniBlock;
        id("miniBlock").innerHTML = player.miniBlock ? "ON" : "OFF";
        break;
      case "Digit1":
        if (id("info").style.display !== "none") {
          id("info").style.display = "none";
        } else if (id("info").style.display !== "inline")
          id("info").style.display = "inline";
        break;
      case "Digit2":
        toggleControl();
        break;
      case "Digit3":
        if (id("blockSelect").style.display !== "none") {
          id("blockSelect").style.display = "none";
          id("mobileControls").style.bottom = 0;
          id("mobileControlsLeft").style.bottom = 0;
        } else if (id("blockSelect").style.display !== "flex") {
          id("blockSelect").style.display = "flex";
          id("mobileControls").style.bottom = "max(20%, 125px)";
          id("mobileControlsLeft").style.bottom = "max(20%, 125px)";
        }
        break;
      case "Digit4":
        if (id("grid").style.display !== "none") {
          id("grid").style.display = "none";
        } else if (id("grid").style.display !== "block")
          id("grid").style.display = "block";
        break;
      case "Digit5":
        if (id("infoOpen").style.display !== "none") {
          id("infoOpen").style.display = "none";
        } else if (id("infoOpen").style.display !== "block")
          id("infoOpen").style.display = "block";
        break;
      case "Digit6":
        player.showTooltips = !player.showTooltips;
        id("showTooltips").innerHTML = player.showTooltips ? "ON" : "OFF";
        break;
      case "Digit7":
        player.showSubblock = !player.showSubblock;
        id("showSubblock").innerHTML = player.showSubblock ? "ON" : "OFF";
        drawLevel(true);
        break;
      case "Digit8":
        toggleCodeMenu();
        break;
      case "Digit9":
        if (id("luaConsoleParent").style.display !== "none") {
          id("luaConsoleParent").style.display = "none";
        } else if (id("luaConsoleParent").style.display !== "block")
          id("luaConsoleParent").style.display = "block";
        break;
      case "Digit0":
        player.falseTexture = !player.falseTexture;
        id("falseTexture").innerHTML = player.falseTexture ? "ON" : "OFF";
        drawLevel(true);
        break;
      case "KeyF":
        if (input.shiftKey) {
          save();
        } else if (input.ctrlKey || input.metaKey) {
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
              if (
                prevVersions[currentVersion - 1].length !== level.length ||
                prevVersions[currentVersion - 1][0].length !== level[0].length
              ) {
                id("lvlWidth").innerHTML = level.length;
                id("levelLayer").width = Math.min(
                  level.length * baseBlockSize,
                  window.innerWidth + 2 * camOffsetLimit
                );
                id("bgLayer").width = Math.min(
                  level.length * baseBlockSize,
                  window.innerWidth + 2 * camOffsetLimit
                );
                id("lvlHeight").innerHTML = level[0].length;
                id("levelLayer").height = Math.min(
                  level[0].length * baseBlockSize,
                  window.innerHeight + 2 * camOffsetLimit
                );
                id("bgLayer").height = Math.min(
                  level[0].length * baseBlockSize,
                  window.innerHeight + 2 * camOffsetLimit
                );
                prevLevel = [];
              }
              drawLevel();
            }
          } else if (currentVersion > 0) {
            currentVersion--;
            level = deepCopy(prevVersions[currentVersion]);
            if (
              prevVersions[currentVersion + 1].length !== level.length ||
              prevVersions[currentVersion + 1][0].length !== level[0].length
            ) {
              id("lvlWidth").innerHTML = level.length;
              id("levelLayer").width = Math.min(
                level.length * baseBlockSize,
                window.innerWidth + 2 * camOffsetLimit
              );
              id("bgLayer").width = Math.min(
                level.length * baseBlockSize,
                window.innerWidth + 2 * camOffsetLimit
              );
              id("lvlHeight").innerHTML = level[0].length;
              id("levelLayer").height = Math.min(
                level[0].length * baseBlockSize,
                window.innerHeight + 2 * camOffsetLimit
              );
              id("bgLayer").height = Math.min(
                level[0].length * baseBlockSize,
                window.innerHeight + 2 * camOffsetLimit
              );
              prevLevel = [];
            }
            drawLevel();
          }
        }
        break;
      case "KeyC":
        openInfo();
        break;
      case "Space":
        control.space = true;
        break;
      case "MobileSize":
        if (id("mobileSizeMenu").style.display !== "none") {
          id("mobileSizeMenu").style.display = "none";
        } else if (id("mobileSizeMenu").style.display !== "inline")
          id("mobileSizeMenu").style.display = "inline";
        break;
      case "KeyT":
        player.timer = 0;
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
        if (!control.right && player.xg) player.canJump = true;
        break;
      case "ArrowRight":
      case "KeyD":
        control.right = false;
        if (!control.left && !control.space && player.xg) player.canJump = true;
        break;
      case "ArrowUp":
      case "KeyW":
        control.up = false;
        if (!control.down && !control.space && !player.xg)
          player.canJump = true;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = false;
        if (!control.up && !control.space && !player.xg) player.canJump = true;
        break;
      case "KeyE":
        control.e = false;
        break;
      case "Space":
        control.space = false;
        if (
          (!control.up && !control.down && !player.xg) ||
          (!control.left && !control.right && player.xg)
        )
          player.canJump = true;
        break;
      default:
    }
  }
});
