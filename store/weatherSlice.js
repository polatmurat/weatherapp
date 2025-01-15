import { createSlice } from '@reduxjs/toolkit';
import cities from '../cities.json';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    weatherData: [],
    forecastData: [],
    selectedCity: { city: "Adana", country: "Turkey" },
    searchQuery: "",
    filteredCities: cities,
    showCities: false,
  },
  reducers: {
    setWeatherData: (state, action) => {
      state.weatherData = action.payload;
    },
    setForecastData: (state, action) => {
      state.forecastData = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilteredCities: (state, action) => {
      state.filteredCities = action.payload;
    },
    setShowCities: (state, action) => {
      state.showCities = action.payload;
    },
  },
});

export const {
  setWeatherData,
  setForecastData,
  setSelectedCity,
  setSearchQuery,
  setFilteredCities,
  setShowCities,
} = weatherSlice.actions;

export default weatherSlice.reducer;
