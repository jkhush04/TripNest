const User = require("../models/User.cjs");

module.exports.newUser = async(req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);

    //console.log(registeredUser);
    req.login(registeredUser, (err) => {
      // login method is added by passport to req object to log the user in after signup ,
      // it is automatically called after successful authentication by passport authenticate method
      if (err) return next(err);
      req.flash("success", "Welcome to LikeHome!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  //  console.log(req.session.returnToUrl);   //nothig will print
  const redirectUrl = res.locals.returnToUrl || "/listings"; // res.locals.returnToUrl is set in storeReturnTo middleware

  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    // logout method is added by passport to req object to log the user out
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!"); //flash message shoild be set before redirecting
    res.redirect("/listings");
  })

};
