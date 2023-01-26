export const setPlaceHolderText = () => {
  const input = document.getElementById("searchBar--text")
  window.innerWidth < 400 
  ? (input.placeholder = "City, State, Country")
  : (input.placeholder = "City, State, Country, or Zip Code")
}

export const addSpinner = (element) => {
  animateButton(element)
  setTimeout(animateButton, 1000, element)
};

const animateButton = (element) => {
  element.classList.toggle("none")
  element.nextElementSibling.classList.toggle("block")
  element.nextElementSibling.classList.toggle("none")
}

export const displayError = (headerMsg, screenReaderMsg) => {
  updateWeatherLocationHeader(headerMsg)
  updateScreenReaderConfirmation(screenReaderMsg)
}

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message)
  updateWeatherLocationHeader(properMsg)
  updateScreenReaderConfirmation(`${properMsg}. Please try Again!`)
}

const toProperCase = (text) => {
  const words = text.split(" ")
  const properWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return properWords.join(" ")
}

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast--location")
  h1.textContent = message
}

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message
}

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay()
  clearDisplay()
  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon)
  setBGImage(weatherClass)
  const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj)
  updateScreenReaderConfirmation(screenReaderWeather)
  updateWeatherLocationHeader(locationObj.getName())
  // current conditions
  // six day forecast
  setFocusOnSearch()
  fadeDisplay()
}

const fadeDisplay = () => {
  const currentCondition = document.getElementById("currentForecast")
  currentCondition.classList.toggle("zero-vis")
  currentCondition.classList.toggle("fade-in")
  const sixDayForecast = document.getElementById("dailyForecast")
  sixDayForecast.classList.toggle("zero-vis")
  sixDayForecast.classList.toggle("fade-in")
}

const clearDisplay = () => {
  const currentCondition = document.getElementById("currentForecast--conditions")
  deleteContents(currentCondition)
  const sixDayForecast = document.getElementById("dailyForecast--contents")
  deleteContents(sixDayForecast)
}

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild
  while (child) {
    parentElement.removeChild(child)
    child = parentElement.lastElementChild
  }
}

