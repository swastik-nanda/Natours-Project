const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const tours = await Tour.find();
  // 2) Build a template
  // 3) Render the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get data for the requested tour(including reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }
  // 2) Build the template
  // 3) render template using data from 1)
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour: tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getUserAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'User Page',
  });
};
