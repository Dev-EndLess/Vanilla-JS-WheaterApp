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
    h1.textContent = `• ${lat} ♦ ${lon} •`
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
  displaySixDayForecast(weatherJson)
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
  const firstChar = icon.slice(0, 1)
  const firstTwoChars = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  const weatherLookup = {
    "02": "few-clouds",
    "03": "few-clouds",
    "04": "broken-clouds",
    "09": "heavy-rain",
    "10": "light-rain",
    "11": "thunder-storm",
    "13": "snow",
    "50": "fog",
  }
  let weatherClass
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars]
  } else if (firstChar === "0" && lastChar === "n") {
    weatherClass = "night"
  } else {
    weatherClass = "clear-sky"
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
  const feels = createElement("div", "feels", `Temp. Percepita ${Math.round(Number(weatherObj.current.feels_like))}°`)
  const maxTemp = createElement("div", "maxtemp", `Massime ${Math.round(Number(weatherObj.daily[0].temp.max))}°`)
  const minTemp = createElement("div", "mintemp", `Minime ${Math.round(Number(weatherObj.daily[0].temp.min))}°`)
  const humidity = createElement("div", "humidity", `Umidità ${Math.round(Number(weatherObj.current.humidity))}%`)
  const wind = createElement("div", "wind", `Venti ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`)
  return [icon, temp, description, feels, maxTemp, minTemp, humidity, wind]
}

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElement("div", "icon")
  iconDiv.id = "icon"
  const myIcon = translateIconToMyIcon(icon)
  myIcon.ariaHidden = true
  myIcon.title = altText
  iconDiv.appendChild(myIcon)
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

const translateIconToMyIcon = (icon) => {
  const img = document.createElement("img")
  const firstTwoChars = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        img.src = `./animated-icons/clear-day.svg`
      } else {
        img.src = `./animated-icons/clear-night.svg`
      }
      break;
    case "02":
      if (lastChar === "d") {
        img.src = `./animated-icons/partly-cloudy-day.svg`
      } else {
        img.src = `./animated-icons/partly-cloudy-night.svg`
      }
      break;
    case "03":
      img.src = `./animated-icons/overcast.svg`
      break;
    case "04":
      img.src = `./animated-icons/extreme.svg`
     break;
    case "09":
      img.src = `./animated-icons/extreme-rain.svg`
      break;
    case "10":
      if (lastChar === "d") {
        img.src = `./animated-icons/partly-cloudy-day-rain.svg`
      } else {
        img.src = `./animated-icons/partly-cloudy-night-rain.svg`
      }
      break;
    case "11":
      img.src = `./animated-icons/thunderstorms-extreme.svg`
      break;
    case "13":
      img.src = `./animated-icons/overcast-snow.svg`
      break;
    case "50":
      img.src = `./animated-icons/overcast-fog.svg`
      break;
    default:
      img.src = `./animated-icons/clear-night.svg`
  }
  return img
}

const displayCurrentConditions = (currentConditionArray) => {
  const currentConditionContainer = document.getElementById("currentForecast--conditions")
  currentConditionArray.forEach((currentCondition) => {
    currentConditionContainer.appendChild(currentCondition)
  })
}

const displaySixDayForecast = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const displayForecastArray = createDailyForecastDivs(weatherJson.daily[i])
    displayDailyForecast(displayForecastArray)
  }
}

const createDailyForecastDivs = (dayWeather) => {
  const dayAbbreviationText = getDayAbbreviation(dayWeather.dt)
  const dayAbbreviation = createElement(
    "p",
    "dayAbbreviation",
    dayAbbreviationText
  )
  const dayIcon = createDailyForecastIcon(
    dayWeather.weather[0].icon,
    dayWeather.weather[0].description
  )
  const dayHigh = createElement(
    "p",
    "dayHigh",
    `${Math.round(Number(dayWeather.temp.max))}°`
  )
  const dayLow = createElement(
    "p",
    "dayLow",
    `${Math.round(Number(dayWeather.temp.min))}°`
  )
  return [dayAbbreviation, dayIcon, dayHigh, dayLow]
}

const getDayAbbreviation = (data) => {
  const dateObj = new Date(data * 1000)
  const utcString = dateObj.toUTCString()
  return utcString.slice(0, 3).toUpperCase()
}

const createDailyForecastIcon = (icon, altText) => {
  const iconDiv = createElement("div", "icon")
  iconDiv.id = "icon"
  const myIcon = translateIconToMyIcon(icon)
  myIcon.ariaHidden = true
  myIcon.title = altText
  iconDiv.appendChild(myIcon)
  return iconDiv
}

const displayDailyForecast = (displayForecastArray) => {
  const dayDiv = createElement("div", "forecastDay")
  displayForecastArray.forEach((element) => {
    dayDiv.appendChild(element)
  })
  const dailyForecastContainer = document.getElementById(
    "dailyForecast--contents"
  )
  dailyForecastContainer.appendChild(dayDiv)
}