var count = 0

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function convertDate(date){
   var months = {Jan: '01', Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sept: "09", Oct: "10", Nov: "11", Dec: "12"}
   date = date.toString().slice(4,7)
   return months[date]
}

function day(today){
    dd = today.getDay() - 1
        if (dd < 0){
            dd = 6
        }
    return dd
}
function getLoc(addy, city, count){
    console.log('getting location')
    const KEY_maps = "AIzaSyAV4K4_4yTcBBbSs2Z0nCh8XoSmql5EU7g"

    const full = `${addy.replace(/\s/g,'+')},${city.replace(/\s/g,'+')}`

    console.log("maps api call")
    let URL_maps = `https://maps.googleapis.com/maps/api/geocode/json?address=${full}&key=${KEY_maps}`
    return fetch(URL_maps)
    .then(response => response.json() )

}

function getWeather(lat, lng, metric, count){
    var units = 'metric'
    if(!(metric)){
        console.log('imperial')
        units = 'imperial'
    }
    console.log('getting weather')
    const KEY_weather = "ccc5ece1459a6b07dd39449ee87e38ef"
    console.log('weather API Call')
    let URL_weather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly&units=${units}&appid=${KEY_weather}`
        return fetch(URL_weather)
        .then(response => response.json())
}

function extractWeather(data){
    var weather = {}

    for(i=0; i < 7; i++){
        var thisDate = new Date();
        thisDate.setDate(thisDate.getDate() + i).toString;
        theDay = thisDate.toString().slice(8,10)
        month = convertDate(thisDate)
        var theDate = `${month}-${theDay}`
        console.log(theDate)
        var rain = 0;
        if(data.daily[i].rain == undefined){
            rain = 0;
        }
        else {
            rain = data.daily[i].rain;
            rain = Math.round(rain * 10)/10
        }
        
        weather[theDate] = {temp: data.daily[i].temp.max, templow: data.daily[i].temp.min, precip: data.daily[i].weather[0].main, sunset: timeConverter(data.daily[i].sunset + data.timezone_offset), sunrise: timeConverter(data.daily[i].sunrise + data.timezone_offset), mm: (rain)}
    }
    return (weather)
}

function timeConverter(UNIX_timestamp){
    var time = new Date(UNIX_timestamp * 1e3).toISOString().slice(-13, -8);
    hours = time.slice(0,2)
    hours = parseInt(hours) - 12
    if (hours < 0){
        hours = hours + 12
    }
    time  = time.slice(2,5)
    return (hours.toString() + time)
}

function genInterface(weather, metric, city, addy) {
    console.log(weather)
    var week = document.getElementsByClassName('calendarWeekContainer inView')
    removeElementsByClass("weatherData")
    
    addy = `${addy},`
    if(addy == ","){
        addy = ""
    }

    if(metric == true){
        var unitsymbol = '&#8451'
    }
    else {
        var unitsymbol = '&#8457'
    }

    for(n=0;n < 2; n++){
        if (week[n] == null){
            console.log('fail')
            if(n=0){
                var backup = document.getElementsByClassName('calendarWeekContainer')[12]
                container = backup.getElementsByClassName("dayWidth dayContainer day")
            }
            else{
                var backup = document.getElementsByClassName('calendarWeekContainer')[13]
                container = backup.getElementsByClassName("dayWidth dayContainer day")
                console.log(container)
            }
        }
        else{
            var container = week[n].getElementsByClassName("dayWidth dayContainer day")
            console.log(container)
        }
    for(k=0; k < 7; k++) {
        var color ="rgb(141,178,216)"
        var testdate = container[k].dataset.date.slice(5,10)
        if(testdate in weather){
            var activities = container[k].getElementsByClassName("activities")
            var dataset = (weather[testdate])
            
            if (dataset.precip == 'Rain' && (dataset.mm > 2)){
                src = chrome.extension.getURL("images/wi-rain.png")
            }
            else if (dataset.precip == 'Rain' && dataset.mm <= 2){
                src = chrome.extension.getURL('images/wi-day-sprinkle.png')
            }
            else if (dataset.precip == 'Clear'){
                src = chrome.extension.getURL("images/wi-sunny-overcast.png")
            }
            else if (dataset.precip == 'Clouds'){
                src = chrome.extension.getURL("images/cloudy.png")
            }
            else {
                src = "images/wi-na.svg"
            }
            var input = (`<div class="TPWeather">
            <table id="top">
            <tr>
            <td class="titleCards" id="location" colspan="2">${addy} ${city}</td>
            </tr>
            <tr style="height: 37px">
                <td class="hl" style="width: 30%"> <p class="p">H: ${Math.round(dataset.temp)} ${unitsymbol}</p>
                </td>
                <td style="width: 50%" rowspan="2"> <img id="weatherimg" src="${src}">
                </td>
            </tr>
            <tr >
                <td class="noColor" style="width: 30%">
                    <p class="p">L: ${Math.round(dataset.templow)} ${unitsymbol}</p>
                </td>
            </tr>
        </table>
            <table id="bottom">
            <tr>
                <td style="width: 30%"> <p class="p">${dataset.sunrise} AM</p>
                </td>
                <td rowspan="2" style="width: 25%"> <img class="staticimg" src="${chrome.extension.getURL("images/sunset.png")}"/> </td>
                <td style="width: 20%" rowspan="2" colspan="2"> <p class="p" id="rain">${dataset.mm} mm</p>
                </td>
            </tr>
            <tr>
                <td class="noColor" style="width: 35%">
                    <p class="p">${dataset.sunset} PM</p>
                </td>
            </tr>
            <tr>
            <td class="titleCards" id="title" colspan="4">TP Weather - by <a href="https://www.instagram.com/nsimm22/" target="_blank">Noah Simms</a></td>
            </tr>
        </table>
        </div>
        <script>
        xbutton = document.getElementById("x-button")
        console.log(xbutton)
        xbutton.onclick = function(){
            alert("Fuck")
        }
        </script>

        <style>
            table {
                width: 100%;
                background-color: ${color};
                text-align: center;
                table-layout: fixed;
                padding: 0px;
                margin: 0px;
            }
            #title {
                font-size: 0.4em;
                border-top: 0.5px black solid;
            }
            #container {
                background-color: ${color};
            }
            .p {
                margin: 0px;
                font-size: 0.7em;
                font-family: Verdana, Geneva, sans-serif;
                color: black;
                float: left;
            }
            a {
                color: red;
            }
            #weatherimg {
                width: 80%;
            }
            .staticimg {
                padding: 0;
                margin: 0;
                width: 100%;
                float: left;
            }
            #rain {
                text-align: center;
                padding: 0px;
            }
            #location {
                border-bottom: 1px black solid;
                font-size: 1vh;
            }
            #top {
                border-top: 1px solid black;
                border-left: 1px solid black;
                border-right: 1px solid black;
                border-bottom: 1.5px solid ${color};
                width: 100%;
            }
            #bottom {
                border-left: 1px solid black;
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                width: 100%;
            }
            .noColor {
                 background: ${color};
            }
            .TPweather {
                background-color: ${color};
            }
            td {
                background-color: ${color};
            }
            .titleCards{
                background-color: rgb(110,148,186)
            }

    </style>`)

            var node = document.createElement("div")
            node.setAttribute("class", "weatherData")
            container[k].insertBefore(node, activities[0])
            node.innerHTML = input
        }
    }
    } 
}



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(count)
    //Get Identification Number
    if (document.querySelectorAll(".userType")[0].innerHTML == "Coach Account"){
        var athletepic = document.getElementsByClassName("athleteInformation athletePhoto clickable left")
        var id = athletepic[0].getElementsByClassName("photo")
        id = id[0].style.backgroundImage
        var identification = id.slice(-32,-14)
        console.log('Coach Account')
        console.log(`Athlete #: ${identification}`)
    }
    else{
        var id = document.getElementsByClassName("photo clickable")
        id = id[0].style.backgroundImage
        var identification = id.slice(-32,-14)
        console.log('Athlete Account')
    }

    //If it is a refresh or Get request use Chrome store values
    if (message.scriptOptions.city == "" && message.scriptOptions.address == ""){
        chrome.storage.sync.get([identification], function(result){
            console.log(identification)
            var sW = result[identification][1]
            var city = result[identification][0].city
            var addy = result[identification][0].address
            var metric = result[identification][0].metric
            if (sW == null){
                console.log("Nothing here boss")
                return;
            }
            console.log(sW)
            var today = new Date()

            today.setHours(today.getHours()+144);
            d = today.getDate()
            m = today.getMonth() + 1;
            if (m > 12){
                m = 1
            }
            if(m < 10){
                m = `0${m}`
            }
            if(d < 10){
                d = `0${d}`
            }
            var date = (`${m}-${d}`)
            console.log(date)
            if(date in sW){
                genInterface(sW, metric, city, addy)
            }
            else {
                var addy = result[identification][0].address
                var city = result[identification][0].city
                var L = (getLoc(addy, city, count))
                L.then(data => {
                var lat = data.results[0].geometry.location.lat
                var lng = data.results[0].geometry.location.lng
                gW.then(data => {
                    var eW = extractWeather(data)
                    genInterface(eW, metric, city, addy)
                    var information = {}
                    information[identification] =[message.scriptOptions, eW, metric]
                    chrome.storage.sync.set(information)
                    count = count + 1
                })
             })
             }
        })
    }
    //If call has new data
    else{
    var addy =  message.scriptOptions.address
    var city = message.scriptOptions.city
    var metric = message.scriptOptions.metric

    var L = (getLoc(addy, city, count))
    L.then(data => {
       var lat = data.results[0].geometry.location.lat
       var lng = data.results[0].geometry.location.lng
        var gW = getWeather(lat, lng, metric, count)

       gW.then(data => {
           var eW = extractWeather(data)
           genInterface(eW, metric, city, addy)
           var information = {}
           information[identification] =[message.scriptOptions, eW, metric]
           chrome.storage.sync.set(information)
           count = count + 1
       })
   })
}
})