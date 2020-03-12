const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please provide your email.'],
      validate: [validator.isEmail, 'Please provide a valid email.']
    },
    password: {
      type: String,
      select: false,
      minlength: [8, 'Password should be 8 characters or longer.'],
      required: [true, 'Please provide your password.']
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function(val) {
          return val === this.password;
        },
        message: 'Password are not the same.'
      }
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role is either: user, admin.'
      },
      default: 'user'
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.isUserChangedPassword = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const convertedPasswordChangedAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < convertedPasswordChangedAt;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
