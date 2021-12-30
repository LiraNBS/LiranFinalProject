const homeDiv = $("#coins");
const aboutDiv = $("#about");
const liveReportDiv = $("#livereport");
const searchInput = $('#searchCoin')
const allCoinsUrl = 'https://api.coingecko.com/api/v3/coins'
const selectedCoins = getLocalStorage('selected_coins')
const selecetedElement = $("#selectedCoinsElement")
const cryptoCoins = {};
let searchResults = []
let lastCoinSelected = null
let modal = null
let counter = 1;



// get LocalStorageItems using a key
function getLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key)) || {}
}

// save LocalStorageItems
function saveLocalStorage(key, data) {
   localStorage.setItem(key, JSON.stringify(data))
}

// When document ready, run this function
$(document).ready(() => {
   $(".cryptocards").append(loaderTemplate())
// get Data from Api using a url and a callback
   function getApiData(url, callback) {
      $.get(url, (data) => {
         console.log(data)
         callback(data)
      })
   }
// modal Template return an html code 
   function modalTemplate(items) {
      return `
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content checkedpopup">
            <div class="modal-header">
               <h5 class="modal-title" id="staticBackdropLabel">Maximum selected coins is 5.</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="modalBody">
                ${items.map((item) => {
         return modelCoinTemplate(item)
      }).join('')}
            </div>
         </div>
      </div>
   </div>
      `
   }
// loader template return an html code
   function loaderTemplate() {
      return ` <img src="./loading.gif" style="margin-left:3rem; height:100px; width:100px;">`
   }
// model inner HTML template return an html code
   function modelCoinTemplate(coin) {
      console.log(coin.id)
      return `
        <h6>${coin.name}</h6>
         <div class="form-check form-switch popupswitch">
            <input class="form-check-input form-check-modal" type="checkbox" role="switch"  ${!!selectedCoins[coin.id] ? 'checked' : ''}  data-id-modal=${coin.id}>
         </div>
         <hr>
        `
   }
// card template return an html code
   function cardTamplate(coin) {
      return `
      <div class="card cryptocard" style="width: 15rem;">
         <div class="card-body">
         <img src=${coin.image.small} class="coinimgs">
         <h5 class="card-title">${coin.name}</h5>
         <p class="card-text"></p>
            <div class="switch form-check form-switch"><input ${!!selectedCoins[coin.id] ? 'checked' : ''}  class="form-check-input" type="checkbox" id=${coin.id} role="switch" data-id-check=${coin.id}></div>
               <button class="moreInfo btn btn-primary" type="button" data-id=${coin.id}>More Info</button>
                     <div class="moreinfobox">
            </div>
            </div>
      </div>`
   }

// more info template return an html code
   function moreInfoTemplate(coin) {
      return `
        <img src=${coin.image.small} class="coinimgs moreinfoimg">
        <p class="moreinfotxt">ILS: ${coin.market_data.current_price.ils.toLocaleString("en-IL")}₪</p>
        <p class="moreinfotxt">USD: ${coin.market_data.current_price.usd.toLocaleString("en-IL")}$</p>
        <p class="moreinfotxt">EUR: ${coin.market_data.current_price.eur.toLocaleString("en-IL")}€</p>`
   }

// create coins function
   function createCoins(coinsArr) {
      $(".cryptocards").html('')

      for (const coin of coinsArr) {
         $(".cryptocards").append(cardTamplate(coin))
         cryptoCoins[coin.id] = coin
      }
      // to be able to read onclick we need to run those functions here:
      showMoreInfo() 
      toggleCheckBox()
   }
//more info function 
   function showMoreInfo() {
      $(".moreInfo").click(function () {
         $(this).next().slideToggle();
         $(this).next().html(loaderTemplate())

         const id = $(this).attr('data-id')

         const localStorageMoreInfo = getLocalStorage('more_info')

         if (localStorageMoreInfo[id]) {
            $(this).next().html(moreInfoTemplate(localStorageMoreInfo[id]))
         } else {
            getApiData(`${allCoinsUrl}/${id}`, (coin) => {
               console.log(id)
               localStorageMoreInfo[id] = coin
               $(this).next().html(moreInfoTemplate(coin))
               saveLocalStorage('more_info', localStorageMoreInfo)
               // check if 2 minutes already passed:
               setTimeout(() => {
                  delete localStorageMoreInfo[id]
                  saveLocalStorage('more_info', localStorageMoreInfo)
               }, 1000 * 120);
            })
         }
      })
   }
// check box in the modal function
   function toggleCheckBoxModal() {
      $(".form-check-modal").change(function () {
         const id = $(this).attr("data-id-modal");

         delete selectedCoins[id]

         selectedCoins[lastCoinSelected.id] = {
            id: lastCoinSelected.id,
            image: lastCoinSelected.image.small,
            name: lastCoinSelected.name
         }

         const coinElementOut = $(`*[data-id-check="${id}"]`)[0]

         coinElementOut.checked = false

         saveLocalStorage('selected_coins', selectedCoins)
         modal.hide()
      })
   }
// check box in cards function
   function toggleCheckBox() {
      $(".form-check-input").change(function () {
         const id = $(this).attr("id");
         lastCoinSelected = cryptoCoins[id]

         if (selectedCoins[id]) {
            delete selectedCoins[id]
            saveLocalStorage('selected_coins', selectedCoins)

            const coinElementNav = $(`*[data-nav-coin="${lastCoinSelected.id}"]`)[0]
         } else if (Object.keys(selectedCoins).length >= 5) {

            console.log(lastCoinSelected)

            if (modal !== null) {
               $('#my_modal').empty()
            }

            $('#my_modal').append(modalTemplate(Object.values(selectedCoins)))

            modal = new bootstrap.Modal($("#staticBackdrop"), {
               keyboard: false
            });

            closeModal()
            toggleCheckBoxModal()

            modal.show()
            return
         } else {
            selectedCoins[id] = {
               id: id,
               symbol: lastCoinSelected.symbol,
               image: lastCoinSelected.image.small,
               name: lastCoinSelected.name
            }
            $("#selectedCoinsElement").append(`<span data-nav-coin=${lastCoinSelected.id}> ${lastCoinSelected.name},</span>`)


            saveLocalStorage('selected_coins', selectedCoins)
         }
         console.log(selectedCoins)
      })
   }
// search function
   searchInput.on('keyup', function (event) {
      if (event.keyCode === 13) {
         const value = $(this).val()

         if (value.trim() === '') {
            createCoins(Object.values(cryptoCoins))
            return
         }

         searchResults = []

         for (const coin of Object.values(cryptoCoins)) {
            if (coin.id.includes(value)) {
               searchResults.push(coin)
            }
         }

         createCoins(searchResults)
      }
   })
// onclick close button modal function
   function closeModal() {
      $('.btn-close').on('click', function () {
         const coinElement = $(`*[data-id-check="${lastCoinSelected.id}"]`)[0]
         coinElement.checked = false
         modal.hide()
      })
   }
// main function that running and get Data from API and then running createCoins function to create cards
   function main() {
      getApiData(allCoinsUrl, (data) => {
         createCoins(data)
      
      })
   }

   main() // running the main function as default on document laod
})

