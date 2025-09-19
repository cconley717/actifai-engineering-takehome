'use strict';

const express = require('express');
const seeder = require('./database/seeder');
const performance = require('./database/performance');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // App
  const app = express();

  // Health check
  app.get('/health', (req, res) => {
    res.send('Hello World');
  });

  app.get('/performance', async (req, res) => {
    let year = req.query.year;
    let month = req.query.month;

    if(year == null) {
      res.send('Year is absent from the query.');
    }
    else if(month == null) {
      res.send('Month is absent from the query.');
    }
    else {
      year = parseInt(year, 10);
      month = parseInt(month, 10);

      if (Number.isNaN(year) || Number.isNaN(month)) {
        res.send('Year and month parameters must be numbers.');
      }
      else if (year < 0) {
        res.send("Invalid year, must be greater than 0.");
      }
      else if (month < 1 || month > 12) {
        res.send("Invalid month, must be between 1 and 12, inclusive.");
      }
      else {
        const data = await performance.get(year, month);

        res.send(data);
      }
    }
  });

  app.listen(PORT, HOST);
  
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
