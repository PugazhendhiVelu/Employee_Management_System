const express = require('express')
const router = express.Router();
const path = require('path')
const {Getbyid} = require(path.join(__dirname,'..','controller','Getbyid'));

router.route('/id/:employeeId').get(Getbyid);

module.exports = router;