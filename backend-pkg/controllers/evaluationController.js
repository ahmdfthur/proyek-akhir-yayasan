// backend-pkg/controllers/evaluationController.js

const db = require('../config/database');

// FUNGSI 1: Untuk mengambil daftar kriteria penilaian
exports.getEvaluationAspects = async (req, res) => {
    try {
        const [aspects] = await db.query('SELECT * FROM evaluation_aspects ORDER BY id');
        res.status(200).json(aspects);
    } catch (error) {
        console.error("GET ASPECTS ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// FUNGSI 2: Untuk menyimpan hasil penilaian dari Kepala Sekolah
exports.submitEvaluation = async (req, res) => {
    console.log("--- FUNGSI SUBMIT EVALUATION DIPANGGIL ---");
    console.log("REQUEST BODY DITERIMA:", JSON.stringify(req.body, null, 2));

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const evaluator_id = req.user.id;
        const { teacher_id, academic_year, semester, evaluations } = req.body;
        const evaluation_date = new Date();
        let total_score = 0;

        if (!evaluations || !Array.isArray(evaluations)) {
            console.error("DATA 'evaluations' BUKAN ARRAY ATAU TIDAK ADA!");
            throw new Error("Data rincian penilaian tidak valid.");
        }
        console.log(`Ditemukan ${evaluations.length} rincian penilaian untuk diproses.`);

        for (const eval_item of evaluations) {
            total_score += eval_item.score;
            const { aspect_id, score } = eval_item;
            
            console.log(`Menyimpan aspek ID: ${aspect_id} untuk guru ID: ${teacher_id} dengan skor: ${score}`);
            const query = `
                INSERT INTO teacher_evaluations (evaluator_id, teacher_id, aspect_id, academic_year, semester, score, evaluation_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE score=VALUES(score), evaluator_id=VALUES(evaluator_id), evaluation_date=VALUES(evaluation_date)
            `;
            await connection.query(query, [evaluator_id, teacher_id, aspect_id, score, academic_year, semester, evaluation_date]);
        }
        console.log("Semua rincian skor berhasil disimpan.");

        const max_score = evaluations.length * 4;
        const performance_value = total_score * 1.25;
        const grade_category = 'Dihitung'; 
        
        console.log(`Menyimpan hasil akhir: total_skor=${total_score}, nilai_akhir=${performance_value}`);
        const resultQuery = `
            INSERT INTO evaluation_results (evaluator_id, teacher_id, academic_year, semester, total_score, max_score, performance_value, grade_category, evaluation_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE total_score=VALUES(total_score), max_score=VALUES(max_score), performance_value=VALUES(performance_value), grade_category=VALUES(grade_category), evaluator_id=VALUES(evaluator_id), evaluation_date=VALUES(evaluation_date)
        `;
        await connection.query(resultQuery, [evaluator_id, teacher_id, academic_year, semester, total_score, max_score, performance_value, grade_category, evaluation_date]);
        
        await connection.commit();
        console.log("--- TRANSAKSI BERHASIL ---");
        res.status(201).json({ message: 'Penilaian berhasil disimpan.' });

    } catch (error) {
        await connection.rollback();
        console.error("--- TRANSAKSI GAGAL ---");
        console.error("Submit Evaluation Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    } finally {
        connection.release();
    }
};

// FUNGSI 3: Untuk guru mengambil riwayat hasil akhirnya
exports.getMyEvaluationResults = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const query = `SELECT * FROM evaluation_results WHERE teacher_id = ? ORDER BY academic_year DESC, semester DESC`;
        const [results] = await db.query(query, [teacher_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Get My Evaluation Results Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 4: Untuk guru mengambil rincian dari satu hasil penilaian
exports.getEvaluationDetails = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const result_id = req.params.resultId;
        const [result] = await db.query('SELECT * FROM evaluation_results WHERE id = ? AND teacher_id = ?', [result_id, teacher_id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Hasil penilaian tidak ditemukan atau Anda tidak punya akses." });
        }
        const { academic_year, semester } = result[0];
        const query = `
            SELECT te.score, ea.aspect_name, ea.category FROM teacher_evaluations te
            JOIN evaluation_aspects ea ON te.aspect_id = ea.id
            WHERE te.teacher_id = ? AND te.academic_year = ? AND te.semester = ?
            ORDER BY ea.id
        `;
        const [details] = await db.query(query, [teacher_id, academic_year, semester]);
        const finalResponse = { ...result[0], details: details };
        res.status(200).json(finalResponse);
    } catch (error) {
        console.error("Get Evaluation Details Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};