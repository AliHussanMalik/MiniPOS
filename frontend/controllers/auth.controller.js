const authService = require("../services/auth.service");

const showLogin = (req, res) => {
  res.redirect("auth/login", {
    title: "Login"
  });
};

const showRegister = (req, res) => {
  res.redirect("auth/register", {
    title: "Register"
  });
};

const login = async (req, res, next) => {
  console.log("1. Log In Controller Hit")
  try {
    console.log("2. Request Body", req.body)

    // try{

    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("3. Backend Response:", result)
    console.log("4. Redirecting to /Dashboard:")
    // }catch(e){
    //   console.error("Axiouse Error")
    //   console.error(e.code)
    //   console.error(e.message)
    //   console.error(e.response?.status)
    //   console.error(e.response?.data)

    //   throw e;
    // }



    req.session.user = result.user;
    req.session.token = result.token;

    console.log("========== LOGIN SESSION ==========");
    console.dir(req.session, { depth: null });
    console.log("==================================");

    console.log("4. Session Stored")

    console.log("Session before redirect:", req.session)

    req.flash("success", "Welcome back!");

    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard")
    })

    // return res.redirect("/dashboard");
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