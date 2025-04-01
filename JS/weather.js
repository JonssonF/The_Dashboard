export async function GetWeather() {
  const apiKey = "f84b4625198645a7afe132443251403";
  const weatherElement = document.getElementById("weather-info");

  weatherElement.classList.add("loading");
  weatherElement.innerHTML = "Loading weather...";

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(new Error("Could not get location"))
      );
    });

    const lat = position.latitude;
    const lon = position.longitude;

    const detailedLocation = await getDetailedLocation(lat, lon);

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    console.log(data);

    const locationName = detailedLocation || data.location.name;
    console.log(locationName);
    const forecast = data.forecast.forecastday;
    let forecastHTML = `<h3>${locationName}</h3><ul>`;

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

async function getDetailedLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location details");
    }
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.warn("Warning: Could not fetch detailed location.");
    return null;
  }
}
