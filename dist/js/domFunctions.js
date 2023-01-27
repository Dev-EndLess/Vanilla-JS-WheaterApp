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
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Lon:") !== -1) {
    const msgArray = message.split(" ")
    const mapArray = msgArray.map(msg => {
      return msg.replace(":", ": ")
    })
    const lat = mapArray[0].indexOf("-") === -1
      ? mapArray[0].slice(0, 10)
      : mapArray[0].slice(0, 11)
    const lon = mapArray[1].indexOf("-") === -1
      ? mapArray[1].slice(0, 10)
      : mapArray[1].slice(0, 11)
    h1.textContent = `♦ ${lat} ♦ ${lon}`
  } else {
    h1.textContent = message
  }
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
  const currentConditionArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit())
  displayCurrentConditions(currentConditionArray)
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
    "09": "soft rain",
    "10": "heavy rain",
    "11": "thunder storm",
    "13": "snow",
    "50": "fog"
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
  return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))}°${tempUnit} in ${location}`
}

const setFocusOnSearch = () => {
  document.getElementById("searchBar--text").focus()
}

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "metric" ? "Celsius" : "Fahrenheit"
  const windUnit = unit === "metric" ? "km/h" : "m/s"
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  )
  const temp = createElement("div", "temp", `${Math.round(Number(weatherObj.current.temp))}°`, tempUnit)
  const properDescription = toProperCase(weatherObj.current.weather[0].description)
  const description = createElement("div", "desc", properDescription)
  const feels = createElement("div", "feels", `Feels Like ${Math.round(Number(weatherObj.current.feels_like))}°`)
  const maxTemp = createElement("div", "maxTemp", `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`)
  const minTemp = createElement("div", "minTemp", `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`)
  const humidity = createElement("div", "humidity", `Humidity ${Math.round(Number(weatherObj.current.humidity))}%`)
  const wind = createElement("div", "wind", `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`)
  return [icon, temp, description, feels, maxTemp, minTemp, humidity, wind]
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

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i")
  const firstTwoChars = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun")
      } else {
        i.classList.add("far", "fa-moon")
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun")
      } else {
        i.classList.add("fas", "fa-cloud-moon")
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud")
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball")
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain")
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain")
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain")
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm")
      break;
    case "13":
      i.classList.add("far", "fa-snowflake")
      break;
    case "50":
      i.classList.add("fas", "fa-smog")
      break;
    default:
      i.classList.add("far", "fa-question-circle")
  }
  return i
}

const displayCurrentConditions = (currentConditionArray) => {
  const currentConditionContainer = document.getElementById("currentForecast--conditions")
  currentConditionArray.forEach((currentCondition) => {
    currentConditionContainer.appendChild(currentCondition)
  })
}