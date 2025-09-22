'use strict';

const express = require('express');
const seeder = require('./database/seeder');
const performanceRoutes = require('./routes/performance');

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

  app.use('/performance', performanceRoutes);

  app.use((req, res) => {
    res.status(404).send('Not Found');
  });

  app.use((err, req, res, next) => {
    console.log(err);

    res.status(500).send('Internal Server Error');
  });

  app.listen(PORT, HOST);
  
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
