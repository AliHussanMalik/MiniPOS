require("dotenv").config();


const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// Configure view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(
  session({
    secret: process.env.SESSION_SECRET || "minipos-secret",
    resave: false,
    saveUninitialized:false,
    cookie:{
      httpOnly:true,
      secure: false,
      maxAge: 1000*60*60*8
    },
  })
);

app.use(flash());

app.use((req,res,next)=>{
  console.log(req.method, req.url)
  console.log("session user", req.session.user)
  console.log("Session Token Esixts:",!!req.session.token)

  next()
})

// --------------------------------------------------
// Global Variables (available in every EJS view)
// --------------------------------------------------

app.use((req,res,next)=>{
  res.locals.user = req.session.user || null;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
})

// --------------------------------------------------
// Static Files
// --------------------------------------------------

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes"));

// 404 Page
app.use((req, res) => {
  res.status(404).render("layouts/error", {
    title: "404 - Page Not Found",
    message: "The page you requested could not be found.",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).render("layouts/error", {
    title: "Server Error",
    message: err.message || "Something went wrong.",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});