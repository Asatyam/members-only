#! /usr/bin/env node


// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, available, price, category) {
  const itemDetail = {
    name: name,
    description: description,
    available: available,
    price: price,
    category: category,
  };

  const item = new Item(itemDetail);

  await item.save();
  items.push(item);
  console.log(`Added items: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await categoryCreate('smartphones', 'You can see the all the smartphones');
  await categoryCreate('laptops', 'You can see the all the laptops');
  await categoryCreate('earphones', 'You can see the all the earphones');
}

async function createItems() {
  console.log('Adding Items');
  await Promise.all([
    itemCreate('Apple Iphone 14 Pro ', 'Pro Beyond', 6, 1200, categories[0]),
    itemCreate(
      'Samsung Galaxy S23 Ultra',
      '6.8” Dynamic AMOLED 2X Infinity-O QHD+ Edge Screen. 120Hz Adaptive Refresh Rate',
      12,
      1400,
      categories[0]
    ),
    itemCreate(
      'Apple Macbook Air M2',
      'Apple 2022 MacBook Air Laptop with M2 chip: 34.46 cm (13.6-inch) Liquid Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard, 1080p FaceTime HD Camera. Works with iPhone/iPad; Space Grey',
      4,
      1200,
      categories[1]
    ),
    itemCreate(
      'HP Spectre X360',
      'HP Spectre X360 12th Gen Intel Evo Core i5 13.5 inch(34.3 cm) WUXGA, Multitouch, 400 nits, Gorilla Glass, 2-in-1 Laptop (16GB RAM/512GB SSD/5MP IR Camera/FPR/B&O/Pen/Eye Safe/1.34 Kg), ef0057TU',
      8,
      1000,
      categories[1]
    ),
    itemCreate(
      'Apple AirPods (2nd Generation)',
      'Simply the best',
      12,
      200,
      categories[2]
    ),
    itemCreate(
      'Sony WF-1000XM4',
      'Sony WF-1000XM4 Industry Leading Active Noise Cancellation True Wireless (TWS) Bluetooth 5.2 Earbuds with 36hrs Battery Life - Black | ',
      2,
      250,
      categories[2]
    ),
  ]);
}
