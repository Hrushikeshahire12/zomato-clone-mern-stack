const restaurantData =require ('../Models/Restuarant');
exports.getRestaurants=async(req,res)=>{
    const restaurants= await restaurantData.find();
    try{
       res.status(200).json(restaurants);

    }catch(err){
        res.status(500).send(err)
    }
}

exports.getRestaurantsByLocations= async(req,res)=>{
    console.log(req.params.id)
const  rest=await restaurantData.find({location_id: req.params.id});
console.log(rest)
try{
    res.status(200).json(rest);
}catch(err){
    res.status(500).send(err);
  }
}

exports.getRestaurantsByID= async(req,res)=>{
    const  restaurants=await restaurantData.findById(req.params.id_rest);
    console.log(req.params.id_rest)
    try{
        res.status(200).json(restaurants);
    }catch(err){
        res.status(500).send(err);
      }
    }


    exports.filter = async (req, res) => {
        const mealtype_id = req.body.mealtype_id;
        const location_id = req.body.location_id;
        const cuisine_id = req.body.cuisine_id;
        const hcost = req.body.hcost;
        const lcost = req.body.lcost;
        const sort = req.body.sort ? req.body.sort : 1;
        const page = req.body.page ? req.body.page : 1;
       
        let itemPerPage = 2;
        let startIndex = (page * itemPerPage) - itemPerPage;
        let endIndex = (page * itemPerPage);
      
        
    
        let payload = {};
    
        if(mealtype_id){
            payload = {mealtype_id: {$elemMatch: { mealtype: mealtype_id}}};
        }
        if(mealtype_id && location_id){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                location_id : location_id
            }
        }
        if(mealtype_id && cuisine_id ){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                cuisine_id: {$elemMatch: { cuisine: cuisine_id}},
            }
        }
        if(mealtype_id && hcost && lcost){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                cost : {$lte: hcost, $gte : lcost}
            }
        }
        if(mealtype_id && cuisine_id && hcost && lcost){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                cost : {$lte: hcost, $gte : lcost},
                cuisine_id: {$elemMatch: { cuisine: cuisine_id}},
            }
        }
        if(mealtype_id && location_id && cuisine_id){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                location_id : location_id,
                cuisine_id: {$elemMatch: { cuisine: cuisine_id}}
            }
        }
        if(mealtype_id && location_id && hcost && lcost){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                location_id : location_id,
                cost : {$lte: hcost, $gte : lcost}
            }
        }
        if(mealtype_id && location_id && cuisine_id && hcost && lcost){
            payload = {
                mealtype_id: {$elemMatch: { mealtype: mealtype_id}},
                location_id : location_id,
                cost : {$lte: hcost, $gte : lcost},
                cuisine_id: {$elemMatch: { cuisine: cuisine_id}}
            }
        }
        let list = await restaurantData.find(payload).sort({cost : sort});
        try{
        res.status(200).json(list);
    }catch(err){
        res.status(500).send(err);
    }
}