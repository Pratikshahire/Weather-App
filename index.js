const API_KEY = "be4a89e29c3c5b5d4f98afac697a111f";

const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

getfromSessionStorage();

let currentTab = userTab;
currentTab.classList.add("current-tab");

userTab.addEventListener("click", () => {
    //pass the clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass the clicked tab as input parameter
    switchTab(searchTab);
});

function switchTab(clickedTab) {
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            //kya search form wala container is invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // now moved to your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //yaha user ka weather display karna hoga, so let's check local storage first for session co-ordinates
            getfromSessionStorage();
        }
    }
}

//checks if location co-ordinates are already present in session storage
function getfromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {
        //agar local coordinates nhi mile so coordinate nhi hai..means location ka access nhi diya hai so we need to show grant location access wali window
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_kEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        //function to render data from API to UI
        renderWeatherInfo(data);

    } 
    catch(err) {
        loadingScreen.classList.remove("active");
        alert("Error in fetchUserWeatherInfo")

    }
}

function renderWeatherInfo(weatherInfo) {
    //firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");

    const countryIcon = document.querySelector("[data-countryIcon");

    const desc = document.querySelector("[data-weatherDesc]");

    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");

    const windSpeed = document.querySelector("[data-windSpeed]");

    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo obj and put in UI elements

    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;    
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${ weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo.clouds?.all} %`;

}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //show an alert for no geolocation support available
        alert("No geolocation support available!");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    {
        return;
    }
    else
    {
        fetchSearchWeatherInfo(cityName);
    }
})

//for calling apis
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        alert("City not found!");
    }
}