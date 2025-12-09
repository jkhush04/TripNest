if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // load environment variables from .env file
}
//console.log(process.env.SECRET);

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const app = express("");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // layout engine for
const ExpressError = require("./utils/ExpressError.cjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.cjs");

const listingR = require("./ExpressRouter/listingR.cjs");
const reviewR = require("./ExpressRouter/ReviewR.cjs");
const userR = require("./ExpressRouter/userR.cjs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //@@

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// connect to mongodb

const dburl = process.env.ATLASDB_URL;

console.log("DB URL:", dburl ? "Loaded from env" : "NOT FOUND"); // debug log
// for localhost use this- "mongodb://localhost:27017/LikeHome";
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
async function main() {
  // disconnect if already connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(dburl); //@@@
}

// session store
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // time in seconds
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

//session configuration
const sessionOptions = {
  // store,
  secret: process.env.SECRET,
  resave: false, // this says do you want to save the session even if nothing is changed
  saveUninitialized: true, // this says do you want to store session even if nothing is stored if yes then true if no then false
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // one week from now
    maxAge: 1000 * 60 * 60 * 24 * 7, // time in milliseconds
    httpOnly: true, // client side scripts cannot access the cookie
  },
};

app.use(session(sessionOptions));
// use flash
app.use(flash());

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate method is added by passport-local-mongoose plugin to User model

passport.serializeUser(User.serializeUser()); // how to store user in session (use for login)
passport.deserializeUser(User.deserializeUser()); // how to get (unstore or remove) user from session (use for logout )

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // locals are used to pass variables to all templates
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // req.user is added by passport and contains the currently logged in user
  next();
});

/* app.get("/demouser", async (req, res) => {
  const fakeuser = new User({
    username: "demouser",
    email: "2iHrH@example.com",
  })
  let registeredUser=await User.register(fakeuser,"helloworld")
// .register method is added by passport-local-mongoose plugin to User model to hash the password and store the user in database
  console.log(registeredUser);
  res.send("demouser created");

}); */

// use the listing routes
app.use("/listings", listingR);

//use the review routes
app.use("/listings/:id/reviews", reviewR);

// use the user routes
app.use("/", userR);

/* app.get("/", (req, res) => {
  res.send("Hello World");
}); */

//when the user enters a wrong url or page that does not exist
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); // custom message or status code
});

//error handler middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).render("./listings/Error.ejs", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
