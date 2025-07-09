const db = require('../config/database');

exports.getContactSettings = async (req, res) => {
    try {
        // Mengambil semua setting yang berawalan 'contact_' atau 'social_' atau 'maps_'
        const [rows] = await db.query("SELECT setting_key, setting_value FROM settings WHERE setting_key LIKE 'contact_%' OR setting_key LIKE 'social_%' OR setting_key LIKE 'maps_%'");

        // Mengubah array menjadi objek agar mudah diakses di frontend
        const settingsObject = rows.reduce((obj, item) => {
            obj[item.setting_key] = item.setting_value;
            return obj;
        }, {});

        res.status(200).json(settingsObject);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};