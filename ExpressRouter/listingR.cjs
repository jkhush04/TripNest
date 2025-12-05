const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.cjs");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.cjs");
const ListingC = require("../Controllers/listingC.cjs");

const multer = require("multer");
const { storage } = require("../cloudConfig.cjs");
const upload = multer({ storage });

// Wrap upload.single to capture errors and always call next()
function singleUpload(fieldName) {
  return (req, res, next) => {
    console.log(`[multer] Starting upload for field: ${fieldName}`);
    upload.single(fieldName)(req, res, function (err) {
      if (err) {
        console.error(`[multer] ERROR for field ${fieldName}:`, err);
        err._fromMulter = true;
        return next(err);
      }
      console.log(`[multer] Successfully processed field ${fieldName}`);
      console.log(`[multer] req.file:`, req.file);
      next();
    });
  };
}

router
  .route("/")
  .get(wrapAsync(ListingC.index))
  .post(
    isLoggedIn,
    (req, res, next) => {
      console.log("➡️ POST /listings HIT — BEFORE MULTER");
      next();
    },
    singleUpload("listing[image]"),
    (req, res, next) => {
      console.log("➡️ POST /listings HIT — AFTER MULTER");
      console.log("req.file:", req.file);
      console.log("req.body:", req.body);
      next();
    },
    validatelisting,
    wrapAsync(ListingC.create)
  );

//new route
router.get("/new", isLoggedIn, ListingC.new);

//show route
router
  .route("/:id")
  .get(wrapAsync(ListingC.show))
  .put(
    isLoggedIn,
    isOwner,
    singleUpload("listing[image]"),
    (req, res, next) => {
      console.log("➡️ PUT /listings/:id — AFTER MULTER");
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("req.file:", req.file);
      console.log("req.body:", req.body);
      next();
    },
    validatelisting,
    wrapAsync(ListingC.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingC.delete));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingC.edit));

module.exports = router;
