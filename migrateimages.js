const mongoose = require('mongoose');
const Campground = require('./models/campground');  // Adjust the path to your model
const dotenv = require('dotenv');

dotenv.config(); // To use environment variables like MONGODB_URI

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Increase timeout
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.log('Failed to connect to MongoDB', err);
});

async function migrateImages() {
  try {
    const campgrounds = await Campground.find({});
    console.log(`Found ${campgrounds.length} campgrounds`);

    for (let campground of campgrounds) {
      if (campground.images && campground.images.length > 0) {
        for (let image of campground.images) {
          if (image.url) {
            console.log(`Migrating image for campground: ${campground._id}`);
            // Perform image migration logic here, e.g., update image URLs in Cloudinary
          }
        }
      }
    }

    console.log('Migration completed');
  } catch (err) {
    console.log('Error during migration', err);
  } finally {
    mongoose.connection.close();
  }
}

migrateImages();
