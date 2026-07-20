// const requirePageAuth = (req, res, next) => {
//   next();
// };

// module.exports = { requirePageAuth };


const requirePageAuth = (req, res, next)=>{
  if(!req.session.user || !req.session.token){
    return res.redirect("/auth/login");
  }
  next();
};


const requireGuest = (req,res, next)=>{
  if(req.session.user && req.sesion.tken){
    return res.redirect("/dashboard");
  }
  next();
}
module.exports = {requirePageAuth,requireGuest};