let currentStudent = null;
let currentExam = null;
let currentQuestion = 0;
let totalQuestions = 0;
let userAnswers = [];
let correctAnswers = [];
let timerInterval = null;
let remainingTime = 0;

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadExamData();
    updateStudentInfo();
    initializeExam();
    startExamTimer();
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

function updateStudentInfo() {
    if (currentStudent) {
        document.getElementById('studentName').textContent = currentStudent.name;
    }
}

function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('currentStudent');
        localStorage.removeItem('currentExam');
        window.location.href = 'login-advanced.html';
    }
}

// ==================== Load Exam Data ====================
function loadExamData() {
    const examData = localStorage.getItem('currentExam');
    if (examData) {
        currentExam = JSON.parse(examData);
    } else {
        window.location.href = 'dashboard.html';
    }
}

function initializeExam() {
    if (!currentExam) return;

    totalQuestions = currentExam.questions.length;
    userAnswers = new Array(totalQuestions).fill(-1);
    correctAnswers = currentExam.questions.map(q => q.correct);
    remainingTime = currentExam.duration * 60;

    // Update header
    document.getElementById('examTitle').textContent = currentExam.name;
    document.getElementById('examSubject').textContent = `المادة: ${currentExam.subject}`;
    document.getElementById('totalQuestions').textContent = totalQuestions;

    // Load first question
    loadQuestion(0);
}

// ==================== Timer ====================
function startExamTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            showNotification('انتهت مدة الامتحان!', 'warning');
            submitExam();
        } else if (remainingTime === 300) { // 5 minutes warning
            showNotification('⚠️ تنبيه: 5 دقائق متبقية!', 'warning');
        }

        remainingTime--;
    }, 1000);
}

// ==================== Load Question ====================
function loadQuestion(index) {
    const question = currentExam.questions[index];
    
    document.getElementById('questionNumber').textContent = index + 1;
    document.getElementById('questionText').textContent = question.question;
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, i) => {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.innerHTML = `
            <input type="radio" name="answer" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}>
            <span>${answer}</span>
        `;
        
        label.addEventListener('change', function() {
            userAnswers[index] = i;
        });
        
        answersContainer.appendChild(label);
    });
    
    // Update progress
    const progress = ((index + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update buttons
    document.getElementById('prevBtn').style.display = index === 0 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = index === totalQuestions - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = index === totalQuestions - 1 ? 'inline-block' : 'none';
}

// ==================== Navigation ====================
function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
}

// ==================== Submit Exam ====================
function submitExam() {
    // Check if all questions are answered
    for (let i = 0; i < totalQuestions; i++) {
        if (userAnswers[i] === -1) {
            showNotification(`❌ الرجاء الإجابة على جميع الأسئلة (السؤال ${i + 1} لم يتم الإجابة عليه)`, 'error');
            currentQuestion = i;
            loadQuestion(i);
            return;
        }
    }

    // Stop timer
    clearInterval(timerInterval);

    // Calculate results
    let correctCount = 0;
    let wrongQuestions = [];

    for (let i = 0; i < totalQuestions; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            correctCount++;
        } else {
            wrongQuestions.push(i);
        }
    }
    
   const score = Math.round((correctCount / totalQuestions) * 100);

sendToGoogleForm(
    currentStudent.name,
    currentExam.name,
    score
);
    // Save results
    const examResult = {
        examId: currentExam.id,
        name: currentExam.name,
        subject: currentExam.subject,
        totalQuestions: totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: totalQuestions - correctCount,
        score: score,
        date: new Date().toLocaleDateString('ar-SA'),
        time: new Date().toLocaleTimeString('ar-SA'),
        studentName: currentStudent.name,
        studentCode: currentStudent.code,
        userAnswers: userAnswers,
        correctAnswers: correctAnswers,
        wrongQuestions: wrongQuestions
    };
    
    // Save to localStorage
    let results = JSON.parse(localStorage.getItem('examResults') || '[]');
    results.push(examResult);
    localStorage.setItem('examResults', JSON.stringify(results));
    
    // Mark exam as completed
    let completedExams = JSON.parse(localStorage.getItem('completedExams') || '[]');
    if (!completedExams.includes(currentExam.id)) {
        completedExams.push(currentExam.id);
        localStorage.setItem('completedExams', JSON.stringify(completedExams));
    }
    
    // Check if eligible for certificate
