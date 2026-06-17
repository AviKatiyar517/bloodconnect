// app.js - handles the search page (index.html)

function searchDonors() {
    const bloodGroup = document.getElementById('bloodGroup').value;
    const city = document.getElementById('city').value.trim();
    const errorMsg = document.getElementById('error-msg');

    // Validation
    if (!bloodGroup) {
        errorMsg.textContent = 'Please select a blood group.';
        return;
    }
    if (!city) {
        errorMsg.textContent = 'Please enter a city name.';
        return;
    }

    errorMsg.textContent = '';

    // Save search params and go to results page
    // We use sessionStorage to pass data between pages
    sessionStorage.setItem('bloodGroup', bloodGroup);
    sessionStorage.setItem('city', city);

    window.location.href = 'results.html';
}

// Allow pressing Enter key to search
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchDonors();
    }
});
