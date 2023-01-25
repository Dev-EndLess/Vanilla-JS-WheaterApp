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