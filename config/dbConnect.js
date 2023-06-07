const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const dbConnect = async()=>{
    const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING)
    if (connect) {
        console.log("Db connected:", connect.connection.host, connect.connection.name);
    }else{
        console.log("Db connection failed");
    }
}

module.exports=dbConnect