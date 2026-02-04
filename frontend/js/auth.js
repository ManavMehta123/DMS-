// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        setToken(data.token);
        setUser(data.user);
        showMessage('Login successful!', 'success');
        
        setTimeout(() => {
            showMainPage();
        }, 500);
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Register Form Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        setToken(data.token);
        setUser(data.user);
        showMessage('Registration successful!', 'success');
        
        setTimeout(() => {
            showMainPage();
        }, 500);
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

function toggleAuthForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
}

function logout() {
    removeToken();
    removeUser();
    showMessage('Logged out successfully', 'success');
    showAuthPage();
}

function showAuthPage() {
    document.getElementById('auth-page').classList.add('active');
    document.getElementById('main-page').classList.remove('active');
}

function showMainPage() {
    const user = getUser();
    if (!user) {
        showAuthPage();
        return;
    }

    document.getElementById('auth-page').classList.remove('active');
    document.getElementById('main-page').classList.add('active');
    document.getElementById('username-display').textContent = user.username;
    
    loadDocuments();
}

// Check authentication on load
function checkAuth() {
    const token = getToken();
    if (token) {
        showMainPage();
    } else {
        showAuthPage();
    }
}
