const path = require("path");
const ejs = require("ejs");

const renderPage = (view, title) => async (req, res, next) => {
  try {
    const user = req.session?.user || null;

    const body = await ejs.renderFile(
      path.join(__dirname, "../views", `${view}.ejs`),
       { title, 
        page: view, 
        user,
       }
      );
    return res.render(
      `layouts/${view.startsWith("auth/") ? "auth" : "main"}`,
     {
       title, 
       page: view, 
       user ,
      body, 
      }
    );
  } catch (error) {
    next(error);
   }
};

module.exports = { 
  renderPage
};
