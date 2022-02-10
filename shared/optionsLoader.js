const defaultOptions = {
  darkMode: false,
  spawnDelay: 10,
  timer: false,
  wipeConfirm: true,
  volume: 0.5
};
const options = {
  ...defaultOptions,
  ...JSON.parse(localStorage.getItem("just-some-options") ?? "{}")
};
if (options.timer) document.getElementById("timer").style.display = "block";
if (options.darkMode) {
  let bg;
  switch (diff) {
    case "":
      bg = 333336;
      break;
    case "-EZR":
      bg = 223333;
      break;
    case "-EZ":
      bg = 223322;
      break;
    case "-HARD":
      bg = 332222;
      break;
    default:
  }
  let darkCSS = `
    body, #background {
      background-color: #${bg} !important;
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
