// admin.js - handles admin dashboard

let allDonors = [];      // stores all donors from API
let deleteTargetId = null; // stores id of donor to delete

// Load donors when page opens
window.onload = function () {
    loadAllDonors();
};

// ===== LOAD ALL DONORS FROM SPRING BOOT =====
function loadAllDonors() {
    fetch('/api/donors/all')
        .then(res => res.json())
        .then(donors => {
            allDonors = donors;
            updateMetrics(donors);
            renderTable(donors);
        })
        .catch(err => {
            document.getElementById('donor-tbody').innerHTML =
                `<tr><td colspan="8" style="text-align:center;padding:30px;color:#e74c3c;">
                    Error loading donors. Is the server running?
                </td></tr>`;
        });
}

// ===== UPDATE METRIC CARDS =====
function updateMetrics(donors) {
    const total     = donors.length;
    const available = donors.filter(d => d.available).length;
    const cooldown  = donors.filter(d => !d.available).length;
    const cities    = new Set(donors.map(d => d.city.toLowerCase())).size;

    document.getElementById('total-count').textContent     = total;
    document.getElementById('available-count').textContent = available;
    document.getElementById('cooldown-count').textContent  = cooldown;
    document.getElementById('cities-count').textContent    = cities;
}

// ===== RENDER DONOR TABLE =====
function renderTable(donors) {
    const tbody = document.getElementById('donor-tbody');
    document.getElementById('table-count').textContent = donors.length + ' registered';

    if (donors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:#aaa;">No donors found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    donors.forEach((donor, index) => {
        // cartoon avatar using dicebear API
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(donor.name)}&backgroundColor=ffd5dc,ffdfbf,ffeaa7,b6e3f4`;

        // format last donated date
        let lastDonated = 'Never';
        if (donor.lastDonatedDate) {
            const date = new Date(donor.lastDonatedDate);
            lastDonated = date.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }

        // status badge
        const badge = donor.available
            ? '<span class="badge badge-avail">&#9679; Available</span>'
            : '<span class="badge badge-unavail">&#9679; Unavailable</span>';

        tbody.innerHTML += `
            <tr>
                <td style="color:#bbb;">${index + 1}</td>
                <td>
                    <div class="donor-cell">
                        <img src="${avatarUrl}" class="avatar" alt="${donor.name}"/>
                        <div>
                            <div class="donor-name">${donor.name}</div>
                            <div class="donor-phone">${donor.phone}</div>
                        </div>
                    </div>
                </td>
                <td><span class="blood-pill">${donor.bloodGroup}</span></td>
                <td>${donor.city}</td>
                <td style="color:#aaa;">${donor.area}</td>
                <td>${badge}</td>
                <td style="color:#aaa;">${lastDonated}</td>
                <td>
                    <button class="action-btn" onclick="toggleDonor(${donor.id})">
                        &#8635; Toggle
                    </button>
                    <button class="action-btn del" onclick="openDeleteModal(${donor.id})">
                        &#128465; Delete
                    </button>
                </td>
            </tr>`;
    });
}

// ===== FILTER DONORS =====
function filterDonors() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const blood  = document.getElementById('filter-blood').value;
    const status = document.getElementById('filter-status').value;

    const filtered = allDonors.filter(donor => {
        const matchSearch = donor.name.toLowerCase().includes(search) ||
                            donor.city.toLowerCase().includes(search) ||
                            donor.area.toLowerCase().includes(search);
        const matchBlood  = !blood  || donor.bloodGroup === blood;
        const matchStatus = !status ||
                            (status === 'available'   &&  donor.available) ||
                            (status === 'unavailable' && !donor.available);
        return matchSearch && matchBlood && matchStatus;
    });

    renderTable(filtered);
}

// ===== TOGGLE AVAILABILITY =====
function toggleDonor(id) {
    fetch(`/api/donors/${id}/toggle`, { method: 'PUT' })
        .then(res => res.json())
        .then(() => {
            loadAllDonors(); // reload table
        })
        .catch(err => alert('Error toggling donor: ' + err.message));
}

// ===== DELETE DONOR =====
function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    deleteTargetId = null;
    document.getElementById('modal-overlay').style.display = 'none';
}

function confirmDelete() {
    if (!deleteTargetId) return;

    fetch(`/api/donors/${deleteTargetId}`, { method: 'DELETE' })
        .then(() => {
            closeModal();
            loadAllDonors(); // reload table
        })
        .catch(err => alert('Error deleting donor: ' + err.message));
}

// ===== SIDEBAR NAVIGATION =====
function showSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'donors':    'All Donors',
        'stats':     'Statistics'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';

    // For now all sections show the same donor table
    // You can expand this later for statistics page
    loadAllDonors();
}
