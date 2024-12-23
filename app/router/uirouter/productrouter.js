const express = require('express');
const productcontroller = require('../../controller/uicontroller/productcontroller');
const { uiAuth } = require('../../middleware/uiauth'); // For UI auth
const uploadImage = require('../../helper/imagehandler') // Image area
const router = express.Router();

router.get('/addproduct', uiAuth, productcontroller.addproductGet) // Show Add Form
router.post('/addproductcreate', uiAuth, uploadImage.single('image'), productcontroller.addproductPost) // Add Data to Form
router.get('/product', uiAuth, productcontroller.showproduct) // For to show Product List
router.get('/singleproductget/:id', uiAuth, productcontroller.singleproduct) //Single Product page
router.post('/updateproductpost/:id', uiAuth, uploadImage.single('image'), productcontroller.updateproduct)//Update Product
router.get('/toggleblogactive/:id', uiAuth, productcontroller.toggleProductActive); // Active or inactive product
router.get('/deleteproductget/:id', uiAuth, productcontroller.deleteproduct);//Delete Product 

module.exports = router;