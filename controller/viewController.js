const Resort = require('./../models/resortModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  if (req.query.search) {
    const resorts = await Resort.find({
      slug: { $regex: '.*' + req.query.search + '.*' }
    }).sort('name');

    return res.status(200).render('overview', {
      title: 'All Resorts',
      resorts
    });
  }

  const resorts = await Resort.find().sort('name');

  return res.status(200).render('overview', {
    title: 'All Resorts',
    resorts
  });
});

exports.getResort = catchAsync(async (req, res, next) => {
  const resort = await Resort.findOne({ slug: req.params.slug });

  if (!resort) {
    return next(new AppError('No Resort Found!', 404));
  }

  res.status(200).render('resort', {
    title: `${resort.name}`,
    resort
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account'
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render('signup', {
    title: 'New Account'
  });
};

exports.getForgetPass = (req, res) => {
  res.status(200).render('forgetpass', {
    title: 'Forgot Password'
  });
};

exports.getResetPass = (req, res) => {
  res.status(200).render('resetpass', {
    title: 'Forgot Password',
    tokenId: req.params.token
  });
};

exports.getAccount = catchAsync(async (req, res, next) => {
  const resorts = await Resort.find()
    .select('name slug')
    .sort('name');

  res.status(200).render('account', {
    title: 'Manage Your Account.',
    resorts
  });
});

exports.getEditResort = catchAsync(async (req, res, next) => {
  const resort = await Resort.findOne({ slug: req.params.slug });

  if (!resort) {
    return res.redirect('/');
  }

  res.status(200).render('editResort', {
    title: `Edit ${resort.name}`,
    resort
  });
});

exports.editResort = catchAsync(async (req, res, next) => {
  const updatedResort = await Resort.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedResort) {
    return res.redirect('/');
  }

  res.status('200').json({
    status: 'Success',
    data: {
      resort: updatedResort
    }
  });
});
