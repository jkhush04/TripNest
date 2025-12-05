const Listing = require("../models/listing.cjs");
const Review = require("../models/Reviews.cjs");

module.exports.newpost = async (req, res) => {
  let listings = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  //console.log(newreview);
  listings.reviews.push(newreview);
  await newreview.save();
  await listings.save();
  //console.log(newreview);
  req.flash("success", "Successfully made a new review!");
  res.redirect(`/listings/${listings._id}`);
};

module.exports.deletereview = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, {
        $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${req.params.id}`);
};
