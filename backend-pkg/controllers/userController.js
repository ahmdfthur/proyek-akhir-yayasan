// backend-pkg/controllers/userController.js
const db = require('../config/database');

exports.getTeachersBySchool = async (req, res) => {
    try {
        const principalId = req.user.id;
        const [principal] = await db.query('SELECT school_id FROM users WHERE id = ?', [principalId]);
        const schoolId = principal[0].school_id;

        const [teachers] = await db.query("SELECT id, name FROM users WHERE role = 'guru' AND school_id = ?", [schoolId]);
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};