const Review = require("./models/Reviews.cjs");
const Listing = require("./models/listing.cjs");
const ExpressError = require("./utils/ExpressError.cjs");
const { listingSchema, reviewSchema } = require("./schemma.cjs");

// This middleware - handle server side validation for listing

module.exports.validatelisting = (req, res, next) => {
  console.log("validatelisting reached");
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // Get the error message string from Joi
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// This middleware - handle server side validation for reviews

module.exports.validatereview = (req, res, next) => {
  console.log("validatereview reached");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // Get the error message string from Joi
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  console.log("isLoggedIn reached");

  //console.log(req.originalUrl,  req.path);
  if (!req.isAuthenticated()) {
    //this method is added by passport to check if the user is logged in
    req.session.returnToUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a new listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  console.log("storeReturnTo reached");
  if (req.session.returnToUrl) {
    res.locals.returnToUrl = req.session.returnToUrl; // make it available to the next middleware or route handler as passport will remove returnToUrl variable from session after successful authentication
    delete req.session.returnToUrl; // remove it from session to avoid using stale url in future logins
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  console.log("isOwner reached");
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  console.log("isReviewAuthor: Firstname Lastname");
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
