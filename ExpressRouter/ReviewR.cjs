const express = require("express");

const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.cjs");

const { isLoggedIn, validatereview , isReviewAuthor} = require("../middleware.cjs");
const ReviewsC = require("../Controllers/ReviewsC.cjs");



//review route----------------------------

//post route
router.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(ReviewsC.newpost)
);

// reviews delete route post

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewsC.deletereview)
);

module.exports = router;
