const defaultOptions = {
  darkMode: false,
  spawnDelay: 10,
  timer: false,
  wipeConfirm: true,
  volume: 0.5
};

let options = {
  ...defaultOptions,
  ...JSON.parse(localStorage.getItem("just-some-options") ?? "{}")
};

function updateOption(opt, val) {
  app.options[opt] = val;
  localStorage.setItem("just-some-options", JSON.stringify(options));
  if (opt == "darkMode") {
    if (val)
      document.getElementById("theme").innerText = `
      body, button {
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
    `;
    else document.getElementById("theme").innerText = "";
  }
}

const app = new Vue({
  el: "#app",
  data: { options, updateOption }
});

if (options.darkMode)
  document.getElementById("theme").innerText = `
  body, button {
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
`;

document.getElementById("spawnDelay").value = options.spawnDelay;

document.getElementById("spawnDelay").addEventListener("input", function () {
  updateOption("spawnDelay", this.value);
});

document.getElementById("volume").value = options.volume;

document.getElementById("volume").addEventListener("input", function () {
  updateOption("volume", parseFloat(this.value));
});
