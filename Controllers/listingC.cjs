const Listing = require("../models/listing.cjs");

module.exports.index = async (req, res) => {
  try{
  const alllistings = await Listing.find({});
  res.render("/listings/index", { alllistings });
  }
  catch(err){
    console.error("Index page error", err);
    res.status(500).send("Error loading index page");
  }
};

module.exports.new = (req, res) => {
  //console.log(req.isAuthenticated());

  res.render("./listings/new.ejs");
};

module.exports.create = async (req, res, next) => {
  if (!req.file) {
    console.warn("No file received in create handler. req.file is undefined.");
    req.flash("error", "Please upload an image!");
    return res.redirect("/listings/new");
  }

  console.log("file received");

  const url = req.file.path;
  const filename = req.file.filename;
  console.log(url, "..", filename);

  const newlisting = new Listing(req.body.listing); // if in object form data given in form is converted to object
  newlisting.owner = req.user._id; //assigning the logged in user as the owner of the listing
  newlisting.image = {  url,filename };

  await newlisting.save(); 
  console.log(newlisting);  //-------------------------------------------------
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
};



module.exports.show = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  // console.log(listing.owner);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing to edit!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  if (originalImageUrl.includes("cloudinary.com")) {
    // check if image is hosted on cloudinary
    originalImageUrl = originalImageUrl.replace(
      "/upload/",
      "/upload/w_300,h_300,c_fill/"
    );
  }
  req.flash("success", "Successfully loaded edit form!");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  //console.log(id);
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //const listing = await Listing.findById(id);

  // copy updates but exclude image so we don't overwrite existing image with empty value
 // const updates = { ...req.body.listing };
  //if (updates.image) delete updates.image;

  //Object.assign(listing, updates);
  if (typeof req.file !== "undefined") {
    // optional: delete old image from cloudinary if you store filename and have cloudinary configured
    // const cloudinary = require('cloudinary').v2;
    // if (listing.image && listing.image.filename) {
    //   await cloudinary.uploader.destroy(listing.image.filename);
    // }

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  
    await listing.save();
  }
  req.flash("success", "Successfully updated listing!");
  res.redirect(`/listings/${id}`);
  console.log("updated");
};

module.exports.delete = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id, { deleted: true });
  req.flash("success", "Successfully deleted listing!");
  res.redirect("/listings");
};
