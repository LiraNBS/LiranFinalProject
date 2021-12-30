let checkedCoins = [];
let cryptoCoins = [];
const searchCoins = document.getElementById("searchCoin");
const mainDiv = document.querySelector(".cryptocards");
const selectedCoinsText = document.createElement("p");

const getCrypto = async () => {
  const res = await fetch("https://api.coingecko.com/api/v3/coins");
  const data = await res.json();
  cryptoCoins = data;
  for (let i = 0; i < 100; i++) {
    const element = cryptoCoins[i];
    console.log(element);
    //Creating DIVS
    const mainDiv = document.querySelector(".cryptocards");
    const cardDiv = document.createElement("div");
    const cardBody = document.createElement("div");
    const coinImg = document.createElement("img");
    const coinTitle = document.createElement("h5");
    const coinDetails = document.createElement("p");
    const switchDiv = document.createElement("div");
    const switchInput = document.createElement("input");
    const moreInfo = document.createElement("button");
    const moreInfobox = document.createElement("div");
    const moreInfoimg = document.createElement("img");
    const ils = document.createElement("p");
    const usd = document.createElement("p");
    const eur = document.createElement("p");
    const alert = document.getElementById("alert");
    cardDiv.className = "card cryptocard";
    cardDiv.style = "width: 15rem;";
    cardBody.className = "card-body";
    coinImg.src = element.image.small;
    coinTitle.className = "card-title";
    coinDetails.className = "card-text";
    switchDiv.className = "switch form-check form-switch";
    switchInput.className = "form-check-input";
    switchInput.type = "checkbox";
    switchInput.role = "switch";
    switchInput.setAttribute("data-id", element.id);
    switchInput.id = "flexSwitchCheckChecked";
    coinTitle.textContent = element.name;
    moreInfo.className = "moreInfo btn btn-primary";
    moreInfo.type = "button";
    moreInfo.setAttribute("data-id", i);
    moreInfo.textContent = "More Info";
    moreInfobox.className = "moreinfobox hide";
    moreInfoimg.id = "moreinfoimg";
    moreInfoimg.src = element.image.small;
    ils.className = "moreinfotxt";
    usd.className = "moreinfotxt";
    eur.className = "moreinfotxt";
    ils.textContent =
      "ILS: " +
      element.market_data.current_price.ils.toLocaleString("en-IL") +
      "₪";
    usd.textContent =
      "USD: " +
      element.market_data.current_price.usd.toLocaleString("en-IL") +
      "$";
    eur.textContent =
      "EUR: " +
      element.market_data.current_price.eur.toLocaleString("en-IL") +
      "€";
    mainDiv.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(coinImg);
    cardBody.appendChild(coinTitle);
    cardBody.appendChild(coinDetails);
    cardBody.appendChild(switchDiv);
    switchDiv.appendChild(switchInput);
    cardBody.appendChild(moreInfo);
    cardBody.appendChild(moreInfobox);
    moreInfobox.appendChild(moreInfoimg);
    moreInfobox.appendChild(ils);
    moreInfobox.appendChild(usd);
    moreInfobox.appendChild(eur);
    switchInput.addEventListener("change", function switchButton() {
      let switchAttribute = switchInput.getAttribute("data-id");
      if (switchInput.checked) {
        checkedCoins.push({
          id: switchAttribute,
          image: element.image.small,
          name: element.name
        });

        console.log("Checked " + switchAttribute);
      } else {
        currIdEdit = switchAttribute;
        let itemIndex = checkedCoins.findIndex(
          (element) => element.id == currIdEdit
        );
        checkedCoins.splice(itemIndex, 1);
        console.log("Not checked " + currIdEdit);
      }
    });
    moreInfo.addEventListener("click", function openMoreInfo(e) {
      if (cardDiv.className !== "card cryptocardshow") {
        cardDiv.className = "card cryptocardshow";
        moreInfobox.className = "moreinfobox";
      } else {
        cardDiv.className = "card cryptocardhide";
        moreInfobox.className = "moreinfobox hide";
      }
    });
    switchInput.addEventListener("change", function checkSwitch() {
      if (checkedCoins.length) {
        alert.className = "alert alert-primary";
      } else {
        alert.className = "alert alert-primary hide";
      }

      const allCoins = checkedCoins.map((coin) => coin.name).join(",");

      if (alert.children.length) {
        alert.children[0].textContent = allCoins;
      } else {
        const element = document.createElement("p");
        element.textContent = allCoins;
        alert.appendChild(element);
      }
    });
  }
};
getCrypto();
const homeDiv = document.getElementById("coins");
const aboutDiv = document.getElementById("about");
const liveReportDiv = document.getElementById("livereport");

function loadmenuitem(i) {
  homeDiv.className = "about hide";
  aboutDiv.className = "coins hide";
  liveReportDiv.className = "livereport hide";

  if (i == 1) {
    homeDiv.className = "about";
  }
  if (i == 2) {
    aboutDiv.className = "coins";
  }
  if (i == 3) {
    liveReportDiv.className = "livereport";
  }
}
function filterCoin() {
  const filteredCoins = cryptoCoins.filter((coin) =>
    coin.name.toLowerCase().includes(searchCoins.value.toLowerCase())
  );

  if (!filteredCoins.length) {
    console.log("no Coins");
    // mainDiv.innerHTML = ``
  }
  mainDiv.innerHTML = ``;
  for (const coin of filteredCoins) {
    mainDiv.innerHTML += `
    <div class="card cryptocard" style="width: 15rem;">
    <div class="card-body">
    <img src=${coin.image.small}>
    <h5 class="card-title">${coin.name}</h5>
    <p class="card-text"></p>
    <div class="switch form-check form-switch">
    <input class="form-check-input" type="checkbox" data-id=${coin.id} id="flexSwitchCheckChecked">
    </div>
    <button class="moreInfo btn btn-primary" type="button" data-id="0">More Info</button>
    </div>
    </div>
    `;
  }
}
searchCoins.addEventListener("keyup", filterCoin);
