const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Db connection succesfull!');
  });

// Read json file

const tours = JSON.parse(
  fs.readFileSync('./starter/dev-data/data/tours.json', 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync('./starter/dev-data/data/users.json', 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync('./starter/dev-data/data/reviews.json', 'utf-8')
);

// Import the data into the db

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully imported!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Deleting all data all together

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
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
