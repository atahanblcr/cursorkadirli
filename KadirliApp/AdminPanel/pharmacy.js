let currentEditingId = null;

// Load all pharmacies
async function loadPharmacies() {
    const tbody = document.getElementById('pharmacyTableBody');
    const filterDate = document.getElementById('filterDate').value;
    
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Yükleniyor...</td></tr>';
    
    try {
        let data;
        if (filterDate) {
            data = await api.get(`/Pharmacy/duty/${filterDate}`);
        } else {
            data = await api.get('/Pharmacy');
        }
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(pharmacy => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editPharmacy('${pharmacy.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deletePharmacy('${pharmacy.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${pharmacy.id.substring(0, 8)}...</td>
                    <td><strong>${pharmacy.name}</strong></td>
                    <td>${pharmacy.phone || '-'}</td>
                    <td>${pharmacy.address || '-'}</td>
                    <td><span class="badge">${pharmacy.region}</span></td>
                    <td>${pharmacy.dutyDate}</td>
                    <td class="actions">${actionButtons}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="error">Veri yüklenirken hata oluştu</td></tr>';
        showNotification('Veriler yüklenemedi: ' + error.message, 'error');
    }
}

// Open add modal
function openAddModal() {
    if (!auth.canCreate()) {
        auth.showPermissionError('Ekleme');
        return;
    }
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Eczane Ekle';
    document.getElementById('pharmacyForm').reset();
    document.getElementById('pharmacyId').value = '';
    document.getElementById('modal').classList.add('show');
}

// Edit pharmacy
async function editPharmacy(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const pharmacy = await api.get(`/Pharmacy/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Eczane Düzenle';
        document.getElementById('pharmacyId').value = id;
        document.getElementById('name').value = pharmacy.name;
        document.getElementById('phone').value = pharmacy.phone || '';
        document.getElementById('address').value = pharmacy.address || '';
        document.getElementById('region').value = pharmacy.region;
        document.getElementById('dutyDate').value = pharmacy.dutyDate;
        document.getElementById('latitude').value = pharmacy.latitude || '';
        document.getElementById('longitude').value = pharmacy.longitude || '';
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save pharmacy (POST or PUT)
async function savePharmacy(event) {
    event.preventDefault();
    
    if (currentEditingId && !auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    if (!currentEditingId && !auth.canCreate()) {
        auth.showPermissionError('Ekleme');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value || null,
        address: document.getElementById('address').value || null,
        region: document.getElementById('region').value,
        dutyDate: document.getElementById('dutyDate').value,
        latitude: document.getElementById('latitude').value ? parseFloat(document.getElementById('latitude').value) : null,
        longitude: document.getElementById('longitude').value ? parseFloat(document.getElementById('longitude').value) : null,
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/Pharmacy/${currentEditingId}`, formData);
            showNotification('Eczane güncellendi', 'success');
        } else {
            await api.post('/Pharmacy', formData);
            showNotification('Eczane eklendi', 'success');
        }
        
        closeModal();
        loadPharmacies();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete pharmacy
async function deletePharmacy(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Pharmacy/${id}`);
        showNotification('Eczane silindi', 'success');
        loadPharmacies();
    } catch (error) {
        showNotification('Silinemedi: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    currentEditingId = null;
}

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPharmacies();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

