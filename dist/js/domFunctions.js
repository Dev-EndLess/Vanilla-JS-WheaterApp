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
  const currentConditionArray = createCurrentDonditionsDivs(weatherJson, locationObj.getUnit())
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

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  const weatherLookup = {
    09: "soft rain",
    10: "heavy rain",
    11: "thunder storm",
    13: "snow",
    50: "fog"
  }
  let weatherClass
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars]
  } else if (lastChar === "d") {
    weatherClass = "clouds"
  } else {
    weatherClass = "night"
  }
  return weatherClass
}

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass)
  document.documentElement.classList.forEach(img => {
    if (img !== weatherClass) document.documentElement.classList.remove(img)
  })
}

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName()
  const unit = locationObj.getUnit()
  const tempUnit = unit === "metric" ? "Celsius" : "Fahrenheit"
  return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))}° in ${location}`
}

const setFocusOnSearch = () => {
  document.getElementById("searchBar--text").focus()
}

const createCurrentDonditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "metric" ? "Celsius" : "Fahrenheit"
  const windUnit = unit === "metric" ? "Mph" : "m/s"
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon, 
    weatherObj.current.weather[0].description
  )

  
}

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElement("div", "icon")
  iconDiv.id = "icon"
  const fontAwesomeIcon = translateIconToFontAwesome(icon)
  fontAwesomeIcon.ariaHidden = true
  fontAwesomeIcon.title = altText
  iconDiv.appendChild(fontAwesomeIcon)
  return iconDiv
}

const createElement = (elementType, divClassName, divText, unit) => {
  const div = document.createElement(elementType)
  div.classList.add(divClassName)
  if (divText) {
    div.textContent = divText
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div")
    unitDiv.classList.add("unit")
    unitDiv.textContent = unit
    div.appendChild(unitDiv)
  }
  return div
}