const express = require('express')
const router = express.Router();
const path = require('path')
const {DisplayEmployee} = require(path.join(__dirname,'..','controller','ShowEmployees'));

router.route('/').get(DisplayEmployee);

module.exports = router;