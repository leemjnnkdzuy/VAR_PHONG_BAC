document.addEventListener('DOMContentLoaded', function() {
    const logoContainer = document.getElementById('logo-container');
    logoContainer.addEventListener('click', function() {
        window.location.href = '../index.html';
    });
});