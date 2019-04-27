'use strict';

// Load environment variables from the .env file
require('dotenv').config();

// Application Dependecies
const express = require('express');
const cors = require('cors'); //Cross Origin Resource Sharing
// const superagent = require('superagent');
const pg = require
// Application Setup
const app = express();
app.use(cors()); //tell express to use cors
const PORT = process.env.PORT || 3000;

//MAC: DATABASE_URL=postgres://localhost:5432/city_expolorer
//WINDOWS:  DATABASE_URL=postgres://<user-name>:<password>/@localhost:5432/city_explorer

// Connect to the Database

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

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

//  What we need to do to refactor for SQL storage
//  1. We need to check the database to see if the location exists
//  a. If it exists => get the location from the database
//  b. Return the location info to the front-end

//  2. If the location is not in the DB
//  a. Get the location from the API
//  b. Run the data through the constructor
//  c. Save it to the Database
//  d. Add the newly added location id to the location object
//  e. Return the location to the front-end.



//function to get local data
// function searchToLatLong(request, response) {
//   try {
//     const geoData = require('./data/geo.json');
//     console.log(request.query.data);
//     const location = new Location(geoData);
//     response.send(location);
//   }
//   catch (error) {
//     console.error(error);
//     response.status(500).send('Status: 500. So sorry, something went wrong.');
//   }



//   console.log(location);
// }

function searchToLatLong(request, response) {
  let query = request.query.data;

  // Define the search query
  let sql = `SELECT * FROM locations WHERE search_query=$1;`;
  let values = [query];

  // Make the query of the Database
  client.query(sql, values)
    .then(results => {
    //  Did the DB return any info?
      if (results.rowCount > 0) {
        console.log('result from Database', result.rows[0]);
        response.send(result.rows[0]);

      } else {
      // otherwise go get the data from the API
        const usl = `https://maps.googleapis.com/`

        superagent.get(url)
          .then(result => {
            if (!result.body.results.length) {throw 'NO DATA' }
            else {
              let location = new Location(query, result.body.results[0]);

              let newSQL = `INSERT INTO locations (search_query, formatted_address, latitude, longitude) VALUES ($1, $2, $e, $4) RETURNING ID;`;
              let newValues = Object.values(location);

              client.query(newSQL, newValues)
                .then(data =>  {
                // attach the returning id to the location object
                  location.id = data.rows[0]
                })
            }
          })
      }
    })



}

// Location for location data
function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

// Start building your weather function and constructor here
// Convert to a .map function

function getWeather(request, response) {
  let query = request.query.data.id;
}

function getWeather () {
  const darkskyData = require('./data/darksky.json');
  console.log('does darksky work', darkskyData);
  const weatherSummaries = darkskyData.daily.data.map(day => new Weather(day));
  console.log(weatherSummaries);
  return weatherSummaries;

  // darkskyData.daily.data.forEach(day => {
  //   weatherSummaries.push(new Weather(day));
  // });
  // return weatherSummaries;
}

// Weather forecast constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

