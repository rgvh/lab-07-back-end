'use strict';

// Load environment variables from the .env file
require('dotenv').config();

// Application Dependecies
const express = require('express');
const cors = require('cors'); //Cross Origin Resource Sharing
// const superagent = require('superagent');

// Application Setup
const app = express();
app.use(cors()); //tell express to use cors
const PORT = process.env.PORT || 3000;

// Incoming API Routes

// app.get('/testing', (request, response) => {
//   console.log('found the testing route')
//   response.send('<h2>HELLO WORLD</h2>')
// });

app.get('/location', searchToLatLong);
//   try {
//     const locationData = searchToLatLong(request.query.data);
//     response.send(locationData);
//   }
//   catch (error) {
//     console.error(error);
//     response.status(500).send('Status: 500. So sorry, something went wrong.');
//   }
// });

app.get('/weather', (request, response) => {
  //console.log('From weather request', request.query.data.latitude);
  // call a get weather function
  // process the data from the darksky json- you need a constructor
  // return the results to the client
  try {
    const weatherData = getWeather();
    response.send(weatherData);
  }
  catch(error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// Helper Functions

//function to get local data
function searchToLatLong(request, response) {
  try {
    const geoData = require('./data/geo.json');
    console.log(request.query.data);
    const location = new Location(geoData);
    response.send(location);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }



  console.log(location);
}

// Location for location data
function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

// Start building your weather function and constructor here
// Convert to a .map function

function getWeather () {
  const darkskyData = require('./data/darksky.json');
  console.log('does darksky work', darkskyData);
  const weatherSummaries = [];

  darkskyData.daily.data.forEach(day => {
    weatherSummaries.push(new Weather(day));
  });
  return weatherSummaries;
}

// Weather forecast constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
