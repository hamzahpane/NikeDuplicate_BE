const router = require("express").Router();
const passport = require("passport");
const authController = require("../Auth/authControler");

// Menggunakan Passport Local Strategy
passport.use(
  "local",
  new (require("passport-local").Strategy)(
    {
      usernameField: "email",
    },
    authController.localStrategy
  )
);

// Route untuk registrasi
router.post("/register", authController.register);

// Route untuk login
router.post("/login", authController.login);

// Route untuk logout
router.post("/logout", authController.logout);

// Route untuk mendapatkan profil pengguna yang sedang login (Me)
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authController.me
);

module.exports = router;
