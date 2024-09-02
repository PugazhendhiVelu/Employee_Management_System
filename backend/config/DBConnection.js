const mongoose = require('mongoose');
const DBConnect = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Database Connected Successfully");
    })
    .catch((err)=>{
        console.error('Database Connection error');
        
    })};

    module.exports = DBConnect;