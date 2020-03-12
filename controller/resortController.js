const multer = require('multer');
const sharp = require('sharp');

const Resort = require('./../models/resortModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const multerStorage = multer.memoryStorage();

// set-up multer filter that accepts only image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// configure multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadResortImages = upload.array('images', 4);
exports.uploadResortImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]);

exports.resizeResortImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  const newImageCover = `resorts-${req.body.name
    .split(' ')
    .join('-')
    .toLowerCase()}-${Date.now()}-cover.jpeg`;

  const updateImageCover = `resorts-${req.params.id}-${Date.now()}-cover.jpeg`;

  // for imageCover
  req.body.imageCover = req.body.name ? newImageCover : updateImageCover;

  await sharp(req.files.imageCover[0].buffer)
    // await sharp(req.files.images[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/resorts/${req.body.imageCover}`);

  // req.files.images.shift();

  // for images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const newImagePicture = `resorts-${req.body.name
        .split(' ')
        .join('-')
        .toLowerCase()}-${Date.now()}-${i + 1}.jpeg`;

      const updateImagePicture = `resorts-${req.params.id}-${Date.now()}-${i +
        1}.jpeg`;

      const filename = req.body.name ? newImagePicture : updateImagePicture;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/resorts/${filename}`);

      req.body.images.push(filename);
    })
  );
  // console.log(req.files);

  next();
});

// // for single upload
// upload.single('fieldName') // req.file
// // for multiple upload with same fieldName.
// upload.array('fieldName', numOfFile) // req.files
// // mix upload
// upload.fields([{name: 'fieldName', maxCount: numOfFile}, {name:'fieldName2': 'fieldName', maxCount: numOfFile}]) // req.files

exports.getAllResorts = catchAsync(async (req, res, next) => {
  const resorts = await Resort.find();

  res.status(200).json({
    status: 'Success',
    data: {
      results: resorts.length,
      resorts
    }
  });
});

exports.createResort = catchAsync(async (req, res, next) => {
  const newResort = await Resort.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      resort: newResort
    }
  });
});

exports.getResort = catchAsync(async (req, res, next) => {
  const resort = await Resort.findById(req.params.id);

  if (!resort) {
    return next(new AppError('There are no resort with that ID.', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      resort
    }
  });
});

exports.updateResort = catchAsync(async (req, res, next) => {
  const resort = await Resort.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!resort) {
    return next(new AppError('There are no resort with that ID.', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      resort
    }
  });
});

exports.deleteResort = catchAsync(async (req, res, next) => {
  const resort = await Resort.findByIdAndDelete(req.params.id);

  if (!resort) {
    return next(new AppError('There are no resort with that ID.', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
