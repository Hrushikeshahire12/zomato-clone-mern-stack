const  mongooese = require("mongoose");

const mealtypeSchema=  new mongooese.Schema({
    name:{
        type: String,
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    mealtype_id:{
type:Number,
require:true,
    }
});
module.exports=mongooese.model('Mealtype',mealtypeSchema);
