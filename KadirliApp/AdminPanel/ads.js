let currentEditingId = null;
const adTypes = {
    0: 'İş İlanı',
    1: 'Hizmet',
    2: 'İhale',
    3: 'Emlak',
    4: 'Vasıta',
    5: 'İkinci El',
    6: 'Hayvanlar',
    7: 'Yedek Parça'
};

// Load all ads
async function loadAds() {
    const tbody = document.getElementById('adsTableBody');
    const filterType = document.getElementById('filterType').value;
    
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Yükleniyor...</td></tr>';
    
    try {
        let data;
        if (filterType !== '') {
            data = await api.get(`/Ads/type/${filterType}`);
        } else {
            data = await api.get('/Ads');
        }
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(ad => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editAd('${ad.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteAd('${ad.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${ad.id.substring(0, 8)}...</td>
                    <td>${ad.title}</td>
                    <td><span class="badge badge-type-${ad.type}">${adTypes[ad.type] || ad.type}</span></td>
                    <td>${ad.price || '-'}</td>
                    <td>${ad.isActive ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Pasif</span>'}</td>
                    <td>${ad.expiresAt ? formatDateTime(ad.expiresAt) : '-'}</td>
                    <td class="actions">${actionButtons}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="error">Veri yüklenirken hata oluştu</td></tr>';
        showNotification('Veriler yüklenemedi: ' + error.message, 'error');
    }
}

// Parse image URLs from string
function parseImageUrls(value) {
    if (!value) return null;
    try {
        // Try to parse as JSON array
        return JSON.parse(value);
    } catch {
        // If not JSON, split by comma
        return value.split(',').map(url => url.trim()).filter(url => url);
    }
}

// Format image URLs for display
function formatImageUrls(imageUrls) {
    if (!imageUrls) return '';
    if (Array.isArray(imageUrls)) {
        return JSON.stringify(imageUrls);
    }
    return imageUrls;
}

// Open add modal
function openAddModal() {
    if (!auth.canCreate()) {
        auth.showPermissionError('Ekleme');
        return;
    }
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Reklam Ekle';
    document.getElementById('adForm').reset();
    document.getElementById('adId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('modal').classList.add('show');
}

// Edit ad
async function editAd(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const ad = await api.get(`/Ads/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Reklam Düzenle';
        document.getElementById('adId').value = id;
        document.getElementById('title').value = ad.title;
        document.getElementById('description').value = ad.description || '';
        document.getElementById('type').value = ad.type;
        document.getElementById('contactInfo').value = ad.contactInfo || '';
        document.getElementById('price').value = ad.price || '';
        document.getElementById('imageUrls').value = formatImageUrls(ad.imageUrls);
        document.getElementById('isActive').checked = ad.isActive;
        
        if (ad.expiresAt) {
            const date = new Date(ad.expiresAt);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            document.getElementById('expiresAt').value = localDate.toISOString().slice(0, 16);
        } else {
            document.getElementById('expiresAt').value = '';
        }
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save ad (POST or PUT)
async function saveAd(event) {
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
        title: document.getElementById('title').value,
        description: document.getElementById('description').value || null,
        type: parseInt(document.getElementById('type').value),
        contactInfo: document.getElementById('contactInfo').value || null,
        price: document.getElementById('price').value || null,
        imageUrls: parseImageUrls(document.getElementById('imageUrls').value),
        isActive: document.getElementById('isActive').checked,
    };
    
    const expiresAt = document.getElementById('expiresAt').value;
    if (expiresAt) {
        formData.expiresAt = new Date(expiresAt).toISOString();
    } else {
        formData.expiresAt = null;
    }
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/Ads/${currentEditingId}`, formData);
            showNotification('Reklam güncellendi', 'success');
        } else {
            await api.post('/Ads', formData);
            showNotification('Reklam eklendi', 'success');
        }
        
        closeModal();
        loadAds();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete ad
async function deleteAd(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Ads/${id}`);
        showNotification('Reklam silindi', 'success');
        loadAds();
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
    loadAds();
    
    // Close modal on outside click
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

