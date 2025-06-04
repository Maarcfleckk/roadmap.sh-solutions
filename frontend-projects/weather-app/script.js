document.addEventListener("DOMContentLoaded", function(){
    const elements = {
        form:document.querySelector("#weather-form"),
        location:document.querySelector("#location"),
        refreshButton:document.querySelector("#refresh"),
        submitButton:document.querySelector("#submit"),
        clearButton:document.querySelector("#clear"),
        resultBox:document.querySelector("#results"),
        titleResultBox:document.querySelector("#results #title"),
        yesterdayResultBox:document.querySelector("#results #yesterday"),
        todayResultBox:document.querySelector("#results #today"),
        tomorrowResultBox:document.querySelector("#results #tomorrow"),
        resultTitle:document.querySelector("#results #result-title"),
    }

    elements.form.addEventListener("submit", function(ev){
        ev.preventDefault();
    });

    elements.clearButton.addEventListener("click", function(){
        clearForm();
    });

    elements.refreshButton.addEventListener("click", function(){
        renderUi();
    });

    elements.submitButton.addEventListener("click", function(){
        renderUi();
    });


    const apiKey = "LQLE8A9SFBX3X3FG5UXW2GJR8";
    
    // FETCH DATA
    async function fetchWeatherData(){
        const todayDate = new Date();
        const todayInfo = {
            year: todayDate.getFullYear(),
            month: todayDate.getMonth() + 1,
            day: todayDate.getDate(),
            hours: todayDate.getHours(),
            minutes: todayDate.getMinutes(),
            seconds: todayDate.getSeconds(),
            miliseconds: todayDate.getMilliseconds()
        }

        const queryInfo = {
            location : elements.location.value.trim(""),
            yesterday : "yesterday",
            today: "today",
            tomorrow : "tomorrow",
            apiKey : apiKey,
        }

        const yesterdayQuery = buildUrl(queryInfo.location, queryInfo.yesterday,)
        console.log("🚀 ~ fetchWeatherData ~ yesterdayQuery:", yesterdayQuery)
        const todayQuery = buildUrl(queryInfo.location, queryInfo.today,)
        console.log("🚀 ~ fetchWeatherData ~ todayQuery:", todayQuery)
        const tomorrowQuery = buildUrl(queryInfo.location, queryInfo.tomorrow,)
        console.log("🚀 ~ fetchWeatherData ~ tomorrowQuery:", tomorrowQuery)
        let ok = false;

        const yesterday = await fetchPast24hWeather(yesterdayQuery);
        const today = await fetchTodayWeather(todayQuery);
        const tomorrow = await fetchTomorrowWeather(tomorrowQuery);

        ok = true;

        return {yesterday, today, tomorrow, ok}
    }

    async function fetchPast24hWeather(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) throw new Error("Failed to fetch yesterday's weather.");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching yesterday's weather:", error);
            return null;
        }
    }

    async function fetchTodayWeather(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) throw new Error("Failed to fetch today's weather.");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching today's weather:", error);
            return null;
        }
    }

    async function fetchTomorrowWeather(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) throw new Error("Failed to fetch tomorrow's weather.");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching tomorrow's weather:", error);
            return null;
        }
    }

    function buildUrl(location, startTime, endTime){
        let timeParams = "";
        
        if (startTime && endTime) {
            timeParams = `/${startTime}/${endTime}`;
        } else if (startTime) {
            timeParams = `/${startTime}`;
        } else if (endTime) {
            timeParams = `/${endTime}`;
        }
        
        return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${timeParams}?unitGroup=metric&key=${apiKey}`;
    }

    async function renderUi(){
        const {yesterday, today, tomorrow, ok} = await fetchWeatherData();
        console.log(`🚀 ~ renderUi ~ {yesterday, today, tomorrow, ok}:`, {yesterday, today, tomorrow, ok})
        if(ok){
          elements.resultTitle.textContent = "Weather forecast | " + today.resolvedAddress + " | " + today.days[0].datetime + " | " + today.currentConditions.datetime;

          // TODAY
          const todayHtml = `
          <div class="today">
          <div class="yesterday--general">
            <div class="today--description">${today.description}</div>
            <div class="today--conditions">${today.currentConditions.conditions}</div>
            <div class="today--cloudcover">${today.currentConditions.cloudcover}</div>
            <div class="today--feelslike">${today.currentConditions.feelslike}</div>
            <div class="today--humidity">${today.currentConditions.humidity}</div>
            <div class="today--pressure">${today.currentConditions.pressure}</div>
            <div class="today--temp">${today.currentConditions.temp} ºC</div>
            <div class="today--tempmax">Max ${today.days[0].tempmax} ºC</div>
            <div class="today--tempmin">Min ${today.days[0].tempmin} ºC</div>
            </div>
            <div class="today--windspeed">${today.currentConditions.windspeed} km/h <i class="fa fa-arrow-up" style="transform: rotate(${today.currentConditions.winddir}deg)"></i></div>
            <div class="today--sunrise">${today.currentConditions.sunrise} h.<i class="fa fa-sun"></i></div>
            <div class="today--sunset">${today.currentConditions.sunset} h.<i class="fa fa-sun"></i></div>
          </div>
          `;
          elements.todayResultBox.innerHTML = todayHtml;
          elements.resultBox.classList.add("show")
          // TOMORROW
          // YESTERDAY
          const yesterdayHtml = `
            <div class="yesterday">
              <div class="yesterday--general">
              <div class="yesterday--conditions">${yesterday.days[0].conditions}</div>
              <div class="yesterday--cloudcover">${yesterday.days[0].cloudcover}</div>
              <div class="yesterday--humidity">${yesterday.days[0].humidity}</div>
              <div class="yesterday--pressure">${yesterday.days[0].pressure}</div>
              <div class="yesterday--temp">${yesterday.days[0].temp} ºC</div>
              <div class="yesterday--tempmax">Max ${yesterday.days[0].tempmax} ºC</div>
              <div class="yesterday--tempmin">Min ${yesterday.days[0].tempmin} ºC</div>
              </div>
              <div class="yesterday--windspeed">${yesterday.days[0].windspeed} km/h <i class="fa fa-arrow-up" style="transform: rotate(${yesterday.days[0].winddir}deg)"></i></div>
              <div class="yesterday--sunrise">${yesterday.days[0].sunrise} h.<i class="fa fa-sun"></i></div>
              <div class="yesterday--sunset">${yesterday.days[0].sunset} h.<i class="fa fa-sun"></i></div>
            </div>
          `;
          elements.yesterdayResultBox.innerHTML = yesterdayHtml;

          // TOMORROW
          const tomorrowHtml = `
            <div class="tomorrow">
            <div class="yesterday--general">
              <div class="tomorrow--conditions">${tomorrow.days[0].conditions}</div>
              <div class="tomorrow--cloudcover">${tomorrow.days[0].cloudcover}</div>
              <div class="tomorrow--humidity">${tomorrow.days[0].humidity}</div>
              <div class="tomorrow--pressure">${tomorrow.days[0].pressure}</div>
              <div class="tomorrow--temp">${tomorrow.days[0].temp} ºC</div>
              <div class="tomorrow--tempmax">Max ${tomorrow.days[0].tempmax} ºC</div>
              <div class="tomorrow--tempmin">Min ${tomorrow.days[0].tempmin} ºC</div>
              </div>
              <div class="tomorrow--windspeed">${tomorrow.days[0].windspeed} km/h <i class="fa fa-arrow-up" style="transform: rotate(${tomorrow.days[0].winddir}deg)"></i></div>
              <div class="tomorrow--sunrise">${tomorrow.days[0].sunrise} h.<i class="fa fa-sun"></i></div>
              <div class="tomorrow--sunset">${tomorrow.days[0].sunset} h.<i class="fa fa-sun"></i></div>
            </div>
          `;
          elements.tomorrowResultBox.innerHTML = tomorrowHtml;


        } else{
            showError();
        }
    }
    
    // USER LOCATION
    function getUserLocation() {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(
                async function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Usamos lat y lon para pedir ciudad desde Visual Crossing o directamente
                    const locationString = `${lat},${lon}`;
                    elements.location.value = locationString;

                    await renderUi(); // Llama automáticamente cuando se tiene ubicación
                },
                function(error) {
                    console.error("Geolocation error:", error.message);
                    alert("No se pudo obtener tu ubicación. Por favor ingresa una ubicación manualmente.");
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    }

    getUserLocation();

    // UI
    function clearForm(){
        elements.form.reset();
    }

    function showError(){}
});