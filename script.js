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

// Form submissions
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Check if admin
        if (email === 'admin@quiz.com' && password === 'admin123') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'home.html';
        }
    } else {
        alert('Invalid email or password');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
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