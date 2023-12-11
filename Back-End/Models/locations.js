const mongoose = require('mongoose')

const restuarantsSchema = new mongoose.Schema({
    name :{
        type:String,
        require:true
    },
    city_id:{
        type:Number,
        require:true
    },
    
    location_id:{
        type:Number,
        require:true
    },
    city_name:{
        type:String,
        require:true
    },
    country_name:{
        type:String,
        require:true
    }
});
module.exports=mongoose.model('locations',restuarantsSchema )
    
