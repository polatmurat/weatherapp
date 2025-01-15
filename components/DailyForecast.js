import React from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";

const DailyForecast = ({ day }) => {
  const date = new Date(day.dt * 1000);
  const weatherInfo = day.weather[0];
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const minTemp = Math.round(day.temp.min);
  const maxTemp = Math.round(day.temp.max);

  return (
    <Container>
      <DayText>{dayName}</DayText>
      <WeatherIcon
        source={{ uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png` }}
      />
      <TemperatureText>{minTemp}°C - {maxTemp}°C</TemperatureText>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  width: 100%;
`;

const DayText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const TemperatureText = styled.Text`
  font-size: 16px;
`;

export default DailyForecast;
