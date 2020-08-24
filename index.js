require('dotenv').config()
const axios = require('axios').default;

const isValidUSZip = sZip => /^\d{5}(-\d{4})?$/.test(sZip)

// isZipType can be further improved to handle postal codes for other countries as well
const isZipType = location => isValidUSZip(location)

const getWeather = async location => {
  const apiKey = process.env.WEATHER_API
  let BaseURL = "http://api.openweathermap.org/data/2.5/weather"
  let URL = `${BaseURL}?${isZipType(location) ? `zip=${location}` : `q=${location}`}&appid=${apiKey}`
  try {
    const weatherResponse = await axios.get(URL)
    if (weatherResponse.status === 200) {
      return weatherResponse.data
    }
  } catch (error) {
    console.error("Error in response")
    if (error.response.status == "404") {
      console.error(`Location not found: ${location}`)
    } else {
      console.error(error)
    }
  }
}

const getLocalTime = timezone => {
  var current = new Date()
  current.setUTCSeconds(current.getUTCSeconds() + timezone)
  return current.toUTCString()
}

function main() {
  const args = process.argv.splice(2)
  args.forEach(elem => {
    getWeather(elem)
      .then(res => {
        if (res === undefined || res === null) {
          console.log(`Cannot find weather and timezone data for location ${elem}`)
          return
        } else {
          const time = getLocalTime(res.timezone)
          console.log(`At location ${elem}, \nWeather is ${res.weather[0].main} at local time: ${time}`)
        }
      })
  });
}


main()
