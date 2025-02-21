import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string,
    public date: string,
    public wind: number,
    public humidity: number
  ) {}
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.API_KEY;
  private cityName: string;

  constructor() {
    this.cityName = '';
  }

  private async fetchLocationData(query: string): Promise<any> {
    console.log(`Fetching location data for query: ${query}`);
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    console.log('Location Data:', data);
    return data;
  }

  private destructureLocationData(locationData: any): Coordinates {
    console.log('Destructuring location data:', locationData);
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  private buildGeocodeQuery(): string {
    return `${this.cityName}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    console.log(`Fetching weather data for coordinates: ${JSON.stringify(coordinates)}`);
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    console.log('Weather Data:', data);
    return data;
  }

  // Build buildForecastArray method
  private buildForecastArray(weatherData: any): Weather[] {
    console.log('Building forecast array from weather data:', weatherData);
    const dailyData = weatherData.list.filter((data: any) => data.dt_txt.includes('12:00:00'));
    const forecastArray = dailyData.slice(0, 5).map((data: any) => {
      const { main, weather, wind, dt_txt } = data;
      const date = dt_txt.split(' ')[0]; // Extract only the date part
      return new Weather(main.temp, weather[0].description, weather[0].icon, date, wind.speed, main.humidity);
    });


    const todayWeather = weatherData.list[0];
    const { main, weather, wind, dt_txt } = todayWeather;
    const todayDate = dt_txt.split(' ')[0];
    forecastArray.unshift(new Weather(main.temp, weather[0].description, weather[0].icon, todayDate, wind.speed, main.humidity));

    return forecastArray;
  }


  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.buildForecastArray(weatherData);
  }
}

export default new WeatherService();
