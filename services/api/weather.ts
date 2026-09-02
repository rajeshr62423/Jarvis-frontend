export type CurrentWeather = {
  temperatureC: number;
  time: string;
};

/** Open-Meteo current-weather forecast — free, no API key required. */
export async function fetchCurrentTemperature(
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=celsius`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }
  const data = await response.json();
  return {
    temperatureC: data.current.temperature_2m,
    time: data.current.time,
  };
}