const hasCertificate = score >= 50;    
    if (hasCertificate) {
        // Save certificate
        let certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const certificate = {
            id: 'cert-' + Date.now(),
            name: `شهادة ${currentExam.name}`,
            subject: currentExam.subject,
            date: new Date().toLocaleDateString('ar-SA'),
            score: score,
            studentName: currentStudent.name,
            studentCode: currentStudent.code
        };
        certificates.push(certificate);
        localStorage.setItem('certificates', JSON.stringify(certificates));
    }
    
    // Show results
    showResults(examResult, hasCertificate);
}

// ==================== Show Results ====================
function showResults(result, hasCertificate) {
    document.querySelector('main').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    document.getElementById('finalScore').textContent = result.score;
    document.getElementById('scorePercentage').textContent = result.score + '%';
    document.getElementById('scoreRating').textContent = getScoreRating(result.score);
    document.getElementById('detailExamName').textContent = result.name;
    document.getElementById('detailSubject').textContent = result.subject;
    document.getElementById('detailQuestions').textContent = result.totalQuestions;
    document.getElementById('detailCorrect').textContent = result.correctAnswers;
    document.getElementById('detailWrong').textContent = result.wrongAnswers;
    document.getElementById('detailStudentName').textContent = result.studentName;
    
    // Display wrong answers
    displayWrongAnswers(result.wrongQuestions);
    
    if (hasCertificate) {
        document.getElementById('certificateSection').style.display = 'block';
        document.getElementById('noCertificateSection').style.display = 'none';
        showNotification('اذهب الي اختيار الشهادات لرؤية الشهادة🎉 مبروك! لقد حصلت على شهادة! ', 'success');
    } else {
        document.getElementById('certificateSection').style.display = 'none';
        document.getElementById('noCertificateSection').style.display = 'block';
    }
}

function displayWrongAnswers(wrongQuestionIndices) {
    const container = document.getElementById('wrongAnswersContainer');
    container.innerHTML = '';

    if (wrongQuestionIndices.length === 0) {
        container.innerHTML = '<p class="no-wrong">✅ لا توجد إجابات خاطئة!</p>';
        return;
    }

    wrongQuestionIndices.forEach(index => {
        const question = currentExam.questions[index];
        const userAnswer = question.answers[userAnswers[index]];
        const correctAnswer = question.answers[correctAnswers[index]];

        const div = document.createElement('div');
        div.className = 'wrong-answer-item';
        div.innerHTML = `
            <div class="wrong-answer-header">
                <h4>السؤال ${index + 1}: ${question.question}</h4>
            </div>
            <div class="wrong-answer-body">
                <div class="answer-row">
                    <span class="answer-label">❌ إجابتك:</span>
                    <span class="answer-text">${userAnswer}</span>
                </div>
                <div class="answer-row">
                    <span class="answer-label">✅ الإجابة الصحيحة:</span>
                    <span class="answer-text correct">${correctAnswer}</span>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function getScoreRating(score) {
    if (score >= 95) return '⭐⭐⭐⭐⭐ ممتاز جداً';
    if (score >= 85) return '⭐⭐⭐⭐ ممتاز';
    if (score >= 75) return '⭐⭐⭐ جيد جداً';
    if (score >= 65) return '⭐⭐ جيد';
    if (score >= 50) return '⭐ مقبول';
    return '❌ ضعيف';
}

function backToDashboard() {
    localStorage.removeItem('currentExam');
    window.location.href = 'dashboard.html';
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
function sendToGoogleForm(name, exam, score) {

    let formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdZYAOUIZDxylTQygJNRL-YoLQpq0360IY0cQ8F2Gx_Tag9xw/formResponse";

    let form = document.createElement("form");
    form.method = "POST";
    form.action = formURL;
    form.target = "hidden_iframe";

    form.innerHTML = `
        <input name="entry.1700652289" value="${name}">
        <input name="entry.982489865" value="${exam}">
        <input name="entry.619258351" value="${score}">
    `;

    document.body.appendChild(form);

    let iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    form.submit();
}