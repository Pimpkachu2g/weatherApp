let navbar = document.getElementsByClassName('nav-item');
let pages = document.getElementsByClassName('pages');
let btn = document.getElementsByClassName('btn');
let text = document.getElementsByClassName('form-control');
let cardWrapper = document.getElementsByClassName('cards-wrapper')[0];
let statistics = document.getElementsByClassName('w-statistics')[0];
let load = document.getElementsByClassName('welcome')[0];
let weather;
let highest = -Infinity;
let lowest = Infinity;
let avrg = 0;
let hMoist = -Infinity;
let lMoist = Infinity;
let aMoist = 0;
let warmestDay;
let coldestDay;

function enable(element, Pagei) {
    element.classList.add('active');
    pages[Pagei].classList.add('show');
    console.log(pages[Pagei])
}

function disable() {
    for (let i = 0; i < navbar.length; i++) {
        navbar[i].classList.remove('active');
        pages[i].classList.remove('show');
    }
}

for (let i = 0; i < navbar.length; i++) {
    navbar[i].addEventListener('click', function() {
        disable();
        enable(this, i);
    })
}

function resetValues () {
    statistics.innerHTML = ''; //reset statistics HTML
    cardWrapper.innerHTML = ''; //reset hourly HTML
    load.innerHTML = '';
    highest = -Infinity;
    lowest = Infinity;
    avrg = 0;
    hMoist = -Infinity;
    lMoist = Infinity;
    aMoist = 0;
    warmestDay = null;
    coldestDay = null;
}

async function fetchData(apiKey, city) {
    let call = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`);
    let data = await call.json();
    return data;
}

btn[0].addEventListener('click', (e)=> {
    e.preventDefault();
    post(text[0].value);
})
text[0].addEventListener('keypress', (e)=> {
    if(e.charCode === 13) {
        e.preventDefault();
        post(text[0].value);
    }
})

function createCard (icon, description, date, temp, humidity, windSpeed) {
    let card = `
    <div class="weather-card">
        <div class="top-card">
            <span><img src="http://openweathermap.org/img/w/${icon}.png" alt=""></span>
            <p>${description}</p>
        </div>
        <hr>
        <div class="bottom-card">
            <div class="time">
                <img src="./style/images/calendar.svg" alt="">
                <span>${date}</span>
            </div>
            <div class="temp">
                <img src="./style/images/thermometer.svg" alt="">
                
    `;
    card += `<span class="${pickColor(temp)}">${temp} °C</span>`;
    card += `
    </div>
            <div class="humidity">
                <img src="./style/images/humidity.svg" alt="">
                <span>${humidity}%</span>
            </div>
            <div class="windsp">
                <img src="./style/images/wind.svg" alt="">
                <span>${windSpeed} km/h</span>
            </div>
        </div>
    </div>`
    return card;
}

function generateStats (highestTemp, highestHumidity, lowestTemp, lowestHumidity, average, averageMoist, warmestDay, coldestDay) {
    let stats = `
    <div class="low">
        <div><img src="./style/images/thermometer.svg"><span>Lowest Temperature: </span> <br> <span class="${pickColor(lowestTemp)}">${lowestTemp}  °C</span></div>
        <div><img src="./style/images/humidity.svg"><span>Lowest Humidity: <br> ${lowestHumidity}%</span></div>
        <div><img src="./style/images/cold.svg"><span>Coldest day of the <br> following period is on: ${coldestDay}</span></div>
    </div>
    <div class="avg">
        <div><img src="./style/images/thermometer.svg"><span>Average Temperature: </span> <br> <span class="${pickColor(average)}">${Math.floor(average)} °C</span></div>
        <div><img src="./style/images/humidity.svg"><span>Average Humidity: <br> ${Math.floor(averageMoist)}%</span></div>
    </div>
    <div class="high">
        <div><img src="./style/images/thermometer.svg"><span>Highest Temperature: </span> <br> <span class="${pickColor(highestTemp)}">${highestTemp} °C</span></div>
        <div><img src="./style/images/humidity.svg"><span>Highest Humidity: <br> ${highestHumidity}</span></div>
        <div><img src="./style/images/hot-thermometer.svg"><span>Warmest day of the <br> following period is on: ${warmestDay}</span></div>
    </div>
    `;
    console.log('activated')
    return stats;
}

function post(city) {
    resetValues();
    weather = fetchData('95fe07de55e269e37fd5d76b7d2f231e', city)
    .then(weather => {
        for (let i = 0; i < weather.list.length; i++) {
            cardWrapper.innerHTML += createCard(weather.list[i].weather[0].icon, weather.list[i].weather["0"].description, weather.list[i].dt_txt, weather.list[i].main.temp, weather.list[i].main.humidity, weather.list[i].wind.speed); 
            highestTemp(weather.list[i].main.temp_max, weather.list[i].dt_txt);
            lowestTemp(weather.list[i].main.temp_min,  weather.list[i].dt_txt);
            averageTemp(weather.list[i].main.temp);
            highestMoist(weather.list[i].main.humidity);
            lowestMoist(weather.list[i].main.humidity);
            averageMoist(weather.list[i].main.humidity);
            }
            statistics.innerHTML += generateStats (highest, hMoist, lowest, lMoist, avrg / weather.list.length, aMoist / weather.list.length, warmestDay, coldestDay);
        }
)
resetValues ()
}

function highestTemp(num,day) {
    if(highest < num){
        highest = num;
        warmestDay = day;
    }

}

function lowestTemp(num, day) {
    if(lowest > num){
        lowest = num;
        coldestDay = day;
    }
}

function averageTemp(arr) {
    avrg += arr;
}

function highestMoist(num) {
    if(hMoist < num){
        hMoist = num;
    }
}

function lowestMoist(num) {
    if(lMoist > num){
        lMoist = num;
    }
}

function averageMoist(arr) {
    aMoist += arr;
}

function pickColor (temp) {
    if (temp < 10) {
       return 'cold';
    } else if (temp > 25) {
        return 'hot';
    }
}
