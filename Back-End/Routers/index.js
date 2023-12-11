const express = require('express');
const routes=express.Router();



const locationsController = require('../Controllers/locations')
const mealtypeController =require('../Controllers/mealtypes')
const RestaurantsController = require('../Controllers/Restaurants')
const userController = require('../Controllers/userController');
const menuItemsController = require('../Controllers/MenuItemsController');
const PaymentController=require('../Controllers/Payment')
routes.get('/locations',locationsController.getLocations);
routes.get('/mealtypes',mealtypeController.getMealtypes);
routes.post('/filter', RestaurantsController.filter);
routes.get('/Restaurants',RestaurantsController.getRestaurants );
routes.get('/Restaurants/:id',RestaurantsController.getRestaurantsByLocations);
routes.get('/Rest/:id_rest',RestaurantsController.getRestaurantsByID);
routes.get('/getmenu/:id_menu', menuItemsController.getMenuItemsByRestaurant);
routes.post('/signup', userController.signUp);
routes.post('/login', userController.logIn);
routes.post('/payment',PaymentController.handlePayment)
module.exports=routes;
