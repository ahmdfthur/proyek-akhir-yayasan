// backend/controllers/boardMemberController.js
const db = require('../config/database');

exports.getAllBoardMembers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, position, photo_url, welcome_speech FROM board_members ORDER BY display_order ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};