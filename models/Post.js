const mongoose= require("mongoose")



const postsSchema =mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    post_image: {
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    likes:{
        type:Number
    },
    comment:{
        type:String
    },
    likes:[],
})
module.exports=mongoose.model("Posts", postsSchema)