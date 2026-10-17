
// ==================== Student Database ====================
const studentsDatabase = {
    '23587': {
        name: 'GHKLO',
        realName: 'ياسين ابراهيم',
        id: '23587'
    },

    '22586': {
        name: 'DFYMQ',
        realName: 'ادم رامي',
        id: '22586'
    },

    '12458': {
        name: 'GGTYS',
        realName: 'حبيبة معمر',
        id: '12458'
    },

    '52587': {
        name: 'MNBVC',
        realName: 'ناصر شنكار',
        id: '52587'
    },

    '32147': {
        name: 'DERTY',
        realName: 'يوسف الكلاف',
        id: '32147'
    },

    '21478': {
        name: 'HYHUI',
        realName: 'عبد الرحمن لطفي',
        id: '21478'
    },

    '14789': {
        name: 'HYHYJ',
        realName: 'رودينا جميل',
        id: '14789'
    },

    '21586': {
        name: 'SDFRT',
        realName: 'الين الرحماني',
        id: '21586'
    },

    '15896': {
        name: 'GKLMO',
        realName: 'احمد بسيوني',
        id: '15896'
    },

    '66652': {
        name: 'JKUYT',
        realName: 'ابراهيم عون',
        id: '66652'
    },

    '36598': {
        name: 'NHYUT',
        realName: 'مريم سويلم',
        id: '36598'
    },

    '36987': {
        name: 'MKIUY',
        realName: 'ندين نصر',
        id: '36987'
    },

    '89742': {
        name: 'VKILO',
        realName: 'شهد عمرو',
        id: '89742'
    },

    '78963': {
        name: 'POIUY',
        realName: 'هنا رخا',
        id: '78963'
    },

    '20126': {
        name: 'BBBVG',
        realName: 'شهد البحراوي',
        id: '20126'
    },
    '25801': {
        name: 'DTDTD',
        realName: ' ملك هاني كشك',
        id: '25801'
    },
    '15928': {
        name: 'SESES',
        realName: 'عائشة ماجد ',
        id: '15928'
    },
    '32328': {
        name: 'HUHUH',
        realName: 'ياسين الحويف  ',
        id: '32328'
    },

};


// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

});


// ==================== Login Function ====================
function handleLogin(e) {

    e.preventDefault();

    const codeInput = document.getElementById('studentCode');
    const nameInput = document.getElementById('studentName');

    const codeError = document.getElementById('codeError');
    const nameError = document.getElementById('nameError');

    const studentCode = codeInput.value.trim();
    const studentName = nameInput.value.trim().toUpperCase();

    // إزالة الأخطاء القديمة
    codeError.textContent = '';
    nameError.textContent = '';

    codeError.classList.remove('show');
    nameError.classList.remove('show');


    // ==================== Validation ====================

    if (studentCode === '') {

        codeError.textContent = 'كود الطالب مطلوب';
        codeError.classList.add('show');

        return;
    }


    if (studentName === '') {

        nameError.textContent = 'اسم الطالب مطلوب';
        nameError.classList.add('show');

        return;
    }


    // ==================== Check Student ====================

    const student = studentsDatabase[studentCode];


    if (!student) {

        codeError.textContent = 'كود الطالب غير صحيح';
        codeError.classList.add('show');

        return;
    }


    // ==================== Check Name ====================

    if (student.name.toUpperCase() !== studentName) {

        nameError.textContent = 'اسم الطالب غير صحيح';
        nameError.classList.add('show');

        return;
    }


    // ==================== Login Success ====================

    const studentData = {

        code: studentCode,

        name: student.realName,

        username: student.name,

        id: student.id,

        loginTime: new Date().toLocaleString('ar-EG')

    };


    // حفظ بيانات الطالب
    localStorage.setItem(
        'currentStudent',
        JSON.stringify(studentData)
    );

    // حفظها كـ currentUser أيضًا
    localStorage.setItem(
        'currentUser',
        JSON.stringify(studentData)
    );


    // رسالة نجاح
    showNotification(
        'تم تسجيل الدخول بنجاح!',
        'success'
    );


    // الانتقال للداشبورد
    setTimeout(function () {

        window.location.href = 'dashboard.html';

    }, 1000);

}



// ==================== Notification ====================

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');

    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.color = '#fff';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '99999';
    notification.style.fontSize = '16px';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';


    if (type === 'success') {

        notification.style.backgroundColor = '#10b981';

    } else if (type === 'error') {

        notification.style.backgroundColor = '#ef4444';

    } else {

        notification.style.backgroundColor = '#3b82f6';

    }


    document.body.appendChild(notification);


    setTimeout(function () {

        notification.remove();

    }, 3000);

}


console.log('نظام تسجيل الدخول جاهز');
