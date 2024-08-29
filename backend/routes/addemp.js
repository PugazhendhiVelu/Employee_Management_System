const express = require('express')
const router = express.Router();
const path = require('path')
const {createEmployee} = require(path.join(__dirname,'..','controller','AddEmployee'));

router.route('/').post(createEmployee);

module.exports = router;