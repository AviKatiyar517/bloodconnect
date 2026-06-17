// register.js - handles donor registration page

function registerDonor() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const bloodGroup = document.getElementById('bloodGroup').value;
    const city = document.getElementById('city').value.trim();
    const area = document.getElementById('area').value.trim();
    const available = document.getElementById('available').checked;
    const lastDonatedDate = document.getElementById('lastDonatedDate').value;
    const errorMsg = document.getElementById('error-msg');

    // ===== VALIDATION =====
    if (!name) {
        errorMsg.textContent = 'Please enter your full name.';
        return;
    }
    if (!phone || phone.length !== 10 || isNaN(phone)) {
        errorMsg.textContent = 'Please enter a valid 10-digit phone number.';
        return;
    }
    if (!bloodGroup) {
        errorMsg.textContent = 'Please select your blood group.';
        return;
    }
    if (!city) {
        errorMsg.textContent = 'Please enter your city.';
        return;
    }
    if (!area) {
        errorMsg.textContent = 'Please enter your area/locality.';
        return;
    }

    errorMsg.textContent = '';

    // ===== BUILD REQUEST BODY =====
    // This is the data we send to Spring Boot
    const donorData = {
        name: name,
        phone: phone,
        bloodGroup: bloodGroup,
        city: city,
        area: area,
        available: available,
        lastDonatedDate: lastDonatedDate || null
    };

    // ===== CALL SPRING BOOT API =====
    // fetch() sends HTTP POST request with donor data as JSON
    fetch('/api/donors/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // tell server we're sending JSON
        },
        body: JSON.stringify(donorData)  // convert JS object to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed. Please try again.');
        }
        return response.json();
    })
    .then(savedDonor => {
        // Registration successful!
        console.log('Registered donor:', savedDonor);
        showSuccess();
    })
    .catch(error => {
        errorMsg.textContent = 'Error: ' + error.message;
    });
}

function showSuccess() {
    // Hide the form button
    document.querySelector('.btn-full').style.display = 'none';
    // Show success message
    document.getElementById('success-box').style.display = 'block';
    // Scroll to success message
    document.getElementById('success-box').scrollIntoView({ behavior: 'smooth' });
}
