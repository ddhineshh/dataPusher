const express = require('express');
const { sequelize } = require('./config/database');
const accountRoutes = require('./routes/accountService');
const destinationRoutes = require('./routes/destinationService');
const incomingDataRoutes = require('./routes/incomingData');

const app = express();
const port = 3000;


//Logger
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };

//Middleware
app.use(express.json());
app.use(logRequest)


// Routes
app.use('/accounts', accountRoutes);
app.use('/destinations', destinationRoutes);
app.use('/server/incoming_data', incomingDataRoutes);


//DB connection
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});