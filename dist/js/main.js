import { addSpinner } from "./domFunctions.js"
import CurrentLocation from "./CurrentLocation.js"

const currentLoc = new CurrentLocation()

const initApp = () => {
  // Add Listener
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);
  // Setup

  // Load Weather
}

document.addEventListener("DOMContentLoaded", initApp)

const getGeoWeather = (event) => {
  if (event && event.type === "click") {
    const mapIcon = document.querySelector(".fa-map-marker-alt")
    addSpinner(mapIcon)
  }
  // if (!navigator.geolocation) geoError()
  // navigator.geoLocation.getCurrentPosition(geoSuccess, geoError)
}