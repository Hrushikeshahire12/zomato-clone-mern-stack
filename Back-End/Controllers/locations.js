const Location = require('../Models/locations');

exports.getLocations= async(req,res)=>{
    try{
        const result = await Location.find();
        res.status(200).json(result);
        console.log(result)

    }catch(err){
        res.status(500).send(err);
    }
};
