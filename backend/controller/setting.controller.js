const Setting = require('../models/setting.js');

// CREATE: Create a new setting
const createSetting = async (req, res) => {
    try {
        const { movie_batch, buyingTicket, Movie_Day } = req.body;

        // Create new setting document
        const newSetting = new Setting({
            movie_batch,
            buyingTicket,
            Movie_Day
        });


        // Save setting to the database
        const savedSetting = await newSetting.save();

        res.status(201).json({
            message: 'Setting created successfully',
            setting: savedSetting
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating setting.' });
    }
};


// READ: Get a setting by ID
const getSettingById = async (req, res) => {
    try {
        const { id } = req.params;
        const setting = await Setting.findById(id);

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }


        res.status(200).json(setting);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching setting.' });
    }
};

// UPDATE: Update a setting by ID
const updateSettingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { movie_batch, buyingTicket, Movie_Day } = req.body;

        const updatedSetting = await Setting.findByIdAndUpdate(
            id,
            { movie_batch, buyingTicket, Movie_Day },
            { new: true } // Return the updated setting
        );

        if (!updatedSetting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }

        res.status(200).json({
            message: 'Setting updated successfully',
            setting: updatedSetting
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating setting.' });
    }
};



module.exports = {
    createSetting,
    getSettingById,
    updateSettingById
};
