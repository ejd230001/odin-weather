import "./css/reset.css"
import "./css/styles.css"
import cloudy from "./imgs/cloudy.svg"
import rain from "./imgs/rain.svg"
import clear from "./imgs/clear.svg"
import snow from "./imgs/snow.svg"

let currentUnit = "C";
let currentMapArray = undefined;
let currentCity = "";

async function getData(city) {
    let url;
    if (currentUnit == "F")
        url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=G8TM9LDVXZM4PRQ53HZTAPU8X&unitGroup=us";
    else
        url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=G8TM9LDVXZM4PRQ53HZTAPU8X&unitGroup=metric";
    let response = await fetch(url);
    let data = await response.json();
    let mapArray = [];
    data.days.forEach((day) => {
        let dataMap = new Map([
        ["date", day.datetime],
        ["conditions", day.conditions],
        ["highTemp", day.tempmax],
        ["lowTemp", day.tempmin],
        ["averageTemp", day.temp]
        ])
        mapArray.push(dataMap);
    })
    
    currentMapArray = mapArray;
    currentCity = city;

}

async function printInfo() {
    let mapArray = await getData("Texas");
    mapArray.forEach((day) => {
        console.log(`Date: ${day.get("date")}\n
                    Conditions: ${day.get("conditions")}\n
                    highTemp: ${day.get("highTemp")}\n
                    lowTemp: ${day.get("lowTemp")}
                    averageTemp: ${day.get("averageTemp")}`);
    })
}

function renderToday(today, city) {
    const overview = document.querySelector(".overview");
    overview.textContent = "";

    const cityName = document.createElement("div");
    cityName.classList.add("city-name");
    cityName.textContent = city;

    const averageForecast = document.createElement("div");
    averageForecast.classList.add("average-forecast");

    const averageImg = document.createElement("img");
    averageImg.classList.add("average-img");
    averageImg.setAttribute("src", getImg(parseCondition(today.get("conditions"))));

    const averageTemp = document.createElement("div");
    averageTemp.classList.add("average-temp");
    averageTemp.textContent = today.get("averageTemp");

    const unit = document.createElement("div");
    unit.classList.add("unit");

    const unitF = document.createElement("div");
    const unitC = document.createElement("div");
    unitF.classList.add("unit-desc");
    unitC.classList.add("unit-desc");
    unitF.textContent = "F";
    unitC.textContent = "C";

    if (currentUnit == "F")
        unitF.classList.add("active");
    else
        unitC.classList.add("active");

    unitC.addEventListener("click", async function() {
        if (currentUnit == "C")
            return;
        else {
            currentUnit = "C";
            await getData(currentCity);
            renderPage();
        }
    })

    unitF.addEventListener("click", async function() {
        if (currentUnit == "F")
            return;
        else {
            currentUnit = "F";
            await getData(currentCity);
            renderPage();
        }
    })

    const averageDesc = document.createElement("div");
    averageDesc.classList.add("average-desc");
    averageDesc.textContent = today.get("conditions");

    const updated = document.createElement("div");
    updated.classList.add("updated");
    updated.textContent = "Updated as of " + getCurrentTime();

    unit.append(unitC, unitF);
    averageForecast.append(averageImg, averageTemp, unit);
    overview.append(cityName, averageForecast, averageDesc, updated);

}

function renderPage() {
    const dailyCardsDiv = document.querySelector(".daily-cards");
    dailyCardsDiv.textContent = "";
    renderToday(currentMapArray[0], currentCity);
    let count = 0;
    currentMapArray.forEach((day) => {
        if (count > 8) return;
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const cardDate = document.createElement("div");
        cardDate.classList.add("card-date");
        cardDate.textContent = day.get("date");

        const cardImg = document.createElement("img");
        cardImg.setAttribute("src", getImg(parseCondition(day.get("conditions"))));
        cardImg.classList.add("card-img");

        const dailyTemps = document.createElement("div");
        dailyTemps.classList.add("daily-temps");

        const highTemp = document.createElement("div");
        highTemp.classList.add("high-temp");
        highTemp.textContent = day.get("highTemp");

        const lowTemp = document.createElement("div");
        lowTemp.classList.add("low-temp");
        lowTemp.textContent = day.get("lowTemp");
        
        dailyTemps.append(highTemp, lowTemp);
        cardDiv.append(cardDate, cardImg, dailyTemps);
        dailyCardsDiv.appendChild(cardDiv);
        count++;
    })
}

function parseCondition(conditionString) {
    const conditionArr = conditionString.split(",").map(condition => condition.trim());

    return conditionArr[0];
}

function getImg(condition) {
    if (condition == "Rain") 
        return rain;
    else if (condition == "Overcast" || condition == "Partially Cloudy")
        return cloudy;
    else if (condition == "Snow")
        return snow;
    else if (condition == "Clear")
        return clear;
    else
        return clear;
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();  
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let half = "AM";
    if (hours > 12) {
        hours -= 12;
        half = "PM";
    }

    return `${hours}:${minutes} ${half}`;

}

function setUpEventListeners() {
    const input = document.querySelector(".search-bar-input");
    const button = document.querySelector(".search-btn");
    const form = document.querySelector(".search-bar-form");

    button.addEventListener("click", async function() {
        await getData(input.value);
        renderPage();
        input.value = "";
    })

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        await getData(input.value);
        renderPage();
        input.value = "";
    })
}

async function initializePage() {
    await getData("Washington, DC");
    renderPage();
}

setUpEventListeners();
initializePage();
