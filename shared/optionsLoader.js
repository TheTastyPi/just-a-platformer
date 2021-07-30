const defaultOptions = {
  darkMode: false,
  spawnDelay: 10,
  timer: false,
  wipeConfirm: true
};
const options =
  JSON.parse(localStorage.getItem("just-some-options")) ?? defaultOptions;
if (options.timer) document.getElementById("timer").style.display = "block";
if (options.darkMode) {
  let darkCSS = `
    body, #background {
      background-color: #${isEasy ? 334433 : 333336} !important;
    }
  
    * {
      color: white;
    }
  
    a {
      color: #bbbbff;
    }
  
    a:visited {
      color: #ffbbff;
    }
  
    #infoOpen, #mainInfo, .mobileBtn, #moreBtn, .mobileMoreBtn, #infoParent, #blockSelect {
      background-color: #00000088 !important;
    }

    button, input, select, textarea {
      background-color: #333336;
    }

    .key {
      border: 1px solid #555;
      background-color: #333;
      box-shadow: 0 3px #555;
    }

    #control {
      background-color: #111111ee
    }
  `;
  let el = document.createElement("style");
  el.innerText = darkCSS;
  document.head.appendChild(el);
}
