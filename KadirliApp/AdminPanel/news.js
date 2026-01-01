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

// Load all news
async function loadNews() {
    const tbody = document.getElementById('newsTableBody');
    const filterPublished = document.getElementById('filterPublished').value;
    
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Yükleniyor...</td></tr>';
    
    try {
        let data = await api.get('/News');
        
        if (filterPublished !== '') {
            const isPublished = filterPublished === 'true';
            data = data.filter(item => item.isPublished === isPublished);
        }
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(news => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editNews('${news.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteNews('${news.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${news.id.substring(0, 8)}...</td>
                    <td><strong>${news.title}</strong></td>
                    <td><span class="badge">${news.category}</span></td>
                    <td>${news.source || '-'}</td>
                    <td>${news.isPublished ? '<span class="badge badge-success">Yayında</span>' : '<span class="badge badge-danger">Taslak</span>'}</td>
                    <td>${news.viewCount}</td>
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
    document.getElementById('modalTitle').textContent = 'Yeni Haber Ekle';
    document.getElementById('newsForm').reset();
    document.getElementById('newsId').value = '';
    document.getElementById('isPublished').checked = false;
    document.getElementById('viewCount').value = '0';
    document.getElementById('modal').classList.add('show');
}

// Edit news
async function editNews(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const news = await api.get(`/News/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Haber Düzenle';
        document.getElementById('newsId').value = id;
        document.getElementById('title').value = news.title;
        document.getElementById('content').value = news.content;
        document.getElementById('summary').value = news.summary || '';
        document.getElementById('category').value = news.category;
        document.getElementById('source').value = news.source || '';
        document.getElementById('imageUrls').value = formatImageUrls(news.imageUrls);
        document.getElementById('isPublished').checked = news.isPublished;
        document.getElementById('viewCount').value = news.viewCount || 0;
        
        if (news.publishedAt) {
            const date = new Date(news.publishedAt);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            document.getElementById('publishedAt').value = localDate.toISOString().slice(0, 16);
        } else {
            document.getElementById('publishedAt').value = '';
        }
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save news (POST or PUT)
async function saveNews(event) {
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
        content: document.getElementById('content').value,
        summary: document.getElementById('summary').value || null,
        category: document.getElementById('category').value,
        source: document.getElementById('source').value || null,
        imageUrls: parseImageUrls(document.getElementById('imageUrls').value),
        isPublished: document.getElementById('isPublished').checked,
        viewCount: parseInt(document.getElementById('viewCount').value) || 0,
    };
    
    const publishedAt = document.getElementById('publishedAt').value;
    if (publishedAt) {
        formData.publishedAt = new Date(publishedAt).toISOString();
    } else {
        formData.publishedAt = null;
    }
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/News/${currentEditingId}`, formData);
            showNotification('Haber güncellendi', 'success');
        } else {
            await api.post('/News', formData);
            showNotification('Haber eklendi', 'success');
        }
        
        closeModal();
        loadNews();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete news
async function deleteNews(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/News/${id}`);
        showNotification('Haber silindi', 'success');
        loadNews();
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
    loadNews();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

