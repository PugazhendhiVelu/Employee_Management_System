const express = require('express')
const router = express.Router();
const path = require('path')
const {createProject} = require(path.join(__dirname,'..','controller','AddProject'));

router.route('/new/').post(createProject);

module.exports = router;