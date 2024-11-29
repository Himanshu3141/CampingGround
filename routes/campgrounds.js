const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground'); 
const joi = require('joi');
const isLoggedIn = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds'); // Import the campgrounds controller

const validateCampground = (req, res, next) => {
  const campgroundSchema = joi.object({
      campground: joi.object({
          title: joi.string().required(),
          price: joi.number().min(0).required(),
          image: joi.string().required(),
          location: joi.string().required(),
          description: joi.string().required(),
      }).required()
  });

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400); 
  }
  next();
}

const isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

// Route for creating a campground with image upload
router.route('/')
  .get(catchAsync(campgrounds.index)) // Use the 'index' method from campgrounds controller
  .post(isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
    // Ensure user is logged in
    if (!req.user) {
      req.flash('error', 'You must be logged in to create a campground.');
      return res.redirect('/login');
    }

    const { title, location, price, description } = req.body.campground;
    const image = req.file.path;  // Cloudinary image URL

    // Create a new campground with the image URL and user ID
    const newCampground = new Campground({
      title,
      location,
      price,
      description,
      image,  // Store the Cloudinary image URL
      author: req.user._id,  // Use the logged-in user's ID
    });

    // Save the campground to the database
    await newCampground.save();
    
    // Redirect to the newly created campground's page
    res.redirect(`/campgrounds/${newCampground._id}`);
  }));

router.get('/new', isLoggedIn, campgrounds.rendernewform);

// Route for editing an existing campground
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.rendereditform));

module.exports = router;
