const express = require('express');
const seeder = require('./database/seeder');
const performanceRoutes = require('./routes/performance');

const app = express();

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // Health check
  app.get('/health', (req, res) => {
    res.send('Hello World');
  });

  app.use('/performance', performanceRoutes);

  app.use((req, res) => {
    res.status(404).json({ isError: true, message: 'Not Found' });
  });

  app.use((err, req, res, next) => {
    console.log(err);
    
    res.status(500).json({ isError: true, message: 'Internal Server Error' });
  });
}

start();

module.exports = app;