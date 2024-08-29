const express = require('express')
const router = express.Router();
const path = require('path')
const {DisplayProject} = require(path.join(__dirname,'..','controller','ShowProjects'));

router.route('/').get(DisplayProject);

module.exports = router;