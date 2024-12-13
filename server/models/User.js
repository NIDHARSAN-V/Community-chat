const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    index: true,
    validate: [isEmail, "Invalid Email"]
  },
  password: {
    type: String,
    required: [true, "Can't be blank"]
  },
  picture: {
    type: String
  },
  newMessages: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    default: 'online'
  }
}, {
  minimize: false,
  timestamps: true
});

// Pre-save middleware to hash the password
UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// Method to return user object without password
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  // Ensure password is a string
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  // Ensure user.password is a string
  if (typeof user.password !== 'string') {
    throw new Error('Stored password must be a string');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  return user;
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
