const express = require('express');
const router = express.Router();
const settingController = require('../controller/setting.controller.js');

// CREATE: Create a new setting
router.post('/', settingController.createSetting);

// READ: Get a setting by ID
router.get('/:id', settingController.getSettingById);

// UPDATE: Update a setting by ID
router.put('/:id', settingController.updateSettingById);


module.exports = router;
