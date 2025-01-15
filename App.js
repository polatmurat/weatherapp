import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, FlatList, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import CurrentForecast from "./components/CurrentForecast";
import DailyForecast from "./components/DailyForecast";
import styled from "styled-components/native";
import config from "./config";
import bgImg from "./assets/4.png";
import cities from "./cities.json";

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ city: "Adana", country: "Turkey" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showCities, setShowCities] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      const fetchWeatherData = async () => {
        const res = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${selectedCity.city}&APPID=${config.API_KEY}`
        );
        const result = await res.json();
        setWeatherData([{ city: selectedCity.city, country: selectedCity.country, weather: result }]);

        const forecastRes = await fetch(
          `http://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`
        );
        const forecastResult = await forecastRes.json();
        setForecastData(forecastResult.daily.slice(1, 6));
      };

      fetchWeatherData();
    }
  }, [selectedCity]);

  useEffect(() => {
    setFilteredCities(
      cities.filter(city =>
        city.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCities(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
          <SearchContainer>
            <SearchInput
              placeholder="Search city..."
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setShowCities(true)}
            />
          </SearchContainer>
          {showCities && (
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item.city}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCitySelect(item)}>
                  <CityItem>{item.city}, {item.country}</CityItem>
                </TouchableOpacity>
              )}
            />
          )}
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
              {forecastData.length > 0 && (
                forecastData.map((day, index) => (
                  <DailyForecast key={index} day={day} />
                ))
              )}
            </FutureForecastContainer>
          </ScrollView>
        </ImageBackground>
      </Container>
    </SafeAreaView>
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
  width: 100%;
`;

const CityItem = styled.Text`
  padding: 10px;
  font-size: 18px;
  color: white;
  text-align: center;
`;

const SearchInput = styled.TextInput`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  font-size: 18px;
  color: black;
  width: 70%;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px;
  width: 100%;
`;

export default App;
