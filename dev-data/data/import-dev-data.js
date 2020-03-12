const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Resort = require('../../models/resortModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log('CONNECTED TO DB'));

const resorts = JSON.parse(
  fs.readFileSync(`${__dirname}/resort.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Resort.create(resorts);
    console.log('Data Successfully created.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Resort.deleteMany();
    console.log('Data Successfully deleted.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
