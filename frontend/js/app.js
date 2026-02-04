// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Prevent form submissions from refreshing page
document.querySelectorAll('form').forEach(form => {
    if (!form.onsubmit) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
});
