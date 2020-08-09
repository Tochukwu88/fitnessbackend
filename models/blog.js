const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        min:3,
        max:160,
        
        index:true,
        required:true
    },
    slug:{
        type:String,
        trim:true,
        required:true,
       unique:true,
       index:true
        
       
    },
    excerpt:{
        type:String,
        max:1000
    },
    body:{
        type:{},
        trim:true,
        required:true,
        
        min:200,
        max:2000000,
    },
    mtitle:{
        type:String,
        
    },
    mdesc:{
        type:String
    },
    about:{
        type:String
    },
  
    photo:{
        data:Buffer,
        contentType:String
    },
   categories:[{type:ObjectId,ref:'Category',required:true}],
   tags:[{type:ObjectId,ref:'Tag',required:true}],
   postedBy:{
       type:ObjectId,
       ref:'User'
   }
    
},{
    timestamps:true
})


module.exports=mongoose.model('Blog',blogSchema)