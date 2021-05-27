const options = JSON.parse(
  localStorage.getItem("just-some-options") ?? '{"spawnDelay": 3}'
);

if (options.darkMode) {
  let darkCSS = `
    body, #background {
      background-color: #333336 !important;
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

    button, input {
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