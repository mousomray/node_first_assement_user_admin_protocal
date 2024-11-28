const express = require('express');
const uiauthcontroller = require('../../controller/uiauthcontroller/uiauthcontroller');
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const router = express.Router();

router.get('/register', uiauthcontroller.registerGet) // Show Register Form
router.post('/registercreate', uploadImage.single('image'), uiauthcontroller.registerPost);
router.get('/login', uiauthcontroller.loginGet) // Get data in login
router.post('/logincreate', uiauthcontroller.loginPost) // Post data in login
router.get('/logout', uiauthcontroller.logout); // For Logout

module.exports = router; 