// results.js - handles the results page
// This is where JavaScript calls the Spring Boot backend API

// Get search values from previous page
const bloodGroup = sessionStorage.getItem('bloodGroup');
const city = sessionStorage.getItem('city');

// Run search when page loads
window.onload = function () {
    if (!bloodGroup || !city) {
        // If someone opens results.html directly without searching
        window.location.href = 'index.html';
        return;
    }
    fetchDonors();
};

function fetchDonors() {
    // Update the summary text
    document.getElementById('result-summary').innerHTML =
        `Searching for <strong>${bloodGroup}</strong> donors in <strong>${city}</strong>...`;

    // ===== THIS IS WHERE FRONTEND CALLS THE SPRING BOOT BACKEND =====
    // fetch() sends an HTTP GET request to our Java API
    fetch(`/api/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error. Please try again.');
            }
            return response.json(); // convert response to JSON
        })
        .then(donors => {
            displayDonors(donors); // show results on screen
        })
        .catch(error => {
            document.getElementById('result-summary').textContent = 'Error: ' + error.message;
        });
}

function displayDonors(donors) {
    const donorList = document.getElementById('donor-list');
    const noResults = document.getElementById('no-results');
    const safetyNote = document.getElementById('safety-note');

    if (donors.length === 0) {
        // No donors found
        document.getElementById('result-summary').textContent = 'No donors found.';
        noResults.style.display = 'block';
        return;
    }

    // Update summary
    document.getElementById('result-summary').innerHTML =
        `Found <strong>${donors.length} donor(s)</strong> with blood group <strong>${bloodGroup}</strong> in <strong>${city}</strong>`;

    // Show safety note
    safetyNote.style.display = 'block';

    // Build donor cards
    donorList.innerHTML = '';
    donors.forEach(donor => {
        const card = document.createElement('div');
        card.className = 'donor-card';

        // Format last donated date
        let donatedText = 'Never donated before';
        if (donor.lastDonatedDate) {
            const date = new Date(donor.lastDonatedDate);
            donatedText = 'Last donated: ' + date.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }

        card.innerHTML = `
            <div class="blood-badge">${donor.bloodGroup}</div>
            <div class="donor-info">
                <div class="donor-name">${donor.name}</div>
                <div class="donor-meta">
                    <span class="avail-dot"></span>Available &nbsp;·&nbsp;
                    ${donor.area}, ${donor.city} &nbsp;·&nbsp;
                    ${donatedText}
                </div>
            </div>
            <button class="btn-call" onclick="callDonor('${donor.phone}', '${donor.name}')">
                &#128222; Call
            </button>
        `;
        donorList.appendChild(card);
    });
}

function callDonor(phone, name) {
    // On mobile this opens the phone dialer
    // On desktop it shows the number
    if (confirm(`Call ${name} at ${phone}?`)) {
        window.location.href = `tel:${phone}`;
    }
}
