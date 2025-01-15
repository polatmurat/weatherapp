import React from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";

const CurrentForecast = ({ currentWeather, city, country }) => {
  if (!currentWeather || !currentWeather.weather) {
    return <Text>Loading...</Text>;
  }

  const { main, weather, wind, sys } = currentWeather;
  const weatherInfo = weather[0];

  return (
    <Container>
      <CityText>{city}, {country}</CityText>
      <WeatherText>{weatherInfo.main}</WeatherText>
      <WeatherDescription>{weatherInfo.description}</WeatherDescription>
      <TemperatureText>{Math.round(main.temp)}°C</TemperatureText>
      <WeatherIcon
        source={{ uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png` }}
      />
      <AdditionalInfo>
        <Text style={{color: '#fff'}}>Humidity: {main.humidity}%</Text>
        <Text style={{color: '#fff'}}>Wind: {wind.speed} m/s</Text>
        <Text style={{color: '#fff'}}>Pressure: {main.pressure} hPa</Text>
      </AdditionalInfo>
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
  margin: 20px;
`;

const CityText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
`;

const WeatherText = styled.Text`
  font-size: 20px;
  color: #fff;
`;

const WeatherDescription = styled.Text`
  font-size: 16px;
  color: gray;
`;

const TemperatureText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: #fff;
`;

const WeatherIcon = styled.Image`
  width: 100px;
  height: 100px;
`;

const AdditionalInfo = styled.View`
  margin-top: 10px;
  color: #000;
`;

export default CurrentForecast;
