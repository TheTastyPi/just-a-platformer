const mobileConfig = {
  main: [
    [
      { key: "KeyA", disp: "←" },
      { key: "KeyD", disp: "→" }
    ]
  ],
  left: [
    [
      { key: "KeyW", disp: "↑" },
      { key: "KeyS", disp: "↓" }
    ]
  ],
  more: [
    ["Reset Position", "r", "KeyR"],
    ["Return to Start", "⇧ + r", "KeyR", true],
    ["Toggle Property Editing", "e", "KeyE"],
    ["Change Level Size", "⇧ + →/←/↑/↓", "MobileSize"],
    ["Clear Level", "⇧ + Del", "Delete", true],
    ["Undo", "Ctrl + Z", "KeyZ", false, true],
    ["Redo", "⇧ + Ctrl + Z", "KeyZ", true, true],
    ["Toggle Godmode", "g", "KeyG"],
    ["Toggle Noclip", "n", "KeyN"],
    ["Toggle Mini Block", "m", "KeyM"],
    ["Toggle Block Menu", "3", "Digit3", true],
    ["Toggle Grid", "4", "Digit4"],
    ["Toggle Custom Sublock Display", "7", "Digit7"],
    // ["Toggle Code Menu", "8", "Digit8"],
    ["Toggle Lua Console", "9", "Digit9"],
    ["Toggle Save Menu", "Ctrl + f", "KeyF", false, true],
    ["Save Current Level", "⇧ + f", "KeyF", true],
    ["Credits", "c", "KeyC"]
  ]
};

id("mobileSizeForm").addEventListener("submit", (evt) => {
  const data = new FormData(id("mobileSizeForm"));
  console.log(data);
  simulateKeypress(
    `Arrow${data.get("dir")}`,
    "down",
    data.get("type") === "more",
    data.get("type") === "less"
  );
  evt.preventDefault();
});

function touchHandler(event) {
  var touches = event.changedTouches,
    first = touches[0],
    type = "";
  switch (event.type) {
    case "touchstart":
      type = "mousedown";
      break;
    case "touchmove":
      type = "mousemove";
      break;
    case "touchend":
      type = "mouseup";
      break;
    default:
      return;
  }

  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //                screenX, screenY, clientX, clientY, ctrlKey,
  //                altKey, shiftKey, metaKey, button, relatedTarget);

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(
    type,
    true,
    true,
    window,
    1,
    first.screenX,
    first.screenY,
    first.clientX,
    first.clientY,
    false,
    false,
    false,
    false,
    0, // left
    null
  );

  first.target.dispatchEvent(simulatedEvent);
  // event.preventDefault();
}

document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);
// https://stackoverflow.com/a/1781750
