const express = require('express')
const router = express.Router();
const path = require('path')
const {ProjectGetbyid} = require(path.join(__dirname,'..','controller','ProjectID'));

router.route('/id/:projectId').get(ProjectGetbyid);

module.exports = router;