import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground } from "react-native";
import ForecastSearch from "./components/ForecastSearch";
import CurrentForecast from "./components/CurrentForecast";
import DailyForecast from "./components/DailyForecast";
import styled from "styled-components/native";
import config from "./config";
import bgImg from "./assets/4.png";

const topCapitals = [
  { city: "Tokyo", country: "Japan" },
  { city: "Delhi", country: "India" },
  { city: "Beijing", country: "China" },
  { city: "Washington", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Paris", country: "France" },
  { city: "Berlin", country: "Germany" },
  { city: "Ottawa", country: "Canada" },
  { city: "Canberra", country: "Australia" },
  { city: "Brasilia", country: "Brazil" }
];

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await Promise.all(
        topCapitals.map(async (capital) => {
          const res = await fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${capital.city}&APPID=${config.API_KEY}`
          );
          const result = await res.json();          
          return { city: capital.city, country: capital.country, weather: result };
        })
      );
      setWeatherData(data);
    };

    fetchWeatherData();
  }, []);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <FutureForecastContainer>
            {weatherData.length > 0 ? (
              weatherData.map((data, index) => (
                <CurrentForecast
                  key={index}
                  currentWeather={data.weather}
                  city={data.city}
                  country={data.country}
                />
              ))
            ) : (
              <NoWeather>No Weather to show</NoWeather>
            )}
          </FutureForecastContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;
