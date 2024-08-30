const express = require('express')
const router = express.Router();
const path = require('path')
const {Editbyid} = require(path.join(__dirname,'..','controller','EditById'));

router.route('/editbyid/:employeeId').put(Editbyid);

module.exports = router;