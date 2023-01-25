import { setLocationObject, getHomeLocation } from "./dataFunctions.js"
import {
  addSpinner,
  displayError,
  updateScreenReaderConfirmation
} from "./domFunctions.js"
import CurrentLocation from "./CurrentLocation.js"

const currentLoc = new CurrentLocation()

const initApp = () => {
  // Add Listener
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);
  const homeButton = document.getElementById("home")
  homeButton.addEventListener("click", loadWeather)
  const saveButton = document.getElementById("saveLocation")
  saveButton.addEventListener("click", saveLocation)
  const unitButton = document.getElementById("unit")
  unitButton.addEventListener("click", setUnitPref)
  const refreshButton = document.getElementById("refresh")
  refreshButton.addEventListener("click", refreshWeather)

  // Setup

  // Load Weather
  loadWeather()
}

document.addEventListener("DOMContentLoaded", initApp)

const getGeoWeather = (event) => {
  if (event && event.type === "click") {
    const mapIcon = document.querySelector(".fa-map-marker-alt")
    addSpinner(mapIcon)
  }
  if (!navigator.geolocation) geoError()
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "Geolocation not supported"
  displayError(errMsg, errMsg)
}

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Lon ${position.coords.longitude}`
  }
  // Set Location Object
  setLocationObject(currentLoc, myCoordsObj)
  // Update data and display
  updateDataAndDisplay(currentLoc)
}

const loadWeather = (event) => {
  const saveLocation = getHomeLocation()
  if (!saveLocation && !event) return getGeoWeather()
  if (!saveLocation && event.type === "click") {
    displayError(
      "No Home Location Save",
      "Sorry, Please Save your home location first"
    )
  } else if (saveLocation && !event) {
    displayHomeLocationWeather(saveLocation)
  } else {
    const homeIcon = document.querySelector(".fa-house-chimney")
    addSpinner(homeIcon)
    displayHomeLocationWeather(saveLocation)
  }
}

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home)
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit
    }
    setLocationObject(currentLoc, myCoordsObj)
    updateDataAndDisplay(currentLoc)
  }
}

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-floppy-disk")
    addSpinner(saveIcon)
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit()
    }
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location))
    updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location`)
  }
}

const updateDataAndDisplay = (locationObj) => {
  console.log(locationObj)
  // const weatherJson = await getWeatherFromCoords(locationObj)
  // if (weatherJson) updateDisplay(weatherJson, locationObj)
}