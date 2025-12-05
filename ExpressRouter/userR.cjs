const express = require("express");
const wrapAsync = require("../utils/wrapAsync.cjs");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const { storeReturnTo } = require("../middleware.cjs");
const UserC = require("../Controllers/UserC.cjs");


/* // User routes
router.get("/signup", UserC.newUser);

// signup route
router.post("/signup", wrapAsync(UserC.signup)); */

// or different way to write above two routes
router
  .route("/signup")
  .get(UserC.newUser)
  .post(wrapAsync(UserC.signup));


router
  .route("/login")
  .get((req, res) => {
  res.render("users/login.ejs");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserC.login
  );

router.get("/logout", UserC.logoutUser);

module.exports = router;
