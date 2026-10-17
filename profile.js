let currentStudent = null;

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadProfileData();
});

// ==================== Login Check ====================
function checkLoginStatus() {
    const student = localStorage.getItem('currentStudent');
    if (student) {
        currentStudent = JSON.parse(student);
    } else {
        window.location.href = 'login-advanced.html';
    }
}

function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('currentStudent');
        window.location.href = 'login-advanced.html';
    }
}

// ==================== Load Profile Data ====================
function loadProfileData() {
    if (!currentStudent) return;

    // Load student info
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentCode').textContent = currentStudent.code;
    document.getElementById('joinDate').textContent = new Date().toLocaleDateString('ar-SA');
    document.getElementById('lastLogin').textContent = currentStudent.loginTime || new Date().toLocaleString('ar-SA');

    // Load statistics
    loadStatistics();
    loadRecentExams();
}

function loadStatistics() {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');

    const totalExams = results.length;
    const passedExams = results.filter(r => r.score >= 50).length;
    const averageScore = totalExams > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalExams)
        : 0;
    const totalCertificates = certificates.length;

    document.getElementById('totalExams').textContent = totalExams;
    document.getElementById('passedExams').textContent = passedExams;
    document.getElementById('averageScore').textContent = averageScore + '%';
    document.getElementById('totalCertificates').textContent = totalCertificates;
}

function loadRecentExams() {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    const container = document.getElementById('recentExamsContainer');
    const noExams = document.getElementById('noRecentExams');

    if (results.length === 0) {
        container.style.display = 'none';
        noExams.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    noExams.style.display = 'none';
    container.innerHTML = '';

    // Show last 5 exams
    const recentExams = results.slice(-5).reverse();

    recentExams.forEach(exam => {
        const row = document.createElement('div');
        row.className = 'exam-row';
        row.innerHTML = `
            <div class="exam-row-info">
                <h4>${exam.name}</h4>
                <p>${exam.date}</p>
            </div>
            <div class="exam-row-score">
                <span class="score-badge ${exam.score >= 50 ? 'passed' : 'failed'}">
                    ${exam.score}%
                </span>
            </div>
        `;
        container.appendChild(row);
    });
}

// ==================== Styles for Recent Exams ====================
const style = document.createElement('style');
style.textContent = `
    .exam-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.3s ease;
    }

    .exam-row:hover {
        background-color: #f9fafb;
    }

    .exam-row:last-child {
        border-bottom: none;
    }

    .exam-row-info h4 {
        margin: 0 0 5px 0;
        color: var(--text-dark);
        font-size: 16px;
    }

    .exam-row-info p {
        margin: 0;
        color: var(--text-light);
        font-size: 14px;
    }

    .score-badge {
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
    }

    .score-badge.passed {
        background-color: #d1fae5;
        color: #065f46;
    }

    .score-badge.failed {
        background-color: #fee2e2;
        color: #991b1b;
    }

    .profile-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }

    .info-box {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid var(--primary-color);
    }

    .info-label {
        display: block;
        font-size: 12px;
        color: var(--text-light);
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .info-value {
        display: block;
        font-size: 16px;
        color: var(--text-dark);
        font-weight: 600;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
    }

    .stat-box {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 25px;
        border-radius: 8px;
        text-align: center;
    }

    .stat-number {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 10px;
    }

    .stat-label {
        font-size: 14px;
        opacity: 0.9;
    }

    .profile-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        margin-bottom: 30px;
        overflow: hidden;
    }

    .card-header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 20px;
    }

    .card-header h2 {
        margin: 0;
        font-size: 20px;
    }

    .card-body {
        padding: 30px;
    }

    .page-header {
        text-align: center;
        margin-bottom: 50px;
        animation: slideInDown 0.5s ease;
    }

    .page-header h1 {
        font-size: 32px;
        color: var(--primary-color);
        margin-bottom: 10px;
    }

    .page-header p {
        font-size: 16px;
        color: var(--text-light);
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .empty-message {
        text-align: center;
        padding: 40px;
        color: var(--text-light);
    }

    @media (max-width: 768px) {
        .profile-info-grid,
        .stats-grid,
        .actions-grid {
            grid-template-columns: 1fr;
        }

        .exam-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
    }
`;
document.head.appendChild(style);

console.log('صفحة الملف الشخصي جاهزة');