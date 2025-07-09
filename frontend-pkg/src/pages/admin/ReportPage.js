import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import './ReportPage.css';
import { utils, writeFile } from 'xlsx'; // <-- Import library xlsx

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchool, setSelectedSchool] = useState('all');

    // Fungsi untuk mengambil data laporan berdasarkan filter sekolah
    const fetchReports = (schoolId) => {
        setLoading(true);
        apiClient.get(`/admin/reports/performance?school_id=${schoolId}`)
            .then(res => {
                setReports(res.data);
            })
            .catch(err => console.error("Gagal mengambil data laporan:", err))
            .finally(() => setLoading(false));
    };

    // Ambil daftar sekolah saat komponen dimuat
    useEffect(() => {
        apiClient.get('/schools').then(res => setSchools(res.data));
        fetchReports('all'); // Ambil semua data saat pertama kali load
    }, []);

    const handleFilterChange = (e) => {
        const schoolId = e.target.value;
        setSelectedSchool(schoolId);
        fetchReports(schoolId);
    };

    // Fungsi untuk mengekspor data ke Excel
    const handleExport = () => {
        const worksheet = utils.json_to_sheet(reports);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Laporan Kinerja");

        // Atur lebar kolom (opsional)
        const colWidths = [ { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 15 } ]; // Lebar untuk setiap kolom
        worksheet["!cols"] = colWidths;

        // Buat dan unduh file Excel
        writeFile(workbook, "Laporan_Kinerja_Guru.xlsx");
    };

    return (
        <div className="report-container">
            <div className="page-header">
                <h2>Laporan Kinerja Guru</h2>
                <div className="filter-export-section">
                    <select value={selectedSchool} onChange={handleFilterChange} className="filter-select">
                        <option value="all">Semua Sekolah</option>
                        {schools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </select>
                    <button onClick={handleExport} className="export-button">
                        Unduh Laporan
                    </button>
                </div>
            </div>
            <div className="card">
                {loading ? (
                    <div>Memuat laporan...</div>
                ) : (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Nama Guru</th>
                                <th>Tempat Tugas</th>
                                <th>Periode</th>
                                <th>Nilai Akhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? reports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.teacher_name}</td>
                                    <td>{report.school_name}</td>
                                    <td>{report.academic_year} - {report.semester}</td>
                                    <td><span className="score-badge">{report.performance_value}</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center'}}>Tidak ada data untuk ditampilkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ReportPage;