// backend-pkg/controllers/dashboardController.js
const db = require('../config/database');

exports.getTeacherSummary = async (req, res) => {
    try {
        const teacher_id = req.user.id;

        // Query untuk menghitung statistik RPP
        const rppQuery = `
            SELECT
                COUNT(*) as total_rpp,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_rpp,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_rpp,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_rpp
            FROM rpp_submissions
            WHERE teacher_id = ?
        `;
        const [rppStats] = await db.query(rppQuery, [teacher_id]);

        // Query untuk mengecek kelengkapan biodata (contoh: cek NIP)
        const [profile] = await db.query('SELECT nip FROM teacher_profiles WHERE user_id = ?', [teacher_id]);
        const is_profile_complete = profile.length > 0 && profile[0].nip !== null && profile[0].nip !== '';

        const summary = {
            rpp_total: rppStats[0].total_rpp || 0,
            rpp_approved: rppStats[0].approved_rpp || 0,
            rpp_pending: rppStats[0].pending_rpp || 0,
            rpp_rejected: rppStats[0].rejected_rpp || 0,
            is_profile_complete: is_profile_complete
        };

        res.status(200).json(summary);

    } catch (error) {
        console.error("Get Teacher Summary Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};