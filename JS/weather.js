export async function GetWeather() {
  const apiKey = "f84b4625198645a7afe132443251403";

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Stockholm`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    console.log(data);

    const temperature = data.current.temp_c;
    const condition = data.current.condition.text;

    const weatherElement = document.getElementById("weather-info");
    weatherElement.innerHTML = `It is currently ${temperature}°C with ${condition} in Stockholm.`;
  } catch (error) {
    console.error("Error: Could not load weather data.", error);
    const weatherInfo = document.getElementById("weather-info");
    weatherInfo.innerHTML = "Could not load weather data.";
  }
}
