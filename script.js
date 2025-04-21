// Tab functionality
function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Initialize localStorage if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

if (!localStorage.getItem('quizzes')) {
    const defaultQuizzes = [
        {
            id: 1,
            title: "General Knowledge",
            questions: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Paris", "Berlin", "Madrid"],
                    answer: "Paris"
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    answer: "Mars"
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                    answer: "Leonardo da Vinci"
                }
            ]
        },
        {
            id: 2,
            title: "Science",
            questions: [
                {
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "NaCl", "O2"],
                    answer: "H2O"
                },
                {
                    question: "What is the hardest natural substance on Earth?",
                    options: ["Gold", "Iron", "Diamond", "Quartz"],
                    answer: "Diamond"
                },
                {
                    question: "Which gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    answer: "Carbon Dioxide"
                }
            ]
        }
    ];
    localStorage.setItem('quizzes', JSON.stringify(defaultQuizzes));
}

// Login form submission (only on index page)
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (email === 'admin@quiz.com' && password === 'admin123') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'home.html';
            }
        } else {
            alert('Invalid email or password');
        }
    });
}

// Register form submission (only on index page)
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users.some(u => u.email === email)) {
            alert('User already exists');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            scores: {}
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        openTab('login');
    });
}

// Home Page Functionality
function loadHomePage() {
    // Load current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display user name
    document.getElementById('userName').textContent = currentUser.name;

    // Load quizzes
    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    const quizList = document.getElementById('quizList');

    quizList.innerHTML = ''; // Clear previous content
    
    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} questions</p>
            ${currentUser.scores && currentUser.scores[quiz.id] ? 
                `<p>Your best score: ${currentUser.scores[quiz.id]}/${quiz.questions.length}</p>` : 
                '<p>Not attempted yet</p>'}
        `;
        quizCard.addEventListener('click', () => {
            window.location.href = `quiz.html?quizId=${quiz.id}`;
        });
        quizList.appendChild(quizCard);
    });

    // Logout button - more reliable implementation
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        };
    }
}

// Quiz Page Functionality
function loadQuizPage() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    if (!quizId) {
        window.location.href = 'home.html';
        return;
    }

    // Load the quiz
    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    const quiz = quizzes.find(q => q.id == quizId);
    if (!quiz) {
        window.location.href = 'home.html';
        return;
    }

    // Set quiz title
    document.getElementById('quizTitle').textContent = quiz.title;

    // Create questions
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = ''; // Clear previous content
    
    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <h3>Question ${index + 1}: ${question.question}</h3>
            <div class="options">
                ${question.options.map((option, i) => `
                    <div class="option">
                        <input type="radio" id="q${index}_opt${i}" name="q${index}" value="${option}">
                        <label for="q${index}_opt${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.onclick = function() {
            window.location.href = 'home.html';
        };
    }

    // Form submission
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Calculate score
            let score = 0;
            quiz.questions.forEach((question, index) => {
                const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
                if (selectedOption && selectedOption.value === question.answer) {
                    score++;
                }
            });

            // Update user's score
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (!users[userIndex].scores) {
                users[userIndex].scores = {};
            }
            
            // Only update if new score is higher
            if (!users[userIndex].scores[quizId] || score > users[userIndex].scores[quizId]) {
                users[userIndex].scores[quizId] = score;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update currentUser in localStorage
                currentUser.scores = users[userIndex].scores;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            // Show result
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-container';
            resultDiv.innerHTML = `
                <h2>Quiz Completed!</h2>
                <p>Your score: ${score}/${quiz.questions.length}</p>
                ${users[userIndex].scores[quizId] === score ? 
                    '<p>🎉 New personal best! 🎉</p>' : ''}
                <button onclick="window.location.href='home.html'">Back to Quizzes</button>
            `;
            questionsContainer.parentNode.insertBefore(resultDiv, questionsContainer.nextSibling);
            questionsContainer.style.display = 'none';
            e.target.style.display = 'none';
        });
    }
}

// Page initialization
if (document.getElementById('quizList')) {  // Home page
    loadHomePage();
} else if (document.getElementById('quizForm')) {  // Quiz page
    loadQuizPage();
}