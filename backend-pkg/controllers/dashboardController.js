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

exports.getHeadmasterSummary = async (req, res) => {
    try {
        const principalId = req.user.id;
        
        // Ambil school_id dari user Kepala Sekolah yang sedang login
        const [principal] = await db.query('SELECT school_id FROM users WHERE id = ?', [principalId]);
        if (!principal || principal.length === 0 || !principal[0].school_id) {
            return res.status(403).json({ message: 'Anda tidak terhubung dengan sekolah manapun.' });
        }
        const schoolId = principal[0].school_id;

        // Jalankan beberapa query statistik secara paralel
        const [
            [teacherStats],
            [pendingRppStats],
            [evaluationStats]
        ] = await Promise.all([
            // 1. Hitung jumlah guru di sekolahnya
            db.query("SELECT COUNT(*) as total FROM users WHERE role = 'guru' AND school_id = ?", [schoolId]),
            // 2. Hitung RPP yang statusnya 'pending' dari guru di sekolahnya
            db.query(`
                SELECT COUNT(*) as total FROM rpp_submissions 
                WHERE status = 'pending' AND teacher_id IN (SELECT id FROM users WHERE school_id = ?)
            `, [schoolId]),
            // 3. Hitung jumlah penilaian yang sudah diselesaikan oleh Kepsek ini
            db.query("SELECT COUNT(*) as total FROM evaluation_results WHERE evaluator_id = ?", [principalId])
        ]);

        const summary = {
            total_teachers: teacherStats.total || 0,
            pending_rpp: pendingRppStats.total || 0,
            completed_evaluations: evaluationStats.total || 0,
        };

        res.status(200).json(summary);

    } catch (error) {
        console.error("Get Headmaster Summary Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};