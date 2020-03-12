const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception! Application will shutdown');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('CONNECTED TO DB'));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`SERVER IS RUNNING AT PORT ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection! Application will shutdown...');
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully.');

  server.close(() => console.log('Process Terminated'));
});
