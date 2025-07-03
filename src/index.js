import "./css/reset.css"
import "./css/styles.css"

async function getData() {
    let response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Texas?key=G8TM9LDVXZM4PRQ53HZTAPU8X");
    let data = await response.json();
    console.log(data.days);
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
    

    return mapArray;
}

async function printInfo() {
    let mapArray = await getData();
    mapArray.forEach((day) => {
        console.log(`Date: ${day.get("date")}\n
                    Conditions: ${day.get("conditions")}\n
                    highTemp: ${day.get("highTemp")}\n
                    lowTemp: ${day.get("lowTemp")}
                    averageTemp: ${day.get("averageTemp")}`);
    })

}

printInfo();
