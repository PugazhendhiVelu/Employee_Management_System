const express = require('express')
const router = express.Router();
const path = require('path')
const {editProject} = require(path.join(__dirname,'..','controller','EditProject'));

router.route('/id/:projectId').put(editProject);

module.exports = router;