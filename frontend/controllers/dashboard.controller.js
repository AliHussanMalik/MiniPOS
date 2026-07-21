const testService =require("../services/test.service");

const index = async (req , res , next)=>{
    try{
        const result = await testService.testConnection(req);

        console.log("Backend Response");
        console.dir(result,{depth: null});

        return res.json(result);
    }catch(err){
        console.error("Status",err.response?.status)
        console.error("Data",err.response?.data)

        next(err)
    }
};
// const { renderPage } = require("./page.controller");
// module.exports = { index: renderPage("dashboard/index", "Dashboard") };
module.exports = {index,}
;