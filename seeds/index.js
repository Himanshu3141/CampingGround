const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
const { getRandomDescription } = require('./descripton')


const accessKey = process.env.PEXELS_API_KEY; 
const apiUrl = `https://api.pexels.com/v1/search?query=camping&per_page=1`;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("DATABASE CONNECTED!!");
}

const fetchImage = async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: accessKey
      }
    });
    return response.data.photos[0].src.original;
  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://via.placeholder.com/300'; 
  }
};

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => { 
  for (let i = 0; i < 10; i++) { 
    const price = Math.floor(Math.random() * 20) + 10;
    const random = Math.floor(Math.random() * cities.length);

    const image = await fetchImage(); 

    const camp = new Campground({
      author: '673df03f4a39763a20e17996', 
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: getRandomDescription(), 
      price,
      image
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
