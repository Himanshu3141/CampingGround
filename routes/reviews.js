const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const joi = require('joi');
const Campground = require('../models/campground');
const Review = require('../models/review');
const  isLoggedIn  = require('../middleware');
const validatecampground=require('../middleware')
const reviews=require('../controllers/reviews');

router.post('/', isLoggedIn,validatecampground,catchAsync(reviews.createreview));

router.delete('/:reviewId', isLoggedIn,validatecampground,catchAsync(reviews.deletereview));

module.exports = router;
