export async function GetWeather() {
  const apiKey = "f84b4625198645a7afe132443251403";
  const weatherElement = document.getElementById("weather-info");

  weatherElement.classList.add("loading");
  weatherElement.innerHTML = "Loading weather...";

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Stockholm&days=3`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    console.log(data);

    const forecast = data.forecast.forecastday;
    let forecastHTML = "<ul>";

    forecast.forEach((day) => {
      const date = new Date(day.date);
      const dayOfWeek = date.toLocaleDateString("sv-SV", { weekday: "long" });
      const temperature = day.day.avgtemp_c;
      const condition = day.day.condition.text;
      const icon = day.day.condition.icon;
      /*----------------------------------------------------------------------*/
      forecastHTML += `
      <li>
  <div><strong>${dayOfWeek}</strong></div>
  <div><img src="https:${icon}" alt="${condition}" style="width: 50px; height: 50px;"></img></div>
  <div>${temperature}°C - ${condition}</div>
</li>
      `;
    });

    forecastHTML += "</ul>";
    weatherElement.classList.remove("loading", "error");
    weatherElement.innerHTML = forecastHTML;
  } catch (error) {
    console.error("Error: Could not load weather data.", "error");
    weatherElement.classList.remove("loading");
    weatherElement.classList.add("error");
    weatherElement.innerHTML = "Could not load weather data.";
  }
}
