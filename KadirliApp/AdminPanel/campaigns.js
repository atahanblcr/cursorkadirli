let currentEditingId = null;

// Parse image URLs from string
function parseImageUrls(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
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

// Load all campaigns
async function loadCampaigns() {
    const tbody = document.getElementById('campaignsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/Campaigns');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(campaign => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editCampaign('${campaign.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteCampaign('${campaign.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${campaign.id.substring(0, 8)}...</td>
                    <td><strong>${campaign.title}</strong></td>
                    <td>${campaign.businessName}</td>
                    <td>${campaign.discountCode ? `<span class="badge badge-success">${campaign.discountCode}</span>` : '-'}</td>
                    <td>${formatDateTime(campaign.createdAt)}</td>
                    <td class="actions">${actionButtons}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="error">Veri yüklenirken hata oluştu</td></tr>';
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
    document.getElementById('modalTitle').textContent = 'Yeni Kampanya Ekle';
    document.getElementById('campaignForm').reset();
    document.getElementById('campaignId').value = '';
    document.getElementById('modal').classList.add('show');
}

// Edit campaign
async function editCampaign(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const campaign = await api.get(`/Campaigns/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Kampanya Düzenle';
        document.getElementById('campaignId').value = id;
        document.getElementById('title').value = campaign.title;
        document.getElementById('businessName').value = campaign.businessName;
        document.getElementById('description').value = campaign.description || '';
        document.getElementById('discountCode').value = campaign.discountCode || '';
        document.getElementById('imageUrls').value = formatImageUrls(campaign.imageUrls);
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save campaign (POST or PUT)
async function saveCampaign(event) {
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
        businessName: document.getElementById('businessName').value,
        description: document.getElementById('description').value || null,
        discountCode: document.getElementById('discountCode').value || null,
        imageUrls: parseImageUrls(document.getElementById('imageUrls').value),
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/Campaigns/${currentEditingId}`, formData);
            showNotification('Kampanya güncellendi', 'success');
        } else {
            await api.post('/Campaigns', formData);
            showNotification('Kampanya eklendi', 'success');
        }
        
        closeModal();
        loadCampaigns();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete campaign
async function deleteCampaign(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Campaigns/${id}`);
        showNotification('Kampanya silindi', 'success');
        loadCampaigns();
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
    loadCampaigns();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

