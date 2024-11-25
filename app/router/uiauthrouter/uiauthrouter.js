const express = require('express');
const uiauthcontroller = require('../../controller/uiauthcontroller/uiauthcontroller');
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const router = express.Router();

router.get('/register', uiauthcontroller.register) // Show Register Form
router.post('/registercreate', uploadImage.single('image'), uiauthcontroller.register);
router.get('/login', uiauthcontroller.login) // Get data in login
router.post('/logincreate', uiauthcontroller.login) // Post data in login
router.get('/logout', uiauthcontroller.logout); // For Logout

module.exports = router; 