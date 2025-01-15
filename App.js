import React, { useEffect } from "react";
import { ScrollView, ImageBackground, FlatList, TouchableOpacity, TextInput, SafeAreaView, Image } from "react-native";
import CurrentForecast from "./components/CurrentForecast";
import styled from "styled-components/native";
import config from "./config";
import bgImg from "./assets/4.png";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { setWeatherData, setForecastData, setSelectedCity, setSearchQuery, setFilteredCities, setShowCities } from './store/weatherSlice';
import cities from "./cities.json";

const AppContent = () => {
  const dispatch = useDispatch();
  const { weatherData, forecastData, selectedCity, searchQuery, filteredCities, showCities } = useSelector(state => state.weather);

  // Mevcut hava durumu ve 5 günlük tahmin verisini çekme
  useEffect(() => {
    if (selectedCity) {
      const fetchWeatherData = async () => {
        const res = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.city}&APPID=${config.API_KEY}&units=metric`
        );
        const result = await res.json();        
        dispatch(setWeatherData([{ city: selectedCity.city, country: selectedCity.country, weather: result.list[0] }]));

        // 5 günlük hava durumu tahmini verisini işleyin
        const dailyForecast = result.list.filter((item, index) => index % 8 === 0); // Her 8. veriyi alıyoruz (günlük tahminler)
        dispatch(setForecastData(dailyForecast));
      };

      fetchWeatherData();
    }
  }, [selectedCity]);

  // Şehir arama filtresi
  useEffect(() => {
    dispatch(setFilteredCities(
      cities.filter(city =>
        city.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ));
  }, [searchQuery]);

  const handleCitySelect = (city) => {
    dispatch(setSelectedCity(city));
    dispatch(setShowCities(false));
  };

  // 5 günlük hava tahminini göstermek için
  const renderDailyForecast = () => {
    return forecastData.map((day, index) => {
      const date = new Date(day.dt * 1000); // Unix timestamp'tan tarihi elde ediyoruz
      const weekday = date.toLocaleString("en-US", { weekday: "long" }); // Gün ismini alıyoruz
      const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`; // Hava durumu simgesini alıyoruz      
      const minTemp = day.main.temp_min.toFixed(1); // En düşük sıcaklık
      const maxTemp = day.main.temp_max.toFixed(1); // En yüksek sıcaklık

      return (
        <DailyForecastItem key={index}>
          <Text>{weekday}</Text>
          <Image source={{ uri: icon }} style={{ width: 30, height: 30 }} />
          <Text>{minTemp}°C / {maxTemp}°C</Text>
        </DailyForecastItem>
      );
    });
  };

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <SearchContainer>
          <SearchInput
            placeholder="Search city..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            onFocus={() => dispatch(setShowCities(true))}
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
            {forecastData.length > 0 && renderDailyForecast()}
          </FutureForecastContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

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
  margin-top: 50px;
  width: 100%;
`;

const DailyForecastItem = styled.View`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.Text`
  color: black;
  font-size: 16px;
`;

export default App;
