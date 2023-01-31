let user_input = document.querySelector("#user_input")
const search = document.querySelector("#search")
const weatherDiv = document.querySelector("#weather")
const removeButton = document.querySelector("#remove")
const API_KEY = "a2a7ab07022d1ffa9f0596855970b6e8"
//! Local Save
let saveFile = JSON.parse(localStorage.getItem("saveFile")) || []
let previousInputs = JSON.parse(localStorage.getItem("previousInputs")) || []; //storing previous inputs to give the user an error

window.addEventListener("load",()=>{
  user_input.focus()
  getSaveFileFromLocalStorage()
})

const getSaveFileFromLocalStorage=()=>{
    weatherDiv.innerHTML = localStorage.getItem("weatherDivInnerHTML") || "";
}
//! Local Save done

search.addEventListener("click", (event) => {
    event.preventDefault(); //stop the refresh button
    if (previousInputs.includes(user_input.value.toLowerCase())) {
      alert(`The information of ${user_input.value} already exist.`);
      user_input.value = ""
      return;
    }
    previousInputs.push(user_input.value.toLowerCase());
    localStorage.setItem("previousInputs", JSON.stringify(previousInputs));
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${user_input.value}&appid=${API_KEY}&units=metric`;
    console.log(URL);
    fetch(URL)
      .then((response) => response.json())
      .then((data) => renderWeather(data))
      .catch((error) => console.error(error));
    user_input.value = ""
  });

//! Remove weatherDiv & update

weatherDiv.addEventListener("click", (event) => {
  if (event.target.id === "remove") {
    event.target.parentElement.parentElement.remove();
    const cityName = event.target.parentElement.querySelector("p").textContent.split(": ")[1];
    saveFile = saveFile.filter(city => city.name.indexOf(cityName) === -1);
    previousInputs = previousInputs.filter(input => input !== cityName.toLowerCase());
    localStorage.setItem("saveFile", JSON.stringify(saveFile));
    localStorage.setItem("previousInputs", JSON.stringify(previousInputs));
    localStorage.setItem("weatherDivInnerHTML", weatherDiv.innerHTML);
  }
});
//!

  const renderWeather = (data) => {
    const { name, main, weather, } = data;
    let city = {
      name,
      icon: weather[0].icon,
      temperature: `${Math.round(main.temp_min)}<sup>°C</sup> / ${Math.round(main.temp_max)}<sup>°C</sup>`,
      weather: `${weather[0].main}, ${weather[0].description}`
    }
    weatherDiv.innerHTML += "";
    weatherDiv.innerHTML += `
    <div class="col-4">
      <div class="col-12 myBorder text-center mt-4">
        <button type="submit" id="remove">X</button>
        <img class="icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg" alt=""/>
        <p><b>City:</b> ${name}</p>
        <p><b>Temperature:</b> ${Math.round(main.temp_min)}<sup>°C</sup> / ${Math.round(main.temp_max)}<sup>°C</sup></p>
        <p><b>Weather:</b> ${weather[0].main}, ${weather[0].description}</p>
        <p><b>Date Created:</b> ${new Date()}</p>
      </div>
    </div>
    `;
    saveFile.push(city);
    localStorage.setItem("saveFile", JSON.stringify(saveFile));
    localStorage.setItem("weatherDivInnerHTML", weatherDiv.innerHTML);
  };

  //! When the user presses enter button on a keyboard
  user_input.addEventListener("keydown", (event) => {
    if (event.code == "Enter" || event.code == "NumpadEnter") {
        event.preventDefault();
        search.click() 
    }
})