const User = require("../User/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");

// Register Controller
const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Cek jika email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 1, message: "Email sudah terdaftar" });
    }

    // Buat user baru
    const newUser = new User({ email, password, username });
    await newUser.save();

    res.status(201).json({
      message: "User successfully registered",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Local Strategy for Passport
const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -token"
    );
    if (!user)
      return done(null, false, { message: "Email or Password is incorrect" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "Email or Password is incorrect" });
    }

    const { password: userPassword, ...userWithoutPassword } = user.toJSON();
    return done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
};

// Login Controller
const login = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) return next(err);
        if (!user)
          return res.status(401).json({ error: 1, message: info.message });

        // Generate JWT Token
        const token = jwt.sign(user, config.secretKey, { expiresIn: "1h" });

        // Optionally, save token to user document (to allow token management)
        await User.findByIdAndUpdate(user._id, { $push: { token: token } });

        res.json({
          message: "Login successful",
          user,
          token: token,
        });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

// Logout Controller
const logout = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: 1, message: "No token provided" });
    }

    // Remove token from user document
    await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

const me = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 1,
      message: "You are not logged in or token expired",
    });
  }
  res.json(req.user);
};

module.exports = { register, localStrategy, login, logout, me };