// Header Navigation:
function loadmenuitem(i) {
   $(homeDiv).attr("class", "coins hide")
   $(aboutDiv).attr("class", "about hide")
   $(liveReportDiv).attr("class", "livereport hide");

   if (i == 1) {
      $(homeDiv).attr("class", "coins");

   }
   if (i == 2) {
      $(aboutDiv).attr("class", "about");
   }
   if (i == 3) {
      $(liveReportDiv).attr("class", "livereport");
   }

}
// About Section:
let current = 1; //keeps track of the current div
let height = $('.roles').height(); //the height of the roles div
let numberDivs = $('.roles').children().length; //the number of children of the roles div
let first = $('.roles div:nth-child(1)'); //the first div nested in roles div
setInterval(function () {
   let number = current * -height;
   first.css('margin-top', number + 'px');
   if (current === numberDivs) {
      first.css('margin-top', '0px');
      current = 1;
   } else current++;
}, 2000);

// Charts : 

let arrCoinRealTime1 = [];
let arrCoinRealTime2 = [];
let arrCoinRealTime3 = [];
let arrCoinRealTime4 = [];
let arrCoinRealTime5 = [];
let arrCoinRealTimeName = [];
function getData(event) {
   let allCoins = Object.values(selectedCoins).map((symbol) => symbol.symbol).join(",");
   console.log(allCoins)
   $.ajax({

       type: "GET",
       url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${allCoins}&tsyms=USD`,

       success: function (selectedCoins) {
      
               $('.livereportsection').html(` <div id="chartContainer" style="height: 300px; width: 100%;"></div>`);

               let dateNow = new Date();
               arrCoinRealTimeName = [];
               let counter =1;
               for (let key in selectedCoins) {

                   if (counter == 1) {
                       arrCoinRealTime1.push({ x: dateNow, y: selectedCoins[key].USD });
                       arrCoinRealTimeName.push(key);
                   }

                   if (counter == 2) {
                       arrCoinRealTime2.push({ x: dateNow, y: selectedCoins[key].USD });
                       arrCoinRealTimeName.push(key);
                   }

                   if (counter == 3) {
                       arrCoinRealTime3.push({ x: dateNow, y: selectedCoins[key].USD });
                       arrCoinRealTimeName.push(key);
                   }

                   if (counter == 4) {
                       arrCoinRealTime4.push({ x: dateNow, y: selectedCoins[key].USD });
                       arrCoinRealTimeName.push(key);
                   }

                   if (counter == 5) {
                       arrCoinRealTime5.push({ x: dateNow, y: selectedCoins[key].USD });
                       arrCoinRealTimeName.push(key);
                   }

                   counter++;
               }

               createGraph();

           

       }

   })

}

IntervalId = setInterval(() => {
getData()
}, 2000);

function createGraph(event) {

   let chart = new CanvasJS.Chart("chartContainer", {
       exportEnabled: true,
       animationEnabled: false,

       title: {
           text: "Real-time Price of Selected CryptoCurrencies in $USD"
       },
       axisX: {
           valueFormatString: "HH:mm:ss",
       },
       axisY: {
           title: "Coin Value",
           suffix: "$",
           titleFontColor: "#4F81BC",
           lineColor: "#4F81BC",
           labelFontColor: "#4F81BC",
           tickColor: "#4F81BC",
           includeZero: true,
       },
       toolTip: {
           shared: true
       },
       legend: {
           cursor: "pointer",
           itemclick: toggleDataSeries,
       },
       data: [{
           type: "spline",
           name: arrCoinRealTimeName[0],
           showInLegend: true,
           xValueFormatString: "HH:mm:ss",
           dataPoints: arrCoinRealTime1

       },
       {
           type: "spline",
           name: arrCoinRealTimeName[1],
           showInLegend: true,
           xValueFormatString: "HH:mm:ss",
           dataPoints: arrCoinRealTime2

       },
       {
           type: "spline",
           name: arrCoinRealTimeName[2],
           showInLegend: true,
           xValueFormatString: "HH:mm:ss",
           dataPoints: arrCoinRealTime3

       },
       {
           type: "spline",
           name: arrCoinRealTimeName[3],
           showInLegend: true,
           xValueFormatString: "HH:mm:ss",
           dataPoints: arrCoinRealTime4

       },
       {
           type: "spline",
           name: arrCoinRealTimeName[4],
           showInLegend: true,
           xValueFormatString: "HH:mm:ss",
           dataPoints: arrCoinRealTime5

       }]

   });

   chart.render();

   function toggleDataSeries(e) {
       if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
           e.dataSeries.visible = false;
       }
       else {
           e.dataSeries.visible = true;
       }
       e.chart.render();
   }

}