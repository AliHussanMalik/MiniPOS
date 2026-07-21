const authService = require("../services/auth.service");
const storesService = require("../services/stores.service");

const showLogin = (req, res) => {
  res.redirect("/auth/login");
};

const showRegister = (req, res) => {
  res.redirect("/auth/register");
};

const login = async (req, res, next) => {
  console.log("1. Log In Controller Hit");
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    req.session.user = result.user;
    req.session.token = result.token;

    // Fetch user stores to set default store in session if available
    try {
      const stores = await storesService.getStores(req);
      if (Array.isArray(stores) && stores.length > 0) {
        req.session.currentStoreId = stores[0].id;
        req.session.currentStore = stores[0];
      }
    } catch (storeErr) {
      console.warn("Could not fetch user stores on login:", storeErr.message);
    }

    req.flash("success", "Welcome back!");

    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  } catch (error) {
    req.flash(
      "error",
      error.response?.data?.message || "Invalid email or password."
    );
    return res.redirect("/auth/login");
  }
};

const signup = async (req, res, next) => {
  console.log("1. Signup Controller Hit")
  console.log("2. Request Body:", req.body);
  try {
    await authService.signup({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: "OWNER",
    });

    console.log("3. Backend Reponse:")
    req.flash("success", "Account created successfully.");


    return res.redirect("/auth/login");
  } catch (error) {
    console.log("4. Signup Failed")
    console.error("Message", error.message)
    console.error("Code", error.code)
    console.error("Status", error.response?.status)
    console.error("Data", error.response?.data)
    console.error("Stack", error.stack)
    console.error("", error)
    console.error("", error)
    req.flash(
      "error",
      error.response?.data?.message || "Unable to create account."
    );

    return res.redirect("/auth/register");
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.redirect("/auth/login");
  });
};


module.exports = {
  showLogin,
  showRegister,
  login,
  signup,
  logout,
};