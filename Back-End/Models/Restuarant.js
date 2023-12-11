const mongooese =require('mongoose');
const restuarantsSchema = new mongooese.Schema({
    name:{
        type:String,
        require:true
    },
    locality:{
        type:String,
        require:true
    },
    
    city_name:{
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
address:{
    type:String,
    require:true
},
contact_number:{
    type:Number,
    require:true
},
thumb:{
    type:String,
    require:true
},
mealtype_id:[{mealtype:Number,name:String}],
cuisine_id:[{cuisine:Number,name:String}]
    
});

module.exports=mongooese.model('restuarant',restuarantsSchema)