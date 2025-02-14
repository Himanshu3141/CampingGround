const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground'); 
const joi = require('joi');
const isLoggedIn = require('../middleware/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds'); 

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


router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
    if (!req.user) {
      req.flash('error', 'You must be logged in to create a campground.');
      return res.redirect('/login');
    }

    const { title, location, price, description } = req.body.campground;
    const image = req.file.path;  


    const newCampground = new Campground({
      title,
      location,
      price,
      description,
      image,  
      author: req.user._id,  
    });

  
    await newCampground.save();
    

    res.redirect(`/campgrounds/${newCampground._id}`);
  }));

router.get('/new', isLoggedIn, campgrounds.rendernewform);

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.rendereditform));

module.exports = router;
