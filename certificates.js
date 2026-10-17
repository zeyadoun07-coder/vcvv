// ==================== Global Variables ====================
let currentStudent = null;

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadCertificates();
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

// ==================== Load Certificates ====================
function loadCertificates() {
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');

    // 🔥 فلترة الشهادات الخاصة بالطالب الحالي فقط
    const studentCertificates = certificates.filter(cert =>
        cert.studentCode === currentStudent.code
    );

    const container = document.getElementById('certificatesContainer');
    const emptyState = document.getElementById('emptyCertificates');

    if (studentCertificates.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';

studentCertificates.forEach((cert, index) => {
            const card = document.createElement('div');
        card.className = 'certificate-card';
        card.innerHTML = `
            <div class="certificate-card-header">
                <h3>${cert.name}</h3>
            </div>
            <div class="certificate-card-body">
                <div class="certificate-details">
                    <div class="cert-detail-item">
                        <span class="cert-label">المادة:</span>
                        <span class="cert-value">${cert.subject}</span>
                    </div>
                    <div class="cert-detail-item">
                        <span class="cert-label">الدرجة:</span>
                        <span class="cert-value">${cert.score}%</span>
                    </div>
                    <div class="cert-detail-item">
                        <span class="cert-label">التاريخ:</span>
                        <span class="cert-value">${cert.date}</span>
                    </div>
                    <div class="cert-detail-item">
                        <span class="cert-label">الحالة:</span>
<span class="cert-value cert-status">
    ${cert.score >= 50 ? '✅ ناجح' : '❌ راسب'}
</span>                    </div>
                </div>
            </div>
            <div class="certificate-card-footer">
                <button class="btn btn-primary btn-small" onclick="viewCertificate(${index})">👁️ عرض</button>
                <button class="btn btn-primary btn-small" onclick="downloadCertificate(${index})">📥 تحميل</button>
                <button class="btn btn-secondary btn-small" onclick="shareCertificate(${index})">📤 مشاركة</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==================== View Certificate ====================
function viewCertificate(index) {
    window.location.href = `certificate-view.html?cert=${index}`;
}

// ==================== Download Certificate ====================
function downloadCertificate(index) {
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const cert = certificates[index];

    if (!cert) return;

    // Create a simple text file with certificate data
    const certificateText = `
════════════════════════════════════════════════════════════
                    شهادة إتمام الامتحان
════════════════════════════════════════════════════════════

تشهد هذه الوثيقة بأن الطالب/ة:

    ${cert.studentName}
    (الكود: ${cert.studentCode})

قد أتم بنجاح امتحان:

    ${cert.name}
    المادة: ${cert.subject}

وحقق درجة: ${cert.score}%

التاريخ: ${cert.date}

════════════════════════════════════════════════════════════
                منصة دعاء عون للامتحانات الإلكترونية
════════════════════════════════════════════════════════════
    `;

    // Create blob and download
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `شهادة_${cert.name}_${cert.date}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showNotification('✅ تم تحميل الشهادة بنجاح!', 'success');
}

// ==================== Share Certificate ====================
function shareCertificate(index) {
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const cert = certificates[index];

    if (!cert) return;

    const shareText = `🎓 لقد حصلت على شهادة إتمام في ${cert.name}!
📊 الدرجة: ${cert.score}%
📅 التاريخ: ${cert.date}
🏆 من منصة دعاء عون للامتحانات الإلكترونية`;

    if (navigator.share) {
        navigator.share({
            title: 'شهادتي',
            text: shareText
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('✅ تم نسخ الشهادة للمشاركة!', 'success');
        });
    }
}

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        background-color: ${getNotificationColor(type)};
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInDown 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'info': return '#3b82f6';
        default: return '#6366f1';
    }
}

console.log('صفحة الشهادات جاهزة');